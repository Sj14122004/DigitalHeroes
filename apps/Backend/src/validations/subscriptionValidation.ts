import { z } from "zod";

const subscriptionSchema = z.object({
  plan: z.enum(["MONTHLY", "YEARLY"])
});

export { subscriptionSchema };