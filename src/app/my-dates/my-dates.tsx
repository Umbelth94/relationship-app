"use client";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { NextPage } from "next";

const MyDates: NextPage = withPageAuthRequired(
  () => {
    return (
      <main>
        <div>
          <p>Pengis</p>
        </div>
      </main>
    );
  },
  { returnTo: "/my-dates" },
);

export default MyDates;
