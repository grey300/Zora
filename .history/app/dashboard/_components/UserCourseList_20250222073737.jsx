import React from "react";
import { db } from "@/configs/db";
function UserCourseList() {
  const getUserCourses = async () => {
    const result = await db.select();
  };
  return <div>UserCourseList</div>;
}

export default UserCourseList;
