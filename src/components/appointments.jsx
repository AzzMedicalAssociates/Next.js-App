import Image from "next/image";
import Link from "next/link";
import mobile from "../../public/images/mobile.jpg";
import qrcode from "../../public/images/qrcode.png";
import { Appleicone, Arrowdown, Playstore } from "../../public/icons";

const Appointments = () => {
  return (
    <section className="text-gray-600 flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center">
        <h2 className="text-xs font-semibold text-indigo-700 tracking-widest title-font mb-1">
          AZZ APPOINTMENT APP
        </h2>
        <div className="text-center mb-5">
          <h1 className="md:text-3xl text-2xl font-medium title-font text-[#1E328F] mb-5">
            Get the mobile app now.
            <br /> Install it
          </h1>
          <div className="flex justify-center text-[#1E328F]">
            <Arrowdown />
          </div>
        </div>

        <Image
          src={mobile}
          layout="responsive"
          height={100}
          width={100}
          alt="screen"
          style={{ marginBottom: "120px" }}
        />
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center px-5 mx-auto mb-10">
        <h2 className="text-2xl font-bold text-[#1E328F]">
          Thousands of Providers.
          <br /> One app.
        </h2>
        <p className="mb-5">
          The AZZ app is the quickest, <br />
          easiest way to book and <br />
          keep track of your appointments.
        </p>
        <p className="text-lg font-semibold">
          Scan the QR code to get the app now
        </p>
        <Image
          src={qrcode}
          height={"100"}
          width={100}
          alt="qrcode"
          style={{ marginTop: "20px" }}
        />
        <div className="flex flex-row justify-center items-center gap-5 mt-5">
          <Link
            href={
              "https://play.google.com/store/apps/details?id=com.azzmedical.azzmedical"
            }
            target="_blank"
            className="btn btn-primary text-lg font-semibold text-white shadow-xl"
          >
            <Playstore />
            <span className="ml-3 flex items-start flex-col leading-none">
              <span className="text-xs text-white mb-1">GET IT ON</span>
              <span className="title-font font-medium">Google Play</span>
            </span>
          </Link>
          <Link
            href={
              "https://apps.apple.com/pk/app/azz-medical-associtaes/id6477295158"
            }
            target="_blank"
            className="btn btn-primary text-lg font-semibold text-white shadow-xl"
          >
            <Appleicone />
            <div className="ml-4 flex items-start flex-col leading-none">
              <span className="text-xs text-white mb-1">GET IT ON</span>
              <span className="title-font font-medium">Apple Store</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Appointments;
