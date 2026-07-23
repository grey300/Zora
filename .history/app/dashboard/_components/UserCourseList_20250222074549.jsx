"use client";
import React, { useEffect } from "react";

function UserCourseList() {
  const { user } = useUser();

  useEffect(() => {
    user && getUserCourses();
  }, [user]);

  const getUserCourses = async () => {
    const result = await db
      .select()
      .from(CourseList)
      .where(
        eq(CourseList?.createdBy, user?.primaryEmailAddress?.emailAddress)
      );
    console.log(result);
  };
  return <div>UserCourseList</div>;
}

export default UserCourseList;
