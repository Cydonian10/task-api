import { Router } from "express";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

export class UserRouter {
  public static get routes(): Router {
    const router = Router();
    const userService = new UserService();
    const userController = new UserController(userService);

    /**
     * api/user/*
     */

    router.post("/", userController.createUser);
    router.get("/", userController.getAllUsers);
    router.put("/:id", userController.updateUser);
    router.delete("/:id", userController.deleteUser);
    router.get("/:id/tasks", userController.getTasksByUserId);

    return router;
  }
}
