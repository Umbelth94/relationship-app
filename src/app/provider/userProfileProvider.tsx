"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { UserProfile } from "../models/UserProfile";
import { useUserProfile } from "../hooks/useUserProfile";

export const UserProfileContext = createContext<UserProfile | undefined>(
  undefined,
);

export default function UserProfileProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userProfile = useUserProfile();

  return (
    <UserProfileContext.Provider value={userProfile}>
      {children}
    </UserProfileContext.Provider>
  );
}
