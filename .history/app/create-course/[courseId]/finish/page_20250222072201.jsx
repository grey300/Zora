"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { db } from "@/configs/db";
import { and, eq } from "drizzle-orm";
import CourseBasicInfo from "../_components/CourseBasicInfo";
import { CourseList } from "@/configs/schema";

function FinishScreen({ params }) {
  const { user } = useUser();
  const [course, setCourse] = useState([]);
  const router = useRouter();

  useEffect(() => {
    params && GetCourse();
  }, [params, user]);

  const GetCourse = async () => {
    const result = await db
      .select()
      .from(CourseList)
      .where(
        and(
          eq(CourseList.courseId, params?.courseId),
          eq(CourseList?.createdBy, user?.primaryEmailAddress?.emailAddress)
        )
      );
    setCourse(result[0]);
    console.log(result);
  };
  return (
    <div className="px-10 md:px-20 lg:px-44 my-7">
      <h2 className="text-center font-bold text-2xl my-3 text-primary">
        Tashi Delek! Your Course is Ready
      </h2>
      <h2>{process.env.NEXT_PUBLIC_HOST_NAME}</h2>
      <CourseBasicInfo course={course} refreshData={() => console.log()} />
    </div>
  );
}

export default FinishScreen;
