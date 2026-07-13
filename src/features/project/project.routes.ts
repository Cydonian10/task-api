import { Router } from "express";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";

export class ProjectRouter {
  public static get routes(): Router {
    const router = Router();
    const service = new ProjectService();
    const controller = new ProjectController(service);

    router.post("/", controller.create);
    router.get("/", controller.getAll);
    router.get("/with-collaborators", controller.getAllWithCollaborators);
    router.get("/:id", controller.getById);
    router.get("/:id/with-collaborators", controller.getByIdWithCollaborators);
    router.put("/:id", controller.update);
    router.delete("/:id", controller.delete);
    return router;
  }
}
