"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { db } from "@/configs/db";
import { and, eq } from "drizzle-orm";
import { CourseList } from "@/configs/schema";
import CourseBasicInfo from "../_components/CourseBasicInfo";
import { FaRegCopy } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function FinishScreen({ params }) {
  const { user } = useUser();
  const [course, setCourse] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (params?.courseId && user?.primaryEmailAddress?.emailAddress) {
      GetCourse();
    }
  }, [params?.courseId, user]);

  const GetCourse = async () => {
    try {
      const result = await db
        .select()
        .from(CourseList)
        .where(
          and(
            eq(CourseList.courseId, params.courseId),
            eq(CourseList.createdBy, user.primaryEmailAddress.emailAddress)
          )
        );

      if (result.length > 0) {
        setCourse(result[0]);
        console.log("Fetched Course for FinishScreen:", result[0]);
      } else {
        console.warn("No course found for courseId:", params.courseId);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  const goToDashboard = () => {
    console.log("Navigating to dashboard...");
    router.push("/dashboard");
  };

  const copyCourseUrl = async () => {
    const urlSyndicationLink = `${process.env.NEXT_PUBLIC_HOST_NAME}/course/view/${course?.courseId}`;
    try {
      await navigator.clipboard.writeText(courseUrl);
      console.log("Copied course URL:", courseUrl);
    } catch (error) {
      console.error("Error copying URL:", error);
    }
  };

  return (
    <div className="px-10 md:px-20 lg:px-44 my-7">
      <h2 className="text-center font-bold text-2xl my-3 text-primary">
        Tashi Delek! Your Course is Ready
      </h2>

      <CourseBasicInfo course={course} refreshData={GetCourse} />

      <h2 className="mt-3">Course URL:</h2>
      <h2 className="text-center text-gray-400 border p-2 rounded flex gap-5 items-center">
        {course?.courseId
          ? `${process.env.NEXT_PUBLIC_HOST_NAME}/course/view/${course.courseId}`
          : "Loading course URL..."}
        <FaRegCopy className="h-5 w-5 cursor-pointer" onClick={copyCourseUrl} />
      </h2>

      <div className="mt-5 text-center">
        <Button onClick={goToDashboard} className="w-full">
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
