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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getUserCourses();
    }
  }, [user]);

  const getUserCourses = async () => {
    try {
      setIsLoading(true);
      const result = await db
        .select()
        .from(CourseList)
        .where(
          eq(CourseList.createdBy, user?.primaryEmailAddress?.emailAddress)
        );
      setCourseList(result);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-10">
        <h2 className="font-bold text-xl">My AI Courses</h2>
        <div className="mt-4">Loading...</div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="font-bold text-xl">My AI Courses</h2>
      <div className="mt-4">
        {courseList.length === 0 ? (
          <div>No courses found</div>
        ) : (
          courseList.map((course, index) => (
            <CourseCard course={course} key={course.id || index} />
          ))
        )}
      </div>
    </div>
  );
}

export default UserCourseList;
