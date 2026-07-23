import { db } from "@/configs/db";
import { Question } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import stringSimilarity from "string-similarity";
import { auth } from "@/auth";

export const runtime = "nodejs";

export async function POST(req) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { questionId, userInput } = await req.json();

    const question = await db.query.Question.findFirst({
      where: (q, { eq }) => eq(q.id, questionId),
      with: { game: true },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }
    // Only the game's owner may answer its questions.
    if (question.game?.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (question.questionType === "mcq") {
      // Tolerate stray whitespace/punctuation differences between the stored
      // answer and the option text the client sent.
      const normalize = (s) =>
        String(s).trim().toLowerCase().replace(/[.\s]+$/g, "");
      const isCorrect = normalize(question.answer) === normalize(userInput);

      await db
        .update(Question)
        .set({ isCorrect, userAnswer: userInput })
        .where(eq(Question.id, questionId));

      // The answer is safe to reveal now that this question has been graded.
      return NextResponse.json({ isCorrect, correctAnswer: question.answer });
    }

    if (question.questionType === "open_ended") {
      const similarity = stringSimilarity.compareTwoStrings(
        question.answer.trim().toLowerCase(),
        userInput.trim().toLowerCase()
      );
      const percentageCorrect = Math.round(similarity * 100);

      await db
        .update(Question)
        .set({ percentageCorrect, userAnswer: userInput })
        .where(eq(Question.id, questionId));

      return NextResponse.json({
        percentageCorrect,
        correctAnswer: question.answer,
      });
    }

    return NextResponse.json(
      { error: "Invalid question type" },
      { status: 400 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
