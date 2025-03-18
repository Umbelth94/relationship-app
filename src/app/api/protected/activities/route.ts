//Implement update functionality for upvoting and downvoting activities that are already saved into database
//Implement updating timeframe (so user can change what time the activity is))

import client from "@/mongodb/mongodb";
import { DateActivity } from "../../../dategenerator/page";
import { NextResponse } from "next/server";
import { DatabaseUserProfile } from "@/app/models/UserProfile";
import { ClientSession, InsertManyResult, ObjectId } from "mongodb";
import withUserProfile from "@/app/api-helpers/withUserProfile";

interface UserDateActivity {
  userId: string;
  name: string;
  startDateTime: Date;
  endDateTime: Date;
  location: string;
  description: string;
  estimatedCost: string;
  rank: number;
}

const insertActivities = async (
  userProfile: DatabaseUserProfile,
  activities: DateActivity[],
  session: ClientSession,
): Promise<InsertManyResult<UserDateActivity>> => {
  const activityCollection = client
    .db("users")
    .collection<UserDateActivity>("activities");

  return activityCollection.insertMany(
    activities.map(
      ({
        name,
        startDateTime,
        endDateTime,
        location,
        description,
        estimatedCost,
      }) => ({
        userId: userProfile._id,
        name,
        startDateTime,
        endDateTime,
        location,
        description,
        estimatedCost,
        rank: 0, // -1 disliked, 0 neutral, 1 liked
      }),
    ),
    { session },
  );
};

const updateUserProfileActivities = async (
  activityIds: ObjectId[],
  userProfile: DatabaseUserProfile,
  session: ClientSession,
) => {
  const profileCollection = client
    .db("users")
    .collection<DatabaseUserProfile>("profiles");

  return profileCollection.updateOne(
    { _id: userProfile._id },
    { $push: { activityIds: { $each: activityIds } } },
    { session },
  );
};

const saveActivitiesToMongo = async (
  userProfile: DatabaseUserProfile,
  activities: DateActivity[],
): Promise<boolean> => {
  const session = client.startSession();
  let success = false;
  try {
    await session.withTransaction(async () => {
      const insertResult = await insertActivities(
        userProfile,
        activities,
        session,
      );
      const insertedIds = Object.values(insertResult.insertedIds) as ObjectId[];
      const updateResult = await updateUserProfileActivities(
        insertedIds,
        userProfile,
        session,
      );

      success =
        insertResult.insertedCount === activities.length &&
        updateResult.modifiedCount === 1;
    });
  } catch (err) {
    console.error("saveActivitiesToMongo failed:", err);
  } finally {
    await session.endSession();
  }
  return success;
};

export const POST = withUserProfile(
  async (userProfile: DatabaseUserProfile, req: Request) => {
    const { activities } = await req.json();
    if (!activities || activities.length === 0) {
      return new NextResponse("No activities provided", { status: 400 });
    }

    const saved = await saveActivitiesToMongo(userProfile, activities);
    return saved
      ? new NextResponse("", { status: 201 })
      : new NextResponse("Error saving activities", { status: 500 });
  },
);

export const GET = withUserProfile(
  async (userProfile: DatabaseUserProfile, req: Request) => {
    // If there are no activityIds, return an empty activities array.
    if (!userProfile.activityIds || userProfile.activityIds.length === 0) {
      return NextResponse.json({ activities: [] });
    }

    // Retrieve activities where _id is in the user's activityIds array.
    const activitiesCollection = client
      .db("users")
      .collection<UserDateActivity>("activities");
    const activities = await activitiesCollection
      .find({ _id: { $in: userProfile.activityIds } })
      .toArray();

    return NextResponse.json({ activities });
  },
);
