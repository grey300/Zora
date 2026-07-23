"use client";
import { db } from "@/configs/db";
import { Chapters, CourseList } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import CourseBasicInfo from "./_components/CourseBasicInfo";
import CourseDetails from "./_components/CourseDetails";
import ChapterList from "./_components/ChapterList";
import { Button } from "@/components/ui/button";
import { GenerateChapterContent_AI } from "@/configs/AiModel";
import LoadingDialog from "../_components/LoadingDialog";
import service from "@/configs/service";
import { useRouter } from "next/navigation";
import { courseList } from "@/drizzle/schema";

function CourseLayout({ params }) {
  const { user } = useUser();
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch course details based on courseId
  useEffect(() => {
    if (params) {
      GetCourse();
    }
  }, [params, user]);

  const GetCourse = async () => {
    try {
      const result = await db
        .select()
        .from(CourseList)
        .where(
          and(
            eq(CourseList.courseId, params?.courseId),
            eq(CourseList?.createdBy, user?.primaryEmailAddress?.emailAddress)
          )
        );
      setCourse(result[0]);
      console.log("Fetched Course:", result);
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  const GenerateChapterContent = async () => {
    setLoading(true);
    const chapters = course?.courseOutput?.Chapters;

    if (!chapters) {
      console.error("No chapters available to generate content.");
      setLoading(false);
      return;
    }

    for (let index = 0; index < chapters.length; index++) {
      const chapter = chapters[index];
      const PROMPT = `Explain the concept in detail on Topic: ${course?.name}, Chapter: ${chapter?.ChapterName}, in JSON format with a list of arrays containing fields as title, description in detail, and Code Example (if applicable) in <precode> format.`;

      console.log("Generated Prompt:", PROMPT);

      try {
        let videoId = "";
        // Generate video URL
        const videoResponse = await service.getVideos(
          `${course?.name}:${chapter?.ChapterName}`
        );
        if (videoResponse && videoResponse[0]?.id?.videoId) {
          videoId = videoResponse[0]?.id?.videoId;
        }

        // Generate chapter content using AI
        const result = await GenerateChapterContent_AI.sendMessage(PROMPT);
        const content = JSON.parse(result?.response?.text());
        console.log("Generated Chapter Content:", content);

        // Save chapter content and video URL to the database
        await db.insert(Chapters).values({
          chapterId: index,
          courseId: course?.courseId,
          content: content,
          videoId: videoId,
        });

        console.log(`Chapter ${index} content saved to database.`);
      } catch (e) {
        console.error("Error generating or saving chapter content:", e);
      }
    }

    try {
      // Mark the course as published
      await db
        .update(courseList)
        .set({ publish: true })
        .where(eq(courseList.courseId, course?.courseId));

      console.log("Course marked as published.");

      // Redirect to the finish page
      router.replace(`/create-course/${course?.courseId}/finish`);
    } catch (error) {
      console.error("Error updating course:", error);
    }

    setLoading(false);
  };

  return (
    <div className="mt-10 px-7 md:px-20 lg:px-44">
      <h2 className="font-bold text-center text-2xl">Course Layout</h2>

      <LoadingDialog loading={loading} />
      {/* Basic Info */}
      <CourseBasicInfo course={course} refreshData={() => GetCourse()} />
      {/* Course Detail */}
      <CourseDetails course={course} />
      {/* List of Lesson */}
      <ChapterList course={course} refreshData={() => GetCourse()} />

      <Button onClick={GenerateChapterContent} className="my-10">
        Generate Course Content
      </Button>
    </div>
  );
}

export default CourseLayout;
