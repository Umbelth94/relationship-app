"use client";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { NextPage } from "next";
import { useContext, useState } from "react";
import { UserDate } from "../api/protected/dates/route";
import { UserDataContext } from "../provider/userDataProvider";

const MyDates: NextPage = withPageAuthRequired(
  () => {
    const { userDates, setUserDates } = useContext(UserDataContext);
    // Create date cards
    return (
      <main>
        <div>
          {userDates?.map((date, index) => {
            return (
              <>
                <hr></hr>
                {date.activities.map((activity, index) => {
                  return <p>{activity.description}</p>;
                })}
              </>
            );
          })}
        </div>
      </main>
    );
  },
  { returnTo: "/mydates" },
);

export default MyDates;
