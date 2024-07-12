"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";

export default function Home() {
  let { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  console.log(user);
  return (
    <main className="flex w-screen min-h-screen">
      <div className="flex w-screen h-[2rem] bg-slate-50">
        <button className="bg-blue-500 hover:bg-blue-700 rounded p-[.5rem] text-white ">
          Sign In
        </button>
      </div>
      {/* if user exists, display username */}
      {user && <div>{user.name}</div>}
    </main>
  );
}
