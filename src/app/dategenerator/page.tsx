"use client";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { NextPage } from "next";
import { SubmitHandler, useForm } from "react-hook-form";
import { UserProfileContext } from "../provider/userProfileProvider";
import { useContext } from "react";

const DateGenerator: NextPage = withPageAuthRequired(
  () => {
    const { userProfile, setUserProfile } = useContext(UserProfileContext);
    //Need context for partner account

    interface DateFormData {
      familiarity: number;
      private: boolean;
      minPrice: number;
      maxPrice: number;
      ideas: string;
      latitude: number;
      longitude: number;
    }

    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
      reset,
      getValues,
      setValue,
    } = useForm<DateFormData>();

    const onSubmit: SubmitHandler<DateFormData> = (dateFormData) => {};

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

          {/* Ideas */}
          <input
            type="text"
            className="border-2 border-[#747474] rounded-lg px-2"
            placeholder="Any ideas?"
            {...register("ideas")}
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
        </form>
      </main>
    );
  },
  { returnTo: "/dategenerator" },
);

export default DateGenerator;
