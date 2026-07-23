import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import React, { useEffect } from "react";

function Explore() {
  useEffect(() => {
    GetAllCourse();
  }, []);

  const GetAllCourse = async () => {
    const result = await db.select().from(CourseList).limit(9).offset(0);
  };

  return <div></div>;
}

export default Explore;
