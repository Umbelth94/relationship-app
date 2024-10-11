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
  aboutMe: string;
  birthDate: string;
  city: string;
  country: string;
  dateActivities: string;
  dateTimes: string;
  line1: string;
  line2: string;
  phone: string;
  pronouns: string;
  state: string;
  zip: string;
  hobbies: string;
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  const updatedProfile = await req.json();
  const collection = client.db("users").collection("profiles");
  collection.findOneAndUpdate(
    { _id: session?.user.sub },
    { $set: updatedProfile },
  );
  return NextResponse.json({}, { status: 200 });
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
  let dbUser = await collection.findOne({ _id: session?.user.sub });
  //If user does not exist, create the user
  if (dbUser == null) {
    createUser(session, collection);
    //set user to the newly created database document
    dbUser = await collection.findOne({ _id: session?.user.sub });
  }
  //Reformat the returned document to a new ID for easier use with our state variable
  const res = {
    id: dbUser?._id,
    ...dbUser,
  };
  //Delete _id from the response so that we do not have duplicate/redundant id tags
  delete res._id;
  return NextResponse.json(res);
}

async function createUser(
  session: Session | null | undefined,
  collection: Collection<databaseUserProfile>,
) {
  const userProfile = {
    _id: session?.user.sub,
    email: session?.user.email,
    firstName: session?.user.given_name ?? "",
    lastName: session?.user.family_name ?? "",
  };
  await collection.insertOne(userProfile);
}
