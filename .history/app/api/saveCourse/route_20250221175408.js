import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    console.log("Received request:", req);

    const body = await req.json();
    console.log("Parsed body:", body);

    // Validate request body
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, error: "Request body is missing." },
        { status: 400 }
      );
    }

    // Ensure courseOutput is an object
    if (typeof body.courseOutput !== "object" || body.courseOutput === null) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid courseOutput format. Expected a JSON object.",
        },
        { status: 400 }
      );
    }

    const result = await prisma.courseList.create({
      data: {
        courseId: body.courseId,
        name: body.name,
        category: body.category,
        level: body.level,
        includeVideo: body.includeVideo || "No", // Default value
        courseOutput: body.courseOutput,
        createdBy: body.createdBy,
        userName: body.userName || "Anonymous",
        userProfileImage: body.userProfileImage || null,
      },
    });

    console.log("Course created successfully:", result);

    return NextResponse.json({ success: true, result }, { status: 201 });
  } catch (error) {
    console.error("Database Insert Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
