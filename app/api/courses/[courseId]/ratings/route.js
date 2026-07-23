import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { CourseList, CourseRatings } from "@/configs/schema";
import { auth } from "@/auth";

export const runtime = "nodejs";

async function getCourse(courseId) {
  const [course] = await db
    .select()
    .from(CourseList)
    .where(eq(CourseList.courseId, courseId));
  return course || null;
}

// GET → { average, count, myRating, ratings: [...] }
export async function GET(req, { params }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await params;
  const ratings = await db
    .select()
    .from(CourseRatings)
    .where(eq(CourseRatings.courseId, courseId))
    .orderBy(desc(CourseRatings.createdAt));

  const count = ratings.length;
  const average = count
    ? Math.round((ratings.reduce((s, r) => s + r.rating, 0) / count) * 10) / 10
    : 0;
  const myRating =
    ratings.find((r) => r.userId === session.user.id)?.rating ?? null;

  return NextResponse.json({ average, count, myRating, ratings });
}

// POST { rating: 1..5, review? } → upsert the caller's rating on a published course
export async function POST(req, { params }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await params;
  const course = await getCourse(courseId);
  if (!course) {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }
  if (!course.publish) {
    return NextResponse.json(
      { error: "Only published courses can be rated." },
      { status: 400 }
    );
  }
  if (course.createdBy === session.user.email) {
    return NextResponse.json(
      { error: "You can't rate your own course." },
      { status: 400 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "Rating must be between 1 and 5." },
      { status: 400 }
    );
  }
  const review = typeof body.review === "string" ? body.review.slice(0, 500) : null;

  const [existing] = await db
    .select()
    .from(CourseRatings)
    .where(
      and(
        eq(CourseRatings.courseId, courseId),
        eq(CourseRatings.userId, session.user.id)
      )
    );

  if (existing) {
    await db
      .update(CourseRatings)
      .set({ rating, review, userName: session.user.name })
      .where(eq(CourseRatings.id, existing.id));
  } else {
    await db.insert(CourseRatings).values({
      courseId,
      userId: session.user.id,
      userName: session.user.name,
      rating,
      review,
    });
  }

  return NextResponse.json({ success: true, rating });
}
