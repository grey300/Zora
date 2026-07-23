"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import { eq } from "drizzle-orm";
import CourseBasicInfo from "@/app/create-course/[courseId]/_components/CourseBasicInfo";
import { Header } from "@/app/dashboard/_components/Header";

function Course({ params }) {
  const [course, setCourse] = useState();
  useEffect(() => {
    params && GetCourse();
  }, [params]);

  const GetCourse = async () => {
    const result = await db
      .select()
      .from(CourseList)
      .where(eq(CourseList?.courseId, params?.courseId));
    setCourse(result[0]);
    console.log(result);
  };
  return (
    <div>
      <Header />
      <CourseBasicInfo course={course} />
    </div>
  );
}

export default Course;
