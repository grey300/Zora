import React, { useEffect } from "react";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import { eq } from "drizzle-orm";

function Course({ params }) {
  useEffect(() => {}, []);
  const GetCourse = async () => {
    const result = await db
      .select()
      .from(CourseList)
      .where(eq(CourseList?.courseId, params?.courseId));

    console.log(result);
  };
  return <div> Course</div>;
}

export default Course;
