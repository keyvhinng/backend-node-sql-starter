import { Request, Response } from "express";

import { logger } from "../utils";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import { AuthService } from "../services/auth-service";

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

export class AuthController {
  static async login(req: LoginRequest, res: Response) {
    const { email, password } = req.body;
    try {
      const user = await AuthService.authenticateUser(email, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      const refreshTokenExpiresIn =
        process.env.REFRESH_TOKEN_EXPIRATION || "7d";
      const expiresAt = new Date();
      const [valueStr, unit] = refreshTokenExpiresIn
        .match(/(\d+)(\w)/)
        ?.slice(1, 3) || ["7", "d"];
      const value = parseInt(valueStr);
      switch (unit) {
        case "d":
          expiresAt.setDate(expiresAt.getDate() + value);
          break;
        case "h":
          expiresAt.setHours(expiresAt.getHours() + value);
          break;
        case "m":
          expiresAt.setUTCMinutes(expiresAt.getMinutes() + value);
          break;
        default:
          expiresAt.setDate(expiresAt.getDate() + 7);
      }

      await AuthService.createRefreshToken(user, refreshToken);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        expires: expiresAt,
      });

      res.json({ accessToken });
    } catch (err) {
      logger.error(err);
      res.status(500).json({
        message: "Internal server error.",
      });
    }
  }

  static async refreshAccessToken() {}

  static async logout() {}
}
