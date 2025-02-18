//TODO: Finish thumbs up thumbs down buttons and decide what we want them to actually do
//TODO: Better styling
//TODO: Save entire date button

"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { DateActivity, GeneratedDate } from "../dategenerator/page";
import { ThumbsDown, ThumbsUp } from "../icons/icons";

interface DateModalProps {
  generatedDate: GeneratedDate;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setGeneratedDate: Dispatch<SetStateAction<GeneratedDate | undefined>>;
}

export default function DateModal({
  generatedDate,
  isOpen,
  setIsOpen,
  setGeneratedDate,
}: DateModalProps) {
  if (!generatedDate) return null;

  return (
    <>
      {isOpen && (
        <div
          id="modal-background"
          className="flex fixed h-[100vh] w-[100vw] mt-[-3em] bg-black/75"
          onClick={(event) => {
            if ((event.target as HTMLElement).id == "modal-background") {
              setIsOpen(false);
            }
          }}
        >
          <div className="flex absolute top-[20%] right-[25%] flex-col m-auto gap-2 text-[#747474] bg-tertiary rounded-xl px-[2em] pb-[2em] pt-[1em] shadow-lg justify-self-center">
            <div className="absolute top-0 right-0">
              <span
                className="border p-2 hover:pointer"
                onClick={() => setIsOpen(false)}
              >
                X
              </span>
            </div>
            {generatedDate.activities.map((activity, index) => {
              return (
                <div
                  key={activity.name}
                  className=" flex relative flex-row justify-between border p-5 m-2 border-black/50"
                >
                  <div className="absolute top-0 right-0">
                    <span
                      className="border p-2 hover:pointer cursor-pointer"
                      onClick={() => {
                        //Remove activity from the list
                        setGeneratedDate((date) => {
                          if (!date) return date;
                          const updatedActivities = date.activities.filter(
                            (_, i) => i !== index,
                          );
                          //If updatedActivities is empty (no activities left) then set the generatedDate to undefined which should close the modal
                          return updatedActivities.length > 0
                            ? { activities: updatedActivities }
                            : undefined;
                        });
                      }}
                    >
                      X
                    </span>
                  </div>
                  <div>
                    <p>{activity.name}</p>
                    <p>{activity.description}</p>
                    <p>{activity.location}</p>
                    <p>{activity.estimatedCost}</p>
                    <p>{activity.startTime}</p>
                    <p>{activity.endTime}</p>
                  </div>
                  <div className="flex flex-row gap-2">
                    <div>
                      <ThumbsUp selected={false}></ThumbsUp>
                    </div>
                    <div>
                      <ThumbsDown selected={false}></ThumbsDown>
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
