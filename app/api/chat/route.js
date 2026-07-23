import { NextResponse } from "next/server";
import { groqComplete } from "@/configs/groqClient";
import { auth } from "@/auth";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { messages, system, temperature, max_tokens } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }

    const full = system
      ? [{ role: "system", content: system }, ...messages]
      : messages;

    const text = await groqComplete(full, { temperature, max_tokens });
    return NextResponse.json({ text });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Chat request failed." }, { status: 500 });
  }
}
