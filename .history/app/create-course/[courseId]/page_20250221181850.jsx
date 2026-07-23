"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Automatically provided by Next.js
import CourseBasicInfo from "./_components/CourseBasicInfo";

function CourseLayout() {
  const { courseId } = useParams(); // Get the courseId from the URL

  const [course, setCourse] = useState(null);

  useEffect(() => {
    console.log(courseId); // Logs the courseId from the URL

    const GetCourse = async () => {
      if (!courseId) {
        console.error("Missing courseId");
        return;
      }

      try {
        const result = await prisma.courseList.findMany({
          where: { courseId },
        });
        console.log(result);
        setCourse(result[0]); // Assuming you're expecting a single course result
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    GetCourse();
  }, [courseId]);

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-10 px-7 md:px-20 lg:px-44">
      <h2 className="font-bold text-center text-2xl">{course.name}</h2>
      <CourseBasicInfo course={course} />
    </div>
  );
}

export default CourseLayout;
