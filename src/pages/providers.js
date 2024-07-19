"use client";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addScreen } from "@/Redux/screenSlice";
import { removePatient } from "@/Redux/patientSlice";
import { removeProvidersId } from "@/Redux/providersIdSlice";
import { addCombinedData, removeCombinedData } from "@/Redux/combinedDataSlice";
import { addSlotsData, removeSlotsData } from "@/Redux/slotsDataSlice";
import axios from "axios";
import { removeProvidersData } from "@/Redux/providersDataSlice";
import { addSelectedProvider } from "@/Redux/selectedProviderSlice";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { addMap, removeMap } from "@/Redux/mapSlice";
import Select, { components } from "react-select";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import {
  LeftArrow,
  LocationIcon,
  ProfileIcon,
  Round,
} from "../../public/icons";

const Providers = () => {
  const dispatch = useDispatch();

  const providersData = useSelector((state) => state.providersData);
  const slotsData = useSelector((state) => state.slotsData);
  const providersId = useSelector((state) => state.providersId[0]);
  const combinedData = useSelector((state) => state.combinedData);
  const myCombinedData = useSelector((state) => state.combinedData[0]);
  const mapSelector = useSelector((state) => state.map);
  const [mapLocationOptions, setMapLocationOptions] = useState(null);
  const [selectedMapLocation, setSelectedMapLocation] = useState({
    value: "0",
    label: "All Locations",
  });
  const [allCombinedData, setAllCombinedData] = useState(
    myCombinedData && myCombinedData
  );

  useEffect(() => {
    if (mapLocationOptions === null && mapSelector.length > 0) {
      setMapLocationOptions(mapSelector[0]);
    }
  }, [mapSelector, mapLocationOptions]);

  useEffect(() => {
    if (myCombinedData && myCombinedData.length > 0) {
      setAllCombinedData(myCombinedData);
    }
  }, [myCombinedData]);

  const dateStart = new Date();
  const dateEnd = new Date(dateStart);
  dateEnd.setDate(dateStart.getDate() + 13);

  const formattedDateStart = dateStart.toISOString().split("T")[0];
  const formattedDateEnd = dateEnd.toISOString().split("T")[0];

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
            d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
          ></path>
        </svg>
      </components.DropdownIndicator>
    );
  };

  const notifyError = () =>
    toast.error("No slots were found.", {
      position: "top-right",
    });

  useEffect(() => {
    if (providersId !== undefined) {
      const getSlotsForProvider = async (providerId) => {
        const config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `https://apis.azzappointments.com/api/v1/slots-by-provider?provider_id=${providerId}&start_date=${formattedDateStart}&end_date=${formattedDateEnd}`,

          headers: {
            client_id: "eae55ed2d7291eaf5741f71203eeba44f922",
            auth_token: "B8nMUiyQD68Y2Kiv08PTzfCKRMJIDuKIgXshLJaPY",
          },
        };

        try {
          const response = await axios.request(config);
          return response.data;
        } catch (error) {
          return { providerId, error: error.message };
        }
      };

      const apiCalls = providersId.map(getSlotsForProvider);

      Promise.all(apiCalls)
        .then((responses) => {
          if (combinedData.length === 0) {
            if (slotsData.length === 0) {
              dispatch(addSlotsData(responses));
              let tempSlotsData = responses;

              if (tempSlotsData !== undefined) {
                const updatedCombinedData = [];

                providersId.forEach((id) => {
                  const providerEntry = providersData[0].find(
                    (provider) => provider.azz_id === id
                  );
                  const slotEntry = tempSlotsData
                    .map((item) => item)
                    .find((slot) => slot.provider_id === id);

                  if (providerEntry && slotEntry && slotEntry.status === "1") {
                    updatedCombinedData.push({
                      providerId: id,
                      providerEntry: providerEntry,
                      slotEntry: slotEntry,
                    });
                  }
                });

                if (combinedData !== undefined) {
                  dispatch(addCombinedData(updatedCombinedData));
                  dispatch(removeProvidersData());
                  dispatch(removeSlotsData());

                  if (mapSelector && mapSelector.length === 0) {
                    const filteredProvidersByLocation = {};

                    updatedCombinedData.forEach((provider) => {
                      provider.slotEntry.locations.forEach((location) => {
                        if (!filteredProvidersByLocation[location.id]) {
                          filteredProvidersByLocation[location.id] = {
                            locationId: location.id,
                            locationName: location.name,
                            providers: [],
                          };
                        }
                        filteredProvidersByLocation[location.id].providers.push(
                          provider
                        );
                      });
                    });

                    const result = Object.values(filteredProvidersByLocation);
                    console.log("resul1 t:- ", result);
                    function capitalizeWords(str) {
                      return str
                        .toLowerCase()
                        .replace(/\b\w/g, (char) => char.toUpperCase());
                    }
                    const result2 = [
                      { value: "0", label: "All Locations" },
                      ...result.map((item) => ({
                        value: item.locationId,
                        label: capitalizeWords(item.locationName),
                      })),
                    ];
                    console.log("result 2:- ", result2);

                    dispatch(addMap(result2));
                  }
                }
              }
            }
          }
        })
        .catch((error) => {
          //console.log("Error in one or more API calls:", error);
        });
    }
  }, []);

  const center = {
    lat: 36.30059,
    lng: -85.6918,
  };

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleMapsApiKey,
  });

  const [map, setMap] = React.useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const onLoad = React.useCallback((map) => {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback((map) => {
    setMap(null);
  }, []);

  const causesSelector = useSelector((state) => state.causes);

  const allAddresses = causesSelector && causesSelector[0].addresses;
  const allMaps = mapSelector && mapSelector[0];

  function filterAddresses(allAddresses, allMaps, selectedMapLocation) {
    if (selectedMapLocation === null || selectedMapLocation.value === "0") {
      const mapValues = allMaps?.map((map) => map.value);
      return allAddresses.filter((address) =>
        mapValues?.includes(address.location_id)
      );
    } else {
      return allAddresses.filter(
        (address) => address.location_id === selectedMapLocation.value
      );
    }
  }

  const filteredAddresses = filterAddresses(
    allAddresses,
    allMaps,
    selectedMapLocation
  );

  const [location, setLocation] = useState({ lat: null, lng: null });
  const [error, setError] = useState(null);

  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [output, setOutput] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const directionsCallback = (result, status) => {
    console.log("result locations: ", result);
    if (status === "OK") {
      setOutput(result);
      const { legs } = result.routes[0];
      if (legs.length > 0) {
        console.log("legs: ", legs);
        setDistance(legs[0].distance.text);
        setDuration(legs[0].duration.text);
      }
    } else {
      console.error(`error fetching directions ${result}`);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, [selectedMapLocation]);

  const previousOrigin = useRef(null);
  const previousDestination = useRef(null);

  useEffect(() => {
    if (
      origin &&
      destination &&
      (previousOrigin.current !== origin ||
        previousDestination.current !== destination)
    ) {
      previousOrigin.current = origin;
      previousDestination.current = destination;

      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        directionsCallback
      );
    }
  }, [origin, destination, directionsCallback]);

  const handleMarkerClick = (item) => {
    const selectedLocation = {
      value: item.location_id,
      label: mapLocationOptions.filter(
        (filter) => filter.value === item.location_id
      )[0].label,
    };

    setSelectedMapLocation(selectedLocation);

    setSelectedMarker({
      ...item,
      position: {
        lat: parseFloat(item.latitude),
        lng: parseFloat(item.longitude),
      },
    });

    setDestination({
      lat: parseFloat(item.latitude),
      lng: parseFloat(item.longitude),
    });

    setOrigin({
      lat: location.lat,
      lng: location.lng,
    });
  };

  useEffect(() => {
    if (
      selectedMapLocation.value !== null &&
      selectedMapLocation.value !== "0"
    ) {
      const filteredProviders = myCombinedData.filter((provider) => {
        const locations = provider.slotEntry.locations;
        return locations.some(
          (location) => location.id === selectedMapLocation.value
        );
      });

      setAllCombinedData(filteredProviders);

      const selectedLocation = allAddresses.find(
        (address) => address.location_id === selectedMapLocation.value
      );

      if (selectedLocation) {
        setDestination({
          lat: parseFloat(selectedLocation.latitude),
          lng: parseFloat(selectedLocation.longitude),
        });

        setOrigin({
          lat: location.lat,
          lng: location.lng,
        });
      }
    } else if (
      selectedMapLocation.value === "0" ||
      selectedMapLocation.label === "All Locations"
    ) {
      setAllCombinedData(myCombinedData);
      setOrigin(null);
      setDestination(null);
      setOutput(null);
      setDistance(null);
      setDuration(null);
    }
  }, [selectedMapLocation]);
  console.log(distance, "data");
  return (
    <div className="relative grid grid-cols-2 max-lg:grid-cols-1  !w-full !h-full overflow-hidden shadow-2xl rounded max-lg:justify-items-center">
      <section className="   bg-white border rounded w-full flex flex-wrap rounded-r-none">
        <div className="flex flex-col items-center justify-between w-full px-4 py-4 border-b border-black/20">
          <div className="flex items-center justify-between w-full">
            <div
              onClick={() => {
                dispatch(addScreen(1));
                dispatch(removePatient());
                dispatch(removeProvidersId());
                dispatch(removeProvidersData());
                dispatch(removeSlotsData());
                dispatch(removeCombinedData());
                dispatch(removeMap());
              }}
              className="p-2 text-white rounded btn btn-primary hover:cursor-pointer"
            >
              <LeftArrow />
            </div>

            <Select
              value={selectedMapLocation}
              defaultValue={[{ value: "0", label: "All Locations" }]}
              placeholder={"Select Location..."}
              required
              components={{ DropdownIndicator: CauseIndicator }}
              className="shadow-lg hover:shadow-xl focus:shadow-xl ml-4"
              onChange={(Choice) => {
                setSelectedMapLocation(Choice);

                if (Choice.value !== null && Choice.value !== "0") {
                  const filteredProviders = myCombinedData.filter(
                    (provider) => {
                      const locations = provider.slotEntry.locations;
                      return locations.some(
                        (location) => location.id === Choice.value
                      );
                    }
                  );

                  setAllCombinedData(filteredProviders);

                  const selectedLocation = allAddresses.find(
                    (address) => address.location_id === Choice.value
                  );

                  if (selectedLocation) {
                    setDestination({
                      lat: parseFloat(selectedLocation.latitude),
                      lng: parseFloat(selectedLocation.longitude),
                    });

                    // Set the origin to the user's current location
                    setOrigin({
                      lat: location.lat,
                      lng: location.lng,
                    });
                  }
                } else if (
                  Choice.value === "0" ||
                  Choice.label === "All Locations"
                ) {
                  setAllCombinedData(myCombinedData);
                  // Set origin and destination to null
                  setOrigin(null);
                  setDestination(null);
                }
              }}
              noOptionsMessage={() => "Not Found"}
              options={mapLocationOptions}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  width: 250,
                  height: 50,
                  border: "2px solid #1E328F",
                  "&:hover": {
                    border: "2px solid #1E328F",
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
                  color: "#1E328F",
                }),
                option: (baseStyles, state) => ({
                  ...baseStyles,
                  backgroundColor: state.isSelected
                    ? "rgba(13,50,118,1)"
                    : "white",
                  "&:hover": {
                    backgroundColor: "#1E328F",
                    cursor: "pointer",
                    color: "white",
                  },
                }),
              }}
            />
          </div>

          {allCombinedData && allCombinedData.length === 0 ? (
            <span className="text-lg font-semibold">No Provider Found</span>
          ) : (
            <div className="text-lg font-semibold">
              {allCombinedData && allCombinedData.length === 0
                ? "No Providers Found!"
                : allCombinedData && allCombinedData.length + " Providers"}
            </div>
          )}
        </div>

        <div className="rounded overflow-hidden w-full  ">
          {providersId.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-svw h-auto py-40  gap-10">
              <div className="text-gray-500 text-xl font-semibold py-10  ">
                No Providers Found. Please try again later.
              </div>
              <button
                onClick={() => {
                  dispatch(addScreen(1));
                  dispatch(removePatient());
                  dispatch(removeProvidersId());
                  dispatch(removeProvidersData());
                  dispatch(removeSlotsData());
                  dispatch(removeCombinedData());
                }}
                className="btn btn-primary px-10 shadow-lg"
              >
                <Round />
              </button>
            </div>
          ) : (
            <div className="h-[76vh] overflow-y-scroll w-full">
              {allCombinedData ? (
                allCombinedData.map((item, index) => (
                  <section
                    key={index}
                    className="hover:bg-black/5 border-b rounded shadow-md hover:shadow-xl  border-[#1E328F]/20 group/name flex items-center justify-center !w-full "
                  >
                    <div className="w-full px-4 py-4 flex max-sm:flex-col items-center justify-between ">
                      <div className="flex items-start justify-start max-sm:w-full max-sm:items-center max-sm:justify-center">
                        <div className="w-20 h-20 overflow-hidden rounded-full object-cover   ">
                          {item.providerEntry.profile ? (
                            <Image
                              width={80}
                              height={80}
                              alt={"provider-pic"}
                              className="rounded-full object-cover"
                              src={item.providerEntry.profile}
                            />
                          ) : (
                            <div className="rounded-full w-20 h-20 bg-gray-300 flex items-center justify-center">
                              <ProfileIcon />
                            </div>
                          )}
                        </div>
                      </div>

                      <div
                        onClick={
                          item.slotEntry.status === "0"
                            ? notifyError
                            : () => {
                                dispatch(addScreen(3));
                                dispatch(
                                  addSelectedProvider({ id: item.providerId })
                                );
                              }
                        }
                        className="flex flex-col items-start justify-center  pl-2 max-sm:w-full max-sm:items-center max-sm:justify-center max-sm:mt-2 hover:cursor-pointer max-sm:text-center text-left  w-full"
                      >
                        <div className="font-bold group-hover/name:underline hover:cursor-pointer">
                          {item.providerEntry.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.providerEntry.description}
                        </div>
                        <div className="flex items-start justify-start gap-1 mt-2 text-sm text-gray-500 max-sm:items-center max-sm:justify-center w-full  ">
                          <span className="mt-0.5">
                            <LocationIcon />
                          </span>
                          <span className="text-[12px] line-clamp-2 ">
                            {item.providerEntry.address}
                          </span>
                        </div>
                      </div>

                      <section className="flex flex-col items-start justify-center max-sm:items-center max-sm:justify-center max-sm:mt-5 h-auto min-h-[200px]  !w-full ">
                        {/******************* Slots section *START* *****************/}

                        <div className="flex flex-wrap items-center justify-start gap-1 ml-1 max-sm:-mt-2 max-sm:items-center max-sm:justify-center 2xl:w-[400px] xl:w-[360px] lg:w-[280px] md:w-[400px] max-sm:w-full   ">
                          {item.slotEntry.status === "1" ? (
                            <>
                              {item.slotEntry.data
                                .map((i) => i)
                                .sort(
                                  (a, b) => new Date(a.date) - new Date(b.date)
                                )
                                .map((item1, index1) => (
                                  <div key={index1}>
                                    <section className="flex flex-wrap items-start justify-start">
                                      <div>
                                        <div className="flex flex-wrap gap-1">
                                          <div
                                            onClick={
                                              item.slotEntry.status === "0"
                                                ? null
                                                : () => {
                                                    dispatch(addScreen(3));
                                                    dispatch(
                                                      addSelectedProvider({
                                                        id: item.providerId,
                                                      })
                                                    );
                                                  }
                                            }
                                            className="btn btn-primary mr-0.5 mb-0.5 !w-[50px] !h-[73px] p-0 rounded hover:opacity-80 hover:cursor-pointer shadow-xl"
                                          >
                                            <div className="flex flex-col items-start">
                                              <div className="font-semibold text-[12px]">
                                                {(new Date(
                                                  item1.date
                                                ).toLocaleDateString([], {
                                                  weekday: "short",
                                                }) === "Mon" &&
                                                  "Tue") ||
                                                  (new Date(
                                                    item1.date
                                                  ).toLocaleDateString([], {
                                                    weekday: "short",
                                                  }) === "Tue" &&
                                                    "Wed") ||
                                                  (new Date(
                                                    item1.date
                                                  ).toLocaleDateString([], {
                                                    weekday: "short",
                                                  }) === "Wed" &&
                                                    "Thu") ||
                                                  (new Date(
                                                    item1.date
                                                  ).toLocaleDateString([], {
                                                    weekday: "short",
                                                  }) === "Thu" &&
                                                    "Fri") ||
                                                  (new Date(
                                                    item1.date
                                                  ).toLocaleDateString([], {
                                                    weekday: "short",
                                                  }) === "Fri" &&
                                                    "Sat") ||
                                                  (new Date(
                                                    item1.date
                                                  ).toLocaleDateString([], {
                                                    weekday: "short",
                                                  }) === "Sat" &&
                                                    "Sun") ||
                                                  (new Date(
                                                    item1.date
                                                  ).toLocaleDateString([], {
                                                    weekday: "short",
                                                  }) === "Sun" &&
                                                    "Mon")}{" "}
                                              </div>
                                              <div className=" text-[11px] font-normal">
                                                {(function getNextDay(date) {
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

                                                  // Return the month abbreviation in "short" format
                                                  return nextDay.toLocaleString(
                                                    "default",
                                                    { month: "short" }
                                                  );
                                                })(item1.date)}{" "}
                                                {/* {new Date(item1.date).getDate() +
                                                1} */}
                                                {(function getNextDay(date) {
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

                                                  return nextDay.getDate();
                                                })(item1.date)}{" "}
                                              </div>
                                            </div>
                                            <div className="flex flex-col items-start">
                                              <div className="font-semibold text-[12px]">
                                                {item1.slots_count}
                                              </div>
                                              <div className=" text-[11px] font-normal">
                                                {"appts"}
                                              </div>
                                            </div>
                                          </div>
                                          <dialog
                                            id="my_modal_1"
                                            className="modal"
                                          >
                                            <div className="modal-box">
                                              <h3 className="text-lg font-bold"></h3>
                                              <div className="flex items-center justify-center gap-5 py-2 mt-2 text-white ">
                                                <div className="flex flex-wrap items-start justify-center gap-1">
                                                  <section>
                                                    <div>
                                                      <div
                                                        onClick={() => {
                                                          document
                                                            .getElementById(
                                                              "my_modal_2"
                                                            )
                                                            .showModal();
                                                        }}
                                                        className="px-2 rounded w-fit hover:cursor-pointer btn btn-primary"
                                                      >
                                                        {"00:00 AM "}
                                                      </div>
                                                      <dialog
                                                        id="my_modal_2"
                                                        className="z-auto text-black modal"
                                                      >
                                                        <div className="modal-box w-[200px] overflow-hidden relative flex items-center justify-center">
                                                          <Button
                                                            className="btn btn-primary"
                                                            onClick={() => {
                                                              document
                                                                .getElementById(
                                                                  "my_modal_1"
                                                                )
                                                                .close();
                                                              document
                                                                .getElementById(
                                                                  "my_modal_2"
                                                                )
                                                                .close();
                                                            }}
                                                          >
                                                            Confirm
                                                          </Button>
                                                          <div className="modal-action">
                                                            <form
                                                              method="dialog"
                                                              className=""
                                                            >
                                                              <button
                                                                className="absolute top-1 right-4 w-1 !h-0 text-black"
                                                                onClick={() =>
                                                                  document
                                                                    .getElementById(
                                                                      "my_modal_1"
                                                                    )
                                                                    .close()
                                                                }
                                                              >
                                                                X
                                                              </button>
                                                            </form>
                                                          </div>
                                                        </div>
                                                      </dialog>
                                                    </div>
                                                  </section>
                                                </div>
                                              </div>
                                              <div className="modal-action">
                                                <form method="dialog">
                                                  <button className="btn-sm btn btn-primary ">
                                                    Close
                                                  </button>
                                                </form>
                                              </div>
                                            </div>
                                          </dialog>
                                        </div>
                                      </div>
                                    </section>
                                  </div>
                                ))}
                            </>
                          ) : (
                            <div className=" text-gray-700">
                              {item.slotEntry.message}
                            </div>
                          )}
                          <Toaster />
                        </div>

                        {/******************* Slots section *END* *****************/}
                      </section>
                    </div>
                  </section>
                ))
              ) : (
                <>
                  {providersId.map((item, index) => (
                    //! /////////////////   SKELETON /////////////////////
                    <section
                      key={index}
                      className=" hover:bg-black/5 border-b group/name pt-5 h-[200px]"
                    >
                      <div className="w-full px-4 py-4 flex max-sm:flex-col items-center justify-between   ">
                        <div className="flex items-start justify-start max-sm:w-full max-sm:items-center max-sm:justify-center">
                          <div className="w-20 h-20 overflow-hidden rounded-full ">
                            <div className="w-20 h-20 rounded-full skeleton shrink-0"></div>
                          </div>
                        </div>

                        <div className="flex flex-col items-start justify-start gap-1 pl-2 max-sm:w-full max-sm:items-center max-sm:justify-center max-sm:mt-2  max-sm:text-center  ">
                          <div className="flex flex-col gap-4">
                            <div className="skeleton h-6 w-[400px] max-[760px]:w-[300px]"></div>
                            <div className="skeleton h-4 w-[400px] max-[760px]:w-[300px]"></div>
                            <div className="skeleton h-3 w-[400px] max-[760px]:w-[300px]"></div>
                          </div>
                        </div>

                        <section className="flex flex-col items-start justify-start   max-sm:w-full max-sm:items-center max-sm:justify-center max-sm:mt-5 h-full w-[380px] max-[760px]:w-[340px] ">
                          {/******************* Slots section *START* *****************/}

                          <div className="flex flex-wrap items-start justify-start gap-1 ml-1 max-sm:items-center max-sm:justify-center ">
                            <div>
                              <section className="flex flex-wrap items-start justify-start pl-5">
                                <div>
                                  <div className="flex flex-wrap gap-1">
                                    <div className="skeleton !w-[50px] !h-[73px] rounded p-0"></div>
                                    <div className="skeleton !w-[50px] !h-[73px] rounded p-0"></div>
                                    <div className="skeleton !w-[50px] !h-[73px] rounded p-0"></div>
                                    <div className="skeleton !w-[50px] !h-[73px] rounded p-0"></div>
                                    <div className="skeleton !w-[50px] !h-[73px] rounded p-0"></div>
                                    {/* <div className="skeleton !w-[50px] !h-[73px] rounded p-0"></div> */}
                                  </div>
                                </div>
                              </section>
                            </div>
                          </div>

                          {/******************* Slots section *END* *****************/}
                        </section>
                      </div>
                    </section>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </section>
      <section className="static max-lg:hidden w-full h-full border-l-2  border-[#1E328F] rounded rounded-l-none ">
        {isLoaded ? (
          <section className="relative">
            <GoogleMap
              mapContainerStyle={{
                width: "100%",
                minHeight: "85vh",
              }}
              center={center}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                gestureHandling: "greedy",
                zoom: 5.3,
                minZoom: 4.5,
                maxZoom: 18,
              }}
            >
              {filteredAddresses &&
                filteredAddresses.map((item) => (
                  <Marker
                    onClick={() => handleMarkerClick(item)}
                    position={{
                      lat: parseFloat(item.latitude),
                      lng: parseFloat(item.longitude),
                    }}
                    key={item.id}
                    className="absolute z-1 cursor-pointer"
                  >
                    {output && (
                      <DirectionsRenderer
                        options={{
                          directions: output,
                        }}
                      />
                    )}
                  </Marker>
                ))}
            </GoogleMap>

            {distance && duration && (
              <div className="absolute top-0 left-0 bg-white/80  w-fit rounded py-3 px-4 rounded-t-none rounded-l-none shadow-lg   ">
                <div>
                  <span className=" font-medium text-center">Distance:</span>
                  {""}
                  {distance}
                </div>
                <div>
                  <span className=" font-medium text-center">Duration:</span>
                  {""}
                  {duration}
                </div>
              </div>
            )}
          </section>
        ) : (
          <span className="loading bg-[#1E328F] loading-bars loading-lg"></span>
        )}
      </section>
    </div>
  );
};

export default Providers;
