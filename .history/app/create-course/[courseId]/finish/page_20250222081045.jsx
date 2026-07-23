"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { db } from "@/configs/db";
import { and, eq } from "drizzle-orm";
import CourseBasicInfo from "../_components/CourseBasicInfo";
import { CourseList } from "@/configs/schema";
import { FaRegCopy } from "react-icons/fa";

function FinishScreen({ params }) {
  const { user } = useUser();
  const [course, setCourse] = useState(null); // Initially set to null to check if the course is loaded
  const router = useRouter();

  // Use router.query to extract courseId from URL if params are not provided
  const { courseId } = router.query;

  useEffect(() => {
    if (courseId && user) {
      GetCourse();
    }
  }, [courseId, user]); // Only run when courseId or user changes

  const GetCourse = async () => {
    try {
      const result = await db
        .select()
        .from(CourseList)
        .where(
          and(
            eq(CourseList.courseId, courseId), // Use courseId from URL query
            eq(CourseList.createdBy, user?.primaryEmailAddress?.emailAddress)
          )
        );

      if (result.length > 0) {
        setCourse(result[0]);
      } else {
        console.error("Course not found");
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  return (
    <div className="px-10 md:px-20 lg:px-44 my-7">
      <h2 className="text-center font-bold text-2xl my-3 text-primary">
        Tashi Delek! Your Course is Ready
      </h2>

      {course ? (
        <>
          <CourseBasicInfo course={course} refreshData={() => console.log()} />

          <h2 className="mt-3">Course URL: </h2>
          <h2 className="text-center text-gray-400 border p-2 round flex gap-5 items-center">
            {process.env.NEXT_PUBLIC_HOST_NAME}/course/view/{course?.courseId}
            <FaRegCopy
              className="h-5 w-5 cursor-pointer"
              onClick={async () =>
                await navigator.clipboard.writeText(
                  process.env.NEXT_PUBLIC_HOST_NAME +
                    "/course/view/" +
                    course?.courseId
                )
              }
            />
          </h2>
        </>
      ) : (
        <p>Loading course...</p>
      )}
    </div>
  );
}

export default FinishScreen;
