"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useContext } from "react";
import UserDataProvider, { UserDataContext } from "./provider/userDataProvider";
import { useRouter } from "next/navigation";

export default function Home() {
  let { user, error, isLoading } = useUser();

  const router = useRouter();
  return (
    <>
      {!user && (
        <main className="flex-column w-screen min-h-screen">
          <div className={"mt-10 w-full flex flex-col items-center"}>
            <p className={"text-3xl font-semibold text-center"}>
              Your love story, beautifully organized
            </p>
            <p className={"my-5 text-2xl text-[#6e6e6e] text-center"}>
              A private digital space for couples to save memories, keep
              conversations and plan unforgettable dates with smart tools and
              ideas
            </p>
            <input
              className="hover:scale-105 my-5 p-5 px-10 bg-primary shadow-lg shadow-primary text-lg text-on-primary cursor-pointer rounded-md "
              type="button"
              onClick={() => {
                router.push(`/api/auth/login`);
              }}
              value="Sign Up"
            ></input>
          </div>

          <div className={"flex flex-row "}>
            <img src="./landing/1.png" alt="" />
            <img src="./landing/2.png" alt="" />
            <img src="./landing/3.png" alt="" />
            <img src="./landing/4.png" alt="" />
          </div>
        </main>
      )}
    </>
  );
}
