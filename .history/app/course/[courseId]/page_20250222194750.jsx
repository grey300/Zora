import React from "react";
import { db } from "@/configs/db";

function Course({ params }) {
  const GetCourse = async () => {
    const result = await db.select().from();
  };
  return <div> Course</div>;
}

export default Course;
