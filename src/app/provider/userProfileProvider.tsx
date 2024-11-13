//TODO::: Tinker with getting rid of rerender and try to just get the state variable to update on form submission using the userProfile state variable
//TODO::: Experiment with profile updating (because sometimes I think it doesn't work right?)
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { UserProfile } from "../models/UserProfile";

export const UserProfileContext = createContext<any | undefined>(undefined);

export default function UserProfileProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [rerender, setRerender] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfile>();

  // Run a fetch request to grab the user's profile information
  useEffect(() => {
    console.log("Provider useEffect");
    if (typeof window !== "undefined") {
      console.log("fetching profile data");
      fetch(`${window.location.origin}/api/protected/user/`).then((data) => {
        //Set userProfile state variable
        if (data.status === 200) {
          data.json().then((userData) => setUserProfile(userData));
        }
      });
    }
  }, [rerender, setRerender]);
  console.log(userProfile + "user profile provider");

  return (
    //Wrap the child elements inside of the provider
    <UserProfileContext.Provider value={{ userProfile, rerender, setRerender }}>
      {children}
    </UserProfileContext.Provider>
  );
}
