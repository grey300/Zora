// POST request to create a quiz game and save questions
import { z } from "zod";

export const quizCreationSchema = z.object({
  topic: z.string(),
  type: z.enum(["open_ended", "mcq"]),
  amount: z.number().min(1),
});

export async function POST(req) {
  try {
    // Get the Clerk session (authentication check)
    const session = getAuth(req);
    console.log("Session Data:", session);

    if (!session?.userId) {
      return NextResponse.json(
        { error: "You must be logged in to create a game." },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await req.json();
    console.log("Received Body:", body); // Add logging to check the body content

    const { topic, type, amount } = quizCreationSchema.parse(body);

    // Create a game using Drizzle ORM (Neon DB)
    const game = await db
      .insert(db.game) // Refers to your 'game' table
      .values({
        gameType: type,
        timeStarted: new Date().toISOString(),
        userId: session.user.id, // Using Clerk's user ID
        topic,
      })
      .returning(); // Get the created game object

    // Upsert topic count in TopicCount table
    await db
      .insert(db.topicCount)
      .values({ topic, count: 1 })
      .onConflictDoUpdate({
        target: [db.topicCount.topic], // Unique index constraint on topic
        set: { count: db.topicCount.count + 1 },
      });

    // Fetch quiz questions from external API (similar to your existing axios call)
    const { data } = await axios.post(`${process.env.API_URL}/api/questions`, {
      amount,
      topic,
      type,
    });

    // Check if the data from API is valid
    if (!data?.questions) {
      throw new Error("No questions returned from the external API.");
    }

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
          gameId: game[0].id, // The game ID created earlier
          questionType: "mcq",
        };
      });

      // Insert multiple MCQ questions
      await db.insert(db.question).values(mcqData);
    } else if (type === "open_ended") {
      const openEndedData = data.questions.map((question) => ({
        question: question.question,
        answer: question.answer,
        gameId: game[0].id, // The game ID created earlier
        questionType: "open_ended",
      }));

      // Insert multiple open-ended questions
      await db.insert(db.question).values(openEndedData);
    }

    return NextResponse.json({ gameId: game[0].id }, { status: 200 });
  } catch (error) {
    console.error("Error:", error); // Log the error for debugging
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
