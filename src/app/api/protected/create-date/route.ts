import { DateFormData } from "@/app/dategenerator/page";
import { DatabaseUserProfile } from "@/app/models/UserProfile";
import client from "@/mongodb/mongodb";
import { Session, getSession } from "@auth0/nextjs-auth0";
import { Collection, Db } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI();

const resposneFormat = `
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
  let userProfile = collection.findOne<DatabaseUserProfile>({
    _id: session?.user.sub,
  });
  console.log(userProfile);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      {
        role: "user",
        content: `
                Respond with a valid json object that only had the following format:
                ${resposneFormat}

                Populate the response json object with activities to create a perfect date using the following information:
                ${JSON.stringify(userProfile)}

                ${JSON.stringify(dateFormData)}
                `,
      },
    ],
    store: true,
  });

  const message = completion.choices[0].message;
  console.log(message);
  return NextResponse.json({ generatedDate: message }, { status: 200 });
}
