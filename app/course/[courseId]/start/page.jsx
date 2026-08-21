"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ChapterContent from "./_components/ChapterContent";
import TutorChat from "./_components/TutorChat";
import { cn } from "@/lib/utils";

export default function CourseStart({ params }) {
  const [course, setCourse] = useState(null);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [chapterContent, setChapterContent] = useState(null);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
  const [isLoadingChapter, setIsLoadingChapter] = useState(false);
  const [mobileListOpen, setMobileListOpen] = useState(false);

  const router = useRouter();
  const chapters = course?.courseOutput?.Chapters || [];
  const selectedChapter = chapters[chapterIndex] || null;

  useEffect(() => {
    if (params?.courseId) GetCourse();
  }, [params?.courseId]);

  const GetCourse = async () => {
    try {
      setIsLoadingCourse(true);
      const res = await fetch(`/api/courses/${params.courseId}`);
      if (res.ok) {
        const courseData = await res.json();
        setCourse(courseData);
        if (courseData?.courseOutput?.Chapters?.length > 0) {
          await loadChapter(0);
        }
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setIsLoadingCourse(false);
    }
  };

  // Load a chapter's content by its INDEX (matches how chapters are stored).
  const loadChapter = async (index) => {
    setChapterIndex(index);
    setMobileListOpen(false);
    try {
      setIsLoadingChapter(true);
      const res = await fetch(
        `/api/courses/${params.courseId}/chapters?chapterId=${index}`
      );
      setChapterContent(res.ok ? await res.json() : null);
    } catch (error) {
      console.error("Error fetching chapter content:", error);
      setChapterContent(null);
    } finally {
      setIsLoadingChapter(false);
    }
  };

  const goTo = async (index) => {
    if (index < 0) return;
    if (index >= chapters.length) {
      router.push(`/course/${params.courseId}`);
      return;
    }
    await loadChapter(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const ChapterListPanel = (
    <nav className="space-y-1 p-3">
      {chapters.map((chapter, index) => (
        <button
          key={index}
          onClick={() => goTo(index)}
          className={cn(
            "flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition",
            index === chapterIndex
              ? "bg-green-50 dark:bg-green-500/15"
              : "hover:bg-gray-100 dark:hover:bg-gray-800/60"
          )}
        >
          <span
            className={cn(
              "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
              index === chapterIndex
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            )}
          >
            {index + 1}
          </span>
          <span className="min-w-0">
            <span
              className={cn(
                "block text-sm font-medium leading-snug",
                index === chapterIndex
                  ? "text-green-600 dark:text-green-300"
                  : "text-gray-800 dark:text-gray-200"
              )}
            >
              {chapter.ChapterName}
            </span>
            <span className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
              <Clock size={12} />
              {chapter.Duration}
            </span>
          </span>
        </button>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-[#0B0E14]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-[#0B0E14]">
        <Link
          href={`/course/${params?.courseId}`}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Back to course</span>
        </Link>
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-sm font-semibold">
            {course?.courseOutput?.CourseName || "Loading…"}
          </p>
          {chapters.length > 0 && (
            <p className="text-xs text-gray-400">
              Chapter {chapterIndex + 1} of {chapters.length}
            </p>
          )}
        </div>
        {/* Mobile chapter list toggle */}
        <button
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:invisible"
          onClick={() => setMobileListOpen(true)}
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Progress bar under the top bar */}
      {chapters.length > 0 && (
        <div className="h-1 w-full bg-gray-200 dark:bg-gray-800">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{
              width: `${((chapterIndex + 1) / chapters.length) * 100}%`,
            }}
          />
        </div>
      )}

      <div className="flex flex-1">
        {/* Desktop chapter list */}
        <aside className="sticky top-[57px] hidden h-[calc(100vh-61px)] w-80 shrink-0 overflow-y-auto border-r border-gray-200 dark:border-gray-800 lg:block">
          {ChapterListPanel}
        </aside>

        {/* Mobile chapter drawer */}
        {mobileListOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setMobileListOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] overflow-y-auto bg-white dark:bg-[#0B0E14]">
              <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
                <p className="font-semibold">Chapters</p>
                <button onClick={() => setMobileListOpen(false)}>
                  <X size={18} />
                </button>
              </div>
              {ChapterListPanel}
            </div>
          </div>
        )}

        {/* Content */}
        <main className="min-w-0 flex-1">
          {isLoadingCourse || isLoadingChapter ? (
            <div className="flex min-h-[60vh] items-center justify-center gap-2 text-gray-400">
              <Loader2 className="h-6 w-6 animate-spin text-green-500" />
              {isLoadingCourse ? "Loading course…" : "Loading chapter…"}
            </div>
          ) : selectedChapter && chapterContent ? (
            <>
              <ChapterContent
                chapter={selectedChapter}
                content={chapterContent}
              />
              {/* Prev / Next inline at the end of the content */}
              <div className="mx-auto flex max-w-3xl items-center justify-between px-4 pb-16 md:px-6">
                <Button
                  variant="outline"
                  disabled={chapterIndex === 0}
                  onClick={() => goTo(chapterIndex - 1)}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>
                <Button onClick={() => goTo(chapterIndex + 1)}>
                  {chapterIndex >= chapters.length - 1
                    ? "Finish Course"
                    : "Next Chapter"}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex min-h-[60vh] items-center justify-center px-6 text-center text-gray-400">
              {course
                ? "No content generated for this chapter yet. Open the course editor and generate the course content."
                : "Course not found."}
            </div>
          )}
        </main>
      </div>

      <TutorChat
        courseName={course?.courseOutput?.CourseName || course?.name}
        chapter={selectedChapter}
        content={chapterContent}
      />
    </div>
  );
}
