"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";

const page = () => {
  //! Login States [START]*************

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(null);
  const [password, setPassword] = useState(null);

  //! Login States [END]*************

  const [data, setData] = useState(null);
  const [provider, setProvider] = useState(null);
  const [selectedOption, setSelectedOption] = useState();
  const [options, setOptions] = useState([{ value: "", label: "" }]);
  const [datePanel, setDatePanel] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loader, setLoader] = useState(false);

  const handleTranscribe = async () => {
    setLoader(true);
    const url = selectedNote.audio_file
      .replace(
        "/home/u681851651/domains/azzappointments.com/public_html/",
        "https://azzappointments.com/"
      )
      .replaceAll(" ", "%20");

    let data = JSON.stringify({
      url: url,
      auth: "AZZPHS225",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://us-central1-my-project-77473-1699397741693.cloudfunctions.net/azzmediclassociate",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        let updatedText = "";
        if (response.data.text === "") {
          alert("No voice found.");

          setLoader(false);
        } else {
          updatedText = response.data.text;

          //! 2ND API TEXT UPDATE  [START] ************

          const axios = require("axios");
          let data = JSON.stringify({
            text: updatedText,
            status: "completed",
          });

          let config = {
            method: "put",
            maxBodyLength: Infinity,
            url: `https://apis.azzappointments.com/api/v1/provider-update/${selectedNote.id}`,
            headers: {
              "Content-Type": "application/json",
            },
            data: data,
          };

          axios
            .request(config)
            .then((response) => {
              // console.log(JSON.stringify(response.data));
              setLoader(false);

              setSelectedNote((prevNote) => ({
                ...prevNote,
                text: updatedText,
              }));

              let config = {
                method: "get",
                maxBodyLength: Infinity,
                url: "https://apis.azzappointments.com/api/v1/get-provider-dictations",
              };

              axios
                .request(config)
                .then((response) => {
                  setData(response.data.data);
                  const data = response.data.data.map((item) => item.provider);
                  const uniqueData = [...new Set(data)];
                  const convertedData = uniqueData.map((name) => ({
                    value: name,
                    label: name,
                  }));

                  setOptions(convertedData);

                  const handleSubmit = () => {
                    const filtered =
                      response.data.data
                        .map((item) => item)
                        .filter((filter) => filter.provider === provider)
                        .filter((filter) => {
                          const filterDate = new Date(filter.created_at)
                            .toISOString()
                            .slice(0, 10);
                          return (
                            (!formattedStartDate ||
                              filterDate >= formattedStartDate) &&
                            (!formattedEndDate ||
                              filterDate <= formattedEndDate)
                          );
                        }) || [];

                    setFilteredData(filtered);
                  };

                  handleSubmit();
                })
                .catch((error) => {
                  console.log(error);
                  setLoader(false);
                });
            })
            .catch((error) => {
              console.log(error);
              setLoader(false);
            });

          //! 2ND API TEXT UPDATE  [END] ************
        }
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  };

  //! DATE ******************
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://apis.azzappointments.com/api/v1/get-provider-dictations",
    };

    axios
      .request(config)
      .then((response) => {
        setData(response.data.data);
        const data = response.data.data.map((item) => item.provider);
        const uniqueData = [...new Set(data)];
        const convertedData = uniqueData.map((name) => ({
          value: name,
          label: name,
        }));

        setOptions(convertedData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const startDate = date && date[0] && date[0].startDate;
  const endDate = date && date[0] && date[0].endDate;

  const startDateFormatted = startDate ? new Date(startDate) : null;
  const endDateFormatted = endDate ? new Date(endDate) : null;

  const formattedStartDate = `${startDateFormatted.getFullYear()}-${(
    startDateFormatted.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${startDateFormatted
    .getDate()
    .toString()
    .padStart(2, "0")}`;

  const formattedEndDate =
    endDateFormatted &&
    `${endDateFormatted.getFullYear()}-${(endDateFormatted.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${endDateFormatted
      .getDate()
      .toString()
      .padStart(2, "0")}`;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDatePanel(!datePanel);
    const filtered =
      (data &&
        provider &&
        data
          .map((item) => item)
          .filter((filter) => filter.provider === provider)
          .filter((filter) => {
            const filterDate = new Date(filter.created_at)
              .toISOString()
              .slice(0, 10);
            return (
              (!formattedStartDate || filterDate >= formattedStartDate) &&
              (!formattedEndDate || filterDate <= formattedEndDate)
            );
          })) ||
      [];
    setFilteredData(filtered);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (userName === "admin" && password === "AZZ@123") {
      setIsLoggedIn(true);
    } else {
      alert("Please try again with correct login details.");
    }
  };

  return (
    <section className=" w-full flex items-start justify-center">
      {isLoggedIn ? (
        <section className=" w-full flex items-start justify-center">
          <div className="w-full flex flex-col items-center justify-center ">
            <div className="font-semibold text-xl text-[#1E328F] border-b-2 w-full text-center py-5 shadow-md">
              Assistant Panel
            </div>

            <div className="flex items-center justify-center w-full h-[67.7vh]">
              <div className="flex flex-col items-center justify-start h-full  w-[330px] bg-gray-200 py-5">
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col items-center justify-start gap-2 w-fit h-fit relative  bg-white rounded text-center "
                >
                  <Select
                    required
                    className="shadow-lg absolute z-50"
                    defaultValue={provider}
                    onChange={(Choice) => {
                      setProvider(Choice.value);
                      setDate([
                        {
                          startDate: new Date(),
                          endDate: null,
                          key: "selection",
                        },
                      ]);
                      setSelectedNote(null);
                      setDatePanel(false);
                    }}
                    options={options}
                    placeholder={"Select Provider"}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        width: 330,
                        height: 40,
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
                  {provider && (
                    <div className="w-full">
                      <div
                        onClick={() => setDatePanel(!datePanel)}
                        className="flex items-center justify-center h-8 min-h-10 btn btn-outline btn-primary rounded font-medium "
                      >
                        {date && date[0] && date[0].endDate
                          ? new Date(date[0].startDate).toLocaleDateString(
                              "en-US",
                              {
                                day: "2-digit",
                              }
                            ) +
                            "-" +
                            new Date(date[0].startDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "2-digit",
                              }
                            ) +
                            "-" +
                            new Date(date[0].startDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                              }
                            ) +
                            " - " +
                            new Date(date[0].endDate).toLocaleDateString(
                              "en-US",
                              {
                                day: "2-digit",
                              }
                            ) +
                            "-" +
                            new Date(date[0].endDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "2-digit",
                              }
                            ) +
                            "-" +
                            new Date(date[0].endDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                              }
                            )
                          : "Select Date"}
                      </div>
                      {datePanel && (
                        <div className="w-full absolute z-40">
                          <DateRange
                            maxDate={new Date()}
                            className="rounded shadow-lg"
                            editableDateInputs={false}
                            onChange={(item) => {
                              setDate([item.selection]);
                            }}
                            moveRangeOnFirstSelection={false}
                            ranges={date}
                          />
                          <div className="w-full">
                            <button
                              id="search-btn"
                              type="submit"
                              className="btn btn-primary w-full tracking-wider h-8 min-h-10 rounded-t-none "
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={20}
                                height={20}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-search"
                              >
                                <circle cx={11} cy={11} r={8} />
                                <path d="m21 21-4.3-4.3" />
                              </svg>
                              Search
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {provider &&
                    date[0].endDate &&
                    data.length > filteredData.length && (
                      <div className="bg-gray-200 w-full ">
                        <ul className="menu bg-base-200 w-[330px] rounded-box flex flex-col items-start justify-start h-[45vh] border overflow-y-scroll ">
                          <li className="flex flex-col items-start justify-start">
                            {filteredData
                              .map((i) => i)
                              .sort((a, b) => b.id - a.id)
                              .map((item) => (
                                <div
                                  key={item.id}
                                  className={
                                    selectedNote && selectedNote.id === item.id
                                      ? "text-[#1E328F] font-semibold bg-black/10"
                                      : ""
                                  }
                                  onClick={() => {
                                    setSelectedNote(null);
                                    setSelectedNote(item);
                                  }}
                                >
                                  <div className="flex flex-col items-start justify-start w-full ">
                                    <div className="flex items-start justify-start gap-1">
                                      <div className="text-black text-nowrap">
                                        Date-Time:
                                      </div>
                                      <div className=" text-nowrap line-clamp-1">
                                        {formatDate(item.created_at)}
                                      </div>
                                    </div>
                                    <div className="flex items-start justify-start gap-1">
                                      <div className="text-black">Patient:</div>
                                      <div className=" text-nowrap line-clamp-1">
                                        {item.name_of_patient}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </li>
                        </ul>
                      </div>
                    )}
                </form>
              </div>
              {provider ? (
                date && date[0].endDate ? (
                  selectedNote ? (
                    <div className="flex flex-col items-center justify-start h-full w-full">
                      <div className="mt-5 font-medium text-lg text-[#1E328F] w-full text-center">
                        Note
                      </div>
                      <div className="flex flex-col items-start justify-center px-10 gap-2 mt-5">
                        <div className="flex items-start justify-start gap-1">
                          <div className=" font-semibold text-[#1E328F]">
                            Date-Time:
                          </div>
                          <div>
                            {selectedNote &&
                              formatDate(selectedNote.created_at)}
                          </div>
                        </div>
                        <div className="flex items-start justify-start gap-1">
                          <div className=" font-semibold text-[#1E328F]">
                            Provider:
                          </div>
                          <div>{selectedNote && selectedNote.provider}</div>
                        </div>
                        <div className="flex items-start justify-start gap-1">
                          <div className=" font-semibold text-[#1E328F]">
                            Patient:
                          </div>
                          <div>
                            {selectedNote && selectedNote.name_of_patient}
                          </div>
                        </div>
                        <div className="flex items-start justify-start gap-1">
                          <div className=" font-semibold text-[#1E328F]">
                            Comments:
                          </div>
                          <div>{selectedNote && selectedNote.comments}</div>
                        </div>

                        <div className="mt-2">
                          {selectedNote && selectedNote.audio_file && (
                            <audio key={selectedNote.id} controls>
                              <source
                                src={
                                  selectedNote &&
                                  selectedNote.audio_file
                                    .replace(
                                      "/home/u681851651/domains/azzappointments.com/public_html/",
                                      "https://azzappointments.com/"
                                    )
                                    .replaceAll(" ", "%20")
                                }
                                type="audio/mp3"
                              />
                              Your browser does not support the audio element.
                            </audio>
                          )}
                        </div>
                      </div>

                      {loader ? (
                        <div className="mt-5">
                          <span className="loading text-[#1E328F] loading-bars loading-lg"></span>
                        </div>
                      ) : (
                        <div className="mt-5">
                          <button
                            onClick={
                              selectedNote && selectedNote.text
                                ? null
                                : handleTranscribe
                            }
                            className={
                              selectedNote && selectedNote.text
                                ? "btn  hover:cursor-not-allowed"
                                : "btn btn-primary"
                            }
                          >
                            Transcribe
                          </button>
                        </div>
                      )}

                      <div className="w-full px-5">
                        <label className="form-control">
                          <div className="label">
                            <span className="label-text">Transcript:</span>
                          </div>
                          <textarea
                            className="textarea textarea-primary textarea-bordered h-[250px] -mt-1 resize-none"
                            placeholder="Transcript...!"
                            value={
                              selectedNote && selectedNote.text
                                ? selectedNote.text
                                : ""
                            }
                            readOnly
                          ></textarea>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-start justify-start h-full w-full py-10 px-10">
                      <div className=" py-3 px-5 text-md font-medium text-gray-400 flex bg-gray-100/50 border rounded">
                        Please select a dication note.
                      </div>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-start justify-start h-full w-full py-10 px-10">
                    <div className=" py-3 px-5 text-md font-medium text-gray-400 flex bg-gray-100/50 border rounded">
                      Please select a date range to view the dictation.
                    </div>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-start justify-start h-full w-full py-10 px-10">
                  <div className=" py-3 px-5 text-md font-medium text-gray-400 flex bg-gray-100/50 border rounded">
                    Please select a provider to view the dictation.
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : (
        <form
          onSubmit={handleLogin}
          className="px-20 mt-32 pt-10 mb-[196px]  pb-16 bg-[#1E328F]/15  shadow-2xl flex flex-col items-center justify-center gap-3 rounded-xl "
        >
          <div className="font-semibold text-2xl text-[#1E328F]  text-center py-5">
            Sign in to your account
          </div>

          <label className="input input-primary input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              type="text"
              className="grow"
              placeholder="Username"
            />
          </label>
          <label className="input input-primary input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="grow"
              placeholder="Password"
            />
          </label>
          <button className="btn btn-primary w-full text-lg mt-5">
            Log in
          </button>
        </form>
      )}
    </section>
  );
};

export default page;
