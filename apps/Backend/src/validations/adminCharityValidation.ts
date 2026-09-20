import { z } from "zod";

const createCharitySchema = z.object({
  name: z.string().trim().min(2, "Charity name must be at least 2 characters").max(100),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  logoUrl: z.string().url("Invalid logo URL").optional(),
  websiteUrl: z.string().url("Invalid website URL").optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional()
});

const updateCharitySchema = createCharitySchema.partial();

export { createCharitySchema, updateCharitySchema };