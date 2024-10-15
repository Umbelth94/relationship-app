export interface UserProfile extends UserProfileFields {
  id: string;
}

export interface DatabaseUserProfile extends UserProfileFields {
  _id: string;
}

interface UserProfileFields {
  firstName?: string;
  lastName?: string;
  email?: string;
  aboutMe?: string;
  birthDate?: string;
  city?: string;
  country?: string;
  dateActivities?: string;
  dateTimes?: string;
  line1?: string;
  line2?: string;
  phone?: string;
  pronouns?: string;
  state?: string;
  zip?: string;
  hobbies?: string;
}
