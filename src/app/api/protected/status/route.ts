import { getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getSession();
  console.log(user?.user.sub);
  console.log("blah");
  return NextResponse.json({ message: "You are authorized bitch" });
}
