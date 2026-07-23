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

    let mcqQuestions = [];
    let openEndedQuestions = [];

    if (type === "mixed") {
      const mcqAmount = Math.ceil(amount / 2);
      const openEndedAmount = Math.floor(amount / 2);

      // Fetching MCQ questions
      const mcqData = await axios.post(`${process.env.API_URL}/api/questions`, {
        amount: mcqAmount,
        topic,
        type: "mcq",
      });
      mcqQuestions = mcqData.data.questions.map((q) => ({
        question: q.question,
        answer: q.correct_answer,
        options: JSON.stringify([...q.options].sort(() => Math.random() - 0.5)),
        gameId,
        questionType: "mcq",
      }));

      // Fetching Open-ended questions
      const openEndedData = await axios.post(
        `${process.env.API_URL}/api/questions`,
        {
          amount: openEndedAmount,
          topic,
          type: "open_ended",
        }
      );
      openEndedQuestions = openEndedData.data.questions.map((q) => ({
        question: q.question,
        answer: q.answer,
        gameId,
        questionType: "open_ended",
      }));
    } else if (type === "mcq") {
      const data = await axios.post(`${process.env.API_URL}/api/questions`, {
        amount,
        topic,
        type,
      });
      mcqQuestions = data.questions.map((q) => ({
        question: q.question,
        answer: q.correct_answer,
        options: JSON.stringify([...q.options].sort(() => Math.random() - 0.5)),
        gameId,
        questionType: "mcq",
      }));
    } else if (type === "open_ended") {
      const data = await axios.post(`${process.env.API_URL}/api/questions`, {
        amount,
        topic,
        type,
      });
      openEndedQuestions = data.questions.map((q) => ({
        question: q.question,
        answer: q.answer,
        gameId,
        questionType: "open_ended",
      }));
    }

    // Insert questions into the database
    if (mcqQuestions.length > 0) {
      await db.insert(Question).values(mcqQuestions);
    }
    if (openEndedQuestions.length > 0) {
      await db.insert(Question).values(openEndedQuestions);
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
