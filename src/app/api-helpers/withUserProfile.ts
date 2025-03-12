import client from "@/mongodb/mongodb";
import { DatabaseUserProfile } from "@/app/models/UserProfile";
import { getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

// Higher-order function to enforce authentication and get the user profile.
export default function withUserProfile(
  handler: (
    userProfile: DatabaseUserProfile,
    req: Request,
  ) => Promise<Response>,
): (req: Request) => Promise<Response> {
  return async (req: Request) => {
    const sessionInfo = await getSession();
    if (!sessionInfo?.user?.sub) {
      return new NextResponse("Not Authorized", { status: 401 });
    }

    const profileCollection = client
      .db("users")
      .collection<DatabaseUserProfile>("profiles");
    const userProfile = await profileCollection.findOne({
      _id: sessionInfo.user.sub,
    });
    if (!userProfile) {
      return new NextResponse("User Profile not found", { status: 404 });
    }
    return handler(userProfile, req);
  };
}
