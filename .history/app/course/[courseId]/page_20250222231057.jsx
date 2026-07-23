"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import { eq } from "drizzle-orm";
import CourseBasicInfo from "@/app/create-course/[courseId]/_components/CourseBasicInfo";
import Header from "@/app/dashboard/_components/Header";
import CourseDetails from "@/app/create-course/[courseId]/_components/CourseDetails";
import ChapterList from "@/app/create-course/[courseId]/_components/ChapterList";

function Course({ params }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use React.use() to unwrap the params
  const courseId = React.use(params?.courseId);

  useEffect(() => {
    if (courseId) {
      GetCourse();
    }
  }, [courseId]);

  const GetCourse = async () => {
    const result = await db
      .select()
      .from(CourseList)
      .where(eq(CourseList?.courseId, courseId));
    setCourse(result[0]);
    setLoading(false);
  };

  return (
    <div>
      <Header />
      <div className="px-10 p-10 md:px-10 lg:px-44">
        {loading ? (
          <div className="h-24 w-full mb-4 bg-gray-200 animate-pulse rounded-md"></div>
        ) : (
          <CourseBasicInfo course={course} edit={false} />
        )}
        {loading ? (
          <div className="h-40 w-full mb-4 bg-gray-200 animate-pulse rounded-md"></div>
        ) : (
          <CourseDetails course={course} />
        )}
        {loading ? (
          <div className="h-60 w-full bg-gray-200 animate-pulse rounded-md"></div>
        ) : (
          <ChapterList course={course} edit={false} />
        )}
      </div>
    </div>
  );
}

export default Course;
