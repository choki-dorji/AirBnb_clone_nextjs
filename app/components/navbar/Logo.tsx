"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import React from "react";

const Logo = () => {
  return (
    <Image
      alt="logo"
      src="/images/air.png"
      height="100"
      width="100"
      className="hidden md:block cursor-pointer"
    />
  );
};

export default Logo;
