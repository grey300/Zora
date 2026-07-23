import { db } from "@/configs/db"; 
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import stringSimilarity from "string-similarity";
import { eq } from "drizzle-orm";
import { Question } from "@/configs/schema";

export async function POST(req) {
  try {
    const body = await req.json();
    const { questionId, userInput } = body;

    const question = await db.query.Question.findFirst({
      where: (q, { eq }) => eq(q.id, questionId),
    });

    if (!question) {
      return NextResponse.json({ error: "Question not found." }, { status: 404 });
    }

    if (question.questionType === "mcq") {
      const isCorrect = question.answer.trim().toLowerCase() === userInput.trim().toLowerCase();

      await db.update(Question).set({ isCorrect }).where(eq(Question.id, questionId));

      return NextResponse.json({ isCorrect }, { status: 200 });
    }

    if (question.questionType === "open_ended") {
      let percentageSimilar = stringSimilarity.compareTwoStrings(
        question.answer.trim().toLowerCase(),
        userInput.trim().toLowerCase()
      );
      percentageSimilar = Math.round(percentageSimilar * 100);

      // ✅ VERY IMPORTANT: Cap to maximum 99.99
      if (percentageSimilar >= 100) {
        percentageSimilar = 99.99;
      }

      await db.update(Question).set({ percentageCorrect: percentageSimilar }).where(eq(Question.id, questionId));

      return NextResponse.json({ percentageSimilar }, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid question type." }, { status: 400 });

  } catch (error) {
    console.error("Error checking answer:", error);
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
