import client from "@/mongodb/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { DateActivity } from "../../../dategenerator/page";
import { NextRequest, NextResponse } from "next/server";
import { DatabaseUserProfile } from "@/app/models/UserProfile";
import { getSession } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";

// Saves activities for the user.
// Returns true if all activities were saved.
async function saveActivitiesToMongo(
  userProfile: DatabaseUserProfile,
  activities: DateActivity[],
): Promise<boolean> {
  const activityCollection = client.db("users").collection("activities");
  console.log(userProfile._id);
  const savedActivities = await activityCollection.insertMany(
    activities.map((activity) => ({
      userId: userProfile._id,
      name: activity.name,
      calendarDate: activity.calendardate,
      startTime: activity.startTime,
      endTime: activity.endTime,
      location: activity.location,
      description: activity.description,
      estimatedCost: activity.estimatedCost,
      rank: 0, // -1 disliked, 0 neutral, 1 liked
    })),
  );

  return Promise.resolve(savedActivities?.insertedCount == activities.length);
}

export async function POST(req: Request) {
  const { activities } = await req.json();

  if (!activities || activities.length === 0) {
    return new NextResponse("No activities provided", { status: 400 });
  }

  const session = await getSession();
  const profileCollection = client
    .db("users")
    .collection<DatabaseUserProfile>("profiles");

  let userProfile = await profileCollection.findOne({ _id: session?.user.sub });

  console.log("userProfile", userProfile);

  if (!userProfile) {
    return new NextResponse("", { status: 401 });
  }

  try {
    const saved = await saveActivitiesToMongo(userProfile, activities);
    if (saved) {
      return new NextResponse("", { status: 201 });
    } else {
      return new NextResponse("Error saving activities", { status: 500 });
    }
  } catch (err) {
    // TODO: add logging for database errors.
    console.log(err);
    return new NextResponse("Exception thrown saving activities", {
      status: 500,
    });
  }
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {}
