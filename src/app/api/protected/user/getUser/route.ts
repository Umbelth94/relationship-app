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
    const res = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    return NextResponse.json(res);
  } catch (e) {
    console.error(e);
  }
}
