//TODO: Validation, Proper Form Inputs
//TODO: Make the button clickable
//TODO: Make sure the form still saves to database
//TODO: Make it look *clicks tongue* REAAALL nice, clark.
//TODO: Profile picture integration
"use client";
import { NextPage } from "next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { UserProfileContext } from "../provider/userProfileProvider";
import {
  mapUserProfileFromUserProfileFields,
  UserProfile,
} from "../models/UserProfile";
import { SubmitHandler, useForm } from "react-hook-form";

export type UserProfileFields = {
  firstName: string;
  lastName: string;
  email: string;
  pronouns: string;
  aboutMe: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  birthDate: string;
  dateActivities: string;
  dateTimes: string;
  hobbies: string;
};

//Auth0 middleware that checks if the user is authenticated
const MyAccount: NextPage = withPageAuthRequired(
  () => {
    const { userProfile, setUserProfile } = useContext(UserProfileContext);

    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm<UserProfileFields>();

    const onSubmit: SubmitHandler<UserProfileFields> = (userProfileData) => {
      if (setUserProfile !== undefined) {
        submit(setUserProfile, userProfileData);
      }
    };

    // watch is used for doing something with the value of a field, like conditional rendering
    //console.log(watch("example"))

    return (
      <main className="h-screen w-screen">
        <div className="w-[50rem] h-fit bg-primary dark:bg-dark-1">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-between p-6">
              <div>
                <h2>Personal Info</h2>
              </div>
              <div className="grid-cols-1 grid gap-y-[2rem]">
                <div>
                  <label htmlFor="firstName">First Name</label>
                  <input
                    placeholder="First Name"
                    defaultValue={userProfile?.firstName}
                    {...register("firstName", { required: true })}
                  />
                </div>
                <div>
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    placeholder="Last Name"
                    defaultValue={userProfile?.lastName}
                    {...register("lastName", { required: true })}
                  />
                </div>
                <div>
                  <label htmlFor="pronouns">Pronouns</label>
                  <input
                    placeholder="He/She/They"
                    defaultValue={userProfile?.pronouns}
                    {...register("pronouns")}
                  />
                </div>
                <div>
                  <label htmlFor="birthDate">Birth Date</label>
                  <input
                    placeholder="12/02/1994"
                    defaultValue={userProfile?.birthDate}
                    {...register("birthDate")}
                  />
                </div>
              </div>
            </div>
            <hr />

            <div className="flex justify-between p-6">
              <div>
                <h2>Contact Info</h2>
              </div>
              <div className="grid-cols-1 grid gap-y-[2rem]">
                <div>
                  <label htmlFor="email">Email</label>
                  <input
                    placeholder="JaneAndJohn@doe.com"
                    defaultValue={userProfile?.email}
                    {...register("email", { required: true })}
                  />
                </div>
                <div>
                  <label htmlFor="phone">Phone #</label>
                  <input
                    placeholder="555-555-5555"
                    defaultValue={userProfile?.phone}
                    {...register("phone")}
                  />
                </div>
              </div>
            </div>
            <hr />

            <div className="flex justify-between p-6">
              <div>
                <h2>Address</h2>
              </div>
              <div className="grid-cols-1 grid gap-y-[2rem]">
                <div>
                  <label htmlFor="line1">Street</label>
                  <input
                    placeholder="1234 Streetname Lane"
                    defaultValue={userProfile?.adress?.line1}
                    {...register("line1")}
                  />
                </div>
                <div>
                  <label htmlFor="line2">Apartment Number</label>
                  <input
                    placeholder="Apartment 1"
                    defaultValue={userProfile?.adress?.line2}
                    {...register("line2")}
                  />
                </div>

                <div>
                  <label htmlFor="city">City</label>
                  <input
                    placeholder="Madison"
                    defaultValue={userProfile?.adress?.city}
                    {...register("city")}
                  />
                </div>
                <div>
                  <label htmlFor="state">State</label>
                  <input
                    placeholder="Wisconsin"
                    defaultValue={userProfile?.adress?.state}
                    {...register("state")}
                  />
                </div>
                <div>
                  <label htmlFor="country">Country</label>
                  <input
                    placeholder="United States"
                    defaultValue={userProfile?.adress?.country}
                    {...register("country")}
                  />
                </div>
              </div>
            </div>
            <hr />

            <div className="flex justify-between p-6">
              <div>
                <h2>Interests</h2>
              </div>
              <div className="grid-cols-1 grid gap-y-[2rem]">
                <div>
                  <label htmlFor="dateActivities">
                    Favorite Date Activities
                  </label>
                  <input
                    placeholder="Long walks on the beach..."
                    defaultValue={userProfile?.about?.dateActivities}
                    {...register("dateActivities")}
                  />
                </div>
                <div>
                  <label htmlFor="dateTimes">Favorite Time For a Date</label>
                  <input
                    placeholder="Evening, Afternoon"
                    defaultValue={userProfile?.about?.dateTimes}
                    {...register("dateTimes")}
                  />
                </div>
                <div>
                  <label htmlFor="hobbies">Favorite Hobbies</label>
                  <input
                    placeholder="Beach Walking, Warhammer Figure Painting"
                    defaultValue={userProfile?.about?.hobbies}
                    {...register("hobbies")}
                  />
                </div>
              </div>
            </div>
            <input type="submit" />
          </form>
        </div>
      </main>
    );
  },
  { returnTo: "/myaccount" },
);

function submit(
  setUserProfile: Dispatch<SetStateAction<UserProfile | undefined>>,
  userProfileFields: UserProfileFields,
) {
  const userProfileForm =
    mapUserProfileFromUserProfileFields(userProfileFields);
  //Submits the userProfile via our API to the database
  fetch(`${window.location.origin}/api/protected/user/`, {
    method: "PUT",
    body: JSON.stringify(userProfileForm),
    //This updates the userProfile state variable on our provider so that it refreshes the state
  }).then(() => setUserProfile?.(userProfileForm));
}

export default MyAccount;
