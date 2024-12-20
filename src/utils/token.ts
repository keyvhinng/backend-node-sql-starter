import { User } from "@prisma/client";
import { sign, verify } from "jsonwebtoken";

const accessTokenSecret = process.env.JWT_ACCESS_SECRET as string;
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET as string;
const accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRATION || "15m";
const refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRATION || "7d";

export function generateAccessToken(user: User): string {
  return sign({ id: user.id, email: user.email }, accessTokenSecret, {
    expiresIn: accessTokenExpiresIn,
  });
}

export function generateRefreshToken(user: User): string {
  return sign({ id: user.id, email: user.email }, refreshTokenSecret, {
    expiresIn: refreshTokenExpiresIn,
  });
}

export function verifyAccessToken(token: string) {
  return verify(token, accessTokenSecret);
}

export function verifyRefreshToken(token: string) {
  return verify(token, refreshTokenSecret);
}
