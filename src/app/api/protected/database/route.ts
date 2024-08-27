import client from "@/mongodb/mongodb";

import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

//
// eslint-disable-next-line import/no-anonymous-default-export
export async function GET(req: NextApiRequest) {
  try {
    const db = client.db("sample_mflix");
    const movies = await db
      .collection("movies")
      .find({})
      .sort({ metacritic: -1 })
      .limit(10)
      .toArray();
    return NextResponse.json(movies);
  } catch (e) {
    console.error(e);
  }
}
