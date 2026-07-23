"use client";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import React, { useEffect, useState } from "react";
import CourseCard from "../_components/CourseCard";
import { Button } from "@/components/ui/button";

function Explore() {
  const [courseList, setCourseList] = useState([]);

  useEffect(() => {
    GetAllCourse();
  }, []);

  const GetAllCourse = async () => {
    const result = await db.select().from(CourseList).limit(9).offset(0);
    setCourseList(result);
    console.log("Courses received:", result);
  };

  return (
    <div>
      <h2 className="font-bold text-3xl">Explore More Projects</h2>
      <p>Explore more projects built with AI by other users</p>

      <div className="grid gird-cols-2 lg:grid-cols-3 gap-5">
        {courseList?.map((course, index) => (
          <div key={index}>
            <CourseCard course={course} displayUser={true} />
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <Button>Next Page</Button>
        <Button>Previous Page</Button>
      </div>
    </div>
  );
}

export default Explore;
