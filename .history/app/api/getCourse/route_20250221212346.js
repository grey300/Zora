import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ensure this path is correct

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId"); // Extract courseId from query params

  if (!courseId) {
    return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
  }

  try {
    const course = await prisma.courseList.findUnique({
      where: { courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
