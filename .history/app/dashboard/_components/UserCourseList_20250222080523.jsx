"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/configs/db";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { CourseList } from "@/configs/schema";
import CourseCard from "./CourseCard";

function UserCourseList() {
  const { user, isLoaded } = useUser();
  const [courseList, setCourseList] = useState([]);

  // Only make the API call once `user` is available and `isLoaded` is true
  useEffect(() => {
    if (isLoaded && user) {
      getUserCourses();
    }
  }, [isLoaded, user]);

  const getUserCourses = async () => {
    const result = await db
      .select()
      .from(CourseList)
      .where(eq(CourseList.createdBy, user?.primaryEmailAddress?.emailAddress));
    setCourseList(result);
  };

  // Display loading state if user data is not loaded
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

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
