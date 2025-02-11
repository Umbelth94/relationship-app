//TODO: Set up modal visibility to potentially work from page context instead of within the modal
//TODO: Finish thumbs up thumbs down buttons and decide what we want them to actually do
//TODO: Set up modal to close when clicking outside of the modal, and a way to bring the modal back up.

"use client";

import React, { useState } from "react";
import { DateActivity, GeneratedDate } from "../dategenerator/page";
import { ThumbsDown, ThumbsUp } from "../icons/icons";

interface DateModalProps {
  generatedDate: GeneratedDate;
}

interface LikableDateActivity extends DateActivity {
  liked: "liked" | "disliked" | "neutral";
}

export default function DateModal({ generatedDate }: DateModalProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  //May need to keep this and import the isOpen from the dateGenerator page to avoid a situation where the modal can't re-render
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const [likableActivities, setLikableActivities] = useState<
    LikableDateActivity[]
  >([]);

  if (likableActivities.length == 0) {
    let newActivitiesList: LikableDateActivity[] = [];
    generatedDate.activities.forEach((activity) => {
      newActivitiesList.push({
        ...activity,
        liked: "neutral",
      });
    });
    setLikableActivities(newActivitiesList);
  }

  return (
    <>
      {isOpen && (
        <div className="flex fixed h-[100vh] w-[100vw] mt-[-3em] bg-black/75">
          <div className="flex absolute top-[20%] right-[25%] flex-col m-auto gap-2 text-[#747474] bg-tertiary rounded-xl px-[2em] pb-[2em] pt-[1em] shadow-lg justify-self-center">
            <div className="absolute top-0 right-0">
              <span className="border p-2 hover:pointer" onClick={closeModal}>
                X
              </span>
            </div>
            {likableActivities.map((activity) => {
              return (
                <div className=" flex flex-row justify-between border p-5 m-2 border-black/50">
                  <div>
                    <p>{activity.name}</p>
                    <p>{activity.description}</p>
                    <p>{activity.location}</p>
                    <p>{activity.estimatedCost}</p>
                    <p>{activity.startTime}</p>
                    <p>{activity.endTime}</p>
                  </div>
                  <div className="flex flex-row gap-2">
                    <div
                      onClick={() => {
                        activity.liked = "liked";
                      }}
                    >
                      <ThumbsUp selected={activity.liked == "liked"}></ThumbsUp>
                    </div>
                    <div
                      onClick={() => {
                        activity.liked = "disliked";
                      }}
                    >
                      <ThumbsDown
                        selected={activity.liked == "disliked"}
                      ></ThumbsDown>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
