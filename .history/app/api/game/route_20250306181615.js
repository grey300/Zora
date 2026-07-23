import { db } from "@/configs/db";
import { game, question, topic_count } from "@/configs/schema"; // Import schema definitions
import { quizCreationSchema } from "@/schemas/forms/quiz";
import { NextResponse } from "next/server";
import axios from "axios";
import { getAuth } from "@clerk/nextjs/server";

// POST request to create a quiz game and save questions
export async function POST(req) {
  try {
    // Get the Clerk session (authentication check)
    const { userId } = getAuth(req);
    console.log("User ID from Clerk:", userId);

    if (!userId) {
      return NextResponse.json(
        { error: "You must be logged in to create a game." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { topic, type, amount } = quizCreationSchema.parse(body);

    // Create a game using Drizzle ORM (Neon DB)
    const gameResult = await db
      .insert(game) // Use imported schema
      .values({
        gameType: type,
        timeStarted: new Date().toISOString(),
        userId: userId, // Using Clerk's user ID directly
        topic,
      })
      .returning(); // Get the created game object

    // Upsert topic count in TopicCount table
    await db
      .insert(topic_count)
      .values({ topic, count: 1 })
      .onConflictDoUpdate({
        target: [topic_count.topic], // Unique index constraint on topic
        set: { count: topic_count.count + 1 },
      });

    // Fetch quiz questions from external API (similar to your existing axios call)
    const { data } = await axios.post(`${process.env.API_URL}/api/questions`, {
      amount,
      topic,
      type,
    });

    // Save questions to the Question table based on the type
    if (type === "mcq") {
      const mcqData = data.questions.map((questionData) => {
        // Randomize the options
        const options = [
          questionData.option1,
          questionData.option2,
          questionData.option3,
          questionData.answer,
        ].sort(() => Math.random() - 0.5);
        return {
          question: questionData.question,
          answer: questionData.answer,
          options: JSON.stringify(options),
          gameId: gameResult[0].id, // The game ID created earlier
          questionType: "mcq",
        };
      });

      // Insert multiple MCQ questions
      await db.insert(question).values(mcqData);
    } else if (type === "open_ended") {
      const openEndedData = data.questions.map((questionData) => ({
        question: questionData.question,
        answer: questionData.answer,
        gameId: gameResult[0].id, // The game ID created earlier
        questionType: "open_ended",
      }));

      // Insert multiple open-ended questions
      await db.insert(question).values(openEndedData);
    }

    return NextResponse.json({ gameId: gameResult[0].id }, { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

// GET request to fetch game data
export async function GET(req) {
  try {
    // Get the Clerk session (authentication check)
    const { userId } = getAuth(req);
    if (!userId) {
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
    const gameData = await db
      .select()
      .from(game)
      .where(game.id.eq(gameId))
      .leftJoin(question, question.gameId.eq(game.id)) // Fetch related questions
      .all(); // Get the result

    if (!gameData || gameData.length === 0) {
      return NextResponse.json({ error: "Game not found." }, { status: 404 });
    }

    return NextResponse.json({ game: gameData }, { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
