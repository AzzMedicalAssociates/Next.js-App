"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addScreen } from "@/Redux/screenSlice";
import Select, { components } from "react-select";
import { addPatient, removePatient } from "@/Redux/patientSlice";
import { removeForm } from "@/Redux/formSlice";
import { removeDateTime } from "@/Redux/dateTimeSlice";
import { removeSelectedProvider } from "@/Redux/selectedProviderSlice";
import { removeCombinedData } from "@/Redux/combinedDataSlice";
import { removeProvidersId } from "@/Redux/providersIdSlice";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Image from "next/image";

const Screen6 = () => {
  const [show, setShow] = useState(false);
  const [insurance, setInsurance] = useState("");
  const [visit, setVisit] = useState("");

  ///*! TOAST

  const notifySuccess = () =>
    toast.success("Your Appointment has been booked successfully.", {
      position: "top-right",
    });

  const notifyError = () =>
    toast.error("Something went wrong. Please try again later.", {
      position: "top-right",
    });

  ///*! USE DISPATCH
  const dispatch = useDispatch();

  ///*! USE SELECTORS
  const myCombinedData = useSelector((state) => state.combinedData[0]);

  const dateTimeSelector = useSelector((state) => state.dateTime);

  const patientSelector = useSelector((state) => state.patient);

  const causesSelector = useSelector((state) => state.causes);

  const formSelector = useSelector((state) => state.form);

  const selectedProvider = useSelector(
    (state) => state.selectedProvider?.[0]?.id
  );
  const selectedProfile = selectedProvider
    ? myCombinedData.filter((filter) => filter.providerId === selectedProvider)
    : [];

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
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
      </components.DropdownIndicator>
    );
  };

  const insuranceOptions = causesSelector[0].insurance;

  const visitTypes = causesSelector[0].visit_types.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const modeOptions = visitTypes;

  useEffect(() => {
    if (patientSelector[0].insurance === "") {
      let myPatientData = {
        cause: patientSelector[0].cause,
        insurance: insurance,
        mode: patientSelector[0].mode,
        visit_type: visit,
      };
      dispatch(removePatient());
      dispatch(addPatient(myPatientData));
    } else {
      let myPatientData = {
        cause: patientSelector[0].cause,
        insurance: patientSelector[0].insurance,
        mode: patientSelector[0].mode,
        visit_type: visit,
      };
      dispatch(removePatient());
      dispatch(addPatient(myPatientData));
    }
  }, [insurance, visit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    let dobYear = new Date(formSelector[0].dob).toLocaleDateString("en-US", {
      year: "numeric",
    });
    let dobMonth = new Date(formSelector[0].dob).toLocaleDateString("en-US", {
      month: "2-digit",
    });
    let dobDay = new Date(formSelector[0].dob).toLocaleDateString("en-US", {
      day: "2-digit",
    });

    let dob = `${dobYear}-${dobMonth}-${dobDay} 00:00:00.000`;

    let dateYear = new Date(dateTimeSelector[0].date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
      }
    );
    let dateMonth = new Date(dateTimeSelector[0].date).toLocaleDateString(
      "en-US",
      {
        month: "short",
      }
    );
    let dateDay = new Date(dateTimeSelector[0].date).toLocaleDateString(
      "en-US",
      {
        day: "2-digit",
      }
    );

    let date = `${dateDay} ${dateMonth} ${dateYear}`;

    let patientInsurance =
      causesSelector[0]?.insurance?.filter(
        (filter) => filter.value === patientSelector[0]?.insurance
      ) || [];

    let data = {
      provider_id: selectedProfile[0].providerId,
      name: `${formSelector[0].fname} ${formSelector[0].lname}`,
      email: formSelector[0].email,
      phone: formSelector[0].phone,
      dob: dob,
      gender: formSelector[0].gender,
      date: date,
      time: dateTimeSelector[0].time,
      insurance_id: patientInsurance[0].value,
      visit_type: visit,
      mode: patientSelector[0].mode,
      location_id: dateTimeSelector[0].location.value,
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://apis.azzappointments.com/api/v1/book-appt`,
      headers: {
        client_id: "eae55ed2d7291eaf5741f71203eeba44f922",
        auth_token: "B8nMUiyQD68Y2Kiv08PTzfCKRMJIDuKIgXshLJaPY",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(response.data);
        notifySuccess();
        setShow(true);
      })
      .catch((error) => {
        // console.log(error);
        notifyError();
      });
  };

  return (
    <>
      <div className="flex items-center justify-center  md:w-svw h-fit  ">
        <div className="flex items-center justify-center w-full  ">
          <section className="bg-white md:w-svw max-sm:w-[460px] mx-20  border rounded shadow-2xl ">
            <div className="flex items-center justify-between w-full px-4 py-4  bg-white border-b border-black/20 rounded">
              <div className="flex items-center justify-center gap-2 ">
                <div
                  onClick={
                    show
                      ? () => {
                          dispatch(removePatient());
                          dispatch(removeProvidersId());
                          dispatch(removeCombinedData());
                          dispatch(removeSelectedProvider());
                          dispatch(removeDateTime());
                          dispatch(removeForm());
                          dispatch(addScreen(1));
                        }
                      : () => dispatch(addScreen(5))
                  }
                  className="p-2 text-white rounded btn btn-primary hover:cursor-pointer"
                >
                  {show ? (
                    <svg
                      xmlns="https://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                      />
                    </svg>
                  ) : (
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
                  )}
                </div>
              </div>

              <h4 className="text-lg font-semibold">
                {show ? "Appointment Booked" : "Appointment Details"}
              </h4>
            </div>
            <div className="rounded h-fit max-sm:h-fit py-10">
              <section className="flex flex-col items-center w-full h-full gap-1 group/name">
                {show ? (
                  ""
                ) : (
                  <>
                    {selectedProfile.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-around w-full  py-4 max-sm:flex-col max-sm:-mt-2"
                      >
                        <div className="flex items-start justify-start max-sm:w-full max-sm:items-center max-sm:justify-center">
                          <div className="w-24 h-24 overflow-hidden rounded-full shadow-md ">
                            <Image
                              width={96}
                              height={96}
                              alt={"provider-pic"}
                              className="rounded-full "
                              src={item.providerEntry.profile}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col items-start justify-start gap-1 pl-2 max-sm:w-full max-sm:items-center max-sm:justify-center max-sm:mt-2 ">
                          <div className="font-bold ">
                            {item.providerEntry.name}
                          </div>
                          <div className="text-sm text-gray-500 ">
                            {item.providerEntry.description}
                          </div>
                          <div className="flex items-start gap-1  text-sm text-gray-500 max-sm:items-center max-sm:justify-center">
                            <span className="mt-0.5">
                              <svg
                                xmlns="https://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-4 h-4 stroke-[#0D3276]"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                                />
                              </svg>
                            </span>
                            <span className="text-[12px]">
                              {item.providerEntry.address}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
                {show ? (
                  <div className="flex flex-col items-start justify-center px-5 max-sm:items-start py-2 gap-5">
                    <div className="font-semibold text-lg flex items-center justify-center">
                      <span>Your Appointment Details:</span>
                    </div>
                    <div className="flex flex-col gap-5 text-md items-start justify-center mt-1">
                      <div className="flex items-start justify-center">
                        <span className="mr-1">
                          <svg
                            xmlns="https://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="#0D3276"
                            className="w-6 h-6 fill-[#7CFC00]"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                        </span>
                        <span className=" font-medium text-[#0D3276]">
                          {new Date(
                            dateTimeSelector[0].date
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            day: "2-digit",
                            month: "short",
                          })}
                          <span className="font-normal"> {" at "}</span>
                          {dateTimeSelector[0].time}
                          <span className="font-normal"> {" in "}</span>
                          {dateTimeSelector[0].location.label}{" "}
                          {patientSelector && (
                            <span className=" font-semibold">
                              {`(${patientSelector[0].mode})`}
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-start justify-center">
                        <span className="mr-1">
                          <svg
                            xmlns="https://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="#0D3276"
                            className="w-6 h-6 fill-[#FCF55F]"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                            />
                          </svg>
                        </span>
                        <span className=" font-medium text-[#0D3276]">
                          Your appointment has been booked successfully. Soon,
                          our representative will contact you by phone.
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 text-md items-center justify-center"></div>
                  </div>
                ) : (
                  <div className="flex flex-col items-start justify-center max-sm:-mt-3 px-5 max-sm:items-start py-2">
                    <div className="font-semibold text-lg flex items-center justify-center">
                      <span>Your Appointment Details:</span>
                    </div>
                    <div className="flex gap-1 text-md items-center justify-center mt-1">
                      <div className="flex items-start justify-center">
                        <span className="mr-1">
                          <svg
                            xmlns="https://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="#0D3276"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                        </span>
                        <span className=" font-medium text-[#0D3276]">
                          {new Date(
                            dateTimeSelector[0].date
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            day: "2-digit",
                            month: "short",
                          })}
                          <span className="font-normal"> {" at "}</span>
                          {dateTimeSelector[0].time}
                          <span className="font-normal"> {" in "}</span>
                          {dateTimeSelector[0].location.label}{" "}
                          {patientSelector && (
                            <span className=" font-semibold">
                              {`(${patientSelector[0].mode})`}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <form
                  onSubmit={handleSubmit}
                  className="flex items-center justify-center flex-col mt-5 max-sm:mt-2 gap-2"
                >
                  {patientSelector[0] && patientSelector[0].insurance ? (
                    ""
                  ) : (
                    <div>
                      <Select
                        required
                        components={{ DropdownIndicator: InsuranceIndicator }}
                        className="shadow-lg hover:shadow-xl focus:shadow-xl"
                        onChange={(Choice) => setInsurance(Choice.value)}
                        noOptionsMessage={() => "Not Found"}
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            width: 300,
                            height: 50,
                            border: "2px solid #0D3276",
                            "&:hover": {
                              border: "2px solid #0D3276",
                              cursor: "pointer",
                            },
                          }),
                          menuList: (baseStyles, state) => ({
                            ...baseStyles,
                            "&:hover": { cursor: "pointer" },
                            maxHeight: "130px",
                            marginTop: "-8px",
                          }),
                          menuPortal: (baseStyles, state) => ({
                            ...baseStyles,
                            "&:hover": { backgroundColor: "red" },
                          }),
                          dropdownIndicator: (baseStyles, state) => ({
                            ...baseStyles,
                            color: "#0D3276",
                          }),
                          option: (baseStyles, state) => ({
                            ...baseStyles,
                            backgroundColor: state.isSelected
                              ? "rgba(13,50,118,1)"
                              : "white",
                            "&:hover": {
                              backgroundColor: "rgba(13,50,118,1)",
                              cursor: "pointer",
                              color: "white",
                            },
                          }),
                        }}
                        placeholder="Choose insurance"
                        options={insuranceOptions}
                      />
                    </div>
                  )}
                  {show ? (
                    ""
                  ) : (
                    <div>
                      <Select
                        components={{ DropdownIndicator: ModeIndicator }}
                        className="shadow-lg hover:shadow-xl focus:shadow-xl"
                        required
                        onChange={(Choice) => setVisit(Choice.label)}
                        noOptionsMessage={() => "Not Found"}
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            width: 300,
                            height: 50,
                            border: "2px solid #0D3276",
                            "&:hover": {
                              border: "2px solid #0D3276",
                              cursor: "pointer",
                            },
                          }),
                          menuList: (baseStyles, state) => ({
                            ...baseStyles,
                            "&:hover": { cursor: "pointer" },
                            maxHeight: patientSelector[0].insurance
                              ? "120px"
                              : "90px",
                            marginTop: "-8px",
                          }),
                          dropdownIndicator: (baseStyles, state) => ({
                            ...baseStyles,
                            color: "#0D3276",
                          }),
                          option: (baseStyles, state) => ({
                            ...baseStyles,
                            backgroundColor: state.isSelected
                              ? "rgba(13,50,118,1)"
                              : "white",
                            "&:hover": {
                              backgroundColor: "rgba(13,50,118,1)",
                              cursor: "pointer",
                              color: "white",
                            },
                          }),
                        }}
                        placeholder="Choose Visit Reason"
                        options={modeOptions}
                      />
                    </div>
                  )}

                  {show ? (
                    ""
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full ">
                      <button
                        type="submit"
                        className="btn text-lg btn-primary w-[300px] mt-5"
                      >
                        Book Appointment
                      </button>
                    </div>
                  )}
                </form>
                {show && (
                  <div className="flex flex-col items-center justify-center py-5 gap-5">
                    <svg
                      xmlns="https://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="#0D3276"
                      className="w-32 h-32"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                      />
                    </svg>
                    <div className="font-semibold">
                      <button
                        onClick={() => {
                          dispatch(removePatient());
                          dispatch(removeProvidersId());
                          dispatch(removeCombinedData());
                          dispatch(removeSelectedProvider());
                          dispatch(removeDateTime());
                          dispatch(removeForm());
                          dispatch(addScreen(1));
                        }}
                        className="btn text-lg btn-primary w-[300px] mt-5"
                      >
                        New Appointment
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </section>
        </div>
        <Toaster />
      </div>
    </>
  );
};

export default Screen6;
