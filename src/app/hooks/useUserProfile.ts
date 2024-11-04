import { useState, useMemo, useEffect } from "react";
import { UserProfile } from "../models/UserProfile";

//TODO: Find a way to get this to fetch whenever a user's profile data is updated
export function useUserProfile(): UserProfile | undefined {
  const [userProfile, setUserprofile] = useState<UserProfile | undefined>(
    undefined,
  );
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("fetching profile data");
      fetch(`${window.location.origin}/api/protected/user/`).then((data) => {
        //Set userProfile state variable
        if (data.status === 200) {
          data.json().then((userData) => setUserprofile(userData));
        }
      });
    }
  }, []);

  //TODO: In the future, set up something to retry the fetch in case of a network error

  console.log(userProfile);
  return userProfile;
}
