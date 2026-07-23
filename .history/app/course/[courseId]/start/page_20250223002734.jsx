"use client";
import { CourseList } from "@/configs/schema";
import React, { useEffect, useState } from "react";
import { db } from "@/configs/db";
import { eq } from "drizzle-orm";
import ChapterListCard from "./_components/ChapterListCard";

function CourseStart({ params }) {
  const [course, setCourse] = useState();
  const [selectedChapter, setSelectedChapter] = useState();
  useEffect(() => {
    GetCourse();
  }, []);

  //Use to get course info from course id
  const GetCourse = async () => {
    const result = await db
      .select()
      .from(CourseList)
      .where(eq(CourseList?.courseId, params?.courseId));
    setCourse(result[0]);
  };

  return (
    <div>
      {/* Chapter list Side Bar */}
      <div className="md:w-72 hidden md:block h-screen border-r shadow-sm">
        <h2 className="font-medium text-lg bg-primary text-secondary p-4">
          {course?.courseOutput?.CourseName}
        </h2>
        <div>
          {course?.courseOutput?.Chapters.map((chapter, index) => (
            <div
              key={index}
              className={`cursor-pointer hover:bg-purple-50 ${
                selectedChapter == chapter?.ChapterName && "bg-purple-100"
              }`}
              onClick={() => setSelectedChapter(chapter)}
            >
              <ChapterListCard chapter={chapter} index={index} />
            </div>
          ))}
        </div>
      </div>
      {/* Content div */}
      <div className="md:ml-64"></div>
    </div>
  );
}
export default CourseStart;
