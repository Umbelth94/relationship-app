import { ObjectId } from "mongodb";

export interface Date {
  activityIds: ObjectId[];
  userDatabaseId: ObjectId;
}
