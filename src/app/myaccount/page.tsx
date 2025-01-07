//TODO: Make sure it works correctly and in one submit
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
import { ErrorMessage } from "@hookform/error-message";

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
                  <div>
                    <label htmlFor="firstName">First Name</label>
                    <input
                      placeholder="First Name"
                      defaultValue={userProfile?.firstName}
                      {...register("firstName", {
                        required: "This field cannot be empty",
                        pattern: {
                          value: /^[A-Z]+$/i,
                          message: "Cannot have any numbers",
                        },
                      })}
                    />
                  </div>
                  <ErrorMessage errors={errors} name="firstName" />
                </div>
                <div>
                  <div>
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      placeholder="Last Name"
                      defaultValue={userProfile?.lastName}
                      {...register("lastName", {
                        required: "This field cannot be empty",
                        pattern: {
                          value: /^[A-Z]+$/i,
                          message: "Cannot have any numbers",
                        },
                      })}
                    />
                  </div>
                  <ErrorMessage errors={errors} name="lastName" />
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
                    type="date"
                    defaultValue={userProfile?.birthDate}
                    {...register("birthDate", {
                      required: "Birth date is required",
                    })}
                  />
                </div>
                <ErrorMessage errors={errors} name="birthDate" />
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
                    type="email"
                    placeholder="JaneAndJohn@doe.com"
                    defaultValue={userProfile?.email}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Email does not match valid format",
                      },
                    })}
                  />
                </div>
                <ErrorMessage errors={errors} name="email" />

                <div>
                  <label htmlFor="phone">Phone #</label>
                  <input
                    type="phone"
                    placeholder="555-555-5555"
                    defaultValue={userProfile?.phone}
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value:
                          /^(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/,
                        message: "Phone number does not match valid format",
                      },
                    })}
                  />
                </div>
                <ErrorMessage errors={errors} name="phone" />
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
                    {...register("line1", { required: "street is required" })}
                  />
                  <ErrorMessage errors={errors} name="line1" />
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
                    {...register("city", {
                      required: "City is required",
                      pattern: {
                        value: /^[a-zA-Z ]*$/i,
                        message: "Cannot have any numbers",
                      },
                    })}
                  />
                  <ErrorMessage errors={errors} name="city" />
                </div>
                <div>
                  <label htmlFor="state">State</label>
                  <input
                    placeholder="Wisconsin"
                    defaultValue={userProfile?.adress?.state}
                    {...register("state", {
                      required: "State is required",
                      pattern: {
                        value: /^[a-zA-Z ]*$/i,
                        message: "Cannot have any numbers",
                      },
                    })}
                  />
                </div>
                <ErrorMessage errors={errors} name="state" />

                <div>
                  <label htmlFor="country">Country</label>
                  <input
                    placeholder="United States"
                    defaultValue={userProfile?.adress?.country}
                    {...register("country", {
                      required: "Country is required",
                      pattern: {
                        value: /^[a-zA-Z ]*$/i,
                        message: "Cannot have any numbers",
                      },
                    })}
                  />
                </div>
                <ErrorMessage errors={errors} name="country" />
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
    //Formats the profile field data into a userProfile object
    mapUserProfileFromUserProfileFields(userProfileFields);
  //Submits the userProfile via our API to the database
  fetch(`${window.location.origin}/api/protected/user/`, {
    method: "PUT",
    body: JSON.stringify(userProfileForm),
    //This updates the userProfile state variable on our provider so that it refreshes the state
  }).then(() => setUserProfile?.(userProfileForm));
}

export default MyAccount;
