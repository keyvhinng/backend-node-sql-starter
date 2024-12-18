import { Router } from "express";

import { UserController } from "../controllers/user-controller";

import { validateCreateUserInput } from "../middlewares/validate-create-user-input";

const router = Router();

router.get("/", UserController.getUsers);
router.get("/:id", UserController.getUserById);
router.post("/", validateCreateUserInput, UserController.createUser);
router.delete("/:id", UserController.deleteUser);

export default router;
