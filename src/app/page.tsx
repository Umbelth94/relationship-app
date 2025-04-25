"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useContext } from "react";
import UserDataProvider, { UserDataContext } from "./provider/userDataProvider";
import { useRouter } from "next/navigation";
import LandingCard from "./components/landingCard";

export default function Home() {
  let { user, error, isLoading } = useUser();

  const router = useRouter();
  return (
    <>
      {!user && (
        <main className="flex-col w-screen min-h-screen items-center">
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
          <LandingCard
            header="Your Relationship, All in one place."
            description="Access everything from upcoming dates and shared messages to scrapbook memories and notifications—all from your personalized dashboard."
            imageUrl="./landing/2.png"
            bgColor="bg-on-primary"
            textColor="text-primary"
          />
          <LandingCard
            header="Let AI Plan Your Perfect Date"
            description="Tell us what you like, and our smart date planner will craft a unique, personalized outing-no stress, just magic.  It even considers what it already knows about you"
            imageUrl="./landing/1.png"
            bgColor="bg-[#123640]"
            textColor="text-on-primary"
          />

          <LandingCard
            header="Create Your Shared Scrapbook"
            description="Collaborate on your memories by uploading, editing, and customizing shared photos to craft a beautiful, joint scrapbook. Relive your moments together, anytime."
            imageUrl="./landing/3.png"
            bgColor="bg-on-primary"
            textColor="text-primary"
          />

          <LandingCard
            header="Your Story, One Moment at a Time"
            description="Capture and share life’s most meaningful milestones in a timeline you can both cherish. Relive the memories and celebrate the journey together, whenever you want."
            imageUrl="./landing/4.png"
            bgColor="bg-[#123640]"
            textColor="text-on-primary"
          />
        </main>
      )}
    </>
  );
}
