"use client";

import { useEffect, useState } from "react";
import CourseBasicInfo from "./_components/CourseBasicInfo";
import CourseDetails from "./_components/CourseDetails";
import ChapterList from "./_components/ChapterList";
import { Button } from "@/components/ui/button";
import LoadingDialog from "../_components/LoadingDialog";
import { useRouter } from "next/navigation";

export default function CourseLayout({ params }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (params?.courseId) {
      GetCourse();
    }
  }, [params?.courseId]);

  const GetCourse = async () => {
    try {
      const res = await fetch(`/api/courses/${params.courseId}?mine=1`);
      if (!res.ok) {
        setError("Course not found or you don't have access to it.");
        return;
      }
      setCourse(await res.json());
    } catch (err) {
      console.error("Error fetching course:", err);
      setError("Failed to load the course. Please refresh.");
    }
  };

  const GenerateChapterContent = async () => {
    if (!course?.courseOutput?.Chapters?.length) {
      setError("No chapters found in this course layout.");
      return;
    }
    setLoading(true);
    setError("");

    const chapters = course.courseOutput.Chapters;
    try {
      // Generate each chapter server-side, one request at a time (progress UX).
      for (let index = 0; index < chapters.length; index++) {
        setProgress(
          `Generating chapter ${index + 1} of ${chapters.length}: ${
            chapters[index].ChapterName
          }`
        );
        const res = await fetch(`/api/courses/${course.courseId}/chapters`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ index }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(
            data.error || `Failed to generate chapter ${index + 1}.`
          );
        }
      }

      // Courses stay PRIVATE by default — the owner publishes explicitly.
      router.replace(`/create-course/${course.courseId}/finish`);
    } catch (err) {
      console.error("Error in GenerateChapterContent:", err);
      setError(err.message || "Chapter generation failed. Please try again.");
      setLoading(false);
      setProgress("");
    }
  };

  return (
    <div className="mt-10 px-7 md:px-20 lg:px-44">
      <h2 className="font-bold text-center text-2xl">Course Layout</h2>

      {error && (
        <p className="mt-4 rounded-md bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </p>
      )}

      <LoadingDialog loading={loading} description={progress} />
      <CourseBasicInfo course={course} refreshData={GetCourse} />
      <CourseDetails course={course} />
      <ChapterList course={course} refreshData={GetCourse} allowRegenerate />

      <Button onClick={GenerateChapterContent} disabled={loading} className="my-10">
        Generate Course Content
      </Button>
    </div>
  );
}
