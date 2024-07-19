"use client";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { removeCombinedData } from "@/Redux/combinedDataSlice";
import { removeMap } from "@/Redux/mapSlice";
import { removePatient } from "@/Redux/patientSlice";
import { removeProvidersData } from "@/Redux/providersDataSlice";
import { removeProvidersId } from "@/Redux/providersIdSlice";
import { addScreen } from "@/Redux/screenSlice";
import { removeSelectedProvider } from "@/Redux/selectedProviderSlice";
import { removeSlotsData } from "@/Redux/slotsDataSlice";

const HomeLink = ({ children }) => {
  const dispatch = useDispatch();
  return (
    <Link
      href={"/"}
      onClick={() => {
        dispatch(addScreen(1));
        dispatch(removePatient());
        dispatch(removeProvidersId());
        dispatch(removeProvidersData());
        dispatch(removeSlotsData());
        dispatch(removeCombinedData());
        dispatch(removeSelectedProvider());
        dispatch(removeMap());
      }}
      style={{ display: "block", width: "100%" }}
    >
      {children}
    </Link>
  );
};

export default HomeLink;
