"use client";
import { CourseList } from "@/configs/schema";
import React, { useEffect, useState } from "react";
import { db } from "@/configs/db";
import { eq } from "drizzle-orm";

function CourseStart({ params }) {
  const [course, setCourse] = useState();
  useEffect(() => {
    GetCourse();
  }, []);

  //Use to get course info from course id
  const GetCourse = async () => {
    const result = await db
      .select()
      .from(CourseList)
      .where(eq(CourseList?.courseId, params?.courseId));
    setCourse(result[0]);
  };

  return (
    <div>
      {/* Chapter list Side Bar */}
      <div className="md:w-64 hidden md:block h-screen bg-blue-50">
        <h2 className="font-medium text-lg bg-primary text-secondary ">
          {course?.courseOutput?.CourseName}
        </h2>
        <div>{course?.courseOutput?.Chapters}</div>
      </div>
      {/* Content div */}
      <div className="md:ml-64"></div>
    </div>
  );
}
export default CourseStart;
