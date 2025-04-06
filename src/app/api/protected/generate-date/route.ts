//TODO: Consider more details that we could add to generated activities
import { DateFormData, GeneratedDate } from "@/app/dategenerator/page";
import { DatabaseUserProfile } from "@/app/models/UserProfile";
import client from "@/mongodb/mongodb";
import { Session, getSession } from "@auth0/nextjs-auth0";
import { Collection, Db } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getActivities, saveActivitiesToMongo } from "../activities/route";
import withUserProfile from "@/app/api-helpers/withUserProfile";
const openai = new OpenAI();

const responseFormat = `
{
    "generatedDate": {
        "activities": [
            {
              "name": string,
              "startDateTime": Date,
              "endDateTime": Date,
              "location": string,
              "description": string,
              "estimatedCost": string,
            }
        ]
    }
}
`;

export const POST = withUserProfile(
  async (userProfile: DatabaseUserProfile, req: Request) => {
    const dateFormData: DateFormData = await req.json();

    let location = "";
    if (dateFormData.location === undefined) {
      location = dateFormData.location;
    } else {
      location = `${userProfile?.address?.city}, ${userProfile?.address?.state}`;
    }

    console.log(dateFormData.tags);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful friend that knows alot about activities that a couple should do together.",
        },
        {
          role: "user",
          content: `
                Respond with a valid json parsable string. do not put the word "json" at the beginning of the response. Respond with only a single valid json object. The first character of the response should be { and the last should be }. It should have the following format:
                ${responseFormat}

                

                Use only real locations in the generated activities. Populate the response json object with activities to create a perfect date using the following groups of information:
                The following are some ideas to use, but the system should come up with ideas of it's own as well ${dateFormData.tags}.
                The location of the date should be in or near ${location}. Ensure all locations exist and have valid addresses.
                The amount of money they want to spend is ${dateFormData.budget}.
                The date should be ${dateFormData.private ? "private" : "public"}.
                
                Here is some more information about the user that can help guide your decision making:
                This is their about me section [${userProfile?.about?.aboutMe}].
                Their favorite date activity or activities are ${userProfile?.about?.dateActivities}.
                Their ideal time of day for a date is ${userProfile?.about?.dateTimes}.
                Their favorite hobby or hobbies are ${userProfile?.about?.hobbies}.
                
                For the following familiarity rating, 10 is a familiar activity which relates to the users hobbies and favorite date activities. 0 is something new which does not relate to the user and so the generated activities should be completely unrelated to their interests or hobbies.  The users selected familiarity rating is ${dateFormData.familiarity}.

                `,
        },
      ],
      store: true,
    });

    // Get activities array out of GPT response
    const message = completion.choices[0].message;
    const gptGeneratedActivities = JSON.parse(message.content ?? "")[
      "generatedDate"
    ]["activities"];

    // Save GPT generated activities to Mongo
    const activityIds = await saveActivitiesToMongo(
      userProfile,
      gptGeneratedActivities,
    );

    // Build response body with activity records from Mongo
    const activities = await getActivities(activityIds ?? []);
    const responseBody: GeneratedDate = {
      activities,
    };

    return NextResponse.json(responseBody, { status: 200 });
  },
);
