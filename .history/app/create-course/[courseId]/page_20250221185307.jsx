"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs"; // Assuming you use Clerk for authentication
import prisma from "@/lib/prisma"; // Import Prisma client

function CourseLayout() {
  const { courseId } = useParams(); // Get courseId from the URL
  const { user } = useUser(); // Get user details
  const [course, setCourse] = useState(null);

  useEffect(() => {
    if (courseId && user) {
      GetCourse();
    }
  }, [courseId, user]);

  const GetCourse = async () => {
    if (!courseId || !user?.primaryEmailAddress?.emailAddress) {
      console.error("Missing courseId or user email.");
      return;
    }

    try {
      const result = await prisma.courseList.findMany({
        where: {
          courseId: courseId,
          createdBy: user.primaryEmailAddress.emailAddress,
        },
      });

      console.log("Fetched Course Data:", result[0]); // Logs the fetched object
      setCourse(result[0]); // Store the first course found
    } catch (error) {
      console.error("Error fetching course:", error);
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
