"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import prisma from "@/lib/prisma";

function CourseLayout() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    console.log("courseId:", courseId);

    const GetCourse = async () => {
      if (!courseId) {
        console.error("Missing courseId");
        return;
      }

      try {
        const result = await prisma.courseList.findMany({
          where: { courseId },
        });

        if (result.length > 0) {
          console.log("Fetched course data:", result[0]);
          setCourse(result[0]);
          console.error("No course found with the given courseId");
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    GetCourse();
  }, [courseId]);

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
