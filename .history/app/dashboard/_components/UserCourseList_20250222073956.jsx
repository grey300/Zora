import React from "react";
import { db } from "@/configs/db";
import { useUser } from "@clerk/nextjs";
import { CourseList } from "@/configs/schema";
import { eq } from "drizzle-orm";
function UserCourseList() {
  const { user } = useUser();
  const getUserCourses = async () => {
    const result = await db
      .select()
      .from(COurseList)
      .where(eq(CourseList?.createdBy));
  };
  return <div>UserCourseList</div>;
}

export default UserCourseList;
