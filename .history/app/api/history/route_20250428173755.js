import { db } from "@/configs/db";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { game } from "@/configs/schema";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const limit = parseInt(searchParams.get("limit") || "100");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const games = await db
      .select()
      .from(game)
      .where(eq(game.userId, userId)) // ✅ Correct where
      .orderBy(desc(game.timeStarted))
      .limit(limit);

    return NextResponse.json(games); // ✅ Return games array directly
  } catch (error) {
    console.error("Error fetching games:", error);
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}
