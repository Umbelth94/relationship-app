import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

//We will need to continually update this to match the basic profile information on the database
//*Remember to update the databaseUserProfile to match this in our getUser Route*//
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  aboutMe: string;
  birthDate: string;
  city: string;
  country: string;
  dateActivities: string;
  dateTimes: string;
  line1: string;
  line2: string;
  phone: string;
  pronouns: string;
  state: string;
  zip: string;
  hobbies: string;
}

//TODO: Find a way to get this to fetch whenever a user's profile data is updated
export function useUserProfile(): UserProfile | undefined {
  const [userProfile, setUserprofile] = useState<UserProfile | undefined>(
    undefined,
  );
  const [isFetched, setIsFetched] = useState<boolean>(false);

  if (typeof window === "undefined") {
    return userProfile;
  }
  if (!isFetched) {
    console.log("fetching profile data");
    fetch(`${window.location.origin}/api/protected/user/`).then((data) => {
      //Set userProfile state variable
      if (data.status === 200) {
        data.json().then((userData) => setUserprofile(userData));
      }
    });
    //Set isFetched so that the function does not repeat
    setIsFetched(true);
    //TODO: In the future, set up something to retry the fetch in case of a network error
  }
  console.log(userProfile);
  return userProfile;
}
