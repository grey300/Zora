import { getQuestionsSchema } from "@/schemas/forms/questions";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { auth } from "@/auth";
import { generateQuizQuestions } from "@/lib/quizQuestions";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { amount, topic, type } = getQuestionsSchema.parse(body);

    if (!["mcq", "open_ended", "mixed"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid question type provided." },
        { status: 400 }
      );
    }

    const generated = await generateQuizQuestions({ topic, amount, type });

    if (type === "mixed") {
      // Combined + shuffled list for consumers that want a single array,
      // plus the split arrays for consumers that need them.
      const questions = [
        ...generated.mcqQuestions,
        ...generated.openEndedQuestions,
      ].sort(() => Math.random() - 0.5);
      return NextResponse.json({ ...generated, questions }, { status: 200 });
    }

    return NextResponse.json(generated, { status: 200 });
  } catch (error) {
    console.error("Error during question generation:", error);
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: error.message || "Unexpected server error." },
      { status: 500 }
    );
  }
}
