import { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { validateBody } from "@/src/utils/validation/requestValidation.js";
import { LoginDtoSchema } from "./dtos/login-dto.js";

export class AuthController {
  constructor(private authSrv: AuthService) {}

  loginUser = async (req: Request, res: Response) => {
    const parsedBody = validateBody(req, res, LoginDtoSchema);
    if (!parsedBody.success) return;

    const result = await this.authSrv.loginUser(parsedBody.data);

    if (result.isFailure()) {
      const error = result.getError()!;
      return res.status(result.getStatusCode()).json({ success: false, error });
    }

    return res.status(200).json({ success: true, data: result.getValue() });
  };

  profile = async (req: Request, res: Response) => {
    const user = req.user!;

    return res.status(200).json({ success: true, data: user });
  };
}
