"use client";
import React, { useEffect, useState } from "react";
import Select, { components } from "react-select";
import Creatable from "react-select/creatable";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addScreen } from "@/Redux/screenSlice";
import { addPatient, removePatient } from "@/Redux/patientSlice";
import { addProvidersId, removeProvidersId } from "@/Redux/providersIdSlice";
import toast, { Toaster } from "react-hot-toast";
import {
  addProvidersData,
  removeProvidersData,
} from "@/Redux/providersDataSlice";
import { addCauses } from "@/Redux/causesSlice";
import TextTransition, { presets } from "react-text-transition";
import { removeCombinedData } from "@/Redux/combinedDataSlice";
import { removeSlotsData } from "@/Redux/slotsDataSlice";
import { registerUser } from "@/Redux/registerSlice";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import Link from "next/link";
import MedicalInsurance from "@/components/medicalInsurance";
import { CrossIcon } from "../../public/icons";
import Video from "@/components/video";
import Input from "@/components/ui/input";
import DropDownSelect, {
  specificCustomStyles,
} from "@/components/ui/dropdown-select";
import { Button } from "@/components/ui/button";

const CauseIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <svg
        xmlns="https://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
    </components.DropdownIndicator>
  );
};
const InsuranceIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <svg
        xmlns="https://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
        />
      </svg>
    </components.DropdownIndicator>
  );
};
const ModeIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <svg
        xmlns="https://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    </components.DropdownIndicator>
  );
};

const modeOptions = [
  { value: "Telehealth Appointment", label: "Telehealth Appointment" },
  { value: "Office Appointment", label: "Office Appointment" },
];

