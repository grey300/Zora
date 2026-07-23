import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

const UserButton = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.UserButton),
  { ssr: false }
);

const Header = () => {
  return (
    <div className="flex justify-between items-center p-7 shadow-sm">
      <Image src={"/Zora(Si).png"} width={30} height={30} alt="Logo" />
      <UserButton />
    </div>
  );
};

export default Header;
