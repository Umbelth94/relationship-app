"use client";

import { GeneratedDate } from "../dategenerator/page";

interface DateModalProps {
  generatedDate: GeneratedDate;
}

export default function DateModal({ generatedDate }: DateModalProps) {
  return (
    <div className="flex fixed h-[100vh] w-[100vw] mt-[-3em] bg-black/75">
      <div className="flex flex-col m-auto gap-2 text-[#747474] bg-tertiary rounded-xl px-[2em] pb-[2em] pt-[1em] shadow-lg justify-self-center">
        {generatedDate.activities.map((activity) => {
          return (
            <div className="border border-black">
              <p>{activity.name}</p>
              <p>{activity.description}</p>
              <p>{activity.location}</p>
              <p>{activity.estimatedCost}</p>
              <p>{activity.startTime}</p>
              <p>{activity.endTime}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
