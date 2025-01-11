import { UserProfileFields } from "../myaccount/page";

export interface DatabaseUserProfile extends UserProfile {
  _id: string;
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  birthDate?: string;
  phone?: string;
  pronouns?: string;
  address?: Addresses;
  about?: About;
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
