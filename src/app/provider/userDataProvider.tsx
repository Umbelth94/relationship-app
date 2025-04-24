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
import { UserDateInfo } from "../api-helpers/datesRouteHelper";

interface UserDataContextProps {
  userDates?: UserDateInfo[];
  setUserDates?: Dispatch<SetStateAction<UserDateInfo[] | undefined>>;
  userProfile?: UserProfile;
  setUserProfile?: Dispatch<SetStateAction<UserProfile | undefined>>;
  refetchUserDates?: () => void;
}

export const UserDataContext = createContext<UserDataContextProps>({});

export default function UserDataProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [userDates, setUserDates] = useState<UserDateInfo[]>();

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

  const fetchUserDates = () => {
    fetch(`${window.location.origin}/api/protected/dates`)
      .then((res) => res.json())
      .then((data) => {
        setUserDates(data.userDates);
      });
  };
  useEffect(() => {
    if (userProfile) {
      fetchUserDates();
    }
  }, [userProfile]);

  return (
    //Wrap the child elements inside of the provider
    <UserDataContext.Provider
      value={{
        userProfile,
        setUserProfile,
        userDates,
        setUserDates,
        refetchUserDates: fetchUserDates,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}
