import client from "@/mongodb/mongodb";
import { Session, getSession } from "@auth0/nextjs-auth0";
import { Collection, Db } from "mongodb";

import { NextResponse, NextRequest } from "next/server";

//The ONLY DIFFERENCE between this one and the one in our useUserProfile hook is the _id
interface databaseUserProfile {
  firstName: string;
  lastName: string;
  email: string;
  _id: string;
}

//This function will search the database for a match using the Auth0 id from session and the _id in MongoDB.  If that user does not exist, it will create them and return it.
export async function GET(req: NextRequest) {
  const session = await getSession();
  console.log("User id = " + session?.user.sub);
  const collection = client
    .db("users")
    .collection<databaseUserProfile>("profiles");
  try {
    return getUser(session, collection);
  } catch (e) {
    console.error(e);
    return NextResponse.json({}, { status: 500 });
  }
}

async function getUser(
  session: Session | null | undefined,
  collection: Collection<databaseUserProfile>,
) {
  //Find the user in the database
  let user = await collection.findOne({ _id: session?.user.sub });
  //If user does not exist, create the user
  if (user == null) {
    createUser(session, collection);
    //set user to the newly created database document
    user = await collection.findOne({ _id: session?.user.sub });
  }
  //Reformat the returned document to a new ID for easier use with our state variable
  const res = {
    id: user?._id,
    email: user?.email,
    firstName: user?.firstName,
    lastName: user?.lastName,
  };
  return NextResponse.json(res);
}

async function createUser(
  session: Session | null | undefined,
  collection: Collection<databaseUserProfile>,
) {
  const userProfile = {
    _id: session?.user.sub,
    email: session?.user.email,
    firstName: "",
    lastName: "",
  };
  await collection.insertOne(userProfile);
}
