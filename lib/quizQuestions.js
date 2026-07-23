// Server-side quiz question generation, shared by /api/questions and /api/game.
import { createGroqChat } from "@/configs/groqClient";
import stringSimilarity from "string-similarity";

const DIFFICULTY_RULES = {
  easy: "Questions should test basic definitions and fundamental recall. Suitable for beginners.",
  medium:
    "Questions should test understanding and application of concepts, not just recall.",
  hard: "Questions should test deep understanding, edge cases, analysis and comparisons between concepts. Avoid trivial questions.",
};

const QUALITY_RULES = `Quality rules (MANDATORY):
- Every question must be clear, specific and have exactly ONE unambiguously correct answer.
- Never use "All of the above", "None of the above", or joke options.
- Distractor options must be plausible but definitely wrong, and clearly distinct from each other.
- The correct_answer string must be EXACTLY identical to one of the options (character for character).
- Cover different aspects of the topic — do not repeat near-identical questions.
- Do not include the answer inside the question text.`;

const mcqPrompt = (amount, topic, difficulty, focus) => `Generate a JSON array of ${amount} ${difficulty} multiple-choice questions about the topic "${topic}".
${focus ? `Personalization: ${focus}\n` : ""}${DIFFICULTY_RULES[difficulty]}
${QUALITY_RULES}
Each object must have:
- question: the question text (max 40 words)
- correct_answer: the correct answer (max 15 words, EXACTLY matching one option)
- options: array of exactly 4 options including the correct answer, in random order
Return only a pure JSON array, no markdown.`;

const openEndedPrompt = (amount, topic, difficulty, focus) => `Generate a JSON array of ${amount} ${difficulty} open-ended questions about the topic "${topic}".
${focus ? `Personalization: ${focus}\n` : ""}${DIFFICULTY_RULES[difficulty]}
Quality rules (MANDATORY):
- Each question must have a short, factual, objective answer (not opinion-based).
- The answer must be a complete short sentence of at most 15 words.
- Cover different aspects of the topic.
Each object must have:
- question: the question text
- answer: the short factual answer (max 15 words)
Return only a pure JSON array, no markdown.`;

/**
 * Guarantee correct_answer exactly matches one of the options.
 * If the AI slipped (extra period, rephrasing), snap it to the closest option.
 */
function normalizeMcq(questions) {
  return questions
    .filter(
      (q) =>
        q &&
        typeof q.question === "string" &&
        typeof q.correct_answer === "string" &&
        Array.isArray(q.options) &&
        q.options.length >= 2
    )
    .map((q) => {
      const options = q.options.map((o) => String(o).trim()).filter(Boolean);
      let answer = String(q.correct_answer).trim();

      if (!options.includes(answer)) {
        const { bestMatchIndex } = stringSimilarity.findBestMatch(
          answer.toLowerCase(),
          options.map((o) => o.toLowerCase())
        );
        answer = options[bestMatchIndex];
      }
      return { question: q.question.trim(), correct_answer: answer, options };
    });
}

function normalizeOpenEnded(questions) {
  return questions.filter(
    (q) =>
      q && typeof q.question === "string" && typeof q.answer === "string"
  );
}

async function generateArray(prompt) {
  const chat = createGroqChat();
  const result = await chat.sendMessage(prompt);
  const parsed = JSON.parse(result.response.text());
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("AI did not return a question array.");
  }
  return parsed;
}

/**
 * Generate quiz questions.
 * - mcq / open_ended → { questions: [...] }
 * - mixed → { mcqQuestions: [...], openEndedQuestions: [...] }
 */
export async function generateQuizQuestions({
  topic,
  amount,
  type,
  difficulty = "medium",
  focus = "",
}) {
  if (type === "mcq") {
    const raw = await generateArray(mcqPrompt(amount, topic, difficulty, focus));
    const questions = normalizeMcq(raw);
    if (questions.length === 0) throw new Error("AI returned no valid questions.");
    return { questions };
  }
  if (type === "open_ended") {
    const raw = await generateArray(
      openEndedPrompt(amount, topic, difficulty, focus)
    );
    const questions = normalizeOpenEnded(raw);
    if (questions.length === 0) throw new Error("AI returned no valid questions.");
    return { questions };
  }
  if (type === "mixed") {
    const mcqAmount = Math.ceil(amount / 2);
    const openAmount = Math.max(1, Math.floor(amount / 2));
    const [rawMcq, rawOpen] = await Promise.all([
      generateArray(mcqPrompt(mcqAmount, topic, difficulty, focus)),
      generateArray(openEndedPrompt(openAmount, topic, difficulty, focus)),
    ]);
    const mcqQuestions = normalizeMcq(rawMcq);
    const openEndedQuestions = normalizeOpenEnded(rawOpen);
    if (mcqQuestions.length === 0 && openEndedQuestions.length === 0) {
      throw new Error("AI returned no valid questions.");
    }
    return { mcqQuestions, openEndedQuestions };
  }
  throw new Error(`Invalid question type: ${type}`);
}
