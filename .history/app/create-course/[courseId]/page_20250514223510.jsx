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
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch course details based on courseId
  useEffect(() => {
    if (params?.courseId && user?.primaryEmailAddress?.emailAddress) {
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
            eq(CourseList.createdBy, user.primaryEmailAddress.emailAddress)
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
      if (!course) {
        throw new Error("Course data is not loaded");
      }
      if (!course.courseOutput?.Chapters) {
        throw new Error("No chapters found in course data");
      }
      if (!course.courseId) {
        throw new Error("Course ID is missing");
      }

      console.log("Starting chapter content generation...");
      const chapters = course.courseOutput.Chapters;
      for (let index = 0; index < chapters.length; index++) {
        const chapter = chapters[index];
        console.log(`Processing chapter ${index + 1}: ${chapter.ChapterName}`);
        const PROMPT = `Explain the concept in Detail on Topic : ${course.name}, Chapter : ${chapter.ChapterName}, in JSON Format with list of array with field as title, description in detail, Code Example(Code field in <precode> format) if applicable`;

        let videoId = "";
        try {
          const resp = await service.getVideos(
            `${course.name}:${chapter.ChapterName}`
          );
          console.log("Video API Response:", resp);
          videoId = resp[0]?.id?.videoId || "";
        } catch (error) {
          console.error("Error fetching video:", error);
        }

        const result = await GenerateChapterContent_AI.sendMessage(PROMPT);
        const contentText = result?.response?.text();
        if (!contentText) {
          throw new Error(
            `No content returned from AI for chapter ${chapter.ChapterName}`
          );
        }

        let content;
        try {
          content = JSON.parse(contentText);
          console.log(
            `Parsed content for chapter ${chapter.ChapterName}:`,
            content
          );
        } catch (error) {
          console.error(
            `Error parsing AI response for chapter ${chapter.ChapterName}:`,
            error
          );
          throw error;
        }

        await db.insert(Chapters).values({
          chapterId: index,
          courseId: course.courseId,
          content,
          videoId,
        });
        console.log(`Inserted chapter ${index + 1} into database`);
      }

      console.log("Updating course publish status...");
      await db
        .update(CourseList)
        .set({ publish: true })
        .where(eq(CourseList.courseId, course.courseId));
      console.log("Course publish status updated");

      console.log("Redirecting to finish page...");
      router.replace(`/create-course/${course.courseId}/finish`);
    } catch (error) {
      console.error("Error in GenerateChapterContent:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 px-7 md:px-20 lg:px-44">
      <h2 className="font-bold text-center text-2xl">Course Layout</h2>

      <LoadingDialog loading={loading} />
      <CourseBasicInfo course={course} refreshData={GetCourse} />
      <CourseDetails course={course} />
      <ChapterList course={course} refreshData={GetCourse} />

      <Button onClick={GenerateChapterContent} className="my-10">
        Generate Course Content
      </Button>
    </div>
  );
}
