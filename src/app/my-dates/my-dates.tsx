"use client";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { NextPage } from "next";

const MyDates: NextPage = withPageAuthRequired(
  async () => {
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
