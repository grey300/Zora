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

function CourseLayout({ params }) {
  const { user } = useUser();
  const [course, setCourse] = useState(null); // changed to null, as it should be an object
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (params?.courseId) GetCourse();
  }, [params, user]);

  const GetCourse = async () => {
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
    console.log(result);
  };

  const GenerateChapterContent = async () => {
    setLoading(true);
    const chapters = course?.courseOutput?.Chapters || [];

    // Use a for loop for proper async handling
    for (let index = 0; index < chapters.length; index++) {
      const chapter = chapters[index];
      const PROMPT = `
        Explain the concept in Detail on Topic: ${course?.name}, Chapter: ${chapter?.ChapterName},
        in JSON format with fields as title, description in detail, and Code Example (HTML format) if applicable.
      `;
      console.log(PROMPT);

      try {
        let videoId = "";
        const result = await GenerateChapterContent_AI.sendMessage(PROMPT);
        console.log(result?.response?.text());
        const content = JSON.parse(result?.response?.text());

        // Wait for video data
        const videoResp = await service.getVideos(
          `${course?.name}:${chapter?.ChapterName}`
        );
        if (videoResp?.[0]?.id?.videoId) {
          videoId = videoResp[0].id.videoId;
        }

        // Save chapter content and video ID to the database
        await db.insert(Chapters).values({
          chapterId: index,
          courseId: course?.courseId,
          content: content,
          videoId: videoId,
        });
      } catch (e) {
        console.error("Error generating chapter content:", e);
      }
    }

    setLoading(false);
    router.replace(`/create-course/${course?.courseId}/finish`);
  };

  return (
    <div className="mt-10 px-7 md:px-20 lg:px-44">
      <h2 className="font-bold text-center text-2xl">Course Layout</h2>

      {/* Show loading dialog while generating content */}
      <LoadingDialog loading={loading} />

      {/* Basic Info */}
      <CourseBasicInfo course={course} refreshData={() => GetCourse()} />

      {/* Course Detail */}
      <CourseDetails course={course} />

      {/* List of Lessons */}
      <ChapterList course={course} refreshData={() => GetCourse()} />

      {/* Button to trigger chapter content generation */}
      <Button onClick={GenerateChapterContent} className="my-10">
        Generate Course Content
      </Button>
    </div>
  );
}

export default CourseLayout;
