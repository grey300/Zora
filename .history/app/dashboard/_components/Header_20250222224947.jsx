import React from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
const Header = () => {
  return (
    <div className="flex justify-between items-center p-7 shadow-sm">
      <Image src={"/Zora(Si).png"} width={30} height={30} alt="Logo" />
      <UserButton />
    </div>
  );
};

export default Header;
