import client from "@/mongodb/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const db = client.db("sample_mflix");
    const movies = await db
      .collection("movies")
      .find({})
      .sort({ metacritic: -1 })
      .limit(10)
      .toArray();
    req.json;
    return NextResponse.json(movies);
  } catch (e) {
    console.error(e);
  }
}
