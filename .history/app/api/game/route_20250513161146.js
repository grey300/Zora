import { db } from "@/configs/db";
import { quizCreationSchema } from "@/schemas/forms/quiz";
import { NextResponse } from "next/server";
import { game, TopicCount, Question } from "@/configs/schema";
import { sql } from "drizzle-orm";
import axios from "axios";
import { z } from "zod";

export async function POST(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId"); // ✅ Get userId from URL params

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { topic, type, amount } = quizCreationSchema.parse(body);

    const createdGame = await db
      .insert(game)
      .values({
        gameType: type,
        timeStarted: new Date().toISOString(),
        userId, // ✅ Save real userId here
        topic,
      })
      .returning();

    if (!createdGame || createdGame.length === 0) {
      throw new Error("Game creation failed.");
    }

    const gameId = createdGame[0].id;

    await db
      .insert(TopicCount)
      .values({ topic, count: 1 })
      .onConflictDoUpdate({
        target: [TopicCount.topic],
        set: {
          count: sql`${TopicCount.count} + 1`,
        },
      });

    const { data } = await axios.post(`${process.env.API_URL}/api/questions`, {
      amount,
      topic,
      type,
    });

    if (type === "mcq") {
      const questions = data.questions.map((q) => ({
        question: q.question,
        answer: q.correct_answer,
        options: JSON.stringify([...q.options].sort(() => Math.random() - 0.5)),
        gameId,
        questionType: "mcq",
      }));
      await db.insert(Question).values(questions);
    } else if (type === "open_ended") {
      const questions = data.questions.map((q) => ({
        question: q.question,
        answer: q.answer,
        gameId,
        questionType: "open_ended",
      }));

      await db.insert(Question).values(questions);
    } else if (type == "mixed") {
      const mcqQuestions = data.mcqQuestions.map((q) => ({
        question: q.question,
        answer: q.correct_answer,
        options: JSON.stringify([...q.options].sort(() => Math.random() - 0.5)),
        gameId,
        questionType: "mcq",
      }));
    }

    return NextResponse.json({ gameId }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    } else {
      return NextResponse.json(
        { error: error.message || "Unexpected error." },
        { status: 500 }
      );
    }
  }
}

// GET a game and its questions
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const gameId = url.searchParams.get("gameId");

    if (!gameId) {
      return NextResponse.json(
        { error: "Game ID is required." },
        { status: 400 }
      );
    }

    const gameData = await db
      .select()
      .from(game)
      .where(game.id.eq(gameId))
      .leftJoin(Question, Question.gameId.eq(game.id))
      .all();

    if (!gameData || gameData.length === 0) {
      return NextResponse.json({ error: "Game not found." }, { status: 404 });
    }

    return NextResponse.json({ game: gameData }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
