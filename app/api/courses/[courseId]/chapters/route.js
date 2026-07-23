import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { CourseList, Chapters } from "@/configs/schema";
import { auth } from "@/auth";
import { createGroqChat } from "@/configs/groqClient";
import { CHAPTER_HISTORY } from "@/configs/aiPrompts";

export const runtime = "nodejs";
export const maxDuration = 60;

// GET /api/courses/:courseId/chapters?chapterId=0 → one chapter's content
export async function GET(req, { params }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await params;
  const chapterId = new URL(req.url).searchParams.get("chapterId");
  if (chapterId === null) {
    return NextResponse.json({ error: "chapterId required." }, { status: 400 });
  }

  const [chapter] = await db
    .select()
    .from(Chapters)
    .where(
      and(
        eq(Chapters.courseId, courseId),
        eq(Chapters.chapterId, parseInt(chapterId, 10))
      )
    );

  if (!chapter) {
    return NextResponse.json({ error: "Chapter not found." }, { status: 404 });
  }
  return NextResponse.json(chapter);
}

async function findYoutubeVideo(query) {
  const key =
    process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  if (!key) return "";
  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("q", query);
    url.searchParams.set("maxResults", "1");
    url.searchParams.set("type", "video");
    url.searchParams.set("key", key);
    const res = await fetch(url);
    if (!res.ok) return "";
    const data = await res.json();
    return data.items?.[0]?.id?.videoId || "";
  } catch (error) {
    console.error("YouTube lookup failed:", error);
    return "";
  }
}

// POST /api/courses/:courseId/chapters { index } → generate ONE chapter's
// content with AI (owner-only). The client loops over indexes for progress.
export async function POST(req, { params }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await params;
  const [course] = await db
    .select()
    .from(CourseList)
    .where(eq(CourseList.courseId, courseId));

  if (!course) {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }
  if (course.createdBy !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const index = Number(body.index);
  const chapters = course.courseOutput?.Chapters;
  if (!Array.isArray(chapters) || !Number.isInteger(index) || !chapters[index]) {
    return NextResponse.json({ error: "Invalid chapter index." }, { status: 400 });
  }

  const chapterMeta = chapters[index];
  // Optional user-written instructions for this chapter (from request body,
  // or previously saved on the chapter meta).
  const customPrompt =
    typeof body.customPrompt === "string" && body.customPrompt.trim()
      ? body.customPrompt.trim().slice(0, 500)
      : chapterMeta.customPrompt || "";

  try {
    const prompt = `Explain the concept in Detail on Topic : ${course.name}, Chapter : ${chapterMeta.ChapterName}, in JSON Format with list of array with field as title, description in detail, Code Example(Code field in <precode> format) if applicable${
      customPrompt ? `\nAdditional instructions from the learner: ${customPrompt}` : ""
    }`;

    const quizPrompt = `Generate a JSON array of exactly 3 multiple-choice questions testing the key ideas of the chapter "${chapterMeta.ChapterName}" from a course about ${course.name}.
Chapter summary: ${chapterMeta.About || chapterMeta.ChapterName}
Each object must have: question, correct_answer (EXACTLY matching one option), options (array of 4).
Rules: one unambiguously correct answer, plausible distractors, no "All of the above".
Return only a pure JSON array, no markdown.`;

    const includeVideo = course.includeVideo?.toLowerCase() !== "no";
    const [aiResult, quizResult, videoId] = await Promise.all([
      createGroqChat({ history: CHAPTER_HISTORY }).sendMessage(prompt),
      createGroqChat().sendMessage(quizPrompt),
      includeVideo
        ? findYoutubeVideo(`${course.name}: ${chapterMeta.ChapterName}`)
        : Promise.resolve(""),
    ]);

    let content;
    try {
      content = JSON.parse(aiResult.response.text());
    } catch {
      return NextResponse.json(
        {
          error: `The AI returned invalid content for "${chapterMeta.ChapterName}". Please retry.`,
        },
        { status: 502 }
      );
    }

    // Chapter quiz is best-effort — a failed quiz must not fail the chapter.
    let quiz = null;
    try {
      const parsed = JSON.parse(quizResult.response.text());
      if (Array.isArray(parsed) && parsed.length > 0) {
        quiz = parsed
          .filter(
            (q) =>
              q?.question &&
              q?.correct_answer &&
              Array.isArray(q?.options) &&
              q.options.length >= 2
          )
          .slice(0, 5);
      }
    } catch {
      console.warn(`Chapter ${index} quiz generation returned invalid JSON`);
    }

    // If the learner supplied a custom prompt, remember it on the chapter meta.
    if (customPrompt && customPrompt !== chapterMeta.customPrompt) {
      const updatedChapters = [...chapters];
      updatedChapters[index] = { ...chapterMeta, customPrompt };
      await db
        .update(CourseList)
        .set({
          courseOutput: { ...course.courseOutput, Chapters: updatedChapters },
        })
        .where(eq(CourseList.courseId, courseId));
    }

    // Replace any previous attempt for this chapter so retries don't duplicate.
    await db
      .delete(Chapters)
      .where(
        and(eq(Chapters.courseId, courseId), eq(Chapters.chapterId, index))
      );
    await db.insert(Chapters).values({
      courseId,
      chapterId: index,
      content,
      videoId,
      quiz,
    });

    return NextResponse.json({ index, ok: true });
  } catch (error) {
    console.error(`Chapter ${index} generation failed:`, error);
    return NextResponse.json(
      { error: `Failed to generate "${chapterMeta.ChapterName}".` },
      { status: 500 }
    );
  }
}
