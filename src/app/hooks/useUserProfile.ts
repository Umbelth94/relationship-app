import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

//We will need to continually update this to match the basic profile information on the database
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
}

export function useUserProfile(): UserProfile | undefined {
  const [userProfile, setUserprofile] = useState<UserProfile | undefined>(
    undefined,
  );
  const [isFetched, setIsFetched] = useState<boolean>(false);

  let { user, error, isLoading } = useUser();

  // check if the user profile exists (if it gets a 500)
  if (typeof window === "undefined") {
    return userProfile;
  }
  if (!isFetched) {
    //If the user profile does exist, set userProfile to the userProfile from the database
    fetch(`${window.location.origin}/api/protected/user/getUser`).then(
      (user) => {
        user.json().then((userData) => setUserprofile(userData));
      },
    );
    setIsFetched(true);
    //TODO: In the future, set up something to retry the fetch in case of a network error
  }

  //If the user profile doesn't exist (isn't found), we want to create it in the database with a post request API route

  return userProfile;
}
