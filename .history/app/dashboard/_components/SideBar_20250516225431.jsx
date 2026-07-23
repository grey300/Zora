"use client";
import React, { useState } from "react";
import Image from "next/image";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineQuiz } from "react-icons/md";
import { PiBooksBold } from "react-icons/pi";
import { TbLogout2 } from "react-icons/tb";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import ChatBot from "../../components/ChatBot";
import { Loader2 } from "lucide-react";

function SideBar() {
  const [isNavigating, setIsNavigating] = useState(false);
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
  const router = useRouter();

  const handleNavigation = async (path) => {
    setIsNavigating(true);
    router.push(path);
    setIsNavigating(false);
  };

  return (
    <div className="fixed h-full md:w-64 p-5 shadow-md">
      <Image src={"/ZoraF.png"} width={140} height={90} alt="logo" />
      <hr className="my-4" />
      <ul>
        {Menu.map((item) => (
          <div
            key={item.id}
            onClick={() => handleNavigation(item.path)}
            className={`flex items-center gap-2 text-gray-600 p-4 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg mb-2 ${
              item.path === path ? "bg-gray-100 text-black" : ""
            } ${isNavigating ? "opacity-50 pointer-events-none" : ""}`}
          >
            <div className="text-2xl">{item.icon}</div>
            <h2>{item.name}</h2>
            {isNavigating && (
              <Loader2 className="ml-2 h-4 w-4 animate-spin text-primary" />
            )}
          </div>
        ))}
      </ul>
      <ChatBot />
    </div>
  );
}

export default SideBar;
