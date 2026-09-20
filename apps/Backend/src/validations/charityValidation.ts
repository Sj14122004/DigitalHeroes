import { z } from "zod";

const charitySelectionSchema = z.object({
  charityId: z.string().uuid("Invalid charity ID"),
  contributionPercent: z
    .number()
    .int("Contribution percentage must be an integer")
    .min(10, "Minimum charity contribution is 10%")
    .max(100, "Contribution cannot exceed 100%")
});

export { charitySelectionSchema };