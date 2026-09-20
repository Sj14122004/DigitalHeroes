import { z } from "zod";

const drawEntrySchema = z.object({
  numbers: z.array(z.number().int().min(1).max(45)).length(5)
    .refine((numbers) => new Set(numbers).size === 5, "Numbers must be unique")
});

export { drawEntrySchema };