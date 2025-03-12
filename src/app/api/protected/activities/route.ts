import client from "@/mongodb/mongodb";
import { DateActivity } from "../../../dategenerator/page";
import { NextResponse } from "next/server";
import { DatabaseUserProfile } from "@/app/models/UserProfile";
import { getSession } from "@auth0/nextjs-auth0";
import { InsertManyResult, ObjectId } from "mongodb";

interface UserActivity {
  userId: string;
  name: string;
  startDateTime: Date;
  endDateTime: Date;
  location: string;
  description: string;
  estimatedCost: string;
  rank: number;
}

// insert all activity objects with associated user profile object.
// @returns: awaitable insert InsertManyResult
async function insertActivities(
  userProfile: DatabaseUserProfile,
  activities: DateActivity[],
): Promise<InsertManyResult<UserActivity>> {
  const activityCollection = client
    .db("users")
    .collection<UserActivity>("activities");
  return activityCollection.insertMany(
    activities.map((activity) => ({
      userId: userProfile._id,
      name: activity.name,
      startDateTime: activity.startDateTime,
      endDateTime: activity.endDateTime,
      location: activity.location,
      description: activity.description,
      estimatedCost: activity.estimatedCost,
      rank: 0, // -1 disliked, 0 neutral, 1 liked
    })),
  );
}

// Update DatabaseUserProfile with activityIds. If the user already has activityIds they are appended,
// otherwise a new activityIds array is added to the DatabaseUserProfile.
// @returns: awaitable UpdateResult
async function updateUserProfileActivities(
  activityIds: ObjectId[],
  userProfile: DatabaseUserProfile,
) {
  if (userProfile.activityIds) {
    userProfile.activityIds.push(...activityIds);
  } else {
    userProfile.activityIds = activityIds;
  }
  const userProfileColleciton = client
    .db("users")
    .collection<DatabaseUserProfile>("profiles");

  return userProfileColleciton.updateOne(
    { _id: userProfile._id },
    { $set: userProfile },
  );
}

// Saves activities for the user.
// Returns true if all activities were saved, and the user profile was updated.
async function saveActivitiesToMongo(
  userProfile: DatabaseUserProfile,
  activities: DateActivity[],
): Promise<boolean> {
  const insertActivitiesResult = await insertActivities(
    userProfile,
    activities,
  );
  const insertedActivityIds = Object.values(
    insertActivitiesResult.insertedIds,
  ) as ObjectId[];
  const updateUserProfileResult = await updateUserProfileActivities(
    insertedActivityIds,
    userProfile,
  );

  return Promise.resolve(
    insertActivitiesResult?.insertedCount == activities.length &&
      updateUserProfileResult.modifiedCount == 1,
  );
}

export async function POST(req: Request) {
  const { activities } = await req.json();

  if (!activities || activities.length === 0) {
    return new NextResponse("No activities provided", { status: 400 });
  }

  const session = await getSession();
  const profileCollection = client
    .db("users")
    .collection<DatabaseUserProfile>("profiles");

  let userProfile = await profileCollection.findOne({ _id: session?.user.sub });

  if (!userProfile) {
    return new NextResponse("", { status: 401 });
  }

  try {
    const saved = await saveActivitiesToMongo(userProfile, activities);
    if (saved) {
      return new NextResponse("", { status: 201 });
    } else {
      return new NextResponse("Error saving activities", { status: 500 });
    }
  } catch (err) {
    // TODO: add logging for database errors.
    console.log(err);
    return new NextResponse("Exception thrown saving activities", {
      status: 500,
    });
  }
}
