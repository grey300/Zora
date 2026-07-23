import { db } from "@/configs/db";
import { TopicCount } from "@/configs/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const topics = await db.select().from(TopicCount);
    return NextResponse.json(topics);
  } catch (error) {
    console.error("Failed to fetch topics:", error);
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 }
    );
  }
}
