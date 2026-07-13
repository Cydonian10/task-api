import { Router } from "express";
import { ProfileController } from "./profile.controller.js";
import { ProfileService } from "./profile.service.js";

export class ProfileRouter {
  public static get routes(): Router {
    const router = Router();
    const service = new ProfileService();
    const controller = new ProfileController(service);

    router.get("/owned-projects", controller.getOwnerProjects);
    router.get("/collaborations", controller.getCollaborations);
    return router;
  }
}
