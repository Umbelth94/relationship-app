//TODO: Update UserProfile state after saving/updating profile into the database.
"use client";
import { NextPage } from "next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { UserProfileContext } from "../provider/userProfileProvider";
import { createUserFormDataObject, UserProfile } from "../models/UserProfile";

//Auth0 middleware that checks if the user is authenticated
const MyAccount: NextPage = withPageAuthRequired(
  () => {
    const { userProfile, setUserProfile } = useContext(UserProfileContext);
    let userInfo = userProfile;
    console.log("save");
    console.log(userInfo?.firstName);

    return (
      <main className="h-screen w-screen dark:text-dark-font-color-1">
        <form id="profile">
          <h1>Personal Information</h1>
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            defaultValue={userInfo?.firstName}
          />
          <br></br>
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            defaultValue={userInfo?.lastName}
          />
          <br></br>
          <label>Email</label>
          <input
            type="text"
            name="email"
            id="email"
            defaultValue={userInfo?.email}
          />
          <br></br>
          <label>Pronouns</label>
          <input
            type="text"
            name="pronouns"
            id="pronouns"
            defaultValue={userInfo?.pronouns}
          />
          <br></br>
          <label>About Me</label>
          <textarea
            name="aboutMe"
            id="aboutMe"
            defaultValue={userInfo?.about?.aboutMe}
          ></textarea>
          <br></br>
          <label>Adress Line 1:</label>
          <input
            type="text"
            name="line1"
            id="line1"
            defaultValue={userInfo?.adress?.line1}
          />
          <br></br>
          <label>Adress Line 2:</label>
          <input
            type="text"
            name="line2"
            id="line2"
            defaultValue={userInfo?.adress?.line2}
          />
          <br></br>
          <label>City</label>
          <input
            type="text"
            name="city"
            id="city"
            defaultValue={userInfo?.adress?.city}
          />
          <br></br>
          <label>State/Province</label>
          {/* TODO: make this a dropdown */}
          <input
            type="text"
            name="state"
            id="state"
            defaultValue={userInfo?.adress?.state}
          />
          <br></br>
          <label>Zip/Postal Code</label>
          <input
            type="text"
            name="zip"
            id="zip"
            defaultValue={userInfo?.adress?.zip}
          />
          <br></br>
          <label>Country</label>
          {/* TODO: make this a dropdown */}
          <input
            type="text"
            name="country"
            id="country"
            defaultValue={userInfo?.adress?.country}
          />
          <br></br>
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            id="phone"
            defaultValue={userInfo?.phone}
          />
          <br></br>
          <label>Birthday</label>
          <input
            type="date"
            name="birthDate"
            id="birthDate"
            defaultValue={userInfo?.birthDate}
          />
          <br></br>
          <h1>Preferences and Interests</h1>
          {/* TODO: Probably make these checkboxes with as many options as we can think of?  */}
          <label>
            Favorite Date Activities(e.g., dining out, outdoor adventures, movie
            nights)
          </label>
          <textarea
            name="dateActivities"
            id="dateActivities"
            defaultValue={userInfo?.about?.dateActivities}
          ></textarea>
          <br></br>
          <label>Preferred Date Times (e.g. weekends, evenings)</label>
          <textarea
            name="dateTimes"
            id="dateTimes"
            defaultValue={userInfo?.about?.dateTimes}
          ></textarea>
          <br></br>
          <label>Hobbies & Interests (e.g., reading, hiking, cooking)</label>
          <textarea
            name="hobbies"
            id="hobbies"
            defaultValue={userInfo?.about?.hobbies}
          ></textarea>
          <br></br>
        </form>
        <button onClick={() => submit(setUserProfile)}>Save</button>
      </main>
    );
  },
  { returnTo: "/myaccount" },
);

function submit(
  setUserProfile?: Dispatch<SetStateAction<UserProfile | undefined>>,
) {
  const form = document.getElementById("profile");
  //Puts all form input data into a formData object
  const formData = new FormData(form as HTMLFormElement);
  //Creates a userProfile object to submit to the database that is based off of our UserProfile Model
  const userProfileForm = createUserFormDataObject(formData);
  //Submits the userProfile via our API to the database
  fetch(`${window.location.origin}/api/protected/user/`, {
    method: "PUT",
    body: JSON.stringify(userProfileForm),
    //This updates the userProfile state variable on our provider so that it refreshes the state
  }).then(() => setUserProfile?.(userProfileForm));
}

export default MyAccount;
