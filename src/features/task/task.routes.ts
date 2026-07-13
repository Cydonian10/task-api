import { Router } from "express";
import { TaskController } from "./task.controller.js";
import { TaskService } from "./task.service.js";

export class TaskRouter {
  public static get routes(): Router {
    const router = Router();
    const service = new TaskService();
    const controller = new TaskController(service);

    router.post("/:id/tasks", controller.create);
    router.get("/:id/tasks", controller.getAll);
    router.get("/:id/tasks/:taskId", controller.getById);
    router.put("/:id/tasks/:taskId", controller.update);
    router.delete("/:id/tasks/:taskId", controller.delete);
    router.patch("/:id/tasks/:taskId/complete", controller.complete);
    return router;
  }
}
