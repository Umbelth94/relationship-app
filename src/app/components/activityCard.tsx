//Set it up so that upvote sets activity.voteStatus to upvote so that it can get saved into database as such
//Set up downvote to automatically save that activity name into database
//

"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { DateActivity, GeneratedDate } from "../dategenerator/page";
import { ThumbsDown, ThumbsUp } from "../icons/icons";

interface ActivityCardProps {
  setGeneratedDate: Dispatch<SetStateAction<GeneratedDate | undefined>>;
  activity: DateActivity;
  index: number;
}

export default function ActivityCard({
  setGeneratedDate,
  activity,
  index,
}: ActivityCardProps) {
  const handleDownvote = () => {
    setGeneratedDate((date) => {
      if (!date) return date;
      const updatedActivities = date.activities.filter((_, i) => i !== index);
      // If updatedActivities is empty (no activities left), set the generatedDate to undefined
      return updatedActivities.length > 0
        ? { activities: updatedActivities }
        : undefined;
    });
  };
  return (
    <div
      key={activity._id}
      className=" flex relative flex-row justify-between border p-5 m-2 border-black/50"
    >
      <div>
        <p>{activity.name}</p>
        <p>{activity.description}</p>
        <p>{activity.location}</p>
        <p>{activity.estimatedCost}</p>
        <p>
          {activity.startDateTime instanceof Date
            ? activity.startDateTime.toDateString()
            : "Invalid Date"}
        </p>
        <p>
          {activity.endDateTime instanceof Date
            ? activity.endDateTime.toDateString()
            : "Invalid Date"}
        </p>
      </div>
      <div className="flex flex-row gap-2">
        <div>
          <ThumbsUp selected={false}></ThumbsUp>
        </div>
        <div>
          <ThumbsDown selected={false} onClick={handleDownvote}></ThumbsDown>
        </div>
      </div>
    </div>
  );
}
