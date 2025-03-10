import { ObjectId } from "mongodb";
import { DateActivity } from "../dategenerator/page";

export interface Date {
  activityIds: ObjectId[];
  userDatabaseId: ObjectId;
}
