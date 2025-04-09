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
import { UserDate } from "../api/protected/dates/route";

interface UserDataContextProps {
  userDates?: UserDate[];
  setUserDates?: Dispatch<SetStateAction<UserDate[] | undefined>>;
  userProfile?: UserProfile;
  setUserProfile?: Dispatch<SetStateAction<UserProfile | undefined>>;
}

export const UserProfileContext = createContext<UserDataContextProps>({});

export default function UserProfileProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [userDates, setUserDates] = useState<UserDate[]>();

  // Run a fetch request to grab the user's profile information
  useEffect(() => {
    console.log("userProfile provider useEffect initialized");
    if (typeof window !== "undefined") {
      console.log("fetching profile data");
      fetch(`${window.location.origin}/api/protected/user/`).then((data) => {
        //Set userProfile state variable
        if (data.status === 200) {
          data.json().then((profileData) => {
            // debugger;
            if (JSON.stringify(profileData) !== JSON.stringify(userProfile)) {
              setUserProfile(profileData);
            } else {
              return;
            }
          });
        }
      });
    }
  }, [userProfile]);

  useEffect(() => {
    console.log("userDates provider useEffect initialized");
    if (typeof window !== "undefined") {
      console.log("fetching date data");
      fetch(`${window.location.origin}/api/protected/dates`).then((dates) => {
        if (dates.status === 200) {
          dates.json().then((dateData) => {
            if (JSON.stringify(dateData) !== JSON.stringify(userDates)) {
              setUserDates(dateData);
            } else {
              return;
            }
          });
        }
      });
    }
  }, [userDates]);

  return (
    //Wrap the child elements inside of the provider
    <UserProfileContext.Provider
      value={{ userProfile, setUserProfile, userDates, setUserDates }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}
