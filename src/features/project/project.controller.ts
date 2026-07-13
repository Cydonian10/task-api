import { Request, Response } from "express";
import { validateBody } from "@/src/utils/validation/requestValidation";
import { CreateProjectSchema } from "./dtos/create-project.dto";
import { ProjectService } from "./project.service";

export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  create = async (req: Request, res: Response) => {
    req.body.ownerId = req.user!.id;

    const parsed = validateBody(req, res, CreateProjectSchema);
    if (!parsed.success) return;

    const result = await this.projectService.create(parsed.data);

    if (result.isSuccess()) {
      return res.status(result.getStatusCode()).json({
        message: "Project created successfully",
        data: result.getValue(),
      });
    }

    return res.status(result.getStatusCode()).json({
      message: result.getError() || "Failed to create project",
    });
  };

  getAll = async (_req: Request, res: Response) => {
    const result = await this.projectService.getAll();

    if (result.isSuccess()) {
      return res.status(200).json({
        message: "Projects retrieved successfully",
        data: result.getValue(),
      });
    }

    return res.status(result.getStatusCode()).json({
      message: result.getError() || "Failed to retrieve projects",
    });
  };

  getAllWithCollaborators = async (_req: Request, res: Response) => {
    const result = await this.projectService.getAllWithCollaborators();

    if (result.isSuccess()) {
      return res.status(200).json({
        message: "Projects with collaborators retrieved successfully",
        data: result.getValue(),
      });
    }

    return res.status(result.getStatusCode()).json({
      message:
        result.getError() || "Failed to retrieve projects with collaborators",
    });
  };

  getById = async (req: Request, res: Response) => {
    const projectId = Number(req.params.id);

    if (isNaN(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const result = await this.projectService.getById(projectId);

    if (result.isSuccess()) {
      return res.status(200).json({
        message: "Project retrieved successfully",
        data: result.getValue(),
      });
    }

    return res.status(result.getStatusCode()).json({
      message: result.getError() || "Failed to retrieve project",
    });
  };

  getByIdWithCollaborators = async (req: Request, res: Response) => {
    const projectId = Number(req.params.id);

    if (isNaN(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const result =
      await this.projectService.getByIdWithCollaborators(projectId);

    if (result.isSuccess()) {
      return res.status(200).json({
        message: "Project with collaborators retrieved successfully",
        data: result.getValue(),
      });
    }

    return res.status(result.getStatusCode()).json({
      message:
        result.getError() || "Failed to retrieve project with collaborators",
    });
  };

  update = async (req: Request, res: Response) => {
    const projectId = Number(req.params.id);

    if (isNaN(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const parsed = validateBody(req, res, CreateProjectSchema.partial());

    if (!parsed.success) return;

    const result = await this.projectService.update(projectId, parsed.data);

    if (result.isSuccess()) {
      return res.status(200).json({
        message: "Project updated successfully",
        data: result.getValue(),
      });
    }

    return res.status(result.getStatusCode()).json({
      message: result.getError() || "Failed to update project",
    });
  };

  delete = async (req: Request, res: Response) => {
    const projectId = Number(req.params.id);

    if (isNaN(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const result = await this.projectService.delete(projectId);

    if (result.isSuccess()) {
      return res.status(200).json({
        message: "Project deleted successfully",
      });
    }

    return res.status(result.getStatusCode()).json({
      message: result.getError() || "Failed to delete project",
    });
  };
}
