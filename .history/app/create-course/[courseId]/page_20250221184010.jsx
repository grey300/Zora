"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Automatically provided by Next.js
import { useUser } from "@clerk/nextjs";
import prisma from "@/lib/prisma"; // Assuming you have Prisma set up in lib/prisma

function CourseLayout() {
  const { courseId } = useParams(); // Get the courseId from the URL
  const { user } = useUser(); // Get user data from Clerk
  const [course, setCourse] = useState(null);

  useEffect(() => {
    if (courseId && user) {
      GetCourse(); // Fetch course when courseId and user are available
    }
  }, [courseId, user]); // Dependency on courseId and user

  // Function to fetch the course using Prisma
  const GetCourse = async () => {
    if (!courseId || !user?.primaryEmailAddress?.emailAddress) {
      console.error("Missing courseId or user email");
      return;
    }

    try {
      // Prisma query to get the course data
      const result = await prisma.courseList.findMany({
        where: {
          courseId: courseId, // Match courseId from params
          createdBy: user.primaryEmailAddress.emailAddress, // Match createdBy field from user email
        },
      });

      console.log("Fetched course data:", result); // Log the result in the console

      if (result.length > 0) {
        setCourse(result[0]); // Set the first result (assuming it's a single course)
      } else {
        console.error("No course found with the given parameters");
      }
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
