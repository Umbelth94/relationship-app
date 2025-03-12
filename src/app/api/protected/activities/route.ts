import client from "@/mongodb/mongodb";
import { DateActivity } from "../../../dategenerator/page";
import { NextResponse } from "next/server";
import { DatabaseUserProfile } from "@/app/models/UserProfile";
import { getSession } from "@auth0/nextjs-auth0";
import { InsertManyResult, ObjectId } from "mongodb";

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

// Inserts activities into the "activities" collection
const insertActivities = async (
  userProfile: DatabaseUserProfile,
  activities: DateActivity[],
  session: any,
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

// Updates the user's profile by pushing new activityIds into the activityIds array.
const updateUserProfileActivities = async (
  activityIds: ObjectId[],
  userProfile: DatabaseUserProfile,
  session: any,
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

// Wraps both the insert and update operations in a transaction.
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

export async function POST(req: Request) {
  const { activities } = await req.json();
  if (!activities || activities.length === 0) {
    return new NextResponse("No activities provided", { status: 400 });
  }

  const sessionInfo = await getSession();
  if (!sessionInfo?.user?.sub) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const profileCollection = client
    .db("users")
    .collection<DatabaseUserProfile>("profiles");

  const userProfile = await profileCollection.findOne({
    _id: sessionInfo.user.sub,
  });
  if (!userProfile) return new NextResponse("User not found", { status: 401 });

  const saved = await saveActivitiesToMongo(userProfile, activities);
  return saved
    ? new NextResponse("", { status: 201 })
    : new NextResponse("Error saving activities", { status: 500 });
}

export async function GET(req: Request) {
  const session = await getSession();
  if (!session || !session.user?.sub) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Retrieve the user profile using the session's user id.
  const profileCollection = client
    .db("users")
    .collection<DatabaseUserProfile>("profiles");
  const userProfile = await profileCollection.findOne({
    _id: session.user.sub,
  });
  if (!userProfile) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

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
}
