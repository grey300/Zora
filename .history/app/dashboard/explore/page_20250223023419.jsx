"use client";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import React, { useEffect } from "react";

function Explore() {
  const [courseList, setCourseList] = useState([]);
  useEffect(() => {
    GetAllCourse();
  }, []);

  const GetAllCourse = async () => {
    const result = await db.select().from(CourseList).limit(9).offset(0);
    console.log(result);
  };

  return (
    <div>
      <h2 className="font-bold text-3xl">Explore More Projects</h2>
      <p>Explore more project build with AI by other users</p>
    </div>
  );
}

export default Explore;
