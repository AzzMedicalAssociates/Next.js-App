"use client";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../public/logo.png";
import HomeLink from "./homeLink";
import { Facebook, Instagram, Youtube, Linkedin } from "../../public/icons";

const Footer = () => {
  let date = new Date();
  let dateYear = date.getFullYear();
  return (
    <footer className="bg-[#1E328F] w-full text-white flex flex-col items-center gap-2 p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between w-full mt-1">
        <div className="flex items-center justify-center mb-2 sm:mb-0">
          <HomeLink href={"/"}>
            <Image
              src={Logo}
              width={100}
              height={"auto"}
              alt="footer-logo"
              className="bg-white p-2 rounded"
            />
          </HomeLink>
        </div>
        <div className="flex items-center justify-center gap-5">
          <Link
            href={"https://www.facebook.com/azzmedicalofficial"}
            target="_blank"
          >
            <Facebook />
          </Link>
          <Link href={"https://www.instagram.com/azzmedical/"} target="_blank">
            <Instagram />
          </Link>
          <Link
            href={"https://www.linkedin.com/in/azz-medical-associates/"}
            target="_blank"
          >
            <Linkedin />
          </Link>
          <Link
            href={"https://www.youtube.com/@azzmedicalassociates"}
            target="_blank"
          >
            <Youtube />
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center text-center w-full pb-4">
        © Copyright {dateYear} | All Rights Reserved | Powered By Theo
        Healthcare
      </div>
    </footer>
  );
};

export default Footer;
