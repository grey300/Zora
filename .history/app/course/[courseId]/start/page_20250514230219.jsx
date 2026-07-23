"use client";

import { Chapters, CourseList } from "@/configs/schema";
import { useEffect, useState } from "react";
import { db } from "@/configs/db";
import { eq, and } from "drizzle-orm";
import { useRouter } from "next/navigation";
import ChapterListCard from "./_components/ChapterListCard";
import ChapterContent from "./_components/ChapterContent";
import { Button } from "@/components/ui/button";

export default function CourseStart({ params }) {
  const [course, setCourse] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chapterContent, setChapterContent] = useState(null);
  const courseId = params.courseId;
  const router = useRouter();

  useEffect(() => {
    if (courseId) {
      GetCourse();
    }
  }, [courseId]);

  const GetCourse = async () => {
    try {
      const result = await db
        .select()
        .from(CourseList)
        .where(eq(CourseList.courseId, courseId));
      if (result.length > 0) {
        const courseData = result[0];
        setCourse(courseData);
        console.log("Fetched Course:", courseData);
        if (courseData?.courseOutput?.Chapters?.length > 0) {
          setSelectedChapter(courseData.courseOutput.Chapters[0]);
          await GetSelectedChapterContent(0);
        } else {
          console.warn("No chapters found for course:", courseId);
        }
      } else {
        console.warn("No course found for courseId:", courseId);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  const GetSelectedChapterContent = async (chapterId) => {
    try {
      const result = await db
        .select()
        .from(Chapters)
        .where(
          and(
            eq(Chapters.chapterId, chapterId),
            eq(Chapters.courseId, courseId)
          )
        );
      if (result.length > 0) {
        setChapterContent(result[0]);
        console.log("Fetched Chapter Content:", result[0]);
      } else {
        console.warn(
          "No content found for chapterId:",
          chapterId,
          "courseId:",
          courseId
        );
        setChapterContent(null);
      }
    } catch (error) {
      console.error("Error fetching chapter content:", error);
      setChapterContent(null);
    }
  };

  const goToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={goToDashboard}
          className="bg-purple-600 hover:bg-purple-500"
        >
          Go to Dashboard
        </Button>
      </div>
      <div className="fixed md:w-72 hidden md:block h-screen border-r shadow-sm">
        <h2 className="font-medium text-lg bg-primary text-secondary p-4">
          {course?.courseOutput?.CourseName || "Loading..."}
        </h2>
        <div>
          {course?.courseOutput?.Chapters?.length > 0 ? (
            course.courseOutput.Chapters.map((chapter, index) => (
              <div
                key={index}
                className={`cursor-pointer hover:bg-purple-50 ${
                  selectedChapter?.ChapterName === chapter?.ChapterName
                    ? "bg-purple-100"
                    : ""
                }`}
                onClick={() => {
                  setSelectedChapter(chapter);
                  GetSelectedChapterContent(index);
                }}
              >
                <ChapterListCard chapter={chapter} index={index} />
              </div>
            ))
          ) : (
            <p className="p-4 text-gray-500">No chapters available</p>
          )}
        </div>
      </div>
      <div className="md:ml-72">
        {selectedChapter && chapterContent ? (
          <ChapterContent chapter={selectedChapter} content={chapterContent} />
        ) : (
          <div className="p-10">
            <p className="text-gray-500">
              {course ? "No chapter content available" : "Loading course..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
