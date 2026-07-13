import { Router } from "express";
import { CollaboratorController } from "./collaborator.controller";
import { CollaboratorService } from "./collaborator.service";

export class CollaboratorRouter {
  public static get routes(): Router {
    const router = Router();
    const service = new CollaboratorService();
    const controller = new CollaboratorController(service);

    /**
     * route api/project/*
     */

    router.post("/:id/collaborator", controller.create);
    router.get("/:id/collaborator", controller.getAll);
    router.delete("/:id/collaborator/:collaboratorId", controller.delete);
    return router;
  }
}
