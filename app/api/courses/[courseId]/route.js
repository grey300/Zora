import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { CourseList, Chapters } from "@/configs/schema";
import { auth } from "@/auth";

export const runtime = "nodejs";

async function getCourse(courseId) {
  const [course] = await db
    .select()
    .from(CourseList)
    .where(eq(CourseList.courseId, courseId));
  return course || null;
}

// GET /api/courses/:courseId          → any signed-in user (viewing/taking a course)
// GET /api/courses/:courseId?mine=1   → only the owner (editing flows)
export async function GET(req, { params }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await params;
  const mine = new URL(req.url).searchParams.get("mine");

  const course = await getCourse(courseId);
  if (!course) {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }
  if (mine && course.createdBy !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json(course);
}

// PATCH /api/courses/:courseId → owner-only updates (courseOutput, banner, publish)
export async function PATCH(req, { params }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await params;
  const course = await getCourse(courseId);
  if (!course) {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }
  if (course.createdBy !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const update = {};
  if (body.courseOutput && typeof body.courseOutput === "object") {
    update.courseOutput = body.courseOutput;
  }
  if (typeof body.courseBanner === "string") {
    update.courseBanner = body.courseBanner;
  }
  if (typeof body.publish === "boolean") {
    update.publish = body.publish;
  }
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const [updated] = await db
    .update(CourseList)
    .set(update)
    .where(eq(CourseList.courseId, courseId))
    .returning();
  return NextResponse.json(updated);
}

// DELETE /api/courses/:courseId → owner-only, removes chapters too
export async function DELETE(req, { params }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await params;
  const course = await getCourse(courseId);
  if (!course) {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }
  if (course.createdBy !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.delete(Chapters).where(eq(Chapters.courseId, courseId));
  await db.delete(CourseList).where(eq(CourseList.courseId, courseId));
  return NextResponse.json({ success: true });
}
