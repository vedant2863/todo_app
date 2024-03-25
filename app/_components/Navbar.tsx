import Image from "next/image";
import React from "react";
import { ModeToggle } from "./theme-toggle";

const Navbar = () => {
  return (
    <nav className="flex justify-around items-center bg-indigo-900 text-white py-2">
      <div className="logo flex">
        <Image src={'/task.gif'} alt="ImgLogo" width={60} height={60}/>
        <span className="font-bold text-xl mx-8">Todo_app</span>
      </div>
      <ul className="flex items-center gap-8 mx-9">
        <li className="cursor-pointer hover:font-bold transition-all">Home</li>
        <li className="cursor-pointer hover:font-bold transition-all">
          <ModeToggle/>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
