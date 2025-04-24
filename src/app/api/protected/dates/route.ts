import client from "@/mongodb/mongodb";
import { ObjectId } from "mongodb";
import withUserProfile from "@/app/api-helpers/withUserProfile";
import { DatabaseUserProfile } from "@/app/models/UserProfile";
import { NextResponse } from "next/server";
import { DateActivity } from "@/app/dategenerator/page";
import { patchActivities } from "../activities/route";
import { Activity } from "@/app/models/Activity";

export interface UserDate {
  userId: string;
  activityIds: ObjectId[];
}

export async function updateOrCreateUserDate(
  activities: DateActivity[],
  userProfile: DatabaseUserProfile,
  updateDateId?: string,
): Promise<boolean> {
  const dateCollection = client.db("users").collection<UserDate>("user-dates");
  const profileCollection = client
    .db("users")
    .collection<DatabaseUserProfile>("profiles");

  const activityObjectIds = activities.map((activity) => {
    return new ObjectId(activity._id);
  });

  const updateDateObjectId = new ObjectId(updateDateId);

  // Check if updateDateId is provided and exists in the user's dates array.
  if (
    updateDateId &&
    userProfile.userDates &&
    userProfile.userDates?.some((dateId) => dateId.equals(updateDateObjectId))
  ) {
    const updateResult = await dateCollection.updateOne(
      { _id: updateDateObjectId },
      { $set: { activityIds: activityObjectIds } },
    );
    return updateResult.modifiedCount === 1;
  } else {
    // Create a new user-date document.
    const dateData: UserDate = {
      userId: userProfile._id,
      activityIds: activityObjectIds,
    };
    const insertResult = await dateCollection.insertOne(dateData);
    if (insertResult.insertedId) {
      // Push the new user-date's _id into the user's dates array.
      const updateProfileResult = await profileCollection.updateOne(
        { _id: userProfile._id },
        { $push: { userDates: insertResult.insertedId } },
      );
      return updateProfileResult.modifiedCount === 1;
    }
    return false;
  }
}

// Valid if all activity ids are in the userProfile
function isValidActivityIds(
  userProfile: DatabaseUserProfile,
  activities: DateActivity[],
): boolean {
  const validIdSet = new Set(
    userProfile.activityIds?.map((id) => id.toHexString()),
  );
  return activities.every((activity) => validIdSet.has(activity._id ?? ""));
}

interface PostBody {
  activities: DateActivity[];
  updateDateId?: string;
}

export const POST = withUserProfile(
  async (userProfile: DatabaseUserProfile, req: Request) => {
    const { activities, updateDateId }: PostBody = await req.json();

    if (!activities || activities.length === 0) {
      return new NextResponse("No activities provided", { status: 400 });
    }

    if (!isValidActivityIds(userProfile, activities)) {
      return new NextResponse("Activity Ids are not valid", { status: 400 });
    }

    try {
      await patchActivities(activities, userProfile);
    } catch (err: any) {
      console.log(err);
      return new NextResponse("Failed to update activities", { status: 500 });
    }

    // don't save activities with rank == -1
    const filteredActivities = activities.filter(
      (activity) => activity.rank != -1,
    );

    if (
      await updateOrCreateUserDate(
        filteredActivities,
        userProfile,
        updateDateId,
      )
    ) {
      return new NextResponse("", { status: 201 });
    } else {
      return new NextResponse("Failed to save date", { status: 500 });
    }
  },
);

export interface UserDateInfo extends UserDate {
  activities: DateActivity[];
}
interface GetUserDatesResponse {
  userDates: UserDateInfo;
}
export const GET = withUserProfile(
  async (userProfile: DatabaseUserProfile, req: Request) => {
    // If there are no userDates, return an empty array.
    if (!userProfile.userDates || userProfile.userDates.length === 0) {
      return NextResponse.json({ userDates: [] });
    }

    const dateCollection = client.db("users").collection("user-dates");

    // Build the aggregation pipeline
    const pipeline = [
      {
        $match: { _id: { $in: userProfile.userDates } },
      },
      {
        $lookup: {
          from: "activities", // Collection to join.
          localField: "activityIds", // Field from user-dates.
          foreignField: "_id", // Field from activities.
          as: "activities", // Output array field.
        },
      },
      {
        $unset: "activityIds",
      },
    ];

    const userDates = await dateCollection.aggregate(pipeline).toArray();
    return NextResponse.json({ userDates });
  },
);
