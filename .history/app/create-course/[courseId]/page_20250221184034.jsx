"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { db } from "@/lib/drizzle"; // Assuming you have Drizzle set up and exported here
import { CourseList } from "@/lib/schema"; // Assuming CourseList is defined in your schema file

function CourseLayout({ params }) {
  const { user } = useUser(); // Get user data from Clerk
  const [course, setCourse] = useState(null);

  useEffect(() => {
    if (params && user) {
      GetCourse(); // Fetch course when params and user are available
    }
  }, [params, user]); // Dependency on params and user

  // Function to fetch the course using Drizzle
  const GetCourse = async () => {
    if (!params?.courseId || !user?.primaryEmailAddress?.emailAddress) {
      console.error("Missing courseId or user email");
      return;
    }

    try {
      // Drizzle query to get the course data
      const result = await db
        .select()
        .from(CourseList)
        .where(
          and(
            eq(CourseList.courseId, params.courseId),
            eq(CourseList.createdBy, user.primaryEmailAddress.emailAddress)
          )
        );

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
