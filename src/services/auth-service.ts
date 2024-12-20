import bcrypt from "bcrypt";
import { User } from "@prisma/client";

import prisma from "../db";

export class AuthService {
  static async registerUser(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    return user;
  }

  static async authenticateUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return null;
    }
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  static async createRefreshToken(user: User, token: string) {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: token,
      },
    });
  }

  static async revokeRefreshToken(token: string) {
    const user = await prisma.user.findFirst({
      where: {
        refreshToken: token,
      },
    });
    if (user) {
      prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          refreshToken: null,
        },
      });
    }
  }

  static async findRefreshToken(token: string): Promise<string | null> {
    const user = await prisma.user.findFirst({
      where: {
        refreshToken: token,
      },
    });
    return user ? user.refreshToken : null;
  }
}
