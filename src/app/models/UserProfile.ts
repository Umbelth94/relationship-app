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
  birthDate?: string;
  phone?: string;
  pronouns?: string;
  adress?: Adresses;
  about?: About;
}

interface Adresses {
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
