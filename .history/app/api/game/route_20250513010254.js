export async function POST(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

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
        userId,
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

    // ✨ **Handling Mixed Type**
    let questions = [];
    if (type === "mcq") {
      const { data } = await axios.post(
        `${process.env.API_URL}/api/questions`,
        {
          amount,
          topic,
          type,
        }
      );

      questions = data.questions.map((q) => ({
        question: q.question,
        answer: q.correct_answer,
        options: JSON.stringify([...q.options].sort(() => Math.random() - 0.5)),
        gameId,
        questionType: "mcq",
      }));
    } else if (type === "open_ended") {
      const { data } = await axios.post(
        `${process.env.API_URL}/api/questions`,
        {
          amount,
          topic,
          type,
        }
      );

      questions = data.questions.map((q) => ({
        question: q.question,
        answer: q.answer,
        gameId,
        questionType: "open_ended",
      }));
    } else if (type === "mixed") {
      // ✨ **Mixed Logic**
      const mcqAmount = Math.ceil(amount / 2);
      const openEndedAmount = Math.floor(amount / 2);

      const [mcqResponse, openEndedResponse] = await Promise.all([
        axios.post(`${process.env.API_URL}/api/questions`, {
          amount: mcqAmount,
          topic,
          type: "mcq",
        }),
        axios.post(`${process.env.API_URL}/api/questions`, {
          amount: openEndedAmount,
          topic,
          type: "open_ended",
        }),
      ]);

      const mcqQuestions = mcqResponse.data.questions.map((q) => ({
        question: q.question,
        answer: q.correct_answer,
        options: JSON.stringify([...q.options].sort(() => Math.random() - 0.5)),
        gameId,
        questionType: "mcq",
      }));

      const openEndedQuestions = openEndedResponse.data.questions.map((q) => ({
        question: q.question,
        answer: q.answer,
        gameId,
        questionType: "open_ended",
      }));

      questions = [...mcqQuestions, ...openEndedQuestions];
    }

    if (questions.length > 0) {
      await db.insert(Question).values(questions);
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
