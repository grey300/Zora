"use client";

import { Chapters, CourseList } from "@/configs/schema";
import { useEffect, useState } from "react";
import { db } from "@/configs/db";
import { eq, and } from "drizzle-orm";
import { useRouter } from "next/navigation";
import ChapterListCard from "./_components/ChapterListCard";
import ChapterContent from "./_components/ChapterContent";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function CourseStart({ params }) {
  const [course, setCourse] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chapterContent, setChapterContent] = useState(null);
  const [isLoadingCourse, setIsLoadingCourse] = useState(false);
  const [isLoadingChapter, setIsLoadingChapter] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const courseId = params.courseId;
  const router = useRouter();

  useEffect(() => {
    if (courseId) {
      GetCourse();
    }
  }, [courseId]);

  const GetCourse = async () => {
    try {
      setIsLoadingCourse(true);
      const result = await db
        .select()
        .from(CourseList)
        .where(eq(CourseList.courseId, courseId));
      if (result.length > 0) {
        const courseData = result[0];
        setCourse(courseData);
        if (courseData?.courseOutput?.Chapters?.length > 0) {
          setSelectedChapter(courseData.courseOutput.Chapters[0]);
          await GetSelectedChapterContent(0);
        }
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setIsLoadingCourse(false);
    }
  };

  const GetSelectedChapterContent = async (chapterId) => {
    try {
      setIsLoadingChapter(true);
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
      } else {
        setChapterContent(null);
      }
    } catch (error) {
      console.error("Error fetching chapter content:", error);
      setChapterContent(null);
    } finally {
      setIsLoadingChapter(false);
    }
  };

  const goToDashboard = () => {
    setIsNavigating(true);
    router.push("/dashboard");
  };

  const goToNextChapter = async () => {
    if (!isLoadingChapter && course && selectedChapter) {
      const currentIndex = course.courseOutput.Chapters.findIndex(
        (ch) => ch.ChapterName === selectedChapter.ChapterName
      );
      if (
        currentIndex !== -1 &&
        currentIndex < course.courseOutput.Chapters.length - 1
      ) {
        const nextChapter = course.courseOutput.Chapters[currentIndex + 1];
        setSelectedChapter(nextChapter);
        await GetSelectedChapterContent(currentIndex + 1);
      }
    }
  };

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={goToDashboard}
          className="bg-primary"
          disabled={isNavigating}
        >
          {isNavigating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Navigating...
            </>
          ) : (
            "Go to Dashboard"
          )}
        </Button>
      </div>

      <div className="fixed bottom-4 right-4 z-10">
        <Button onClick={goToNextChapter} className="bg-primary">
          Next Chapter
        </Button>
      </div>

      <div className="fixed md:w-72 hidden md:block h-screen border-r shadow-sm">
        <h2 className="font-medium text-lg bg-primary text-secondary p-4">
          {course?.courseOutput?.CourseName || "Loading..."}
        </h2>
      </div>

      <div className="md:ml-72">
        {isLoadingChapter ? (
          <div className="p-10 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading chapter content...</span>
          </div>
        ) : selectedChapter && chapterContent ? (
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
