import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { logger } from "../utils";
import prisma from "../db";

interface DecodedToken {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({
      message: "Acces denied. No token provided",
    });
    return;
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "",
    ) as DecodedToken;
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });
    if (user) {
      req.user = user;
    }
    next();
  } catch (err) {
    logger.error(err);
    res.status(400).json({
      message: "Invalid token.",
    });
  }
}
