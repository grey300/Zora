"use client";
import React from "react";
import Header from "../dashboard/_components/Header";
import { UserInputContext } from "../_context/UserInputContext";
import SideBar from "../dashboard/_components/SideBar";
import ChatBot from "@/components/ChatBot";
import { useState } from "react";

function CreateCourseLayout({ children }) {
  const [userCourseInput, setUserCourseInput] = React.useState([]);
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <div suppressHydrationWarning>

      <div suppressHydrationWarning className="md:block hidden">
        <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div className={`flex flex-col flex-1 transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"}`}>
        <UserInputContext.Provider value={{ userCourseInput, setUserCourseInput }}>
        <>
          <Header suppressHydrationWarning />

          <div className="pl-20 pr-20 pt-5"> {children} </div>
        
        </>
      </UserInputContext.Provider>
      </div>

            <ChatBot />

    </div>
  );
}

export default CreateCourseLayout;
