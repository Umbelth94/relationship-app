//Implement update functionality for upvoting and downvoting activities that are already saved into database
//Implement updating timeframe (so user can change what time the activity is))

import client from "@/mongodb/mongodb";
import { DateActivity } from "../../../dategenerator/page";
import { NextResponse } from "next/server";
import { DatabaseUserProfile } from "@/app/models/UserProfile";
import { ClientSession, InsertManyResult, ObjectId } from "mongodb";
import withUserProfile from "@/app/api-helpers/withUserProfile";
import {
  getActivities,
  patchActivities,
  saveActivitiesToMongo,
  UserDateActivity,
} from "@/app/api-helpers/activitiesRouteHelper";

export const POST = withUserProfile(
  async (userProfile: DatabaseUserProfile, req: Request) => {
    const { activities } = await req.json();
    if (!activities || activities.length === 0) {
      return new NextResponse("No activities provided", { status: 400 });
    }

    const saved = await saveActivitiesToMongo(userProfile, activities);

    if (saved) {
      return new NextResponse(
        JSON.stringify({
          message: "Activities saved successfully",
          activityIds: saved,
        }),
        {
          status: 201,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    } else {
      return new NextResponse(
        JSON.stringify({ error: "Error saving activities" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  },
);

export const GET = withUserProfile(
  async (userProfile: DatabaseUserProfile, req: Request) => {
    // If there are no activityIds, return an empty activities array.
    if (!userProfile.activityIds || userProfile.activityIds.length === 0) {
      return NextResponse.json({ activities: [] });
    }

    // Retrieve activities where _id is in the user's activityIds array.
    const activities = await getActivities(userProfile.activityIds);

    return NextResponse.json({ activities });
  },
);

//Updates the rank of activities
export const PATCH = withUserProfile(
  async (userProfile: DatabaseUserProfile, req: Request) => {
    try {
      // Expecting an array of objects: { _id: "someId", rank: 1, ... }
      const { activities } = await req.json();
      if (
        !activities ||
        !Array.isArray(activities) ||
        activities.length === 0
      ) {
        return new NextResponse("No activities provided", { status: 400 });
      }

      await patchActivities(activities, userProfile);

      return new NextResponse("", { status: 200 });
    } catch (error: any) {
      console.error("PATCH Activities error:", error);
      return new NextResponse("", { status: 500 });
    }
  },
);
