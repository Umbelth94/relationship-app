"use client";

import Button from "component-nest/components/client/buttons/Button";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useContext } from "react";
import UserProfileProvider, {
  UserProfileContext,
} from "./provider/userProfileProvider";

export default function Home() {
  const user = useContext(UserProfileContext);
  return (
    <main className="flex-column w-screen min-h-screen">
      <h1>Hello {user?.userProfile?.firstName}</h1>
      <Button onClick={() => console.log("Hello daddy")}>I am text</Button>
    </main>
  );
}
