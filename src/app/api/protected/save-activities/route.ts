import client from "@/mongodb/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { DateActivity } from "../../../dategenerator/page";

async function saveActivitiesToMongo(activities: DateActivity[]) {
  const activityCollection = client.db("users").collection("activities");

  const savedActivities = await activityCollection.insertMany(
    activities.map((activity) => ({
      name: activity.name,
      date: activity.date,
      startTime: activity.startTime,
      endTime: activity.endTime,
      location: activity.location,
      description: activity.description,
      estimatedCost: activity.estimatedCost,
      votes: {}, // Initialize with an empty votes object
    })),
  );

  return savedActivities.insertedIds; // Return activity IDs for Date Saver
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { activities } = req.body; // Assuming activities are passed in the body

  if (!activities || activities.length === 0) {
    return res.status(400).json({ message: "No activities provided" });
  }

  try {
    const savedActivityIds = await saveActivitiesToMongo(activities);
    return res
      .status(200)
      .json({ message: "Activities saved successfully", savedActivityIds });
  } catch (error) {
    console.error("Error saving activities:", error);
    return res.status(500).json({ message: "Error saving activities" });
  }
}
