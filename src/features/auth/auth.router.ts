import { Router } from "express";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { AuthMiddleware } from "@/src/middlewares/auth.middlware";

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
