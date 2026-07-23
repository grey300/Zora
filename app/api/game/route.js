import { db } from "@/configs/db";
import { quizCreationSchema } from "@/schemas/forms/quiz";
import { NextResponse } from "next/server";
import { game, TopicCount, Question } from "@/configs/schema";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/auth";
import { generateQuizQuestions } from "@/lib/quizQuestions";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const body = await req.json();
    const { topic, type, amount, difficulty, focus } =
      quizCreationSchema.parse(body);

    // Generate questions FIRST so a failed generation doesn't leave an empty game.
    const generated = await generateQuizQuestions({
      topic,
      amount,
      type,
      difficulty,
      focus,
    });

    const [createdGame] = await db
      .insert(game)
      .values({
        gameType: type,
        timeStarted: new Date().toISOString(),
        userId,
        topic,
      })
      .returning();

    const gameId = createdGame.id;

    await db
      .insert(TopicCount)
      .values({ topic, count: 1 })
      .onConflictDoUpdate({
        target: [TopicCount.topic],
        set: { count: sql`${TopicCount.count} + 1` },
      });

    const rows = [];
    if (type === "mcq") {
      for (const q of generated.questions) {
        rows.push({
          question: q.question,
          answer: q.correct_answer,
          options: JSON.stringify([...q.options].sort(() => Math.random() - 0.5)),
          gameId,
          questionType: "mcq",
        });
      }
    } else if (type === "open_ended") {
      for (const q of generated.questions) {
        rows.push({
          question: q.question,
          answer: q.answer,
          gameId,
          questionType: "open_ended",
        });
      }
    } else {
      for (const q of generated.mcqQuestions) {
        rows.push({
          question: q.question,
          answer: q.correct_answer,
          options: JSON.stringify([...q.options].sort(() => Math.random() - 0.5)),
          gameId,
          questionType: "mcq",
        });
      }
      for (const q of generated.openEndedQuestions) {
        rows.push({
          question: q.question,
          answer: q.answer,
          gameId,
          questionType: "open_ended",
        });
      }
    }

    await db.insert(Question).values(rows);

    return NextResponse.json({ gameId }, { status: 200 });
  } catch (error) {
    console.error("Game creation error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: error.message || "Quiz generation failed. Please try again." },
      { status: 500 }
    );
  }
}

// GET /api/game?gameId=N → a game (with questions) owned by the caller
export async function GET(req) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const gameId = parseInt(
      new URL(req.url).searchParams.get("gameId") || "",
      10
    );
    if (!Number.isInteger(gameId)) {
      return NextResponse.json({ error: "Game ID is required." }, { status: 400 });
    }

    const gameData = await db.query.game.findFirst({
      where: (g, { eq }) => eq(g.id, gameId),
      with: { questions: true },
    });

    if (!gameData) {
      return NextResponse.json({ error: "Game not found." }, { status: 404 });
    }
    if (gameData.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ game: gameData }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