const Home = () => {
  const registerUsersData = useSelector((state) => state.register);
  const TEXTS = ["Doctor", "Practitioner", "Specialist", "Therapist"];
  const [index, setIndex] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [gender, setGender] = useState("M");
  const [insuranceCarrier, setInsuranceCarrier] = useState("UnitedHealthcare");
  const [insurancePlan, setInsurancePlan] = useState(
    "UnitedHealthcare Choice Plus"
  );
  const [insuranceGroupNumber, setInsuranceGroupNumber] = useState("");
  const [insuranceMemberId, setInsuranceMemberId] = useState("0");
  const [loader2, setLoader2] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmitForm = (e) => {
    e.preventDefault();

    if (phoneNumber.length < 10) {
      toast.error("Phone number must be 10 digit allow.", {
        position: "top-center",
      });
    } else if (phoneNumber.length === 10) {
      setIsFormOpen(false);
      setLoader2(true);
      const data = JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dateOfBirth,
        phone_number: phoneNumber,
        email_address: emailAddress,
        gender: gender,
        insurance_carrier: insuranceCarrier,
        insurance_plan: insurancePlan,
        insurance_group_number: insuranceGroupNumber,
        insurance_member_id: insuranceMemberId,
      });
      console.log(data);

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://apis.azzappointments.com/api/create_patient",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(response);
          dispatch(registerUser(response.data));
          console.log(JSON.stringify(response.data.message));

          document.getElementById("my_modal_1").close();
          toast.success(response.data.message, {
            position: "top-center",
          });
          setLoader2(false);
        })
        .catch((error) => {
          console.log(error);
          setLoader2(false);
        });
    }
  };

  const [isMounted, setIsMounted] = useState(false);

  ///*! USE DISPATCH
  const dispatch = useDispatch();

  ///*! USE SELECTOR
  const causesSelector = useSelector((state) => state.causes);

  const [cause, setCause] = useState("");
  const [insurance, setInsurance] = useState("");
  const [mode, setMode] = useState("Office Appointment");
  const [loader, setLoader] = useState(false);

  const [causeOptions, setCauseOptions] = useState();
  const [insuranceOptions, setInsuranceOptions] = useState();

  ///*! Patient BY Cause
  const handleAddPatient = () => {
    if (mode === "") {
      dispatch(
        addPatient({
          cause: cause,
          insurance: insurance,
          mode: "Office Appointment",
        })
      );
    } else {
      dispatch(
        addPatient({
          cause: cause,
          insurance: insurance,
          mode: mode,
        })
      );
    }
  };

  useEffect(() => {
    if (causesSelector.length === 0) {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "https://apis.azzappointments.com/api/v1/causes",
        headers: {
          client_id: "eae55ed2d7291eaf5741f71203eeba44f922",
          auth_token: "B8nMUiyQD68Y2Kiv08PTzfCKRMJIDuKIgXshLJaPY",
        },
      };
      axios
        .request(config)
        .then((response) => {
          /// Causes
          const causeData = response.data.causes;
          const causeFiltered = causeData.map((item) => {
            return item;
          });
          const outputCause = causeFiltered.map((item) => ({
            value: item.id,
            label: item.name,
          }));
          /// Insurance
          const insuranceData = response.data.insurances;
          const insuranceFiltered = insuranceData.map((item) => {
            return item;
          });
          const outputInsurance = insuranceFiltered.map((item) => ({
            value: item.id,
            label: item.name,
          }));
          dispatch(
            addCauses({
              cause: outputCause,
              insurance: outputInsurance,
              addresses: response.data.addresses,
              visit_types: response.data.visit_types,
            })
          );
        })
        .catch((error) => {
          //console.log(error);
        });
    }
    if (causesSelector[0] !== undefined) {
      setCauseOptions(causesSelector[0].cause);
      setInsuranceOptions(causesSelector[0].insurance);
    }
  }, [causesSelector]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Loader ON
    setLoader(true);

    ///*! Adding Patient Cause+Insurance+Mode => patientSlice
    handleAddPatient();

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://apis.azzappointments.com/api/v1/providers?query=${cause}`,
      headers: {
        client_id: "eae55ed2d7291eaf5741f71203eeba44f922",
        auth_token: "B8nMUiyQD68Y2Kiv08PTzfCKRMJIDuKIgXshLJaPY",
      },
    };

    axios
      .request(config)
      .then((response) => {
        dispatch(removeProvidersId());
        dispatch(removeProvidersData());
        dispatch(removeSlotsData());
        dispatch(removeCombinedData());
        dispatch(addProvidersData(response.data));
        dispatch(addProvidersId(response.data.map((item) => item.azz_id)));
        setLoader(false);
        dispatch(addScreen(2));
      })
      .catch((error) => {
        dispatch(removePatient());
      });
  };

  return (
    <>
      <div className="relative w-full min-h-screen overflow-hidden">
        <Video
          className="w-full object-cover max-md:h-[70vh]"
          src="/bg.mp4"
          autoPlay
          loop
          muted
        />
        <div className="top-0 absolute w-full h-full flex items-center justify-center bg-black/10">
          <div className="flex flex-col items-center justify-center w-full max-w-screen-xl mx-auto px-5 gap-5">
            {loader ? (
              ""
            ) : (
              <div className="flex items-center justify-center px-5 py-10 text-center">
                <div className="text-5xl md:text-4xl sm:text-3xl font-semibold text-[#1E328F]">
                  Book a local
                  <span className="mx-2 text-white font-bold">
                    <TextTransition
                      inline={true}
                      springConfig={presets.default}
                    >
                      {TEXTS[index % TEXTS.length]}
                    </TextTransition>
                  </span>
                  who takes your insurance
                </div>
              </div>
            )}
            <form
              onSubmit={handleSubmit}
              className="relative flex flex-wrap items-center justify-center gap-5"
            >
              {loader && (
                <div className="flex items-center justify-center py-20">
                  <span className="loading-lg loading loading-bars bg-[#1E328F]"></span>
                </div>
              )}
              {!loader && (
                <>
                  <DropDownSelect
                    components={{ DropdownIndicator: CauseIndicator }}
                    onChange={(choice) => setCause(choice.label)}
                    placeholder="Condition or Procedure..."
                    options={causeOptions}
                    required
                  />
                  <DropDownSelect
                    components={{ DropdownIndicator: InsuranceIndicator }}
                    onChange={(choice) => setInsuranceCarrier(choice.label)}
                    placeholder="Insurance Carrier"
                    options={insuranceOptions}
                  />
                  <DropDownSelect
                    components={{ DropdownIndicator: ModeIndicator }}
                    onChange={(choice) => setMode(choice.label)}
                    placeholder="Mode of Consultancy"
                    options={modeOptions}
                  />
                  <div type="submit">
                    <Button variant="default">Find Care</Button>
                  </div>
                </>
              )}
            </form>
            <div className="flex items-center justify-center flex-wrap gap-2 mt-3">
              <div className="text-blue text-md font-semibold text-center">
                If you are a new patient then ?
              </div>
              <div
                onClick={() =>
                  document.getElementById("my_modal_1").showModal()
                }
              >
                <Button variant="default">Register</Button>
              </div>
            </div>
            <dialog id="my_modal_1" className="modal">
              <div className="modal-box">
                <form method="dialog">
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    <CrossIcon />
                  </button>
                </form>
                <h3 className="font-bold text-lg text-center">
                  Registration Form:
                </h3>
                {loader2 ? (
                  <div className="text-center flex items-center justify-center py-20 w-full">
                    <span className="loading-lg loading loading-bars bg-[#1E328F]"></span>
                  </div>
                ) : (
                  <form
                    className="flex flex-col gap-3"
                    onSubmit={handleSubmitForm}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="form-control">
                        <span className="label-text">First Name:</span>
                        <Input
                          type="text"
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="First Name"
                          className="input input-bordered input-primary"
                          required
                        />
                      </label>
                      <label className="form-control">
                        <span className="label-text">Last Name:</span>
                        <Input
                          type="text"
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Last Name"
                          className="input input-bordered input-primary"
                          required
                        />
                      </label>
                      <label className="form-control">
                        <span className="label-text">Date Of Birth:</span>
                        <Input
                          type="date"
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          className="input input-bordered input-primary"
                          required
                        />
                      </label>
                      <label className="form-control">
                        <span className="label-text">Phone Number:</span>
                        <Input
                          type="tel"
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+123456789"
                          className="input input-bordered input-primary"
                          onKeyDown={(e) => {
                            if (
                              !(e.key === "Backspace" || /[0-9]/.test(e.key))
                            ) {
                              e.preventDefault();
                            }
                          }}
                          maxLength={10}
                          required
                        />
                      </label>
                      <label className="form-control">
                        <span className="label-text">Email Address:</span>
                        <Input
                          type="email"
                          onChange={(e) => setEmailAddress(e.target.value)}
                          placeholder="example@gmail.com"
                          className="input input-bordered input-primary"
                          required
                        />
                      </label>
                      <label className="form-control">
                        <span className="label-text">Insurance Carrier:</span>
                        <DropDownSelect
                          components={{ DropdownIndicator: InsuranceIndicator }}
                          onChange={(choice) =>
                            setInsuranceCarrier(choice.label)
                          }
                          placeholder="Insurance Carrier"
                          options={insuranceOptions}
                          styles={specificCustomStyles}
                        />
                      </label>
                      <label className="form-control">
                        <span className="label-text">Insurance Plan:</span>
                        <Input
                          type="text"
                          onChange={(e) => setInsurancePlan(e.target.value)}
                          placeholder="Insurance Plan"
                          className="input input-bordered input-primary"
                          required
                        />
                      </label>
                      <label className="form-control">
                        <span className="label-text">
                          Insurance Group Number:
                        </span>
                        <Input
                          type="text"
                          onChange={(e) =>
                            setInsuranceGroupNumber(e.target.value)
                          }
                          placeholder="Insurance Group Number"
                          className="input input-bordered input-primary"
                        />
                      </label>
                      <label className="form-control">
                        <span className="label-text">Insurance Member ID:</span>
                        <Input
                          type="text"
                          onChange={(e) => setInsuranceMemberId(e.target.value)}
                          placeholder="Insurance Member ID"
                          className="input input-bordered input-primary"
                        />
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="form-control">
                        <span className="label-text font-bold">Gender:</span>
                        <label className="flex items-center gap-2">
                          <span className="label-text">Male</span>
                          <Input
                            type="radio"
                            onChange={(e) => setGender(e.target.value)}
                            name="gender"
                            className="radio radio-primary"
                            value="Male"
                          />
                          <span className="label-text">Female</span>
                          <Input
                            type="radio"
                            onChange={(e) => setGender(e.target.value)}
                            name="gender"
                            className="radio radio-primary"
                            value="Female"
                          />
                        </label>
                      </div>
                    </div>
                    <Button variant="default">Submit</Button>
                  </form>
                )}
              </div>
            </dialog>
            <Toaster />
          </div>
        </div>
      </div>

      <MedicalInsurance />
    </>
  );
};

export default Home;
