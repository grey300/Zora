import { quizCreationSchema } from "@/schemas/forms/quiz"; // Import schema once
import { db } from "@/configs/db"; // Assuming db is properly configured with Drizzle ORM and Neon DB
import { NextResponse } from "next/server";
import axios from "axios";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    // Get the Clerk session (authentication check)
    const session = getAuth(req);
    console.log("Session Data:", session);

    // If the user is not authenticated, return 401 Unauthorized response
    if (!session?.userId) {
      return NextResponse.json(
        { error: "You must be logged in to create a game." },
        { status: 401 }
      );
    }

    // Parse the request body to extract the necessary parameters
    const body = await req.json();
    console.log("Received Body:", body); // Add logging to check the body content

    // Validate the body using the quizCreationSchema
    const { topic, type, amount } = quizCreationSchema.parse(body);

    // Create a new game record in the game table using Drizzle ORM (Neon DB)
    const game = await db
      .insert(db.game)
      .values({
        gameType: type,
        timeStarted: new Date().toISOString(),
        userId: session.userId, // Corrected Clerk session userId
        topic,
      })
      .returning();

    console.log("Created Game:", game);

    // Upsert topic count in TopicCount table (increment or insert topic)
    await db
      .insert(db.topicCount)
      .values({ topic, count: 1 })
      .onConflictDoUpdate({
        target: [db.topicCount.topic], // Unique index constraint on topic
        set: { count: db.topicCount.count + 1 },
      });

    // Fetch quiz questions from an external API
    const { data } = await axios.post(`${process.env.API_URL}/api/questions`, {
      amount,
      topic,
      type,
    });

    // Log the fetched questions data
    console.log("Fetched Questions:", data);

    // Check if the data from API is valid
    if (!data?.questions) {
      throw new Error("No questions returned from the external API.");
    }

    // Save the questions in the Question table based on the quiz type
    if (type === "mcq") {
      const mcqData = data.questions.map((question) => {
        // Randomize the options for MCQ
        const options = [
          question.option1,
          question.option2,
          question.option3,
          question.answer,
        ].sort(() => Math.random() - 0.5); // Randomly shuffle the options
        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options), // Store options as a JSON string
          gameId: game[0].id, // The game ID created earlier
          questionType: "mcq", // Set question type to 'mcq'
        };
      });

      // Insert multiple MCQ questions in the database
      await db.insert(db.question).values(mcqData);
    } else if (type === "open_ended") {
      const openEndedData = data.questions.map((question) => ({
        question: question.question,
        answer: question.answer,
        gameId: game[0].id, // The game ID created earlier
        questionType: "open_ended", // Set question type to 'open_ended'
      }));

      // Insert multiple open-ended questions in the database
      await db.insert(db.question).values(openEndedData);
    }

    // Return a response with the created game ID
    return NextResponse.json({ gameId: game[0].id }, { status: 200 });
  } catch (error) {
    // Log the error for debugging
    console.error("Error:", error);

    // Return appropriate error responses
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    } else {
      return NextResponse.json(
        { error: "An unexpected error occurred." },
        { status: 500 }
      );
    }
  }
}
