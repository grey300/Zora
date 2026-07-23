import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json(
        { success: false, error: "Method Not Allowed" },
        { status: 405 }
      );
    }

    console.log("Received request headers:", req.headers);

    // Safely parse JSON
    let body;
    try {
      body = await req.json();
    } catch (err) {
      console.error("JSON Parse Error:", err);
      return NextResponse.json(
        { success: false, error: "Invalid JSON format." },
        { status: 400 }
      );
    }

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, error: "Request body is missing or empty." },
        { status: 400 }
      );
    }

    console.log("Parsed body:", body);

    // Required fields validation
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

    // Ensure courseOutput is a valid JSON object
    if (typeof body.courseOutput !== "object" || body.courseOutput === null) {
      console.error("Invalid courseOutput:", body.courseOutput);
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
      courseOutput: body.courseOutput,
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
        courseOutput: body.courseOutput,
        createdBy: body.createdBy,
        userName: userName,
        userProfileImage: body.userProfileImage,
      },
    });

    console.log("Course created successfully:", result);

    return NextResponse.json({ success: true, result }, { status: 201 });
  } catch (error) {
    console.log("Database Insert Error:", error);

    // Ensure a valid error response
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "An unknown error occurred.",
      },
      { status: 500 }
    );
  }
}
