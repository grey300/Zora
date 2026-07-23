import React from "react";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";

function Course({ params }) {
  const GetCourse = async () => {
    const result = await db.select().from(CategoryList);
  };
  return <div> Course</div>;
}

export default Course;
