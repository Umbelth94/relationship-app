// this is just a placeholder page that does not recieve data
"use client";
import { NextPage } from "next";
import { useUserProfile } from "../hooks/useUserProfile";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

const MyAccount: NextPage = withPageAuthRequired(
  () => {
    const userInfo = useUserProfile();
    return (
      <main className="h-screen w-screen">
        <form id="profile">
          <h1>Personal Information</h1>
          <label>First Name</label>
          <input
            type="text"
            name="firstname"
            id="firstname"
            value={userInfo?.firstName}
          />
          <br></br>
          <label>Last Name</label>
          <input
            type="text"
            name="lastname"
            id="lastname"
            value={userInfo?.lastName}
          />
          <br></br>
          <label>Email</label>
          <input type="text" name="email" id="email" value={userInfo?.email} />
          <br></br>
          <label>Pronouns</label>
          <input type="text" name="pronouns" id="pronouns" />
          <br></br>
          <label>About Me</label>
          <textarea name="aboutMe" id="aboutMe"></textarea>
          <br></br>
          <label>Adress Line 1:</label>
          <input type="text" name="line1" id="line1" />
          <br></br>
          <label>Adress Line 2:</label>
          <input type="text" name="line2" id="line2" />
          <br></br>
          <label>City</label>
          <input type="text" name="city" id="city" />
          <br></br>
          <label>State/Province</label>
          {/* TODO: make this a dropdown */}
          <input type="text" name="state" id="state" />
          <br></br>
          <label>Zip/Postal Code</label>
          <input type="text" name="zip" id="zip" />
          <br></br>
          <label>Country</label>
          {/* TODO: make this a dropdown */}
          <input type="text" name="country" id="country" />
          <br></br>
          <label>Phone Number</label>
          <input type="tel" name="phone" id="phone" />
          <br></br>
          <label>Birthday</label>
          <input type="date" name="birthDate" id="birthDate" />
          <br></br>
          <h1>Preferences and Interests</h1>
          {/* TODO: Probably make these checkboxes with as many options as we can think of?  */}
          <label>
            Favorite Date Activities(e.g., dining out, outdoor adventures, movie
            nights)
          </label>
          <textarea name="dateActivities" id="dateActivities"></textarea>
          <br></br>
          <label>Preferred Date Times (e.g. weekends, evenings)</label>
          <textarea name="dateTimes" id="dateTimes"></textarea>
          <br></br>
          <label>Hobbies & Interests (e.g., reading, hiking, cooking)</label>
          <textarea name="hobbies" id="hobbies"></textarea>
          <br></br>
        </form>
        <button onClick={submit}>Save</button>
      </main>
    );
  },
  { returnTo: "/myaccount" },
);

function submit() {
  const form = document.getElementById("profile");
  const data = new FormData(form as HTMLFormElement);
  var object: any = {};
  data.forEach((value, key) => {
    object[key] = value;
  });
  console.log(object);
}

export default MyAccount;
