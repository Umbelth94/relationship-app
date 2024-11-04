"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { UserProfile } from "../models/UserProfile";
import { useUserProfile } from "../hooks/useUserProfile";

export const UserProfileContext = createContext<any | undefined>(undefined);

export default function UserProfileProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [rerender, setRerender] = useState(0);

  useEffect(() => {
    console.log("Provider useEffect");
  }, [rerender, setRerender]);
  const userProfile = useUserProfile();
  console.log(userProfile + "user profile provider");

  return (
    <UserProfileContext.Provider value={{ userProfile, rerender, setRerender }}>
      {children}
    </UserProfileContext.Provider>
  );
}
