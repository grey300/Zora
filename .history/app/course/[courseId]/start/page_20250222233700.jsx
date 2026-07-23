"use client";
import { CourseList } from "@/configs/schema";
import React, { useEffect } from "react";
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
  return <div>CourseStart</div>;
}

export default CourseStart;
