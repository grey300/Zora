"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs"; // Using Clerk authentication

function CourseLayout() {
  const { courseId } = useParams(); // Get courseId from the URL
  const { user } = useUser(); // Get user details
  const [course, setCourse] = useState(null);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/course/${courseId}`);
      const data = await response.json();

      if (response.ok) {
        console.log("Fetched Course Data:", data);
        setCourse(data);
      } else {
        console.error("Error fetching course:", data.error);
      }
    } catch (error) {
      console.error("Failed to fetch course:", error);
    }
  };

  return (
    <div className="mt-10 px-7 md:px-20 lg:px-44">
      <h2 className="font-bold text-center text-2xl">Course Layout</h2>

      {/* Basic Info */}
      {/* <CourseBasicInfo course={course} /> */}
      {/* Course Layout */}

      {/* List of Lesson */}
    </div>
  );
}

export default CourseLayout;
