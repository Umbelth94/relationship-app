import client from "@/mongodb/mongodb";
import withUserProfile from "@/app/api-helpers/withUserProfile";
import { DatabaseUserProfile } from "@/app/models/UserProfile";
import { NextResponse } from "next/server";
import { DateActivity } from "@/app/dategenerator/page";
import { Activity } from "@/app/models/Activity";
import { patchActivities } from "@/app/api-helpers/activitiesRouteHelper";
import { updateOrCreateUserDate } from "@/app/api-helpers/datesRouteHelper";

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
