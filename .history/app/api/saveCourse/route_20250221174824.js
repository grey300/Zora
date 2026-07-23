import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Ensure request is a POST method
    if (req.method !== "POST") {
      return NextResponse.json(
        { success: false, error: "Method Not Allowed" },
        { status: 405 }
      );
    }

    console.log("Received request headers:", req.headers);

    // Parse the request body safely
    const body = await req.json().catch((err) => {
      console.error("JSON Parse Error:", err);
      return null;
    });

    if (!body) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON format." },
        { status: 400 }
      );
    }

    console.log("Parsed body:", body);

    // Validate if body is not null or empty
    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, error: "Request body is missing or empty." },
        { status: 400 }
      );
    }

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
