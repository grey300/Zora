"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/configs/db";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { CourseList } from "@/configs/schema";

function UserCourseList() {
  const { user } = useUser();
  const [courseList, setCourseList] = useState([]);
  useEffect(() => {
    if (user) {
      getUserCourses();
    }
  }, [user]);

  const getUserCourses = async () => {
    const result = await db
      .select()
      .from(CourseList)
      .where(eq(CourseList.createdBy, user?.primaryEmailAddress?.emailAddress));
    console.log(result);
  };

  return <div>UserCourseList</div>;
}

export default UserCourseList;
