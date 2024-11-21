//TODO::: Tinker with getting rid of rerender and try to just get the state variable to update on form submission using the userProfile state variable
//TODO::: Experiment with profile updating (because sometimes I think it doesn't work right?)
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  SetStateAction,
  Dispatch,
} from "react";
import { UserProfile } from "../models/UserProfile";

interface UserProfileContextProps {
  userProfile?: UserProfile;
  setUserProfile?: Dispatch<SetStateAction<UserProfile | undefined>>;
}

export const UserProfileContext = createContext<UserProfileContextProps>({});

export default function UserProfileProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [userProfile, setUserProfile] = useState<UserProfile>();

  // Run a fetch request to grab the user's profile information
  useEffect(() => {
    console.log("Provider useEffect initialized");
    if (typeof window !== "undefined") {
      console.log("fetching profile data");
      fetch(`${window.location.origin}/api/protected/user/`).then((data) => {
        //Set userProfile state variable
        if (data.status === 200) {
          data.json().then((userData) => {
            // debugger;
            if (JSON.stringify(userData) !== JSON.stringify(userProfile)) {
              setUserProfile(userData);
            } else {
              return;
            }
          });
        }
      });
    }
  }, [userProfile]);

  return (
    //Wrap the child elements inside of the provider
    <UserProfileContext.Provider value={{ userProfile, setUserProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
}
