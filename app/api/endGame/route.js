import { db } from "@/configs/db";
import { game } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const runtime = "nodejs";

// POST /api/endGame { gameId } → stamp timeEnded on the caller's own game
export async function POST(req) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { gameId } = await req.json();
    if (!gameId) {
      return NextResponse.json({ error: "Game ID is required" }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(game)
      .where(eq(game.id, gameId))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }
    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db
      .update(game)
      .set({ timeEnded: new Date().toISOString() })
      .where(eq(game.id, gameId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("endGame error:", error);
    return NextResponse.json({ error: "Failed to end game" }, { status: 500 });
  }
}
