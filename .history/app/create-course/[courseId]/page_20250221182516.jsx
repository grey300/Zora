"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Automatically provided by Next.js
import prisma from "@/lib/prisma"; // Ensure you have prisma imported

function CourseLayout() {
  const { courseId } = useParams(); // Get the courseId from the URL
  const [course, setCourse] = useState(null);

  useEffect(() => {
    console.log("Course ID from URL:", courseId); // Logs the courseId from the URL

    const GetCourse = async () => {
      if (!courseId) {
        console.error("Missing courseId");
        return;
      }

      try {
        // Fetch course data based on the courseId
        const result = await prisma.courseList.findMany({
          where: { courseId },
        });

        if (result.length > 0) {
          console.log("Fetched course data:", result[0]); // Logs the entire course object
          setCourse(result[0]); // Store the first course (if found)
        } else {
          console.error("No course found with the given courseId");
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    GetCourse();
  }, [courseId]);

  if (!course) {
    return <div>Loading...</div>;
  }

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
