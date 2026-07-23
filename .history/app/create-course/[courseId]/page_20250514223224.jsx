"use client";

import { db } from "@/configs/db";
import { Chapters, CourseList } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import CourseBasicInfo from "./_components/CourseBasicInfo";
import CourseDetails from "./_components/CourseDetails";
import ChapterList from "./_components/ChapterList";
import { Button } from "@/components/ui/button";
import { GenerateChapterContent_AI } from "@/configs/AiModel";
import LoadingDialog from "../_components/LoadingDialog";
import service from "@/configs/service";
import { useRouter } from "next/navigation";

export default function CourseLayout({ params }) {
  const { user } = useUser();
  const [course, setCourse] = useState(null); // Initialize as null for clarity
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch course details based on courseId
  useEffect(() => {
    if (params?.courseId && user) {
      GetCourse();
    }
  }, [params?.courseId, user]);

  const GetCourse = async () => {
    try {
      const result = await db
        .select()
        .from(CourseList)
        .where(
          and(
            eq(CourseList.courseId, params.courseId),
            eq(CourseList.createdBy, user?.primaryEmailAddress?.emailAddress)
          )
        );
      if (result.length > 0) {
        setCourse(result[0]);
        console.log("Fetched Course:", result[0]);
      } else {
        console.warn("No course found for courseId:", params.courseId);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  const GenerateChapterContent = async () => {
    try {
      setLoading(true);
      if (!course?.courseOutput?.Chapters) {
        throw new Error("No chapters found in course data");
      }

      const chapters = course.courseOutput.Chapters;
      for (let index = 0; index < chapters.length; index++) {
        const chapter = chapters[index];
        const PROMPT = `Explain the concept in Detail on Topic : ${course.name}, Chapter : ${chapter.ChapterName}, in JSON Format with list of array with field as title, description in detail, Code Example(Code field in <precode> format) if applicable`;

        let videoId = "";
        await service
          .getVideos(`${course.name}:${chapter.ChapterName}`)
          .then((resp) => {
            console.log("Video API Response:", resp);
            videoId = resp[0]?.id?.videoId || "";
          })
          .catch((error) => {
            console.error("Error fetching video:", error);
          });

        const result = await GenerateChapterContent_AI.sendMessage(PROMPT);
        const contentText = result?.response?.text();
        if (!contentText) {
          throw new Error("No content returned from AI");
        }

        let content;
        try {
          content = JSON.parse(contentText);
        } catch (error) {
          console.error("Error parsing AI response:", error);
          throw error;
        }

        await db.insert(Chapters).values({
          chapterId: index,
          courseId: course.courseId,
          content: content,
          videoId: videoId,
        });
      }

      await db
        .update(CourseList)
        .set({ publish: true })
        .where(eq(CourseList.courseId, course.courseId));

      console.log("Course content generated, redirecting to finish page...");
      router.replace(`/create-course/${course.courseId}/finish`);
    } catch (error) {
      console.error("Error in GenerateChapterContent:", error);
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 px-7 md:px-20 lg:px-44">
      <h2 className="font-bold text-center text-2xl">Course Layout</h2>

      <LoadingDialog loading={loading} />
      {/* Basic Info */}
      <CourseBasicInfo course={course} refreshData={GetCourse} />
      {/* Course Detail */}
      <CourseDetails course={course} />
      {/* List of Lesson */}
      <ChapterList course={course} refreshData={GetCourse} />

      <Button onClick={GenerateChapterContent} className="my-10">
        Generate Course Content
      </Button>
    </div>
  );
}
