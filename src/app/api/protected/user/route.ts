//TODO: Put in better error handling for cases where the session is invalid, or if database operations fail.
//TODO: Modify the PUT request to also include the user creation so that the GET request ONLY handles retrieving user profiles.

import { DatabaseUserProfile } from "@/app/models/UserProfile";
import client from "@/mongodb/mongodb";
import { Session, getSession } from "@auth0/nextjs-auth0";
import { Collection, Db } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

//Updates the user's profile in the database using their Auth0 ID as the identifier.  If the user exists, the profile is updated with the new data provided in the request
export async function PUT(req: NextRequest) {
  const session = await getSession();
  const updatedProfile = await req.json();
  const collection = client.db("users").collection("profiles");
  await collection.findOneAndUpdate(
    { _id: session?.user.sub },
    { $set: updatedProfile },
  );
  return NextResponse.json({}, { status: 200 });
}

//Search the database for a match using the Auth0 id from session and the _id in MongoDB.  If that user does not exist, it will create them and return it.
export async function GET(req: NextRequest) {
  const session = await getSession();
  const collection = client
    .db("users")
    .collection<DatabaseUserProfile>("profiles");
  try {
    return getUser(session, collection);
  } catch (e) {
    console.error(e);
    return NextResponse.json({}, { status: 500 });
  }
}

//Checks if the user exists in the database.  If not, it calls createUser to insert a new profile and then retrieves it
async function getUser(
  session: Session | null | undefined,
  collection: Collection<DatabaseUserProfile>,
) {
  //Find the user in the database
  let dbUser = await collection.findOne({ _id: session?.user.sub });
  //If user does not exist, create the user
  if (dbUser == null) {
    createUser(session, collection);
    //set user to the newly created database document
    dbUser = await collection.findOne({ _id: session?.user.sub });
  }
  return NextResponse.json(dbUser);
}

async function createUser(
  session: Session | null | undefined,
  collection: Collection<DatabaseUserProfile>,
) {
  const userProfile = {
    _id: session?.user.sub,
    email: session?.user.email,
    firstName: session?.user.given_name ?? "",
    lastName: session?.user.family_name ?? "",
  };
  await collection.insertOne(userProfile);
}
