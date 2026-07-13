import { Router } from "express";
import { AuthService } from "./auth.service.js";
import { AuthController } from "./auth.controller.js";
import { AuthMiddleware } from "@/src/middlewares/auth.middlware.js";

export class AuthRouter {
  public static get routes(): Router {
    const router = Router();
    const authSrv = new AuthService();
    const authController = new AuthController(authSrv);

    router.post("/login", authController.loginUser);
    router.get(
      "/profile",
      AuthMiddleware.isAuthenticated,
      authController.profile,
    );

    return router;
  }
}
