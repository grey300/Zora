"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CourseBasicInfo from "../_components/CourseBasicInfo";
import { FaRegCopy } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function FinishScreen({ params }) {
  const [course, setCourse] = useState(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (params?.courseId) {
      GetCourse();
    }
  }, [params?.courseId]);

  const GetCourse = async () => {
    try {
      const res = await fetch(`/api/courses/${params.courseId}?mine=1`);
      if (res.ok) {
        setCourse(await res.json());
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  const courseUrl = course?.courseId
    ? `${window.location.origin}/course/${course.courseId}`
    : "";

  const copyCourseUrl = async () => {
    if (!courseUrl) return;
    try {
      await navigator.clipboard.writeText(courseUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying URL:", error);
    }
  };

  return (
    <div className="mx-auto my-10 max-w-4xl px-4 md:px-8">
      <div className="text-center">
        <span className="text-4xl">🎉</span>
        <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
          Tashi Delek! Your Course is Ready
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          It&apos;s private for now — publish it below to share it in Explore.
        </p>
      </div>

      <CourseBasicInfo course={course} refreshData={GetCourse} />

      <div className="mt-5">
        <p className="mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
          Course link
        </p>
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-[#11151D]">
          <span className="min-w-0 flex-1 truncate text-sm text-gray-500 dark:text-gray-400">
            {courseUrl || "Loading course URL..."}
          </span>
          <button
            onClick={copyCourseUrl}
            className="shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            title="Copy link"
          >
            <FaRegCopy className="h-4 w-4" />
          </button>
          {copied && (
            <span className="shrink-0 text-xs font-medium text-emerald-500">
              Copied!
            </span>
          )}
        </div>
      </div>

      <div className="mt-6">
        <Button onClick={() => router.push("/dashboard")} className="w-full">
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
