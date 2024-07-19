"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  addProvidersData,
  removeProvidersData,
} from "@/Redux/providersDataSlice";
import { useDispatch, useSelector } from "react-redux";
import { addProvidersId } from "@/Redux/providersIdSlice";
import { addCombinedData } from "@/Redux/combinedDataSlice";
import { addSlotsData, removeSlotsData } from "@/Redux/slotsDataSlice";
import { addScreen } from "@/Redux/screenSlice";
import { addSelectedProvider } from "@/Redux/selectedProviderSlice";
import { addPatient } from "@/Redux/patientSlice";
import { CalenderRange, ChevronRight, ProfileIcon } from "../../public/icons";
import ChevronLeft from "../../public/icons/chevronLeft";
import HighlyStar from "../../public/icons/highlyStar";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      onClick={onClick}
      className=" !absolute !bottom-0 !left-16 next-arrow btn btn-primary btn-outline rounded-full px-0 py-0 h-10 w-12 border-2 !hover:text-white !z-[999999] max-md:!-bottom-20 "
    >
      <ChevronRight />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      onClick={onClick}
      className=" !absolute !bottom-0 back-arrow btn btn-primary btn-outline rounded-full px-0 py-0 h-10 w-12 border-2 !hover:text-white !z-[999999] max-md:!-bottom-20 "
    >
      <ChevronLeft />
    </div>
  );
}

const DoctorSlider = () => {
  const [providers, setProviders] = useState(null);
  const [selectedProviderId, setSelectedProviderId] = useState(null);

  ///*! USE DISPATCH
  const dispatch = useDispatch();

  ///*! USE SELECTORS
  const providersData = useSelector((state) => state.providersData);
  const slotsData = useSelector((state) => state.slotsData);
  const providersId = useSelector((state) => state.providersId[0]);
  const combinedData = useSelector((state) => state.combinedData);
  const myCombinedData = useSelector((state) => state.combinedData[0]);

  const dateStart = new Date();
  const dateEnd = new Date(dateStart);
  dateEnd.setDate(dateStart.getDate() + 13);

  const formattedDateStart = dateStart.toISOString().split("T")[0];
  const formattedDateEnd = dateEnd.toISOString().split("T")[0];

  // ///! USE REF
  // const navigationPrevRef = useRef(null);
  // const navigationNextRef = useRef(null);

  useEffect(() => {
    if (providers === null) {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `https://apis.azzappointments.com/api/v1/providers`,
        headers: {
          client_id: "eae55ed2d7291eaf5741f71203eeba44f922",
          auth_token: "B8nMUiyQD68Y2Kiv08PTzfCKRMJIDuKIgXshLJaPY",
        },
      };

      axios
        .request(config)
        .then((response) => {
          // console.log(response.data);
          setProviders(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    if (providersId !== undefined) {
      //! ***************** CREATEING OVERLAY [--START--]**********************

      var overlay = document.createElement("div");

      overlay.id = "AI-OVERLAY";
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
      overlay.style.zIndex = "99999999";
      overlay.style.display = "flex";
      overlay.style.justifyContent = "center";
      overlay.style.alignItems = "center";

      var spinnerHtml = `<span class="loading loading-bars loading-lg"></span>`;

      overlay.innerHTML = spinnerHtml;

      // Append the overlay to the body
      document.body.appendChild(overlay);

      //! ***************** CREATEING OVERLAY [--END--]************************

      // Function to make API call for a specific provider ID
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

      // Use map to make API calls for each provider ID
      const apiCalls = providersId.map(getSlotsForProvider);

      // Wait for all API calls to complete
      Promise.all(apiCalls)
        .then((responses) => {
          if (combinedData.length === 0) {
            if (slotsData.length === 0) {
              dispatch(addSlotsData(responses));
              let tempSlotsData = responses;

              //! 2ND Function: /////////////////////////

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
                  dispatch(addScreen(3));
                  dispatch(addSelectedProvider({ id: providersId[0] }));

                  window.scrollTo({
                    top: 0,
                    behavior: "smooth", // Smooth scrolling animation
                  });

                  //! ***************** REMOVE OVERLAY [--START--]**********************

                  let overlayToRemove = document.getElementById("AI-OVERLAY");
                  if (overlayToRemove) {
                    overlayToRemove.remove();
                  }

                  //! ***************** REMOVE OVERLAY [--END--]************************
                }
              }
            }
          }
        })
        .catch((error) => {
          //console.log("Error in one or more API calls:", error);
        });
    }
  }, [providersId]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    draggable: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,

    responsive: [
      {
        breakpoint: 1660,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
        },
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="w-full h-full">
      <Slider className="!h-full !w-full" {...settings}>
        {providers &&
          providers.map((item) => (
            <div
              key={item.id}
              className="!h-[500px] !w-full sm:!w-[400px] !relative"
            >
              <div className="bg-white rounded border pb-32 sm:pb-20 md:pb-32 h-[70%] mt-[80px] shadow hover:shadow-lg hover:cursor-grab hover:h-[72%] transition ease-in-out duration-300 hover:bg-gray-50">
                <div className="w-[100px] h-[100px] shadow-lg overflow-hidden rounded-xl absolute top-8 left-10">
                  {/\.(png|jpe?g|gif|bmp|webp|tiff|svg)$/i.test(
                    item.profile
                  ) ? (
                    <Image
                      fill={true}
                      alt={"provider-pic"}
                      className="bg-contain rounded-xl"
                      src={item.profile}
                    />
                  ) : (
                    <div className="rounded-full w-[100px] h-[100px] bg-gray-100 border flex items-center justify-center">
                      <ProfileIcon />
                    </div>
                  )}
                </div>
                <div className="flex items-start justify-center flex-col">
                  <div className="badge mt-5 ml-40 bg-blue-100 flex items-center justify-center gap-1 py-3">
                    <HighlyStar />
                    <span className="text-black text-center">
                      Highly recommended
                    </span>
                  </div>
                  <div className="flex items-start justify-center flex-col w-full h-full px-10 gap-1">
                    <div className="mt-5 font-medium text-xl line-clamp-1">
                      {item.name}
                    </div>
                    <div className="text-wrap line-clamp-1">
                      {item.description}
                    </div>
                    <div className="text-gray-500 font-light line-clamp-2">
                      {item.address}
                    </div>

                    <div
                      className={`${
                        item.address && item.address.length > 40
                          ? "mt-16 sm:mt-5"
                          : "mt-24 sm:mt-10"
                      } w-full`}
                    >
                      <div className="flex items-center justify-start mb-2 gap-1">
                        <CalenderRange />
                        <p className="font-medium text-[#0D3276]">
                          Appointments available Today
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          dispatch(addProvidersId([item.azz_id]));
                          dispatch(addProvidersData([item]));
                          dispatch(
                            addPatient({
                              cause: "No Cause",
                              insurance: "",
                              mode: "Office Appointment",
                            })
                          );
                        }}
                        className="btn btn-primary w-full text-lg"
                      >
                        Book online
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </Slider>
    </section>
  );
};

export default DoctorSlider;
