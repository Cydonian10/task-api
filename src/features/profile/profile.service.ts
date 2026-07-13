import { AppDataSource } from "@/src/database/data-source";
import { UserEntity } from "@/src/database/entities/user.entity";
import { Result } from "@/src/common/entities/result";
import { ProjectEntity } from "@/src/database/entities/project.entity";
import { CollaboratorEntity } from "@/src/database/entities/collaborator.entity";
import { TaskEntity, TaskStatus } from "@/src/database/entities/task.entity";
import {
  CollaborationEntry,
  CollaborationsResponse,
  OwnedProjectsResponse,
} from "./dtos/profile-responses.dto";
import { ProjectDto } from "../project/dtos/project.dto";
import { In } from "typeorm";

export class ProfileService {
  private readonly userRepo = AppDataSource.getRepository(UserEntity);
  private readonly projectRepo = AppDataSource.getRepository(ProjectEntity);
  private readonly collaboratorRepo =
    AppDataSource.getRepository(CollaboratorEntity);
  private readonly taskRepo = AppDataSource.getRepository(TaskEntity);

  async getOwnerProjects(
    userId: number,
  ): Promise<Result<OwnedProjectsResponse>> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      return Result.error(`User not found with id ${userId}`, 404);
    }

    const projects = await this.projectRepo.find({
      where: { ownerId: userId },
      order: { id: "DESC" },
    });

    return Result.success(
      new OwnedProjectsResponse(
        projects.length,
        projects.map(ProjectDto.fromEntity),
      ),
    );
  }

  async getCollaborations(
    userId: number,
  ): Promise<Result<CollaborationsResponse>> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      return Result.error(`User not found with id ${userId}`, 404);
    }

    const collaborations = await this.collaboratorRepo.find({
      where: { userId },
      relations: {
        project: true,
      },
      order: { projectId: "ASC" },
    });

    if (collaborations.length === 0) {
      return Result.success(new CollaborationsResponse(0, []));
    }

    const projectIds = collaborations.map((c) => c.projectId);

    const tasks = await this.taskRepo.find({
      where: {
        collaboratorId: In(projectIds),
      },
    });

    const tasksByCollaborator: Record<
      number,
      { total: number; completed: number }
    > = {};
    for (const task of tasks) {
      if (!tasksByCollaborator[task.collaboratorId]) {
        tasksByCollaborator[task.collaboratorId] = { total: 0, completed: 0 };
      }
      tasksByCollaborator[task.collaboratorId].total += 1;
      if (task.status === TaskStatus.COMPLETED) {
        tasksByCollaborator[task.collaboratorId].completed += 1;
      }
    }

    const entries: CollaborationEntry[] = collaborations.map((collab) => {
      const stats = tasksByCollaborator[collab.id] ?? {
        total: 0,
        completed: 0,
      };
      const progressPercentage =
        stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

      return {
        projectId: collab.project.id,
        projectName: collab.project.name,
        projectDescription: collab.project.description,
        totalTasks: stats.total,
        completedTasks: stats.completed,
        progressPercentage,
      };
    });

    return Result.success(new CollaborationsResponse(entries.length, entries));
  }
}
