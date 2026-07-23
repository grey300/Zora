"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Automatically provided by Next.js
import { useUser } from "@clerk/nextjs";
import prisma from "@/lib/prisma"; // Ensure you have prisma imported

function CourseLayout() {
  const { courseId } = useParams(); // Get the courseId from the URL
  const { user } = useUser(); // Get the current user

  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Course ID from URL:", courseId); // Logs the courseId from the URL

    const GetCourse = async () => {
      if (!courseId || !user?.primaryEmailAddress?.emailAddress) {
        setError("Missing courseId or user information");
        return;
      }

      try {
        // Fetch course data based on the courseId and createdBy (email of the user)
        const result = await prisma.courseList.findMany({
          where: {
            courseId,
            createdBy: user.primaryEmailAddress.emailAddress,
          },
        });

        if (result.length > 0) {
          console.log("Fetched course data:", result[0]); // Logs the entire course object
          setCourse(result[0]); // Store the first course (if found)
        } else {
          setError(
            "No course found with the given courseId and createdBy email."
          );
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        setError("Error fetching course.");
      }
    };

    GetCourse();
  }, [courseId, user?.primaryEmailAddress?.emailAddress]);

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
