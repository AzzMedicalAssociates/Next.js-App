"use client";
import { useEffect, useState } from "react";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";
import { addLogin } from "@/Redux/loginSlice";
const page = () => {
  //! Redux ***********
  const dispatch = useDispatch();

  const loggedIn = useSelector((state) => state.login[0]);

  //! Login States [START]*************
  const [isLoggedIn, setIsLoggedIn] = useState(loggedIn ? loggedIn : false);
  const [userName, setUserName] = useState(null);
  const [password, setPassword] = useState(null);
  //! Login States [END]*************

  const [patient, setPatient] = useState("");
  const [provider, setProvider] = useState("");
  const [comments, setComments] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedOption, setSelectedOption] = useState();
  const [options, setOptions] = useState([{ value: "", label: "" }]);
  const [data, setData] = useState(null);
  const [allDictations, setAllDictations] = useState(null);

  useEffect(() => {
    const axios = require("axios");

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://apis.azzappointments.com/api/v1/providers",
      headers: {
        client_id: "eae55ed2d7291eaf5741f71203eeba44f922",
        auth_token: "B8nMUiyQD68Y2Kiv08PTzfCKRMJIDuKIgXshLJaPY",
      },
    };

    axios
      .request(config)
      .then((response) => {
        const data = response.data.map((item) => item.name);
        const convertedData = data.map((name) => ({
          value: name,
          label: name,
        }));

        setOptions(convertedData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //! Getting all Dictations

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://apis.azzappointments.com/api/v1/get-provider-dictations",
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        //console.log(JSON.stringify(response.data));
        setAllDictations(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //! Filtering Dictations By Providers
  const filteredDictationsByProvider =
    provider &&
    allDictations &&
    allDictations
      .map((item) => item)
      .filter((filter) => filter.provider === provider)
      .sort((a, b) => b.id - a.id);

  const addAudioElement = (blob) => {
    setSelectedFile(blob);
  };

  const convertBlobToAudioFile = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        const audioFile = dataURLToBlob(dataUrl, "audio/mp3");
        resolve(audioFile);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const dataURLToBlob = (dataURL, mimeType) => {
    const binary = atob(dataURL.split(",")[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: mimeType });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedFile !== null) {
      const audioFile = await convertBlobToAudioFile(selectedFile);

      const formdata = new FormData();
      formdata.append("name_of_patient", patient);
      formdata.append("provider", provider);
      formdata.append("audio_file", audioFile);
      formdata.append("text", "");
      formdata.append("comments", comments);
      formdata.append("status", "pending");

      try {
        const response = await axios.post(
          "https://apis.azzappointments.com/api/v1/provider-dictations",
          formdata,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        //console.log(response.data.message);
        const notifySuccess = () =>
          toast.success(
            "The dictation notes have been recorded successfully.",
            {
              position: "top-right",
            }
          );
        notifySuccess();
        setPatient("");

        setComments("");
        setSelectedFile(null);
      } catch (error) {
        const notifyError = () =>
          toast.error(error.message, {
            position: "top-right",
          });

        notifyError();
      }
    } else {
      const notifyError = () =>
        toast.error("Please record your dictation note for the patient.", {
          position: "top-right",
        });

      notifyError();
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (userName === "admin" && password === "AZZ@123") {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "https://apis.azzappointments.com/api/v1/get-provider-dictations",
      };

      axios
        .request(config)
        .then((response) => {
          setData(response.data.data);
          setIsLoggedIn(true);
          //console.log(response.data.data);

          setOptions(convertedData);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert("Please try again with correct login details.");
    }
  };

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

  return (
    <section
      className={
        isLoggedIn
          ? "w-full flex items-start justify-center pb-2"
          : "w-full flex items-start justify-center mb-[68px] "
      }
    >
      {isLoggedIn ? (
        <section className=" w-full flex items-start justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center justify-center "
          >
            <div className="font-semibold text-xl text-[#1E328F] border-b-2 w-full text-center py-5 shadow-md">
              Provider Panel
            </div>

            <section className="flex items-start justify-start w-full ">
              {provider && (
                <div className="bg-gray-200 w-[470px]  ">
                  <div className="text-[#1E328F] w-full text-center font-semibold  py-2">
                    Dictations By {provider}
                  </div>
                  <div className="flex flex-col items-start justify-start w-full h-[67vh] overflow-y-scroll gap-0">
                    {filteredDictationsByProvider.map((item) => (
                      <div className="flex flex-col items-start justify-between rounded border border-gray-400  w-full py-3 pl-2 gap-1 mb-2 bg-white/70 glass shadow-md">
                        <div className="text-sm line-clamp-1">
                          <span className=" text-[#1E328F] font-semibold">
                            Date:{" "}
                          </span>
                          {formatDate(item.created_at)}
                        </div>
                        <div className="text-sm line-clamp-1">
                          <span className="text-[#1E328F] font-semibold">
                            Patient Name:{" "}
                          </span>
                          {item.name_of_patient}
                        </div>
                        <div className="w-full pr-2">
                          <audio
                            controlsList="nodownload"
                            className="w-full"
                            controls
                          >
                            <source
                              src={item.audio_file
                                .replace(
                                  "/home/u681851651/domains/azzappointments.com/public_html/",
                                  "https://azzappointments.com/"
                                )
                                .replaceAll(" ", "%20")}
                              type="audio/mpeg"
                            />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="w-full flex items-center justify-center flex-col py-5 gap-2 ">
                <div className="mb-5 font-medium text-lg text-[#1E328F] w-full text-center">
                  Dictation Note
                </div>

                <div>
                  <input
                    required
                    value={patient}
                    onChange={(e) => setPatient(e.target.value)}
                    type="text"
                    placeholder="Patient name"
                    className="input input-primary input-bordered w-[300px] rounded "
                  />
                </div>

                <div>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="textarea textarea-primary textarea-bordered w-[300px] h-[200px] resize-none rounded"
                    placeholder="Additional Comments"
                  ></textarea>
                </div>
                <div>
                  <div className="mb-2">
                    <AudioRecorder
                      showVisualizer={true}
                      onRecordingComplete={addAudioElement}
                      audioTrackConstraints={{
                        noiseSuppression: true,
                        echoCancellation: false,
                      }}
                      downloadOnSavePress={false}
                      downloadFileExtension="mp3"
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="btn btn-primary w-[300px] text-lg tracking-wider"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </section>
          </form>

          <Toaster />
        </section>
      ) : (
        <form
          onSubmit={handleLogin}
          className="px-20 my-32 pt-10 pb-16 bg-[#1E328F]/15  shadow-2xl flex flex-col items-center justify-center gap-3 rounded-xl  "
        >
          <div className="font-semibold text-2xl text-[#1E328F]  text-center py-5">
            Sign in to your account
          </div>

          <Select
            required
            className="shadow-lg"
            defaultValue={provider}
            onChange={(Choice) => {
              setProvider(Choice.value);
            }}
            options={options}
            placeholder={"Select Provider"}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                width: 240,
                height: 48,
                borderRadius: "6px",
                border: "1px solid #1E328F",
                "&:hover": {
                  border: "1px solid #1E328F",
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
