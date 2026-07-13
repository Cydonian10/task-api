import { Request, Response } from "express";
import { validateBody } from "@/src/utils/validation/requestValidation";
import { CreateTaskSchema } from "./dtos/create-task.dto";
import { UpdateTaskSchema } from "./dtos/update-task.dto";
import { TaskService } from "./task.service";

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  create = async (req: Request, res: Response) => {
    console.log("Request body al crear:", req.body); // Log the request body for debugging
    const collaboratorId = +req.params.id;
    req.body.collaboratorId = collaboratorId;

    const validationResult = validateBody(req, res, CreateTaskSchema);
    if (!validationResult.success) return;

    const result = await this.taskService.create(validationResult.data);

    if (!result.isSuccess()) {
      return res.status(result.getStatusCode()).json({
        message: result.getError(),
      });
    }

    return res.status(201).json({
      message: "Task created successfully",
      data: result.getValue(),
    });
  };

  getAll = async (req: Request, res: Response) => {
    const collaboratorId = +req.params.id;
    const result = await this.taskService.getAll(collaboratorId);

    if (!result.isSuccess()) {
      return res.status(result.getStatusCode()).json({
        message: result.getError(),
      });
    }

    return res.status(200).json({
      message: "Tasks retrieved successfully",
      data: result.getValue(),
    });
  };

  getById = async (req: Request, res: Response) => {
    const taskId = +req.params.taskId;
    const result = await this.taskService.getById(taskId);

    if (!result.isSuccess()) {
      return res.status(result.getStatusCode()).json({
        message: result.getError(),
      });
    }

    return res.status(200).json({
      message: "Task retrieved successfully",
      data: result.getValue(),
    });
  };

  update = async (req: Request, res: Response) => {
    const taskId = +req.params.taskId;

    const validationResult = validateBody(req, res, UpdateTaskSchema);
    if (!validationResult.success) return;

    const result = await this.taskService.update(taskId, validationResult.data);

    if (!result.isSuccess()) {
      return res.status(result.getStatusCode()).json({
        message: result.getError(),
      });
    }

    return res.status(200).json({
      message: "Task updated successfully",
      data: result.getValue(),
    });
  };

  delete = async (req: Request, res: Response) => {
    const taskId = +req.params.taskId;
    const result = await this.taskService.delete(taskId);

    if (!result.isSuccess()) {
      return res.status(result.getStatusCode()).json({
        message: result.getError(),
      });
    }

    return res.status(200).json({
      message: "Task deleted successfully",
    });
  };

  complete = async (req: Request, res: Response) => {
    const taskId = +req.params.taskId;
    const result = await this.taskService.complete(taskId);

    if (!result.isSuccess()) {
      return res.status(result.getStatusCode()).json({
        message: result.getError(),
      });
    }

    return res.status(200).json({
      message: "Task completed successfully",
      data: result.getValue(),
    });
  };
}
