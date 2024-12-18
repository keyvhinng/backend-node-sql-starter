import { z } from "zod";
import { Request, Response, NextFunction } from "express";

import logger from "../utils/logger";

const userInputSchema = z.object({
  email: z.string().email(),
});

export const validateCreateUserInput = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    userInputSchema.parse(req.body);
    next();
  } catch (error) {
    logger.error(error);
    if (error instanceof z.ZodError) {
      res.status(422).json({
        error: "Unprocessable Entity",
        details: error.errors,
      });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
