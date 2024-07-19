"use client";
import React, { useState, useEffect } from "react";
import VerificationInput from "react-verification-input";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { removeForm } from "@/Redux/formSlice";
import { addScreen } from "@/Redux/screenSlice";
import toast, { Toaster } from "react-hot-toast";

const Verification = () => {
  const [seconds, setSeconds] = useState(59);
  const [code, setCode] = useState();

  const handleChange = (value) => {
    setCode(value);
  };

  useEffect(() => {
    const countdown = setInterval(() => {
      if (seconds > 0) {
        setSeconds((prevSeconds) => prevSeconds - 1);
      } else {
        clearInterval(countdown);
      }
    }, 1000);

    return () => {
      clearInterval(countdown);
    };
  }, [seconds]);

  ///*! USE DESPATCH
  const dispatch = useDispatch();

  ///*! USE SELECTOR
  const formSelector = useSelector((state) => state.form);

  ///*! TOAST
  const notifyError = () =>
    toast.error("Something went wrong. Please try again later.", {
      position: "top-right",
    });
  const notifySuccess = () =>
    toast.success("Code Verified.", {
      position: "top-right",
    });
  const notify = () =>
    toast(`Verification code sent to: ${formSelector[0].phone}`, {
      position: "top-right",
    });

  const handleSendCodeAgain = (e) => {
    e.preventDefault();
    let data = {
      phone_number: `${formSelector[0].phone}`,
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://apis.azzappointments.com/api/v1/send-verification-code",
      headers: {
        client_id: "eae55ed2d7291eaf5741f71203eeba44f922",
        auth_token: "B8nMUiyQD68Y2Kiv08PTzfCKRMJIDuKIgXshLJaPY",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        //console.log(JSON.stringify(response.data));
        notify();
        setSeconds(59);
      })
      .catch((error) => {
        //console.log(error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let data = {
      phone_number: `${formSelector[0].phone}`,
      code: code,
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://apis.azzappointments.com/api/v1/verify-code",
      headers: {
        client_id: "eae55ed2d7291eaf5741f71203eeba44f922",
        auth_token: "B8nMUiyQD68Y2Kiv08PTzfCKRMJIDuKIgXshLJaPY",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        //console.log(JSON.stringify(response.data));

        if (response.data.status !== "0") {
          notifySuccess();
          setTimeout(() => {
            dispatch(addScreen(6));
          }, 3000); // 3000 milliseconds = 3 seconds
        } else {
          notifyError();
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  };

  return (
    <>
      <div className="flex items-center justify-center w-full md:w-svw px-14 h-auto overflow-hidden">
        <div className="flex items-center justify-center w-full rounded  h-fit overflow-hidden border shadow-2xl mb-20">
          <section className="bg-white w-full h-fit max-sm:w-[460px] ">
            <div className="flex items-center justify-between w-full px-4 py-4 bg-white border-b border-black/20">
              <div className="flex items-center justify-center gap-2 ">
                <div
                  onClick={() => {
                    dispatch(removeForm());
                    dispatch(addScreen(4));
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

              <h4 className="text-lg font-semibold">Verification</h4>
            </div>
            <div className="rounded  h-fit py-10 ">
              <section className="flex flex-col items-center w-full h-full gap-1 group/name">
                <div className="flex flex-col items-center justify-center w-full py-2  font-semibold  text-[#0D3276] px-6">
                  We have sent the verification code to your phone number:{" "}
                  {formSelector && formSelector[0].phone}
                </div>
                <div className="mt-10">
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col items-center justify-center w-full gap-2 "
                  >
                    <VerificationInput
                      placeholder="_"
                      validChars="0-9"
                      inputProps={{ inputMode: "numeric" }}
                      value={code}
                      onChange={handleChange}
                      autoFocus={true}
                      length={6}
                    />

                    <button
                      type="submit"
                      className="btn text-lg btn-primary w-[300px] mt-10"
                    >
                      Verify
                    </button>
                    <div
                      onClick={seconds === 0 ? handleSendCodeAgain : null}
                      className={
                        seconds === 0
                          ? "text-sm text-gray-500 hover:underline hover:cursor-pointer"
                          : "text-sm text-gray-500"
                      }
                    >
                      {seconds === 0 ? "Resend code" : "Didn't receive code?"}{" "}
                      {seconds === 0 ? (
                        " "
                      ) : (
                        <span className="countdown font-mono text-md bg-[#0D3276]/90 p-1 rounded text-white font-semibold">
                          <span
                            className=""
                            style={{ "--value": seconds }}
                          ></span>
                        </span>
                      )}
                    </div>
                  </form>
                </div>
              </section>
            </div>
          </section>
        </div>
        <Toaster />
      </div>
    </>
  );
};

export default Verification;
