import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Llama 3.3 70B handles the structured JSON generation this app relies on.
export const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

const DEFAULT_SYSTEM =
  "You are a helpful assistant that responds with ONLY valid JSON. " +
  "Do not include markdown code fences, comments, or any text outside the JSON.";

/**
 * Pull the JSON payload out of a model response, tolerating stray prose or
 * ```json fences. Returns a clean string ready for JSON.parse.
 */
export function extractJson(text) {
  if (!text) return "";
  let t = String(text).trim();
  t = t.replace(/```json/gi, "").replace(/```/g, "").trim();

  const starts = [t.indexOf("{"), t.indexOf("[")].filter((i) => i !== -1);
  const ends = [t.lastIndexOf("}"), t.lastIndexOf("]")].filter((i) => i !== -1);
  if (starts.length && ends.length) {
    const start = Math.min(...starts);
    const end = Math.max(...ends);
    if (end > start) t = t.slice(start, end + 1);
  }
  return t.trim();
}

/**
 * Create a chat session with the same interface the old Gemini code used:
 *   const chat = createGroqChat({ history });
 *   const result = await chat.sendMessage(prompt);
 *   const json = result.response.text();  // cleaned JSON string
 *
 * `history` is an array of { role: "user" | "assistant", content } messages
 * used for few-shot prompting.
 */
/**
 * Raw completion returning plain text (no JSON extraction). Used for the
 * conversational chatbot.
 */
export async function groqComplete(messages, { temperature = 0.7, max_tokens = 2048 } = {}) {
  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    temperature,
    max_tokens,
    messages,
  });
  return completion.choices?.[0]?.message?.content ?? "";
}

export function createGroqChat({ system = DEFAULT_SYSTEM, history = [] } = {}) {
  const base = [{ role: "system", content: system }, ...history];

  return {
    async sendMessage(prompt) {
      const completion = await groq.chat.completions.create({
        model: GROQ_MODEL,
        temperature: 1,
        top_p: 0.95,
        max_tokens: 8192,
        messages: [...base, { role: "user", content: String(prompt) }],
      });
      const raw = completion.choices?.[0]?.message?.content ?? "";
      const cleaned = extractJson(raw);
      return { response: { text: () => cleaned } };
    },
  };
}
