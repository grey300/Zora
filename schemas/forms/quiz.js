import { z } from "zod";

export const quizCreationSchema = z.object({
  topic: z
    .string()
    .trim()
    .min(2, { message: "Topic must be at least 2 characters long" })
    .max(100, { message: "Topic must be at most 100 characters long" }),
  type: z.enum(["mcq", "open_ended", "mixed"]),
  amount: z.coerce.number().int().min(1).max(15),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  // Optional personalization: what to emphasize, audience level, etc.
  focus: z.string().trim().max(200).optional().or(z.literal("")),
});
