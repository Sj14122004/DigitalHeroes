import { z } from "zod";

const scoreSchema = z.object({
  score: z
    .number()
    .int("Score must be an integer")
    .min(1, "Score must be at least 1")
    .max(45, "Score cannot exceed 45"),

  playedAt: z
    .string()
    .datetime("Invalid score date")
});

const updateScoreSchema = scoreSchema;

export { scoreSchema, updateScoreSchema };