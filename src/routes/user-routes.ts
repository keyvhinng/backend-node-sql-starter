import { Router } from "express";

import { UserController } from "../controllers/user-controller";

import { authMiddleware, validateCreateUserInput } from "../middlewares";

const router = Router();

router.get("/", UserController.getUsers);
router.get("/:id", UserController.getUserById);
router.post("/", validateCreateUserInput, UserController.createUser);
router.delete("/:id", authMiddleware, UserController.deleteUser);

export default router;
