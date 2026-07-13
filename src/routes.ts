import { Router } from "express";
import { UserRouter } from "./features/user/user.routes";
import { AuthRouter } from "./features/auth/auth.router";
import { ProjectRouter } from "./features/project/project.routes";
import { CollaboratorRouter } from "./features/collaborator/collaborator.routes";
import { TaskRouter } from "./features/task/task.routes";
import { ProfileRouter } from "./features/profile/profile.routes";
import { AuthMiddleware } from "./middlewares/auth.middlware";

export class AppRoutes {
  public static routes(): Router {
    const router = Router();

    router.use("/api/user", UserRouter.routes);

    router.use("/api/auth", AuthRouter.routes);

    router.use(
      "/api/project",
      AuthMiddleware.isAuthenticated,
      ProjectRouter.routes,
    );

    router.use(
      "/api/project",
      AuthMiddleware.isAuthenticated,
      CollaboratorRouter.routes,
    );

    router.use(
      "/api/collaborator",
      AuthMiddleware.isAuthenticated,
      TaskRouter.routes,
    );

    router.use(
      "/api/profile",
      AuthMiddleware.isAuthenticated,
      ProfileRouter.routes,
    );

    router.use("/api/prueba", (_req, res) => {
      res.json({ message: "Hola desde la ruta de prueba!" });
    });
    return router;
  }
}
