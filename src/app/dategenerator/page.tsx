"use client";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { NextPage } from "next";
import { SubmitHandler, useForm } from "react-hook-form";
import { UserDataContext } from "../provider/userDataProvider";
import { useContext, useEffect, useState } from "react";
import GeneratedDateModal from "../components/generatedDateModal";
import { UserProfile } from "../models/UserProfile";
import { ObjectId } from "mongodb";

export interface DateFormData {
  familiarity: number;
  private: boolean;
  budget: string;
  location: string;
  tags: string[];
}

export interface DateActivity {
  _id?: string;
  name: string;
  startDateTime: Date;
  endDateTime: Date;
  location: string;
  description: string;
  estimatedCost: string;
  rank: number;
}

export interface GeneratedDate {
  activities: DateActivity[];
}

const DateGenerator: NextPage = withPageAuthRequired(
  () => {
    const { userProfile, setUserProfile } = useContext(UserDataContext);
    const [tags, setTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [generatedDate, setGeneratedDate] = useState<
      undefined | GeneratedDate
    >();
    const [generatedDateModalOpen, setGeneratedDateModalOpen] =
      useState<boolean>(false);

    useEffect(() => {
      console.log(generatedDate);
    }, [generatedDate]);

    //Add tags function for the ideas tags input
    const addTag = () => {
      const trimmedValue = inputValue.trim();
      if (trimmedValue && !tags.includes(trimmedValue)) {
        const newTags = [...tags, trimmedValue];
        setTags(newTags);
        setInputValue("");
      }
    };

    const removeTag = (tag: string) => {
      const filteredTags = tags.filter((t) => t !== tag);
      setTags(filteredTags);
    };

    //Add tags when enter key is pressed
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addTag();
      }
    };

    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
      reset,
      getValues,
      setValue,
    } = useForm<DateFormData>();

    const onSubmit: SubmitHandler<DateFormData> = async (dateFormData) => {
      const submissionData = {
        ...dateFormData,
        tags,
      };

      try {
        const resp = await fetch(
          `${window.location.origin}/api/protected/generate-date`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(submissionData),
          },
        );

        if (!resp.ok) {
          console.error(
            "Failed to fetch generated date I think:",
            resp.statusText,
          );
          return;
        }

        const generatedDate = (await resp.json()) as GeneratedDate;
        generatedDate.activities = generatedDate.activities.map(
          (activity: DateActivity) => {
            return {
              ...activity,
              startDateTime: new Date(activity.startDateTime),
              endDateTime: new Date(activity.endDateTime),
            };
          },
        );
        console.log(generatedDate);

        if (generatedDate) {
          console.log("Activities saved successfully!");
          setGeneratedDate(generatedDate);
        } else {
          console.error("Error saving activities");
        }

        setGeneratedDateModalOpen(true);
      } catch (err) {
        console.error("Error fetching generated date:", err);
      }
    };
    return (
      <main className="flex flex-col items-center h-screen w-screen bg-secondary pt-[3em]">
        {generatedDate && (
          <GeneratedDateModal
            generatedDate={generatedDate}
            setGeneratedDate={setGeneratedDate}
            isOpen={generatedDateModalOpen}
            setIsOpen={setGeneratedDateModalOpen}
          ></GeneratedDateModal>
        )}
        <form
          className="flex flex-col gap-2 text-[#747474] bg-tertiary w-[60%] rounded-xl px-[2em] pb-[2em] pt-[1em] shadow-lg justify-self-center"
          onSubmit={handleSubmit(onSubmit)}
          onChange={() => {
            // check if the form should submit
          }}
        >
          <p className="text-[2em] justify-self-center text-center text-primary">
            What's The Vibe?
          </p>

          <div className="flex flex-col gap-2">
            {/*Render tags above input*/}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-white bg-on-primary px-2 py-1 rounded-lg text-sm cursor-pointer "
                  onClick={() => removeTag(tag)}
                >
                  {tag} x
                </span>
              ))}
            </div>
          </div>

          <input
            type="text"
            className="border-2 border-[#747474] rounded-lg px-2"
            placeholder="Any ideas?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <hr className="text-[#d4d4d4] my-[1em]" />

          {/* Familiarity */}
          <div className="flex flex-row gap-[30px] justify-center">
            <p className="">Something New</p>
            <input
              type="range"
              min="0"
              max="10"
              className=""
              {...register("familiarity", {
                required: "First Name is required",
              })}
            />
            <p className="">Something Familiar</p>
          </div>
          <hr className="text-[#d4d4d4] my-[1em]" />

          {/* Private */}
          <div className="flex flex-row gap-[30px]">
            <p>Private</p>
            <input type="checkbox" className="" {...register("private")} />
          </div>
          <hr className="text-[#d4d4d4] my-[1em]" />

          {/* Location */}
          <div className="flex flex-row gap-[30px]">
            <p>Location</p>
            <input
              type="input"
              className="border-[#747474]"
              {...register("location")}
            />
          </div>

          {/*Budget*/}
          <div className="flex flex-row gap-[30px]">
            <p>Budget</p>
            <select {...register("budget")}>
              <option value="Any price">Any Price</option>
              <option value="free">Free</option>
              <option value="<=$25">Affordable (Up to $25)</option>
              <option value=">=$25 and <=$100">Pricey (Up to $100)</option>
              <option value=">=$100">Fancy (Over $100)</option>
            </select>
          </div>

          <hr className="text-[#d4d4d4] my-[1em]" />
          <input
            className="px-5 py-5 bg-primary cursor-pointer rounded-md hover:bg-primary/75 text-tertiary active:scale-[97%]"
            type="submit"
          />
        </form>
        {!generatedDateModalOpen && generatedDate && (
          <input
            className="p-5 bg-primary cursor-pointer rounded-md"
            type="button"
            onClick={() => {
              setGeneratedDateModalOpen(true);
            }}
            value="Open Date"
          ></input>
        )}
      </main>
    );
  },
  { returnTo: "./dategenerator" },
);

export default DateGenerator;
function saveActivitiesToMongo(userProfile: UserProfile, activities: any) {
  throw new Error("Function not implemented.");
}
