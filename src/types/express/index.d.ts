import { User } from "../../features/user/entity/user.entity";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
