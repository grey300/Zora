import prisma from "@/lib/prisma"; // Adjust the import if needed
import { NextResponse } from "next/server";

export async function GET({ params }) {
  const { id } = params; // Get the course ID from params

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Course ID is required." },
      { status: 400 }
    );
  }

  try {
    // Fetch course data from the database using Prisma
    const course = await prisma.courseList.findUnique({
      where: { courseId: id }, // Assuming 'courseId' is the unique identifier
    });

    if (!course) {
      return NextResponse.json(
        { success: false, error: "Course not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
