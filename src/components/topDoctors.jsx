"use client";
import { Star } from "../../public/icons";
import DoctorSlider from "./doctorSlider";
import { useSelector } from "react-redux";

const TopDoctors = () => {
  const currentScreen = useSelector((state) => state.screen[0]);

  return (
    <>
      {currentScreen === 1 ? (
        <section className="relative mb-40 mt-10 bg-slate-100 rounded h-[550px] w-full grid grid-cols-2 max-md:grid-cols-1 max-md:gap-10 max-md:h-fit py-5">
          <div className="col-span-1 flex items-center justify-center">
            <div className="flex flex-col items-start justify-center gap-5 max-md:h-[250px] max-md:items-center">
              <div className="text-2xl font-semibold text-[#1E328F] max-md:text-center">
                Top-rated doctors across all specialities
              </div>
              <div className="text-md text-center">
                90% of patients gave these doctors 5 stars
                <br />
                <br />
                <div className="rating gap-1">
                  {[1, 2, 3, 4, 5].map((_, index) => (
                    <Star key={index} className="mask mask-star bg-red-600" />
                  ))}
                </div>
              </div>
              <div className="btn btn-primary shadow-lg btn-outline text-lg md:text-md max-w-xs md:max-w-full h-auto -mt-6">
                See more highly-recommended doctors
              </div>
            </div>
          </div>
          <div className="col-span-1 !h-full max-md:pb-10 max-md:-mt-20">
            <DoctorSlider />
          </div>
        </section>
      ) : null}
    </>
  );
};

export default TopDoctors;
