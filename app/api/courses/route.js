import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { desc, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/configs/db";
import { CourseList, CourseRatings } from "@/configs/schema";
import { auth } from "@/auth";
import { createGroqChat } from "@/configs/groqClient";
import { COURSE_HISTORY } from "@/configs/aiPrompts";
import { courseBannerUrl } from "@/lib/banner";

export const runtime = "nodejs";
export const maxDuration = 60;

// GET /api/courses?scope=mine            → the caller's courses
// GET /api/courses?scope=explore&page=0  → everyone's courses, paginated (8/page)
export async function GET(req) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const scope = searchParams.get("scope") || "mine";

  try {
    if (scope === "explore") {
      const page = Math.max(0, parseInt(searchParams.get("page") || "0", 10));
      // Explore only shows courses their owners chose to publish.
      const courses = await db
        .select()
        .from(CourseList)
        .where(eq(CourseList.publish, true))
        .orderBy(desc(CourseList.id))
        .limit(8)
        .offset(page * 8);

      // Attach rating aggregates.
      const ids = courses.map((c) => c.courseId);
      let ratingMap = {};
      if (ids.length > 0) {
        const aggregates = await db
          .select({
            courseId: CourseRatings.courseId,
            average: sql`round(avg(${CourseRatings.rating})::numeric, 1)`.mapWith(Number),
            count: sql`count(*)`.mapWith(Number),
          })
          .from(CourseRatings)
          .where(inArray(CourseRatings.courseId, ids))
          .groupBy(CourseRatings.courseId);
        ratingMap = Object.fromEntries(
          aggregates.map((a) => [a.courseId, { average: a.average, count: a.count }])
        );
      }

      return NextResponse.json(
        courses.map((c) => ({
          ...c,
          rating: ratingMap[c.courseId] || { average: 0, count: 0 },
        }))
      );
    }

    const courses = await db
      .select()
      .from(CourseList)
      .where(eq(CourseList.createdBy, session.user.email))
      .orderBy(desc(CourseList.id));
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return NextResponse.json(
      { error: "Failed to load courses." },
      { status: 500 }
    );
  }
}

const createCourseSchema = z.object({
  category: z.string().trim().min(1),
  topic: z.string().trim().min(1).max(200),
  level: z.string().trim().min(1),
  duration: z.string().trim().min(1),
  displayVideo: z.string().trim().min(1),
  noOfChapters: z.coerce.number().int().min(1).max(15),
  // Personalization (optional)
  description: z.string().trim().max(500).optional().or(z.literal("")),
  audience: z.string().trim().max(200).optional().or(z.literal("")),
});

// POST /api/courses → generate the course layout with AI and save it.
export async function POST(req) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let input;
  try {
    input = createCourseSchema.parse(await req.json());
  } catch {
    return NextResponse.json(
      { error: "Please fill in every step before generating." },
      { status: 400 }
    );
  }

  try {
    const prompt =
      "Generate a Course Tutorial on Following Detail With field as Course Name, Description, Along with Chapter Name, about, Duration. " +
      `Category: ${input.category}, Topic: ${input.topic}, Level: ${input.level}, ` +
      `Duration: ${input.duration}, NoOfChapters: ${input.noOfChapters}, in JSON format.` +
      (input.description
        ? ` The learner wants the course to cover: ${input.description}.`
        : "") +
      (input.audience
        ? ` The course is for: ${input.audience}. Adapt chapter topics and depth accordingly.`
        : "");

    const chat = createGroqChat({ history: COURSE_HISTORY });
    const result = await chat.sendMessage(prompt);

    let courseOutput;
    try {
      courseOutput = JSON.parse(result.response.text());
    } catch {
      console.error("AI returned unparseable course layout");
      return NextResponse.json(
        { error: "The AI returned an invalid course layout. Please try again." },
        { status: 502 }
      );
    }

    const courseId = randomUUID();
    await db.insert(CourseList).values({
      courseId,
      name: input.topic,
      category: input.category,
      level: input.level,
      includeVideo: input.displayVideo,
      courseOutput,
      courseBanner: courseBannerUrl({
        topic: input.topic,
        courseName: courseOutput?.CourseName,
        category: input.category,
      }),
      createdBy: session.user.email,
      userName: session.user.name || "Anonymous User",
      userProfileImage: session.user.image || "/placeholder.png",
    });

    return NextResponse.json({ courseId }, { status: 201 });
  } catch (error) {
    console.error("Course creation failed:", error);
    return NextResponse.json(
      { error: "Course generation failed. Please try again." },
      { status: 500 }
    );
  }
}
