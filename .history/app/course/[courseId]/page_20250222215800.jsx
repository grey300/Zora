"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import { eq } from "drizzle-orm";
import CourseBasicInfo from "@/app/create-course/[courseId]/_components/CourseBasicInfo";
import Header from "@/app/dashboard/_components/Header";
import CourseDetails from "@/app/create-course/[courseId]/_components/CourseDetails";
import ChapterList from "@/app/create-course/[courseId]/_components/ChapterList";
import Skeleton from "@/components/ui/skeleton";

function Course({ params }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params) {
      GetCourse();
    }
  }, [params]);

  const GetCourse = async () => {
    const result = await db
      .select()
      .from(CourseList)
      .where(eq(CourseList?.courseId, params?.courseId));
    setCourse(result[0]);
    setLoading(false);
  };

  return (
    <div>
      <Header />
      <div className="px-10 p-10 md:px-10 lg:px-44">
        {loading ? (
          <Skeleton className="h-24 w-full mb-4" />
        ) : (
          <CourseBasicInfo course={course} edit={false} />
        )}
        {loading ? (
          <Skeleton className="h-40 w-full mb-4" />
        ) : (
          <CourseDetails course={course} />
        )}
        {loading ? (
          <Skeleton className="h-60 w-full" />
        ) : (
          <ChapterList course={course} edit={false} />
        )}
      </div>
    </div>
  );
}

export default Course;
