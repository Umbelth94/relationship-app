//TODO: Make sure the form still saves to database
//TODO: Make it look *clicks tongue* REAAALL nice, clark.
//TODO: Profile picture integration
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
      <main className="h-screen w-screen flex justify-center">
        <div className="w-[80%] h-fit grid grid-cols-2  bg-primary dark:bg-dark-1 m-">
          <form
            onSubmit={handleSubmit(onSubmit)}
            onChange={() => {
              setShouldSubmit(checkShouldSubmit());
            }}
          >
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
                  <div>
                    <label htmlFor="lastName">Last Name</label>
                    <input
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
                <div>
                  <label htmlFor="pronouns">Pronouns</label>
                  <input placeholder="He/She/They" {...register("pronouns")} />
                </div>
                <div>
                  <label htmlFor="birthDate">Birth Date</label>
                  <input
                    placeholder="12/02/1994"
                    type="date"
                    {...register("birthDate", {
                      required: "Birth Date is required",
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
                    {...register("address.line1", {
                      required: "Street is required",
                    })}
                  />
                  <ErrorMessage errors={errors} name="line1" />
                </div>
                <div>
                  <label htmlFor="line2">Apartment Number</label>
                  <input
                    placeholder="Apartment 1"
                    {...register("address.line2")}
                  />
                </div>

                <div>
                  <label htmlFor="city">City</label>
                  <input
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
                <div>
                  <label htmlFor="state">State</label>
                  <input
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

                <div>
                  <label htmlFor="country">Country</label>
                  <input
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
                    {...register("about.dateActivities")}
                  />
                </div>
                <div>
                  <label htmlFor="dateTimes">Favorite Time For a Date</label>
                  <input
                    placeholder="Evening, Afternoon"
                    {...register("about.dateTimes")}
                  />
                </div>
                <div>
                  <label htmlFor="hobbies">Favorite Hobbies</label>
                  <input
                    placeholder="Beach Walking, Warhammer Figure Painting"
                    {...register("about.hobbies")}
                  />
                </div>
              </div>
            </div>
            <div className="flex place-content-end">
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
