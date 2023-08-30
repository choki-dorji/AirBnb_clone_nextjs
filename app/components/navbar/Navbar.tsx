"use client";
import React from "react";
import Logo from "./Logo";
import Container from "../Container";
import Search from "./Search";
import UserMenu from "./UserMenu";
import { safeuser } from "@/app/types";
import Categories from "./Categories";
interface navbarprops {
  currentuser?: safeuser | null;
}

const Navbar: React.FC<navbarprops> = ({ currentuser }) => {
  // console.log(currentuser);
  console.log(process.env.NEXT_PUBLIC_DATABASE_URL);
  return (
    <div className="fixed w-full bg-white z-10 shadow-sm">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
            <Logo />
            <Search />
            <UserMenu currentuser={currentuser} />
          </div>
        </Container>
      </div>
      <Categories />
    </div>
  );
};

export default Navbar;
