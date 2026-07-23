"use client";
import React, { useEffect, useState } from "react";
import CourseBasicInfo from "@/app/create-course/[courseId]/_components/CourseBasicInfo";
import Header from "@/app/dashboard/_components/Header";
import CourseDetails from "@/app/create-course/[courseId]/_components/CourseDetails";
import ChapterList from "@/app/create-course/[courseId]/_components/ChapterList";
import SideBar from "@/app/dashboard/_components/SideBar";
import ChatBot from "@/components/ChatBot";
import CourseRating from "./_components/CourseRating";


function Course({ params }) {
  const [course, setCourse] = useState();
  const [collapsed, setCollapsed] = useState(false);
  

  useEffect(() => {
    params && GetCourse();
  }, [params]);

  const GetCourse = async () => {
    try {
      const res = await fetch(`/api/courses/${params?.courseId}`);
      if (res.ok) {
        setCourse(await res.json());
      }
    } catch (error) {
      console.error("Failed to load course:", error);
    }
  };
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0B0E14]">
      <div suppressHydrationWarning className="md:block hidden">
        <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>
      <div
        className={`flex min-h-screen flex-1 flex-col transition-all duration-300 ${
          collapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <Header />
        <div className="mx-auto w-full max-w-5xl flex-1 px-4 pb-16 md:px-8">
          <CourseBasicInfo course={course} edit={false} />
          <CourseRating course={course} />
          <CourseDetails course={course} />
          <ChapterList course={course} edit={false} />
        </div>
      </div>
      <ChatBot />
    </div>
  );
}

export default Course;
