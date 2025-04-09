"use client";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { NextPage } from "next";

const Default: NextPage = withPageAuthRequired(
  () => {
    return (
      <main>
        <div>
          <p>Default</p>
        </div>
      </main>
    );
  },
  { returnTo: "/default" },
);

export default Default;
