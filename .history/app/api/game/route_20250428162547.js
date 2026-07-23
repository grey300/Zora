import { auth } from "@clerk/nextjs/server"; // Clerk auth
import { db } from "@/configs/db";
import { quizCreationSchema } from "@/schemas/forms/quiz";
import { NextResponse } from "next/server";
import axios from "axios";
import { game, TopicCount, Question } from "@/configs/schema";
import { sql } from "drizzle-orm";
import { z } from "zod";

// POST: Create a new game
export async function POST(req) {
  try {
    const { userId } = auth(req); // ✅ Pass 'req' to auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { topic, type, amount } = quizCreationSchema.parse(body);

    // Insert new game
    const createdGame = await db
      .insert(game)
      .values({
        gameType: type,
        timeStarted: new Date().toISOString(),
        userId: userId, // ✅ real user ID
        topic,
      })
      .returning();

    if (!createdGame || createdGame.length === 0) {
      throw new Error("Game creation failed");
    }

    const gameId = createdGame[0].id;

    // Update topic count
    await db
      .insert(TopicCount)
      .values({ topic, count: 1 })
      .onConflictDoUpdate({
        target: [TopicCount.topic],
        set: { count: sql`${TopicCount.count} + 1` },
      });

    // Fetch questions from Gemini API
    const { data } = await axios.post(`${process.env.API_URL}/api/questions`, {
      amount,
      topic,
      type,
    });

    if (type === "mcq") {
      const manyData = data.questions.map((question) => {
        const options = [...question.options].sort(() => Math.random() - 0.5);

        return {
          question: question.question,
          answer: question.correct_answer,
          options: JSON.stringify(options),
          gameId: gameId,
          questionType: "mcq",
        };
      });

      await db.insert(Question).values(manyData);
    } else if (type === "open_ended") {
      const manyData = data.questions.map((question) => ({
        question: question.question,
        answer: question.answer,
        gameId: gameId,
        questionType: "open_ended",
      }));

      await db.insert(Question).values(manyData);
    }

    return NextResponse.json({ gameId }, { status: 200 });
  } catch (error) {
    console.error("Error creating game:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: error.message || "Unexpected error" },
      { status: 500 }
    );
  }
}

// GET: Fetch a game and its questions
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const gameId = url.searchParams.get("gameId");

    if (!gameId) {
      return NextResponse.json(
        { error: "You must provide a game id." },
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
    console.error("Error fetching game:", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
