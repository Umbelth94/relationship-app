//TODO: Finish thumbs up thumbs down buttons and decide what we want them to actually do
//TODO: Better styling
//TODO: Save entire date button

"use client";
import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import { DateActivity, GeneratedDate } from "../dategenerator/page";
import ActivityCard from "./activityCard";
import { UserDataContext } from "../provider/userDataProvider";

interface GeneratedDateModalProps {
  generatedDate: GeneratedDate;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setGeneratedDate: Dispatch<SetStateAction<GeneratedDate | undefined>>;
}

export default function GeneratedDateModal({
  generatedDate,
  isOpen,
  setIsOpen,
  setGeneratedDate,
}: GeneratedDateModalProps) {
  if (!generatedDate) return null;
  const { refetchUserDates } = useContext(UserDataContext);

  async function saveDateToMongo() {
    //Save the date
    try {
      const resp = await fetch(
        `${window.location.origin}/api/protected/dates`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(generatedDate),
        },
      );

      if (!resp.ok) {
        console.error("Failed to post date", resp.statusText);
      }

      setIsOpen(false);
      console.log("Very nice, big success");
      alert("Date saved successfully!");
      refetchUserDates?.();
    } catch (err) {
      console.error("Error posting generated date", err);
    }
  }

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
            <div
              className="p-5 max-w-[50%] mx-auto text-center bg-primary cursor-pointer rounded-md"
              onClick={() => {
                saveDateToMongo();
              }}
            >
              <p className="text-center">Save Date</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
function refetchUserDates() {
  throw new Error("Function not implemented.");
}
