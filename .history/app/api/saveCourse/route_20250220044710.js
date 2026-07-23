import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    console.log("Received request:", req); // Debugging line

    // Parse the request body
    const body = await req.json();
    console.log("Parsed body:", body); // Debugging line

    // Validate if body is not null or empty
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, error: "Request body is missing or empty." },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = [
      "courseId",
      "name",
      "category",
      "level",
      "duration",
      "courseOutput",
      "createdBy",
      "userProfileImage",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate courseOutput
    if (typeof body.courseOutput !== "object" || body.courseOutput === null) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid courseOutput format. Expected a JSON object.",
        },
        { status: 400 }
      );
    }

    // Replace null userName with "Anonymous"
    const userName = body.userName || "Anonymous";

    console.log("Creating course with data:", {
      courseId: body.courseId,
      name: body.name,
      category: body.category,
      level: body.level,
      duration: body.duration,
      courseOutput: body.courseOutput, // Already a JSON object
      createdBy: body.createdBy,
      userName: userName,
      userProfileImage: body.userProfileImage,
    });

    // Create the course in the database
    const result = await prisma.courseList.create({
      data: {
        courseId: body.courseId,
        name: body.name,
        category: body.category,
        level: body.level,
        duration: body.duration,
        courseOutput: body.courseOutput, // Pass the JSON object directly
        createdBy: body.createdBy,
        userName: userName,
        userProfileImage: body.userProfileImage,
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
