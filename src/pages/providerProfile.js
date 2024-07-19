"use client";
import React, { useState } from "react";
import Image from "next/image";
import Select, { components } from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { removeSelectedProvider } from "@/Redux/selectedProviderSlice";
import { addScreen } from "@/Redux/screenSlice";
import { addDateTime } from "@/Redux/dateTimeSlice";
import { LeftArrow, LocationIcon, ProfileIcon } from "../../public/icons";

const ModeIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <LocationIcon />
    </components.DropdownIndicator>
  );
};

const ProviderProfile = () => {
  const [userSelectedDate, setUserSelectedDate] = useState();
  const [userSelectedTime, setUserSelectedTime] = useState();
  const [currentPage, setCurrentPage] = useState(0);

  ///*! USE DISPATCH
  const dispatch = useDispatch();

  ///*! USE SELECTORS
  const myCombinedData = useSelector((state) => state.combinedData[0]);

  const selectedProvider = useSelector(
    (state) => state.selectedProvider?.[0]?.id
  );
  const selectedProfile = selectedProvider
    ? myCombinedData.filter((filter) => filter.providerId === selectedProvider)
    : [];

  const locationNames = selectedProfile[0].slotEntry.locations.map(
    (item) => item.name
  );
  const locationIds = selectedProfile[0].slotEntry.locations.map(
    (item) => item.id
  );

  const selectedProviderLocations = [];

  for (let i = 0; i < locationNames.length; i++) {
    selectedProviderLocations.push({
      value: locationIds[i],
      label: locationNames[i],
    });
  }

  const locationOptions = selectedProviderLocations;

  const [selectedLocation, setSelectedLocation] = useState(locationOptions[0]);

  // useEffect(() => {}, [selectedLocation]);

  const handleLocation = (choice) => {
    setSelectedLocation(choice);
  };

  const combinedData = useSelector((state) => state.combinedData);

  const tempSlotsByLocation1 = selectedProfile[0].slotEntry.data
    .map((i) => i)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((item) =>
      item.slots_by_location
        .flatMap((item) => item)
        .filter((filter) => filter.location_name === selectedLocation.label)
    );

  const tempSlotsByLocation2 = tempSlotsByLocation1
    .flatMap((item) => item)
    .flatMap((item) => item.slots);

  const dates = tempSlotsByLocation2.map((item) => item.date);

  const uniqueDates = [...new Set(dates)];

  const allSlotsByLocation = tempSlotsByLocation2;

  const appointmentsPerPage = 3;
  const totalPages = Math.ceil(uniqueDates.length / appointmentsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const startIndex = currentPage * appointmentsPerPage;
  const visibleDates = uniqueDates.slice(
    startIndex,
    startIndex + appointmentsPerPage
  );

  return (
    <>
      {selectedProfile &&
        selectedProfile.map((item, index) => (
          <div
            key={index}
            className="flex items-center  justify-center w-svw px-14 h-full overflow-hidden pb-20"
          >
            <section className="bg-white w-full h-full border shadow-2xl rounded">
              <div className="flex items-center justify-between w-full h-full px-4 py-4 bg-white border-b border-black/20">
                <div className="flex items-center justify-center gap-2  ">
                  <div
                    onClick={() => {
                      dispatch(removeSelectedProvider());
                      dispatch(addScreen(2));
                    }}
                    className="p-2 text-white rounded btn btn-primary hover:cursor-pointer"
                  >
                    <LeftArrow />
                  </div>
                </div>

                <h4 className="text-lg font-semibold">Provider Profile</h4>
              </div>
              <div className="rounded w-full  ">
                <section className="flex flex-col items-center w-full h-full  group/name">
                  <div className="flex items-center justify-around w-full py-4 flex-col">
                    <div className="flex items-start justify-start max-sm:w-full max-sm:items-center max-sm:justify-center flex-col">
                      <div className="w-[100px] h-[100px] overflow-hidden rounded-full shadow-md">
                        {item.providerEntry.profile ? (
                          <Image
                            width={100}
                            height={100}
                            alt={"provider-pic"}
                            className="rounded-full"
                            src={item.providerEntry.profile}
                          />
                        ) : (
                          <div className="rounded-full w-24 h-24 bg-gray-300 flex items-center justify-center">
                            <ProfileIcon />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1 pl-2 max-sm:w-full mt-2 ">
                      <div className="font-bold ">
                        {item.providerEntry.name}
                      </div>
                      <div className="text-sm text-gray-500 ">
                        {item.providerEntry.description}
                      </div>
                      <div className="flex items-start gap-1 mt-2 text-sm text-gray-500 max-sm:items-center max-sm:justify-center">
                        <span className="mt-0.5">
                          <LocationIcon />
                        </span>
                        <span className="text-[12px]">
                          {item.providerEntry.address}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <section className="flex flex-col items-center justify-center gap-5 py-5 ">
                      {locationOptions.length > 1 ? (
                        <div>
                          <div>Select the location:</div>
                          <Select
                            defaultValue={selectedLocation}
                            components={{ DropdownIndicator: ModeIndicator }}
                            className="shadow-lg hover:shadow-xl focus:shadow-xl"
                            required
                            onChange={(choice) => {
                              handleLocation(choice);
                            }}
                            noOptionsMessage={() => "Not Found"}
                            styles={{
                              control: (baseStyles, state) => ({
                                ...baseStyles,
                                width: 350,
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
                                maxHeight: "200px",
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
                            options={locationOptions}
                          />
                        </div>
                      ) : (
                        <>
                          <div className="border-2 bg-[#1E328F]/30 glass border-[#1E328F] rounded py-3 px-5 flex items-center justify-center gap-1">
                            <span className="font-semibold">Location:</span>
                            <span className=" font-medium">
                              {locationOptions[0].label}
                            </span>
                          </div>
                        </>
                      )}
                      <section className="flex flex-col items-center justify-center max-sm:mt-5 h-full w-full ">
                        {/******************* Slots section *START* *****************/}

                        <div className="w-full flex flex-col items-center justify-center ">
                          {visibleDates.map((item, index) => (
                            <div
                              key={index}
                              className="w-full flex flex-col pl-5 pr-3 py-2 my-2 border rounded"
                            >
                              <div className="text-[#1E328F] font-semibold    ">
                                {(new Date(item).toLocaleDateString([], {
                                  weekday: "long",
                                }) === "Monday" &&
                                  "Tuesday") ||
                                  (new Date(item).toLocaleDateString([], {
                                    weekday: "long",
                                  }) === "Tuesday" &&
                                    "Wednesday") ||
                                  (new Date(item).toLocaleDateString([], {
                                    weekday: "long",
                                  }) === "Wednesday" &&
                                    "Thursday") ||
                                  (new Date(item).toLocaleDateString([], {
                                    weekday: "long",
                                  }) === "Thursday" &&
                                    "Friday") ||
                                  (new Date(item).toLocaleDateString([], {
                                    weekday: "long",
                                  }) === "Friday" &&
                                    "Saturday") ||
                                  (new Date(item).toLocaleDateString([], {
                                    weekday: "long",
                                  }) === "Saturday" &&
                                    "Sunday") ||
                                  (new Date(item).toLocaleDateString([], {
                                    weekday: "long",
                                  }) === "Sunday" &&
                                    "Monday")}{" "}
                                {(function getNextDay(date) {
                                  let currentDate = new Date(date);
                                  let nextDay = new Date(currentDate);
                                  nextDay.setDate(currentDate.getDate() + 1);

                                  if (
                                    nextDay.getMonth() !==
                                    currentDate.getMonth()
                                  ) {
                                    nextDay = new Date(
                                      nextDay.getFullYear(),
                                      nextDay.getMonth(),
                                      1
                                    );
                                  }

                                  return nextDay.getDate();
                                })(item)}{" "}
                                {(function getNextDay(date) {
                                  let currentDate = new Date(date);
                                  let nextDay = new Date(currentDate);
                                  nextDay.setDate(currentDate.getDate() + 1);

                                  if (
                                    nextDay.getMonth() !==
                                    currentDate.getMonth()
                                  ) {
                                    nextDay = new Date(
                                      nextDay.getFullYear(),
                                      nextDay.getMonth(),
                                      1
                                    );
                                  }

                                  // Return the month abbreviation in "short" format
                                  return nextDay.toLocaleString("default", {
                                    month: "short",
                                  });
                                })(item)}
                              </div>
                              <div className="grid grid-cols-5 max-lg:grid-cols-5 max-md:grid-cols-4 max-sm:grid-cols-3 py-3 ">
                                {allSlotsByLocation
                                  .filter((filter) => filter.date === item)
                                  .map((slot, index1) => (
                                    <div key={index1}>
                                      {/* Render slot information here */}

                                      <div
                                        className={
                                          slot.booked
                                            ? "uppercase !px-0 rounded w-24 btn hover:cursor-not-allowed mr-2 mb-2"
                                            : "uppercase !px-0 rounded w-24 hover:cursor-pointer btn btn-primary mr-2 mb-2"
                                        }
                                        onClick={
                                          slot.booked
                                            ? null
                                            : () => {
                                                setUserSelectedTime(
                                                  new Date(
                                                    slot.start_time
                                                  ).toLocaleTimeString(
                                                    "en-US",
                                                    {
                                                      hour: "numeric",
                                                      minute: "numeric",
                                                      hour12: true,
                                                    }
                                                  )
                                                );
                                                // setUserSelectedDate(slot.date);
                                                setUserSelectedDate(
                                                  ((date) => {
                                                    let currentDate = new Date(
                                                      date
                                                    );
                                                    let nextDay = new Date(
                                                      currentDate
                                                    );
                                                    nextDay.setDate(
                                                      currentDate.getDate() + 1
                                                    );

                                                    if (
                                                      nextDay.getMonth() !==
                                                      currentDate.getMonth()
                                                    ) {
                                                      nextDay = new Date(
                                                        nextDay.getFullYear(),
                                                        nextDay.getMonth(),
                                                        1
                                                      );
                                                    }

                                                    return (
                                                      nextDay.getFullYear() +
                                                      "-" +
                                                      (
                                                        "0" +
                                                        (nextDay.getMonth() + 1)
                                                      ).slice(-2) +
                                                      "-" +
                                                      (
                                                        "0" + nextDay.getDate()
                                                      ).slice(-2)
                                                    );
                                                  })(slot.date)
                                                );

                                                dispatch(
                                                  addDateTime({
                                                    date: ((date) => {
                                                      let currentDate =
                                                        new Date(date);
                                                      let nextDay = new Date(
                                                        currentDate
                                                      );
                                                      nextDay.setDate(
                                                        currentDate.getDate() +
                                                          1
                                                      );

                                                      if (
                                                        nextDay.getMonth() !==
                                                        currentDate.getMonth()
                                                      ) {
                                                        nextDay = new Date(
                                                          nextDay.getFullYear(),
                                                          nextDay.getMonth(),
                                                          1
                                                        );
                                                      }

                                                      return (
                                                        nextDay.getFullYear() +
                                                        "-" +
                                                        (
                                                          "0" +
                                                          (nextDay.getMonth() +
                                                            1)
                                                        ).slice(-2) +
                                                        "-" +
                                                        (
                                                          "0" +
                                                          nextDay.getDate()
                                                        ).slice(-2)
                                                      );
                                                    })(slot.date),
                                                    time: new Date(
                                                      slot.start_time
                                                    ).toLocaleTimeString(
                                                      "en-US",
                                                      {
                                                        hour: "numeric",
                                                        minute: "numeric",
                                                        hour12: true,
                                                      }
                                                    ),
                                                    location: selectedLocation,
                                                  })
                                                );
                                                dispatch(addScreen(4));
                                              }
                                        }
                                      >
                                        {slot &&
                                          new Date(
                                            slot.start_time
                                          ).toLocaleTimeString([], {
                                            hour: "numeric",
                                            minute: "numeric",
                                            hour12: true,
                                          })}
                                      </div>
                                      <dialog
                                        id="my_modal_2"
                                        className="z-auto text-black modal"
                                      >
                                        <div className="relative flex items-center justify-center w-1/2 overflow-hidden modal-box h-[150px]">
                                          <h4 className="absolute font-bold top-3 text-md">
                                            {(new Date(item).toLocaleDateString(
                                              [],
                                              {
                                                weekday: "long",
                                              }
                                            ) === "Monday" &&
                                              "Tuesday") ||
                                              (new Date(
                                                item
                                              ).toLocaleDateString([], {
                                                weekday: "long",
                                              }) === "Tuesday" &&
                                                "Wednesday") ||
                                              (new Date(
                                                item
                                              ).toLocaleDateString([], {
                                                weekday: "long",
                                              }) === "Wednesday" &&
                                                "Thursday") ||
                                              (new Date(
                                                item
                                              ).toLocaleDateString([], {
                                                weekday: "long",
                                              }) === "Thursday" &&
                                                "Friday") ||
                                              (new Date(
                                                item
                                              ).toLocaleDateString([], {
                                                weekday: "long",
                                              }) === "Friday" &&
                                                "Saturday") ||
                                              (new Date(
                                                item
                                              ).toLocaleDateString([], {
                                                weekday: "long",
                                              }) === "Saturday" &&
                                                "Sunday") ||
                                              (new Date(
                                                item
                                              ).toLocaleDateString([], {
                                                weekday: "long",
                                              }) === "Sunday" &&
                                                "Monday")}{" "}
                                            {new Date(item).toLocaleDateString(
                                              [],
                                              {
                                                month: "short",
                                              }
                                            )}{" "}
                                            {new Date(item).getDate() + 1}
                                            {" at "}
                                            {userSelectedTime}
                                          </h4>
                                          <button
                                            className="mt-5 btn px-5 btn-primary "
                                            onClick={() => {
                                              document
                                                .getElementById("my_modal_2")
                                                .close();
                                              dispatch(
                                                addDateTime({
                                                  date: userSelectedDate,
                                                  time: userSelectedTime,
                                                  location: selectedLocation,
                                                })
                                              );
                                              dispatch(addScreen(4));
                                            }}
                                          >
                                            Confirm
                                          </button>
                                          <div className="modal-action">
                                            <form method="dialog" className="">
                                              <button className="absolute btn-sm p-1 text-[12px] btn btn-primary bottom-2 right-2 ">
                                                Close
                                              </button>
                                            </form>
                                          </div>
                                        </div>
                                      </dialog>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-center gap-4 mt-5">
                          <button
                            className="btn btn-primary"
                            onClick={handlePreviousPage}
                            disabled={currentPage === 0}
                          >
                            Previous
                          </button>
                          <button
                            className="btn btn-primary"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages - 1}
                          >
                            Next
                          </button>
                        </div>
                        {/******************* Slots section *END* *****************/}
                      </section>
                    </section>
                  </div>
                </section>
              </div>
            </section>
          </div>
        ))}
    </>
  );
};

export default ProviderProfile;
