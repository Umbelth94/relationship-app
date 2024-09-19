import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

//We will need to continually update this to match the basic profile information on the database
interface UserProfile {
  name: string;
  email: string;
  userId: string;
}

export function useUserProfile(): UserProfile | undefined {
  const [userProfile, setUserprofile] = useState<UserProfile | undefined>(
    undefined,
  );

  let { user, error, isLoading } = useUser();

  // check if the user profile exists (if it gets a 500)
  fetch(`${window.location.origin}/api/protected/user/getUser`).then((user) => {
    user.json().then((a) => console.log(a));
  }); //We will want to save this ^^^^ as a state variable to be referenced throughout the site

  //If the user profile does exist, set userProfile to the userProfile from the database

  //If the user profile doesn't exist (isn't found), we want to create it in the database with a post request API route

  return userProfile;
}
