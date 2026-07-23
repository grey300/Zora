import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ensure this path is correct

export async function GET(req, { params }) {
  const { courseId } = params;

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

    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
