import { db } from "@/configs/db";
import { quizCreationSchema } from "@/schemas/forms/quiz";
import { NextResponse } from "next/server";
import axios from "axios";
import { getAuth } from "@clerk/nextjs/server";
import { game, TopicCount, Question } from "@/configs/schema";
import { sql } from "drizzle-orm";

// POST request to create a quiz game and save questions
export async function POST(req) {
  try {
    const session = getAuth(req);
    if (!session?.userId) {
      return NextResponse.json(
        { error: "You must be logged in to create a game." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { topic, type, amount } = quizCreationSchema.parse(body);
    console.log("Quiz creation data:", {
      topic,
      type,
      amount,
      userId: session.userId,
    });

    // Create the game
    const Game = await db
      .insert(game)
      .values({
        gameType: type,
        timeStarted: new Date().toISOString(),
        userId: session.userId,
        topic,
      })
      .returning();

    if (!Game || Game.length === 0) throw new Error("Game creation failed");
    console.log("Game created:", Game[0]);

    // Update topic count
    await db
      .insert(TopicCount)
      .values({ topic, count: 1 })
      .onConflictDoUpdate({
        target: [TopicCount.topic],
        set: { count: sql`${TopicCount.count} + 1` },
      });

    // Fetch questions from the API
    const { data } = await axios.post(`${process.env.API_URL}/api/questions`, {
      amount,
      topic,
      type,
    });

    console.log("API Response:", data);

    const questions = data.quiz; // Match the API response
    if (questions && questions.length > 0) {
      const questionData = questions.map((q) => {
        const options = q.options.sort(() => Math.random() - 0.5);
        return {
          question: q.question,
          answer: q.answer,
          options: type === "mcq" ? JSON.stringify(options) : null,
          gameId: Game[0].id,
          questionType: type,
        };
      });

      // Insert questions into the database
      await db.insert(Question).values(questionData);
      console.log("Questions inserted:", questionData);
    } else {
      console.log("No questions received from API");
    }

    return NextResponse.json(
      { message: "Game created successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during game creation:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

// GET request to fetch game data
export async function GET(req) {
  try {
    const session = getAuth(req);
    if (!session?.userId) {
      return NextResponse.json(
        { error: "You must be logged in to view the game." },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const gameId = url.searchParams.get("gameId");
    if (!gameId) {
      return NextResponse.json(
        { error: "You must provide a game ID." },
        { status: 400 }
      );
    }

    // Fetch the game and its questions
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
    console.error("Error fetching game data:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

// Let me know if anything else needs adjusting! 🚀
