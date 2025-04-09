"use client";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { NextPage } from "next";
import { useState } from "react";
import { UserDate } from "../api/protected/dates/route";

const MyDates: NextPage = withPageAuthRequired(
  async () => {
    // All dates state variable
    const [savedDates, setSavedDates] = useState<UserDate | undefined>(
      undefined,
    );

    // Get all dates
    const resp = await fetch(`${window.location.origin}/api/protected/dates`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    //Set response data to savedDates state variable
    if (resp.ok) {
      resp.json().then((data) => {
        setSavedDates(data);
      });
    }

    // Create date cards
    return (
      <main>
        <div>
          {
            // Display a clickable "date" card for each date that will open a modal that provides more details
          }
        </div>
      </main>
    );
  },
  { returnTo: "/mydates" },
);

export default MyDates;
