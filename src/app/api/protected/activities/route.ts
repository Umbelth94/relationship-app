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

const updateUserProfileActivities = async (
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

export const POST = withUserProfile(
  async (userProfile: DatabaseUserProfile, req: Request) => {
    const { activities } = await req.json();
    if (!activities || activities.length === 0) {
      return new NextResponse("No activities provided", { status: 400 });
    }

    const saved = await saveActivitiesToMongo(userProfile, activities);

    if (saved) {
      return new NextResponse(
        JSON.stringify({
          message: "Activities saved successfully",
          activityIds: saved,
        }),
        {
          status: 201,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    } else {
      return new NextResponse(
        JSON.stringify({ error: "Error saving activities" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  },
);

export async function getActivities(
  objectIds: ObjectId[],
): Promise<UserDateActivity[]> {
  const activitiesCollection = client
    .db("users")
    .collection<UserDateActivity>("activities");
  return await activitiesCollection.find({ _id: { $in: objectIds } }).toArray();
}

export const GET = withUserProfile(
  async (userProfile: DatabaseUserProfile, req: Request) => {
    // If there are no activityIds, return an empty activities array.
    if (!userProfile.activityIds || userProfile.activityIds.length === 0) {
      return NextResponse.json({ activities: [] });
    }

    // Retrieve activities where _id is in the user's activityIds array.
    const activities = await getActivities(userProfile.activityIds);

    return NextResponse.json({ activities });
  },
);

export const PATCH = withUserProfile(
  async (userProfile: DatabaseUserProfile, req: Request) => {
    try {
      // Expecting an array of objects: { _id: "someId", rank: 1, ... }
      const { activities } = await req.json();
      if (
        !activities ||
        !Array.isArray(activities) ||
        activities.length === 0
      ) {
        return new NextResponse("No activities provided", { status: 400 });
      }

      const activityCollection = client
        .db("users")
        .collection<UserDateActivity>("activities");

      // create an array of bulk operations, each element of the array is an update for an activity
      const bulkOps = activities.map((activity: any) => {
        if (!activity._id) {
          throw new Error("Each activity must include an _id.");
        }

        // Destructure _id and the rest of the fields to update.
        const { _id, ...updateFields } = activity;

        // Prevent any attempt to update the _id or userId.
        delete updateFields._id;
        delete updateFields.userId;

        // Update the activity by _id and make sure the userProfile._id matches
        return {
          updateOne: {
            filter: {
              _id: new ObjectId(_id as string),
              userId: userProfile._id,
            },
            update: { $set: updateFields },
          },
        };
      });

      if (bulkOps.length === 0) {
        return new NextResponse("No valid update operations", { status: 400 });
      }

      // execute the bulk operations
      const result = await activityCollection.bulkWrite(bulkOps);

      return new NextResponse("", { status: 200 });
    } catch (error: any) {
      console.error("PATCH Activities error:", error);
      return new NextResponse("", { status: 500 });
    }
  },
);
