export interface UserProfile extends UserProfileFields {}

export interface DatabaseUserProfile extends UserProfileFields {
  _id: string;
}

// Takes the form data and maps it all to a user profile object for us to submit it to the database
export function createUserFormDataObject(formData: FormData): UserProfile {
  const userProfile: UserProfile = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    birthDate: formData.get("birthDate") as string,
    phone: formData.get("phone") as string,
    pronouns: formData.get("pronouns") as string,
    adress: {
      city: formData.get("city") as string,
      country: formData.get("country") as string,
      line1: formData.get("line1") as string,
      line2: formData.get("line2") as string,
      state: formData.get("state") as string,
      zip: formData.get("zip") as string,
    },
    about: {
      aboutMe: formData.get("aboutMe") as string,
      hobbies: formData.get("hobbies") as string,
      dateActivities: formData.get("dateActivities") as string,
      dateTimes: formData.get("dateTimes") as string,
    },
  };
  return userProfile;
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
