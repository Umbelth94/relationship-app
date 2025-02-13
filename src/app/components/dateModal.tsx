//TODO: Set up modal visibility to potentially work from page context instead of within the modal
//TODO: Finish thumbs up thumbs down buttons and decide what we want them to actually do
//TODO: Set up modal to close when clicking outside of the modal, and a way to bring the modal back up.

"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { DateActivity, GeneratedDate } from "../dategenerator/page";
import { ThumbsDown, ThumbsUp } from "../icons/icons";

interface DateModalProps {
  generatedDate: GeneratedDate;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DateModal({
  generatedDate,
  isOpen,
  setIsOpen,
}: DateModalProps) {
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
            {generatedDate.activities.map((activity) => {
              return (
                <div
                  key={activity.name}
                  className=" flex flex-row justify-between border p-5 m-2 border-black/50"
                >
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
