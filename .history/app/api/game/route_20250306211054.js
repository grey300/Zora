import { db } from "@/configs/db";
import { quizCreationSchema } from "@/schemas/forms/quiz";
import { NextResponse } from "next/server";
import axios from "axios";
import { getAuth } from "@clerk/nextjs/server";
import { game, TopicCount, Question } from "@/configs/schema";

// POST request to create a quiz game and save questions
export async function POST(req) {
  try {
    console.log(db.chapters, "client");
    // Get the Clerk session (authentication check)
    const session = getAuth(req);
    console.log(session, "session");

    if (!session?.userId) {
      return NextResponse.json(
        { error: "You must be logged in to create a game." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { topic, type, amount } = quizCreationSchema.parse(body);
    console.log(" dkfjskd", type, "userId", session.userId, "topic", topic);
    // Create a game using Drizzle ORM (Neon DB)
    const Game = await db
      .insert(game) // Refers to your 'game' table
      .values({
        gameType: type,
        timeStarted: new Date().toISOString(),
        userId: session.userId, // Using Clerk's user ID
        topic,
      })
      .returning(); // Get the created game object
    if (!Game || Game.length === 0) throw new Error("Game creation failed");
    console.log("Game created:", Game[0]);
    // Upsert topic count in TopicCount table
    const nf = await db
      .insert(TopicCount)
      .values({ topic, count: 1 })
      .onConflictDoUpdate({
        target: [TopicCount.topic],
        set: { count: sql`${TopicCount.count} + 1` },
      });

    // Fetch quiz questions from external API (similar to your existing axios call)
    const { data } = await axios.post(`${process.env.API_URL}/api/questions`, {
      amount,
      topic,
      type,
    });

    // Save questions to the Question table based on the type
    if (type === "mcq") {
      const mcqData = data.questions.map((question) => {
        // Randomize the options
        const options = [
          question.option1,
          question.option2,
          question.option3,
          question.answer,
        ].sort(() => Math.random() - 0.5);
        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
          gameId: Game[0].id, // The game ID created earlier
          questionType: "mcq",
        };
      });

      // Insert multiple MCQ questions
      await db.insert(Question).values(mcqData);
    } else if (type === "open_ended") {
      const openEndedData = data.questions.map((question) => ({
        question: question.question,
        answer: question.answer,
        gameId: Game[0].id, // The game ID created earlier
        questionType: "open_ended",
      }));

      // Insert multiple open-ended questions
      await db.insert(Question).values(openEndedData);
    }

    return NextResponse.json({ gameId: Game[0].id }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.log(" herei your error,", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    } else {
      return NextResponse.json(
        { error: "An unexpected error occurred." },
        { status: 500 }
      );
    }
  }
}

// GET request to fetch game data
export async function GET(req) {
  try {
    // Get the Clerk session (authentication check)
    const session = await getAuth(req);
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to view the game." },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const gameId = url.searchParams.get("gameId");
    if (!gameId) {
      return NextResponse.json(
        { error: "You must provide a game id." },
        { status: 400 }
      );
    }

    // Fetch the game and its questions
    const game = await db
      .select()
      .from(db.game)
      .where(db.game.id.eq(gameId))
      .leftJoin(db.question, db.question.gameId.eq(db.game.id)) // Fetch related questions
      .all(); // Get the result

    if (!game || game.length === 0) {
      return NextResponse.json({ error: "Game not found." }, { status: 404 });
    }

    return NextResponse.json({ game }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
