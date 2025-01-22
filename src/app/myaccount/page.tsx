//TODO: Make it look *clicks tongue* REAAALL nice, clark.
//TODO: Fix the error for name, last name (check for others) that thinks spaces are numbers.  Maybe implement a function to cut off spaces from the end of string input className="text-input"
//TODO: Resize the grids so that the titles don't take up half of the space.
//TODO: Grid out the fields and labels so that the inputs are all in a neat lil' row.
//TODO: Profile picture integration
//Clean up code, potentially move some functions into utility folders
"use client";
import { NextPage } from "next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { UserProfileContext } from "../provider/userProfileProvider";
import {
  FieldErrors,
  SubmitHandler,
  useForm,
  UseFormWatch,
} from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import Button from "component-nest/components/client/buttons/Button";
import { isEqual } from "@/util/isEqual";

export type UserProfileFields = {
  firstName: string;
  lastName: string;
  email: string;
  pronouns: string;
  phone: string;
  birthDate: string;
  about: {
    aboutMe: string;
    dateActivities: string;
    dateTimes: string;
    hobbies: string;
  };
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
};

//Auth0 middleware that checks if the user is authenticated
const MyAccount: NextPage = withPageAuthRequired(
  () => {
    const { userProfile, setUserProfile } = useContext(UserProfileContext);
    const [shouldSubmit, setShouldSubmit] = useState<boolean>(false);

    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
      reset,
      getValues,
    } = useForm<UserProfileFields>();

    //Determines whether or not the submit button will hit our API depending on if the userProfile state matches our fields.
    const checkShouldSubmit = (): boolean => {
      return !isEqual(userProfile, getValues());
    };

    //Sets the default values of the inputs to the userProfile state variable
    useEffect(() => {
      reset({ ...userProfile });
    }, [userProfile, reset]);

    const onSubmit: SubmitHandler<UserProfileFields> = (userProfileData) => {
      //If the fields are different than our userProfile
      if (checkShouldSubmit()) {
        //Submits the userProfile via our API to the database
        fetch(`${window.location.origin}/api/protected/user/`, {
          method: "PUT",
          body: JSON.stringify(userProfileData),
        }).then(() => {
          //This updates the userProfile state variable on our provider so that it refreshes the state
          setUserProfile?.(userProfileData);
        });
        setShouldSubmit(false);
      }
    };

    const submitEnabledCss =
      "bg-secondary cursor-pointer hover:bg-secondary/75 text-tertiary font-bold m-3 py-2 px-4 rounded-md active:scale-[97%]";
    const submitDisabledCss =
      "bg-disabled font-bold m-3 py-2 px-4 rounded-md text-tertiary";

    return (
      <main>
        <div className="bg-primary p-48">
          <form
            className="bg-secondary grid grid-cols-[35%_auto] "
            onSubmit={handleSubmit(onSubmit)}
            onChange={() => {
              setShouldSubmit(checkShouldSubmit());
            }}
          >
            <div>
              <h2>Personal Info</h2>
            </div>

            <div>
              <div>
                <div className="flex justify-between">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    className="text-input"
                    placeholder="First Name"
                    {...register("firstName", {
                      required: "First Name is required",
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
                <div className="flex justify-between">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    className="text-input"
                    placeholder="Last Name"
                    {...register("lastName", {
                      required: "Last Name is required",
                      pattern: {
                        value: /^[A-Z]+$/i,
                        message: "Cannot have any numbers",
                      },
                    })}
                  />
                </div>
                <ErrorMessage errors={errors} name="lastName" />
              </div>
              <div className="flex justify-between">
                <label htmlFor="pronouns">Pronouns</label>
                <input
                  className="text-input"
                  placeholder="He/She/They"
                  {...register("pronouns")}
                />
              </div>
              <div className="flex justify-between">
                <label htmlFor="birthDate">Birth Date</label>
                <input
                  className="text-input"
                  placeholder="12/02/1994"
                  type="date"
                  {...register("birthDate", {
                    required: "Birth Date is required",
                  })}
                />
              </div>
              <ErrorMessage errors={errors} name="birthDate" />
            </div>

            <hr className="col-start-1 col-end-3" />

            <div>
              <h2>Contact Info</h2>
            </div>

            <div>
              <div className="flex justify-between">
                <label htmlFor="email">Email</label>
                <input
                  className="text-input"
                  type="email"
                  placeholder="JaneAndJohn@doe.com"
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

              <div className="flex justify-between">
                <label htmlFor="phone">Phone #</label>
                <input
                  className="text-input"
                  type="phone"
                  placeholder="555-555-5555"
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

            <hr className="col-start-1 col-end-3" />

            <div>
              <h2>Address</h2>
            </div>

            <div>
              <div className="flex justify-between">
                <label htmlFor="line1">Street</label>
                <input
                  className="text-input"
                  placeholder="1234 Streetname Lane"
                  {...register("address.line1", {
                    required: "Street is required",
                  })}
                />
                <ErrorMessage errors={errors} name="line1" />
              </div>
              <div className="flex justify-between">
                <label htmlFor="line2">Apartment Number</label>
                <input
                  className="text-input"
                  placeholder="Apartment 1"
                  {...register("address.line2")}
                />
              </div>

              <div className="flex justify-between">
                <label htmlFor="city">City</label>
                <input
                  className="text-input"
                  placeholder="Madison"
                  {...register("address.city", {
                    required: "City is required",
                    pattern: {
                      value: /^[a-zA-Z ]*$/i,
                      message: "Cannot have any numbers",
                    },
                  })}
                />
                <ErrorMessage errors={errors} name="city" />
              </div>
              <div className="flex justify-between">
                <label htmlFor="state">State</label>
                <input
                  className="text-input"
                  placeholder="Wisconsin"
                  {...register("address.state", {
                    required: "State is required",
                    pattern: {
                      value: /^[a-zA-Z ]*$/i,
                      message: "Cannot have any numbers",
                    },
                  })}
                />
              </div>
              <ErrorMessage errors={errors} name="state" />

              <div className="flex justify-between">
                <label htmlFor="country">Country</label>
                <input
                  className="text-input"
                  placeholder="United States"
                  {...register("address.country", {
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

            <hr className="col-start-1 col-end-3" />

            <div>
              <h2>Interests</h2>
            </div>
            <div>
              <div className="flex justify-between">
                <label htmlFor="dateActivities">Favorite Date Activities</label>
                <input
                  className="text-input"
                  placeholder="Long walks on the beach..."
                  {...register("about.dateActivities")}
                />
              </div>
              <div className="flex justify-between">
                <label htmlFor="dateTimes">Favorite Time For a Date</label>
                <input
                  className="text-input"
                  placeholder="Evening, Afternoon"
                  {...register("about.dateTimes")}
                />
              </div>
              <div className="flex justify-between">
                <label htmlFor="hobbies">Favorite Hobbies</label>
                <input
                  className="text-input"
                  placeholder="Beach Walking, Warhammer Figure Painting"
                  {...register("about.hobbies")}
                />
              </div>
            </div>

            <div className="col-start-1 col-end-3 flex place-content-end">
              <input
                className={`${shouldSubmit ? submitEnabledCss : submitDisabledCss}`}
                type="submit"
              />
            </div>
          </form>
        </div>
      </main>
    );
  },
  { returnTo: "/myaccount" },
);

export default MyAccount;
