import { DateActivity } from "../dategenerator/page";

export interface Date {
  activityIds: String[];
  userDatabaseId: String;
}

export interface Activity extends DateActivity {
  _id: String;
}
