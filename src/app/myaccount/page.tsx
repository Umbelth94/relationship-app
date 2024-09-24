// this is just a placeholder page that does not recieve data
"use client";
import { NextPage } from "next";
import { useUserProfile } from "../hooks/useUserProfile";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

const MyAccount: NextPage = withPageAuthRequired(
  () => {
    const userInfo = useUserProfile();
    return (
      <main className="h-screen w-screen">
        <h1>This is just a placeholder page for the MyAccount page</h1>
      </main>
    );
  },
  { returnTo: "/myaccount" },
);

export default MyAccount;
