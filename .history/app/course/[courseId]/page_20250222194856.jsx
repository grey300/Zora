import React from "react";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import { eq } from " drizzle-orm";
function Course({ params }) {
  const GetCourse = async () => {
    const result = await db.select().from(CourseList);
  };
  return <div> Course</div>;
}

export default Course;
