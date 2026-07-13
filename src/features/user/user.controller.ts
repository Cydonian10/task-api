import { Request, Response } from "express";
import { validateBody } from "@/src/utils/validation/requestValidation.js";
import { CreateUserSchema } from "./dtos/create-user.dto.js";
import { UserService } from "./user.service.js";

export class UserController {
  constructor(private readonly userService: UserService) {}

  createUser = async (req: Request, res: Response) => {
    const parsedBody = validateBody(req, res, CreateUserSchema);
    if (!parsedBody.success) return;

    const result = await this.userService.createUser(parsedBody.data);

    if (result.isSuccess()) {
      return res.status(201).json({
        message: "User created successfully",
        data: result.getValue(),
      });
    }

    return res.status(result.getStatusCode()).json({
      message: result.getError() || "Failed to create user",
    });
  };

  getAllUsers = async (_req: Request, res: Response) => {
    const result = await this.userService.getAll();

    if (result.isSuccess()) {
      return res.status(200).json({
        message: "Users retrieved successfully",
        data: result.getValue(),
      });
    }

    return res.status(result.getStatusCode()).json({
      message: result.getError() || "Failed to retrieve users",
    });
  };

  updateUser = async (req: Request, res: Response) => {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const parsedBody = validateBody(req, res, CreateUserSchema.partial());

    if (!parsedBody.success) return;

    const result = await this.userService.updateUser(userId, parsedBody.data);
    if (result.isSuccess()) {
      return res.status(200).json({
        message: "User updated successfully",
        data: result.getValue(),
      });
    }

    return res.status(result.getStatusCode()).json({
      message: result.getError() || "Failed to update user",
    });
  };

  deleteUser = async (req: Request, res: Response) => {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const result = await this.userService.deleteUser(userId);

    if (result.isSuccess()) {
      return res.status(200).json({
        message: "User deleted successfully",
      });
    }

    return res.status(result.getStatusCode()).json({
      message: result.getError() || "Failed to delete user",
    });
  };

  getTasksByUserId = async (req: Request, res: Response) => {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const result = await this.userService.getTasksByUserId(userId);

    if (result.isSuccess()) {
      return res.status(200).json({
        message: "Tasks retrieved successfully",
        data: result.getValue(),
      });
    }

    return res.status(result.getStatusCode()).json({
      message: result.getError() || "Failed to retrieve tasks",
    });
  };
}
