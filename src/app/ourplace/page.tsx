// this is just a placeholder page that does not recieve data
"use client";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { NextPage } from "next";

const OurPlace: NextPage = withPageAuthRequired(
  () => {
    return (
      <main className="h-screen w-screen">
        <h1>This is just a placeholder page for the OurPlace page</h1>
      </main>
    );
  },
  { returnTo: "/ourplace" },
);

export default OurPlace;
