"use client";

import Button from "component-nest/components/client/buttons/Button";
import { useUser } from "@auth0/nextjs-auth0/client";
export default function Home() {
  let { user, error, isLoading } = useUser();
  return (
    <main className="flex-column w-screen min-h-screen">
      {user && <h1>Hello {user.name}</h1>}
      <Button onClick={() => console.log("Hello daddy")}>I am text</Button>
    </main>
  );
}
