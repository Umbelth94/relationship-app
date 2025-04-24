import client from "@/mongodb/mongodb";
import { ClientSession, InsertManyResult, ObjectId } from "mongodb";
import { DatabaseUserProfile } from "../models/UserProfile";
import { DateActivity } from "../dategenerator/page";

export const insertActivities = async (
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
        userId: userProfile._id, //Associate activity with the user
        name,
        startDateTime,
        endDateTime,
        location,
        description,
        estimatedCost,
        rank: 0, // -1 disliked, 0 neutral, 1 liked
      }),
    ),
    { session }, // Ensure operation is part of the transaction
  );
};

export const updateUserProfileActivities = async (
  activityIds: ObjectId[],
  userProfile: DatabaseUserProfile,
  session: ClientSession,
) => {
  const profileCollection = client
    .db("users")
    .collection<DatabaseUserProfile>("profiles");

  return profileCollection.updateOne(
    { _id: userProfile._id }, // Find user by ID
    { $push: { activityIds: { $each: activityIds } } }, // Append new activity IDs
    { session }, // Ensure operation is part of the transaction
  );
};

export const saveActivitiesToMongo = async (
  userProfile: DatabaseUserProfile,
  activities: DateActivity[],
): Promise<ObjectId[] | null> => {
  const session = client.startSession();
  let insertedIds: ObjectId[] | null = null;
  try {
    await session.withTransaction(async () => {
      const insertResult = await insertActivities(
        userProfile,
        activities,
        session,
      );
      insertedIds = Object.values(insertResult.insertedIds) as ObjectId[];
      const updateResult = await updateUserProfileActivities(
        insertedIds,
        userProfile,
        session,
      );

      // Ensure all activities were inserted and profile was updated
      return insertResult.insertedCount === activities.length &&
        updateResult.modifiedCount === 1
        ? insertedIds
        : null;
    });
  } catch (err) {
    console.error("saveActivitiesToMongo failed:", err);
    insertedIds = null;
  } finally {
    await session.endSession();
  }
  return insertedIds; // Return the array of inserted activity IDs or null if failure
};

export interface UserDateActivity {
  userId: string;
  name: string;
  startDateTime: Date;
  endDateTime: Date;
  location: string;
  description: string;
  estimatedCost: string;
  rank: number;
}

export async function getActivities(
  objectIds: ObjectId[],
): Promise<UserDateActivity[]> {
  const activitiesCollection = client
    .db("users")
    .collection<UserDateActivity>("activities");
  return await activitiesCollection.find({ _id: { $in: objectIds } }).toArray();
}

export async function patchActivities(
  activities: DateActivity[],
  userProfile: DatabaseUserProfile,
) {
  const activityCollection = client
    .db("users")
    .collection<UserDateActivity>("activities");

  // create an array of bulk operations, each element of the array is an update for an activity
  const bulkOps = activities.map((activity: any) => {
    if (!activity._id) {
      throw new Error("Each activity must include an _id.");
    }

    //Define allowed keys for updating
    const ALLOWED_UPDATE_FIELDS = ["rank"] as const;
    type AllowedUpdateField = (typeof ALLOWED_UPDATE_FIELDS)[number];

    //Filter the update object so that it only includes valid fields
    const sanitizedUpdateFields = Object.fromEntries(
      Object.entries(activity).filter(([key]) =>
        ALLOWED_UPDATE_FIELDS.includes(key as AllowedUpdateField),
      ),
    );

    // Update the activity by _id and make sure the userProfile._id matches
    return {
      updateOne: {
        filter: {
          _id: new ObjectId(activity._id as string),
          userId: userProfile._id,
        },
        update: { $set: sanitizedUpdateFields },
      },
    };
  });

  // execute the bulk operations
  const result = await activityCollection.bulkWrite(bulkOps);
}
