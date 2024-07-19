"use client";
import { useState, useEffect } from "react";
import Main from "@/pages/Main";
import TopDoctors from "@/components/topDoctors";
import Appointments from "@/components/appointments";

const Page = () => {
  const [deviceType, setDeviceType] = useState("");

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      setDeviceType("android");
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setDeviceType("ios");
    } else if (
      /tablet|ipad|playbook|silk|kindle|android|windows|firefox|mobi/i.test(
        userAgent
      )
    ) {
      setDeviceType("tablet");
    } else if (
      /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Silk|Kindle|Windows Phone/i.test(
        userAgent
      )
    ) {
      setDeviceType("phone");
    } else {
      setDeviceType("desktop");
    }
  }, [deviceType]);

  return (
    <>
      {((deviceType && deviceType === "desktop") ||
        deviceType === "tablet") && (
        <main className="bg-white w-full px-10 overflow-hidden min-h-[700px]">
          <div className="flex flex-col w-full h-full py-20 max-sm:py-10 max-sm:pb-0">
            <Main />
          </div>
          <TopDoctors />
          <Appointments />
        </main>
      )}
    </>
  );
};

export default Page;
