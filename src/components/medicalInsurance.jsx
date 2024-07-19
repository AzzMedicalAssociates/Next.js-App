import Link from "next/link";
import { RightArrow } from "../../public/icons";
import { insuranceImages } from "@/constants/dummyData";

const MedicalInsurance = () => {
  return (
    <div className="flex flex-col gap-4 pt-20 px-4 sm:px-10">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-900">
          Get AZZ Medical Insurance Plan For better Healthy Life.
        </h1>
        <p className="text-base sm:text-lg text-gray-700">
          Add your insurance to see in-network primary care doctors.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {insuranceImages.map((imageUrl, index) => (
          <div
            key={index}
            className="card bg-base-100 w-40 sm:w-60 border border-black"
          >
            <div className="px-4 sm:px-10">
              <img
                src={imageUrl}
                alt={`Insurance Logo ${index}`}
                className="w-full h-auto"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center sm:justify-end">
        <Link href={"/locations"} target="_blank" passHref>
          <div className="btn btn-outline btn-primary border-2 border-solid hover:bg-gray-200 hover:border-gray-400 cursor-pointer">
            <p className="px-4 flex items-center">
              Search by Map
              <RightArrow />
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default MedicalInsurance;
