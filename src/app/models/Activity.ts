import { ObjectId } from "mongodb";

export interface Activity {
  _id: ObjectId;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  estimatedCost: string;
  votes: Record<string, "like" | "dislike">; //Key-value pairs where key = userId and value = vote
}
