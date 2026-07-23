"use client";
import React from "react";
import Header from "../dashboard/_components/Header";
import { UserInputContext } from "../_context/UserInputContext";

function CreateCourseLayout({ children }) {
  const [userCourseInput, setUserCourseInput] = React.useState([]);
  return (
    <div suppressHydrationWarning>
      <UserInputContext.Provider
        value={{ userCourseInput, setUserCourseInput }}
      >
        <>
          <Header suppressHydrationWarning />
          {children}
        </>
      </UserInputContext.Provider>
    </div>
  );
}

export default CreateCourseLayout;
