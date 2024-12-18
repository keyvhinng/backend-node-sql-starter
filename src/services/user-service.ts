import { Prisma, User, Role } from "@prisma/client";

import { hash, compare } from "bcrypt";

import prisma from "../db";
import logger from "../utils/logger";

export interface CreateUserDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
}

export interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
}

type UserWithoutPassword = Omit<User, "password">;

const SALT_ROUNDS = 10;

export class UserService {
  public static async createUser(
    userData: CreateUserDto,
  ): Promise<UserWithoutPassword> {
    try {
      const deletedUser = await prisma.user.findFirst({
        where: {
          email: userData.email,
          deletedAt: {
            not: null,
          },
        },
      });

      if (deletedUser) {
        await prisma.user.update({
          where: {
            id: deletedUser.id,
          },
          data: {
            deletedAt: null,
          },
        });
        return deletedUser;
      }

      const hashedPassword = await hash(userData.password, SALT_ROUNDS);

      const user = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
      });
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      logger.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002":
            throw new Error("User already exists");
          default:
            throw new Error("Internal server error");
        }
      }
      throw error;
    }
  }

  public static async getUsers(): Promise<Array<UserWithoutPassword>> {
    try {
      const users = await prisma.user.findMany({
        where: {
          deletedAt: null,
        },
      });
      const usersWithoutPassword = users.map(
        ({ password: _, ...rest }) => rest,
      );
      return usersWithoutPassword;
    } catch (error) {
      logger.error(error);
      throw new Error("Internal server error");
    }
  }

  public static async getUserById(
    id: string,
  ): Promise<UserWithoutPassword | null> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: id,
          deletedAt: null,
        },
      });
      if (!user) {
        return null;
      }
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      logger.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new Error("User not found");
        }
      }
      throw new Error("Internal server error");
    }
  }

  public static async updateUser(
    id: string,
    updateData: UpdateUserDto,
  ): Promise<UserWithoutPassword> {
    try {
      const updatedUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: updateData,
      });
      const { password: _, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      logger.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          logger.debug(`User not found with id: ${id}`);
          throw new Error("User not found");
        }
      }
      throw new Error("Internal server error");
    }
  }

  public static async updateUserPassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    const hashedPassword = await hash(newPassword, SALT_ROUNDS);
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  public static async deleteUser(id: string): Promise<void> {
    try {
      await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          logger.debug(`User not found with id: ${id}`);
          throw new Error("User not found");
        }
      }
      logger.error(error);
      throw new Error("Internal server error");
    }
    return;
  }

  public static async setRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken,
      },
    });
  }

  public static async getUserByRefreshToken(
    refreshToken: string,
  ): Promise<UserWithoutPassword | null> {
    const user = await prisma.user.findFirst({
      where: {
        refreshToken,
        deletedAt: null,
      },
    });

    if (!user) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
