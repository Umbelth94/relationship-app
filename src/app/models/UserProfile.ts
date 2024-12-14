import { UserProfileFields } from "../myaccount/page";

export interface DatabaseUserProfile extends UserProfile {
  _id: string;
}

export function mapUserProfileFromUserProfileFields(
  fields: UserProfileFields,
): UserProfile {
  return {
    firstName: fields.firstName,
    lastName: fields.lastName,
    email: fields.email,
    birthDate: fields.birthDate,
    phone: fields.phone,
    pronouns: fields.pronouns,
    adress: {
      city: fields.city,
      country: fields.country,
      line1: fields.line1,
      line2: fields.line2,
      state: fields.state,
      zip: fields.zip,
    },
    about: {
      aboutMe: fields.aboutMe,
      hobbies: fields.hobbies,
      dateActivities: fields.dateActivities,
      dateTimes: fields.dateTimes,
    },
  };
}

export interface UserProfile {
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
