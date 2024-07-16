"use client";
import Navbar from "./components/navbar";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Home() {
  let { user, error, isLoading } = useUser();


  return (
    <main className="flex-column w-screen min-h-screen">
      <Navbar></Navbar>
      {user && <h1>Hello {user.name}</h1>}

    </main>
  );
}
