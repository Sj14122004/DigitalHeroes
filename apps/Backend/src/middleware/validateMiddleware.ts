import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).send(
        result.error.issues.map((issue) => issue.message).join(", ")
      );
    }

    req.body = result.data;
    next();
  };
};

export default validate;