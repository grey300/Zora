import { db } from "@/configs/db";
import { game, Question } from "@/configs/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export const runtime = "nodejs";

// POST /api/replay { gameId } → clone one of the caller's own games for a retry
export async function POST(req) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const { gameId } = await req.json();
    if (!gameId) {
      return NextResponse.json(
        { error: "Game ID is required" },
        { status: 400 }
      );
    }

    const [originalGame] = await db
      .select()
      .from(game)
      .where(eq(game.id, gameId))
      .limit(1);

    if (!originalGame) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }
    // Only the owner may replay their game.
    if (originalGame.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const questions = await db
      .select()
      .from(Question)
      .where(eq(Question.gameId, gameId));

    const [newGame] = await db
      .insert(game)
      .values({
        userId,
        timeStarted: new Date().toISOString(),
        topic: originalGame.topic,
        gameType: originalGame.gameType,
        timeEnded: null,
      })
      .returning({ id: game.id });

    const questionInserts = questions.map((q) => ({
      gameId: newGame.id,
      question: q.question,
      answer: q.answer,
      options: q.options,
      questionType: q.questionType,
      percentageCorrect: null,
      isCorrect: null,
      userAnswer: null,
    }));

    if (questionInserts.length > 0) {
      await db.insert(Question).values(questionInserts);
    }

    return NextResponse.json({ gameId: newGame.id }, { status: 200 });
  } catch (error) {
    console.error("Error replaying game:", error);
    return NextResponse.json(
      { error: error.message || "Failed to replay game" },
      { status: 500 }
    );
  }
}
