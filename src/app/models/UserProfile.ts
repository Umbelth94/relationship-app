import { UserProfileFields } from "../myaccount/page";
import { ObjectId } from "mongodb";

export interface DatabaseUserProfile extends UserProfile {
  _id: string;
}

type NewType = ObjectId;

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  birthDate?: string;
  phone?: string;
  pronouns?: string;
  address?: Addresses;
  about?: About;
  savedDates: ObjectId[];
  activityVoteHistory: ActivityVoteHistory;
}

interface Addresses {
  city?: string;
  country?: string;
  line1?: string;
  line2?: string;
  state?: string;
  zip?: string;
}

interface About {
  hobbies?: string;
  dateActivities?: string;
  dateTimes?: string;
  aboutMe?: string;
}

//These may need to be safed as references later if we'd like to do more with the dates than just sending them into openAI prompt
interface ActivityVoteHistory {
  activityId: ObjectId;
  activityName: string;
  vote: "like" | "dislike";
}
[];
