import { Request, Response } from "express";
import { validateBody } from "@/src/utils/validation/requestValidation";
import { CreateCollaboratorSchema } from "./dtos/create-collaborator.dto";
import { CollaboratorService } from "./collaborator.service";

export class CollaboratorController {
  constructor(private readonly collaboratorService: CollaboratorService) {}

  create = async (req: Request, res: Response) => {
    const proyectoId = +req.params.id;
    req.body.projectId = proyectoId;

    const validationResult = validateBody(req, res, CreateCollaboratorSchema);
    if (!validationResult.success) return;

    const result = await this.collaboratorService.create(validationResult.data);

    if (!result.isSuccess()) {
      const statusCode = result.getStatusCode();
      const error = result.getError();
      return res.status(statusCode).json({
        message: error,
      });
    }

    return res.status(201).json({
      message: "Collaborator created successfully",
      data: result.getValue(),
    });
  };

  getAll = async (_req: Request, res: Response) => {
    const projectId = +_req.params.id;
    const result = await this.collaboratorService.getAll(projectId);

    if (!result.isSuccess()) {
      const statusCode = result.getStatusCode();
      const error = result.getError();
      return res.status(statusCode).json({
        message: error,
      });
    }

    return res.status(200).json({
      message: "Collaborators retrieved successfully",
      data: result.getValue(),
    });
  };

  delete = async (req: Request, res: Response) => {
    const collaboratorId = +req.params.collaboratorId;
    const result = await this.collaboratorService.delete(collaboratorId);

    if (!result.isSuccess()) {
      const statusCode = result.getStatusCode();
      const error = result.getError();
      return res.status(statusCode).json({
        message: error,
      });
    }

    return res.status(200).json({
      message: "Collaborator deleted successfully",
    });
  };
}
