"use client";
import React from "react";
import Image from "next/image";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineQuiz } from "react-icons/md";
import { PiBooksBold } from "react-icons/pi";
import { TbLogout2 } from "react-icons/tb";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ChatBot from "../../components/ChatBot";

function SideBar() {
  const Menu = [
    {
      id: 1,
      name: "Home",
      icon: <IoHomeOutline />,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Explore",
      icon: <PiBooksBold />,
      path: "/dashboard/explore",
    },
    {
      id: 3,
      name: "Quiz",
      icon: <MdOutlineQuiz />,
      path: "/dashboard/quiz",
    },
    {
      id: 4,
      name: "Logout",
      icon: <TbLogout2 />,
      path: "/dashboard/logout",
    },
  ];
  const path = usePathname();
  return (
    <div className="fixed h-full md:w-64 p-5 shadow-md">
      <Image src={"/ZoraF.png"} width={140} height={90} alt="logo" />
      <hr className="my-4" />
      <ul>
        {Menu.map((item) => (
          <Link key={item.id} href={item.path}>
            <div
              className={`flex items-center gap-2 text-gray-600 p-4 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg  mb-2 ${
                item.path === path && "bg-gray-100 text-black"
              }`}
            >
              <div className="text-2xl">{item.icon}</div>
              <h2>{item.name}</h2>
            </div>
          </Link>
        ))}
      </ul>

      {/* <div className="absolute bottom-10 w-[80%] ">
        <Progress value={33} />
        <h2 className="text-sm my-2">3 out of 10 created</h2>
        <h2 className="text-xs text-gray-500">
          Upgrade your plan for unlimited generation
        </h2>
      </div> */}
      <ChatBot />
    </div>
  );
}

export default SideBar;
