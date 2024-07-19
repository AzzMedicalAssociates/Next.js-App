"use client";
import { useSelector } from "react-redux";
import Home from "@/pages/Home";
import Screen6 from "@/pages/Screen6";
import Providers from "./providers";
import ProviderProfile from "./providerProfile";
import UserDetailPage from "./userDetailPage";
import Verification from "@/pages/verification";
const Main = () => {
  const currentScreen = useSelector((state) => state.screen[0]);

  return (
    <div className="flex items-center justify-center">
      {currentScreen === 1 && (
        <div>
          <Home />
        </div>
      )}
      {currentScreen === 2 && (
        <div className="flex items-center justify-center h-fit ">
          <Providers />
        </div>
      )}
      {currentScreen === 3 && (
        <div className="flex items-center justify-center max-w-[1200px]">
          <ProviderProfile />
        </div>
      )}
      {currentScreen === 4 && (
        <div className="flex items-center justify-center max-w-[1200px]">
          <UserDetailPage />
        </div>
      )}
      {currentScreen === 5 && (
        <div className="flex items-center justify-center max-w-[1200px]">
          <Verification />
        </div>
      )}
      {currentScreen === 6 && (
        <div className="flex items-center justify-center max-w-[1200px]">
          <Screen6 />
        </div>
      )}
    </div>
  );
};

export default Main;
