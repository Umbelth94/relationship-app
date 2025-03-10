import client from "@/mongodb/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

async function saveDateToMongo(
  activityIds: ObjectId[],
  userDatabaseId: ObjectId,
) {
  const dateCollection = client.db("users").collection("dates");

  //Create a new date document with references to the activities
  const dateData = {
    activityIds,
    userDatabaseId,
  };

  const savedDate = await dateCollection.insertOne(dateData);

  return savedDate.insertedId;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { activityIds, userDatabaseId } = req.body;

  if (!activityIds || activityIds.length === 0 || !userDatabaseId) {
    return res.status(400).json({ message: "Missing data" });
  }

  try {
    const savedDateId = await saveDateToMongo(
      activityIds,
      new ObjectId(userDatabaseId),
    );
    return res
      .status(200)
      .json({ message: "Date saved successfully", savedDateId });
  } catch (error) {
    console.error("Error saving date:", error);
    return res.status(500).json({ message: "Error saving date" });
  }
}
