import { CourseList } from "@/configs/schema";
import React from "react";
import { db } from "@/configs/db";
import React from "react";

function CourseStart() {
  const GetCourse = async () => {
    const result = await db
      .select()
      .from(CourseList)
      .where(eq(CourseList?.courseId, params?.courseId));
  };
  return <div>CourseStart</div>;
}

export default CourseStart;
