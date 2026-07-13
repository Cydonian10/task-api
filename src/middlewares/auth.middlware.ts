import { JwtAdapter } from "@/src/common/adapters/jose/jwt-adapter.js";
import { Request, Response, NextFunction } from "express";
import { UserService } from "../features/user/user.service.js";

export class AuthMiddleware {
  static isAuthenticated = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const payload = await JwtAdapter.verifyToken(token);
    if (!payload) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userSrv = new UserService();
    const result = await userSrv.getByEmail(payload.email);

    if (!result.isSuccess()) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    req.user = result.getValue()!;
    next();
  };
}
