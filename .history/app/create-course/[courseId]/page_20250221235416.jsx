"use client";
import { CourseList } from "@/configs/schema";
import React, { useEffect } from "react";
import { and, eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { useUser } from "@clerk/nextjs";

function CourseLayout({ params }) {
  const { user } = useUser();
  const [course, setCourse] = useState([]);
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
    console.log(result);
  };

  return <div>CourseLayout</div>;
}

export default CourseLayout;
