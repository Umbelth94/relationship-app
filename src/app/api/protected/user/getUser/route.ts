import client from "@/mongodb/mongodb";
import { getSession } from "@auth0/nextjs-auth0";

import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getSession();
  console.log("User id = " + session.user.sub);
  try {
    const db = client.db("users");
    const user = await db
      .collection("profiles")
      .findOne({ _id: session.user.sub });
    if (user == null) {
      return NextResponse.json({ error: "Not found" }, { status: 400 });
    }
    return NextResponse.json(user);
  } catch (e) {
    console.error(e);
  }
}
