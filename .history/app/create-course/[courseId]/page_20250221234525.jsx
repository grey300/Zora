"use client";
import React, { useEffect } from "react";

function CourseLayout({ params }) {
  useEffect(() => {
    console.log(params);
  }, [params]);

  const GetCourse = () => {
    const result = await db.select().from(CourseList)
  };

  return <div>CourseLayout</div>;
}

export default CourseLayout;
