//TODO: Finish thumbs up thumbs down buttons and decide what we want them to actually do
//TODO: Better styling
//TODO: Save entire date button

"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { DateActivity, GeneratedDate } from "../dategenerator/page";
import ActivityCard from "./activityCard";

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
          className="flex fixed inset-0 items-center justify-center h-[100vh] w-[100vw] mt-[-3em] bg-black/75"
          onClick={(event) => {
            if ((event.target as HTMLElement).id == "modal-background") {
              setIsOpen(false);
            }
          }}
        >
          <div className="relative bg-tertiary rounded-xl p-6 shadow-lg w-[90%] max-w-[600px] max-h-[80vh] overflow-y-auto">
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
                <ActivityCard
                  setGeneratedDate={setGeneratedDate}
                  activity={activity}
                  index={index}
                ></ActivityCard>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
