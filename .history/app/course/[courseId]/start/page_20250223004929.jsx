"use client";
import { CourseList } from "@/configs/schema";
import React, { useEffect, useState } from "react";
import { db } from "@/configs/db";
import { eq } from "drizzle-orm";
import ChapterListCard from "./_components/ChapterListCard";
import ChapterContent from "./_components/ChapterContent";

function CourseStart({ params }) {
  const [course, setCourse] = useState();
  const [selectedChapter, setSelectedChapter] = useState({}); // Initialize with empty object
  const courseId = React.use(params).courseId; // Unwrap the params

  useEffect(() => {
    GetCourse();
  }, []);

  const GetCourse = async () => {
    const result = await db
      .select()
      .from(CourseList)
      .where(eq(CourseList?.courseId, courseId)); // Use unwrapped courseId
    setCourse(result[0]);
  };

  const GetSelectedChapterContent = () => {};
  return (
    <div>
      <div className="md:w-72 hidden md:block h-screen border-r shadow-sm">
        <h2 className="font-medium text-lg bg-primary text-secondary p-4">
          {course?.courseOutput?.CourseName}
        </h2>
        <div>
          {course?.courseOutput?.Chapters.map((chapter, index) => (
            <div
              key={index}
              className={`cursor-pointer hover:bg-purple-50 ${
                selectedChapter?.ChapterName === chapter?.ChapterName &&
                "bg-purple-100"
              }`}
              onClick={() => {
                setSelectedChapter(chapter);
                GetSelectedChapterContent();
              }}
            >
              <ChapterListCard chapter={chapter} index={index} />
            </div>
          ))}
        </div>
      </div>
      <div className="md:ml-72">
        <ChapterContent chapter={selectedChapter} />
      </div>
    </div>
  );
}

export default CourseStart;
