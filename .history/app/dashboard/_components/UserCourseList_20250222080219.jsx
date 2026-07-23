"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/configs/db";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { CourseList } from "@/configs/schema";
import CourseCard from "./CourseCard";

function UserCourseList() {
  const { user } = useUser();
  const [courseList, setCourseList] = useState([]);
  const [isMounted, setIsMounted] = useState(false); // Add mount state

  useEffect(() => {
    setIsMounted(true);
    if (user) {
      getUserCourses();
    }
  }, [user]);

  const getUserCourses = async () => {
    const result = await db
      .select()
      .from(CourseList)
      .where(eq(CourseList.createdBy, user?.primaryEmailAddress?.emailAddress));
    setCourseList(result);
  };

  // Show loading state until mounted
  if (!isMounted) return null;

  return (
    <div className="mt-10">
      <h2 className="font-bold text-xl">My AI Courses</h2>
      <div>
        {courseList?.map((course, index) => (
          <CourseCard course={course} key={index} />
        ))}
      </div>
    </div>
  );
}

export default UserCourseList;
