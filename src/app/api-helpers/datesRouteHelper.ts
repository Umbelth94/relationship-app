import { ObjectId } from "mongodb";
import { DateActivity } from "../dategenerator/page";
import { DatabaseUserProfile } from "../models/UserProfile";
import client from "@/mongodb/mongodb";

export interface UserDate {
  userId: string;
  activityIds: ObjectId[];
}

export interface UserDateInfo extends UserDate {
  activities: DateActivity[];
}

interface GetUserDatesResponse {
  userDates: UserDateInfo;
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
