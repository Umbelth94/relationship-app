// this is just a placeholder page that does not recieve data

import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { NextPage } from "next";

const MyAccount: NextPage = withPageAuthRequired(
  async () => {
    return (
      <main className="h-screen w-screen">
        <h1>This is just a placeholder page for the MyAccount page</h1>
      </main>
    );
  },
  { returnTo: "/myaccount" },
);

export default MyAccount;
