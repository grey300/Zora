import { db } from "@/configs/db";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { game } from "@/configs/schema";
import { auth } from "@/auth";

export const runtime = "nodejs";

// GET /api/history?limit=N → the caller's own quiz history
export async function GET(req) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(200, parseInt(searchParams.get("limit") || "100", 10));

  try {
    const games = await db
      .select()
      .from(game)
      .where(eq(game.userId, session.user.id))
      .orderBy(desc(game.timeStarted))
      .limit(limit);

    return NextResponse.json(games);
  } catch (error) {
    console.error("Error fetching games:", error);
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}
