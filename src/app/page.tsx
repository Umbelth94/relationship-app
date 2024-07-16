"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";

export default function Home() {
  let { user, error, isLoading } = useUser();

  const router = useRouter();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <main className="flex w-screen min-h-screen">
      <div className="flex w-screen h-[2rem] bg-slate-50">
        {!user && (
          <button
            className="bg-blue-500 hover:bg-blue-700 rounded p-[.5rem] text-white "
            onClick={() => router.push("/api/auth/login")}
          >
            Sign In
          </button>
        )}
        {user && (
          <button
            className="bg-blue-500 hover:bg-blue-700 rounded p-[.5rem] text-white "
            onClick={() => router.push("/api/auth/logout")}
          >
            Sign Out
          </button>
        )}
      </div>
      {/* if user exists, display username */}
      {user && <div>{user.name}</div>}
    </main>
  );
}
