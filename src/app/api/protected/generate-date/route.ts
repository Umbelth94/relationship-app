//TODO: Tweak open AI prompt to incorporate each specific userobject variable in a sentence instead of sending it just the json object of the user profile and form.
//TODO: Consider more details that we could add to generated activities
import { DateFormData } from "@/app/dategenerator/page";
import { DatabaseUserProfile } from "@/app/models/UserProfile";
import client from "@/mongodb/mongodb";
import { Session, getSession } from "@auth0/nextjs-auth0";
import { Collection, Db } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI();

const responseFormat = `
{
    "generatedDate": {
        "activities": [
            {
                "name": "",
                "date": "",
                "startTime": "",
                "endTime": "",
                "location": "",
                "description": ""
                "estimatedCost":"",
            }
        ]
    }
}
`;

export async function POST(req: NextRequest) {
  const session = await getSession();
  const dateFormData: DateFormData = await req.json();
  const collection = client
    .db("users")
    .collection<DatabaseUserProfile>("profiles");
  let userProfile = await collection.findOne<DatabaseUserProfile>({
    _id: session?.user.sub,
  });

  let location = "";
  if (dateFormData.location === undefined) {
    location = dateFormData.location;
  } else {
    location = `${userProfile?.address?.city}, ${userProfile?.address?.state}`;
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      {
        role: "user",
        content: `
                Respond with a valid json parsable string. The first character of the response should be { and the last should be }. It should have the following format:
                ${responseFormat}

                The familiarity input is rated on a scale from 0 to 10, where 0 is a date that is a new experience unfamiliar to the users, and 10 is an experience that they are both familiar with.  

                Use only real locations in the generated activities. Populate the response json object with activities to create a perfect date using the following groups of information:
                Some ideas that the user has already suggested include ${dateFormData.ideas}.
                The location of the date should be in or near ${location}.
                The familiarity rating is ${dateFormData.familiarity}.
                The amount of money they want to spend is ${dateFormData.budget}.
                The date should be ${dateFormData.private ? "private" : "public"}.

                Here is some more information about the user that can help guide your decision making:
                This is their about me section [${userProfile?.about?.aboutMe}].
                Their favorite date activity or activities are ${userProfile?.about?.dateActivities}.
                Their ideal time of day for a date is ${userProfile?.about?.dateTimes}.
                Their favorite hobby or hobbies are ${userProfile?.about?.hobbies}.


                `,
      },
    ],
    store: true,
  });

  const message = completion.choices[0].message;
  return NextResponse.json(JSON.parse(message.content ?? ""), { status: 200 });
}
