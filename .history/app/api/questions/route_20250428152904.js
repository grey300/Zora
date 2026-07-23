import { GoogleGenerativeAI } from "@google/generative-ai";
import { getQuestionsSchema } from "@/schemas/forms/questions";
 // <-- Make sure this file exists!!
import { NextResponse } from "next/server";
import { ZodError } from "zod";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const runtime = "nodejs";
export const maxDuration = 500;

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, topic, type } = getQuestionsSchema.parse(body);

    const chatSession = model.startChat({ generationConfig });

    let prompt = "";

    if (type === "mcq") {
      prompt = `Generate a JSON array of ${amount} multiple-choice questions about the topic "${topic}". 
Each question must have:
- question: the question text
- correct_answer: the correct answer
- options: array of 4 options including the correct answer, randomized
All answers and options must be less than 15 words.
Return only pure JSON array, no markdown.`;
    } else if (type === "open_ended") {
      prompt = `Generate a JSON array of ${amount} open-ended questions about the topic "${topic}". 
Each object must have:
- question: the question text
- answer: short answer, maximum 15 words
Return only pure JSON array, no markdown.`;
    }

    const result = await chatSession.sendMessage(prompt);
    const raw = result.response.text();

    const cleaned = raw
      .replace(/^```json/, '')
      .replace(/^```/, '')
      .replace(/```$/, '')
      .trim();

    let questions;
    try {
      questions = JSON.parse(cleaned);
    } catch (error) {
      console.error("Failed to parse Gemini JSON:", cleaned);
      throw new Error("Gemini returned invalid JSON format.");
    }

    return NextResponse.json({ questions }, { status: 200 });

  } catch (error) {
    console.error("Error during question generation:", error);

    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: error.message || "Unexpected server error." }, { status: 500 });
    }
  }
}
