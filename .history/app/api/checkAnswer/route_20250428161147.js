import { db } from "@/configs/db";
import { Question } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import stringSimilarity from "string-similarity";

export async function POST(req) {
  try {
    const { questionId, userInput } = await req.json();

    const question = await db.query.Question.findFirst({
      where: (q, { eq }) => eq(q.id, questionId),
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    if (question.questionType === "mcq") {
      const isCorrect =
        question.answer.trim().toLowerCase() === userInput.trim().toLowerCase();

      await db
        .update(Question)
        .set({ isCorrect, userAnswer: userInput })
        .where(eq(Question.id, questionId));

      return NextResponse.json({ isCorrect });
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

      return NextResponse.json({ percentageCorrect });
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
