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
  const handleLikeDislike = (liked: boolean) => {
    // Should we update the state variable like this? And then later when the user presses
    // a button like "Create Date", or "Regenerate Date" we update all the activities at once
    // using a new PATCH endpoint?

    // this will currently save the updated activity into the react state, but it does not call the API
    // to update the database
    setGeneratedDate((prevDate) => {
      const activities = prevDate?.activities.map((prevActivity) => {
        let rank = prevActivity.rank;
        if (prevActivity._id == activity._id) {
          // if user liked an already liked activity set it to neutrual
          // or if user disliked an already disliked activity set it to neutrual
          if ((rank == 1 && liked) || (rank == -1 && !liked)) {
            rank = 0;
          } else {
            rank = liked ? 1 : -1;
          }
        }
        return {
          ...prevActivity,
          rank,
        };
      }) as DateActivity[];

      return {
        activities,
      };
    });
  };

  return (
    <div
      key={activity._id}
      className=" flex relative flex-row justify-between border p-5 m-2 border-black/50 text-light-font-color-1 dark:text-dark-font-color-1"
    >
      <div>
        <p>{activity.name}</p>
        <p>{activity.description}</p>
        <p>{activity.location}</p>
        <p>{activity.estimatedCost}</p>
        <p>
          {activity.startDateTime instanceof Date
            ? activity.startDateTime.toLocaleDateString()
            : "Invalid Date"}
        </p>
        <p>
          {" "}
          {`${
            activity.startDateTime instanceof Date
              ? activity.startDateTime.toLocaleTimeString()
              : "Invalid Date"
          } - ${
            activity.endDateTime instanceof Date
              ? activity.endDateTime.toLocaleTimeString()
              : "Invalid Date"
          }`}
        </p>
      </div>
      <div className="flex flex-row gap-2">
        <div>
          <ThumbsUp
            selected={activity.rank == 1}
            onClick={() => handleLikeDislike(true)}
          ></ThumbsUp>
        </div>
        <div>
          <ThumbsDown
            selected={activity.rank == -1}
            onClick={() => handleLikeDislike(false)}
          ></ThumbsDown>
        </div>
      </div>
    </div>
  );
}
