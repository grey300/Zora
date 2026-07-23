import { z } from "zod";

export const checkAnswerSchema = z.object({
  questionId: z.number(),
  userInput: z.string(),
});

export const endGameSchema = z.object({
  gameId: z.number(),
});

export const getQuestionsSchema = z.object({
  amount: z.coerce.number().int().min(1).max(15),
  topic: z.string().trim().min(2),
  type: z.enum(["mcq", "open_ended", "mixed"]),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  focus: z.string().max(200).optional(),
});
