import { auth } from "@clerk/nextjs/server"; // ✅ Import Clerk server
import { db } from "@/configs/db"; // your drizzle db instance
import { quizCreationSchema } from "@/schemas/forms/quiz"; // validation schema
import { game, TopicCount, Question } from "@/configs/schema"; // your db tables
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import axios from "axios";
import { z } from "zod";

export async function POST(req) {
  try {
    const { userId } = auth(); // ✅ Clerk authentication

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { topic, type, amount } = quizCreationSchema.parse(body);

    const createdGame = await db
      .insert(game)
      .values({
        gameType: type,
        timeStarted: new Date().toISOString(),
        userId, // ✅ save real Clerk userId
        topic,
      })
      .returning();

    if (!createdGame || createdGame.length === 0) {
      throw new Error("Game creation failed");
    }

    const gameId = createdGame[0].id;

    // Update TopicCount
    await db
      .insert(TopicCount)
      .values({ topic, count: 1 })
      .onConflictDoUpdate({
        target: [TopicCount.topic],
        set: { count: sql`${TopicCount.count} + 1` },
      });

    // Fetch questions from Gemini AI
    const { data } = await axios.post(`${process.env.API_URL}/api/questions`, {
      amount,
      topic,
      type,
    });

    // Save questions
    if (type === "mcq") {
      const questions = data.questions.map((q) => ({
        question: q.question,
        answer: q.correct_answer,
        options: JSON.stringify([...q.options].sort(() => Math.random() - 0.5)),
        gameId,
        questionType: "mcq",
      }));
      await db.insert(Question).values(questions);
    } else {
      const questions = data.questions.map((q) => ({
        question: q.question,
        answer: q.answer,
        gameId,
        questionType: "open_ended",
      }));
      await db.insert(Question).values(questions);
    }

    return NextResponse.json({ gameId }, { status: 200 });
  } catch (error) {
    console.error(error);
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
