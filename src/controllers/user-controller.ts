import { Request, Response } from "express";
import { UserService } from "../services/user-service";

import logger from "../utils/logger";

export class UserController {
  static async getUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getUsers();
      res.status(200).json(users);
    } catch (error) {
      logger.error(error);
      if (error instanceof Error) {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const user = await UserService.getUserById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      logger.error(error);
      if (error instanceof Error) {
        if (error.message === "User not found") {
          res.status(404).json({ error: "User not found" });
          return;
        }
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async createUser(req: Request, res: Response) {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      logger.error(error);
      if (error instanceof Error) {
        logger.error(error.message);
        if (error.message === "User already exists") {
          res.status(422).json({ error: "Unprocessable Entity" });
          return;
        }
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      await UserService.deleteUser(req.params.id);
      res.sendStatus(204);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
