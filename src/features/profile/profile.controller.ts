import { Request, Response } from "express";
import { ProfileService } from "./profile.service";

export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  getOwnerProjects = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;

    const result = await this.profileService.getOwnerProjects(userId!);
    if (!result.isSuccess()) {
      res
        .status(result.getStatusCode() || 500)
        .json({ message: result.getError() });
      return;
    }

    res.json({
      message: "Owned projects retrieved successfully",
      data: result.getValue(),
    });
  };

  getCollaborations = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const result = await this.profileService.getCollaborations(userId);
    if (!result.isSuccess()) {
      res
        .status(result.getStatusCode() || 500)
        .json({ message: result.getError() });
      return;
    }

    res.json({
      message: "Collaborations retrieved successfully",
      data: result.getValue(),
    });
  };
}
