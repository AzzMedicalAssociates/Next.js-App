"use client";
import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addScreen } from "@/Redux/screenSlice";
import { addForm, removeForm } from "@/Redux/formSlice";
import { removeDateTime } from "@/Redux/dateTimeSlice";
import toast, { Toaster } from "react-hot-toast";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

const dateRange = new Date();

let rangeDay = dateRange.toLocaleDateString("en-US", {
  day: "2-digit",
});

let rangeMonth = dateRange.toLocaleDateString("en-US", {
  month: "2-digit",
});

let rangeYear = dateRange.toLocaleDateString("en-US", {
  year: "numeric",
});

let dobRange = `${rangeYear - 17}-${rangeMonth}-${rangeDay}`;

const UserDetailPage = () => {
  const [email, setEmail] = useState();
  const [fname, setFName] = useState();
  const [lname, setLName] = useState();
  const [phone, setPhone] = useState();
  const [dob, setDob] = useState(new Date(`1999-${rangeMonth}-${rangeDay}`));
  const [gender, setGender] = useState();

  let day = new Date(dob).toLocaleDateString("en-US", {
    day: "2-digit",
  });

  let month = new Date(dob).toLocaleDateString("en-US", {
    month: "2-digit",
  });

  let year = new Date(dob).toLocaleDateString("en-US", {
    year: "numeric",
  });

  ///*! USE DESPATCH
  const dispatch = useDispatch();

  ///*! TOAST
  const notifyError = () =>
    toast.error("Something went wrong. Please try again later.", {
      position: "top-right",
    });

  const notifyDOB = () =>
    toast.error("Please select your date of birth.", {
      position: "top-right",
    });
  const notify = () =>
    toast(`Verification code sent to: ${phone}`, {
      position: "top-right",
    });

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (dob === undefined) {
      notifyDOB();
    } else {
      try {
        dispatch(
          addForm({
            email: email,
            fname: fname,
            lname: lname,
            phone: phone,
            dob: `${year}-${month}-${day}`,
            gender: gender,
          })
        );

        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "https://apis.azzappointments.com/api/v1/send-verification-code",
          headers: {
            client_id: "eae55ed2d7291eaf5741f71203eeba44f922",
            auth_token: "B8nMUiyQD68Y2Kiv08PTzfCKRMJIDuKIgXshLJaPY",
          },
          data: {
            phone_number: phone,
          },
        };

        const response = await axios.request(config);
        //console.log(JSON.stringify(response.data));

        if (response.data.status !== "0") {
          notify();
          setTimeout(() => {
            dispatch(addScreen(5));
          }, 3000); // 3000 milliseconds = 3 seconds
        } else {
          notifyError();
        }
      } catch (error) {
        //console.log(error);
        notifyError();
        dispatch(removeForm());
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-center md:w-svw px-14 h-auto overflow-hidden ">
        <div className="flex items-center justify-center w-full  h-fit overflow-hidden border shadow-2xl mb-20">
          <section className="bg-white w-full   h-fit max-sm:w-[400px] ">
            <div className="flex items-center justify-between w-full px-4 py-4  border-b border-black/20">
              <div className="flex items-center justify-center gap-2">
                <div
                  onClick={() => {
                    dispatch(addScreen(3));
                    dispatch(removeDateTime());
                  }}
                  className="p-2 text-white rounded btn btn-primary hover:cursor-pointer"
                >
                  <svg
                    xmlns="https://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </div>
              </div>

              <h3 className="text-lg font-semibold">Tell us a bit about you</h3>
            </div>
            <div className="rounded ">
              <section className="flex flex-col items-center w-full h-full gap-1 pb-5   group/name">
                <div className="flex flex-col items-center justify-center w-full py-5  font-semibold  text-[#0D3276] px-6">
                  To book your appointment, we need to verify a few things:
                </div>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col items-center justify-center w-full gap-5 "
                >
                  <input
                    required
                    type="email"
                    placeholder="Email Address"
                    className="w-full max-w-sm input input-bordered input-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    required
                    type="text"
                    placeholder="First Name"
                    className="w-full max-w-sm input input-bordered input-primary"
                    value={fname}
                    onChange={(e) => setFName(e.target.value)}
                  />
                  <input
                    required
                    type="text"
                    placeholder="Last Name"
                    className="w-full max-w-sm input input-bordered input-primary"
                    value={lname}
                    onChange={(e) => setLName(e.target.value)}
                  />

                  <div className="flex items-center justify-center w-full">
                    <PhoneInput
                      containerClass="flex items-center justify-center"
                      inputStyle={{
                        borderColor: "#0D3276",
                        borderRadius: "8px",
                        fontSize: 16,
                        width: 380,
                      }}
                      inputClass="!input !input-bordered !input-primary !pl-10"
                      buttonStyle={{
                        border: "solid 1px #0D3276",
                        borderTopLeftRadius: "8px",
                        borderBottomLeftRadius: "8px",
                        marginRight: 345,
                      }}
                      buttonClass="hover:bg-[red]"
                      inputProps={{
                        name: "phone",
                        required: true,
                      }}
                      country={"us"}
                      autoFormat={true}
                      disableDropdown={true}
                      disableCountryCode={false}
                      disableSearchIcon={true}
                      disableCountryGuess={true}
                      onChange={(phone) => setPhone(`+${phone}`)}
                    />
                  </div>

                  <div className="flex flex-col items-center justify-center w-full">
                    <div className="-ml-[285px]">Date of birth</div>
                    <DatePicker
                      dayPlaceholder="DD"
                      monthPlaceholder="MM"
                      yearPlaceholder="YYYY"
                      dayAriaLabel="Day"
                      monthAriaLabel="Month"
                      yearAriaLabel="Year"
                      autoFocus={false}
                      required={true}
                      className="w-full max-w-sm input input-bordered input-primary"
                      onChange={setDob}
                      value={dob}
                      format="dd-MM-yyyy"
                      maxDate={new Date(dobRange)}
                      minDate={new Date("1950-01-01")}
                    />
                  </div>

                  <div className="flex flex-col items-center justify-center w-full">
                    <div className="-ml-[325px]">Gender</div>
                    <div className="flex items-center justify-center gap-8">
                      <div className=" form-control -mt-1">
                        <label className="flex items-center justify-center gap-1 cursor-pointer label">
                          <span className="label-text">Male</span>
                          <input
                            type="radio"
                            name="gender"
                            className="radio radio-primary checked:bg-[#0D3276]"
                            onChange={handleGenderChange}
                            value="Male"
                            checked={gender === "Male"}
                            required
                          />
                        </label>
                      </div>
                      <div className=" form-control -mt-1">
                        <label className="flex items-center justify-center gap-1 cursor-pointer label">
                          <span className="label-text">Female</span>
                          <input
                            type="radio"
                            name="gender"
                            className="radio radio-primary checked:bg-[#0D3276]"
                            onChange={handleGenderChange}
                            value="Female"
                            checked={gender === "Female"}
                            required
                          />
                        </label>
                      </div>
                      <div className=" form-control -mt-1">
                        <label className="flex items-center justify-center gap-1 cursor-pointer label">
                          <span className="label-text">Other</span>
                          <input
                            type="radio"
                            name="gender"
                            className="radio radio-primary checked:bg-[#0D3276]"
                            onChange={handleGenderChange}
                            value="Other"
                            checked={gender === "Other"}
                            required
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn text-lg btn-primary w-[390px]"
                  >
                    Continue
                  </button>
                </form>
              </section>
            </div>
          </section>
        </div>
        <Toaster />
      </div>
    </>
  );
};

export default UserDetailPage;
