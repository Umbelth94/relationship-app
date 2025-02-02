"use client";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { NextPage } from "next";
import { SubmitHandler, useForm } from "react-hook-form";
import { UserProfileContext } from "../provider/userProfileProvider";
import { useContext, useEffect, useState } from "react";

export interface DateFormData {
  familiarity: number;
  private: boolean;
  minPrice: number;
  maxPrice: number;
  ideas: string;
  latitude: number;
  longitude: number;
}

const DateGenerator: NextPage = withPageAuthRequired(
  () => {
    const { userProfile, setUserProfile } = useContext(UserProfileContext);
    const [tags, setTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");

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

    const onSubmit: SubmitHandler<DateFormData> = (dateFormData) => {
      const submissionData = {
        ...dateFormData,
        tags,
      };
      console.log(submissionData); // Does this look correct when the form is submitted
      fetch(`${window.location.origin}/api/protected/create-date/`, {
        method: "Post",
        body: JSON.stringify(submissionData),
      }).then((resp) => {
        resp.json().then((data) => {
          console.log(data);
        });
      });
    };

    return (
      <main className="h-screen w-screen bg-secondary pt-[3em]">
        <form
          className="flex flex-col gap-2 text-[#747474] bg-tertiary w-fit rounded-xl px-[2em] pb-[2em] pt-[1em] shadow-lg justify-self-center"
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
                  className="text-white px-2 py-1 rounded-lg text-sm cursor-pointer "
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
            <p>Latitude</p>
            <input type="number" className="" {...register("longitude")} />
            <p>-</p>
            <p>Longitude</p>
            <input
              type="number"
              className="border-[#d4d4d4]"
              {...register("latitude")}
            />
          </div>
          <hr className="text-[#d4d4d4] my-[1em]" />
          <input className="px-5 py-5 bg-primary" type="submit" />
        </form>
      </main>
    );
  },
  { returnTo: "./dategenerator" },
);

export default DateGenerator;
