import { AppDataSource } from "@/src/database/data-source.js";
import { ProjectEntity } from "@/src/database/entities/project.entity.js";
import { UserEntity } from "@/src/database/entities/user.entity.js";
import { CollaboratorEntity } from "@/src/database/entities/collaborator.entity.js";
import { Result } from "@/src/common/entities/result.js";
import { CreateProjectDTO } from "./dtos/create-project.dto.js";
import { UpdateProjectDTO } from "./dtos/update-project.dto.js";
import { ProjectDto } from "./dtos/project.dto.js";
import { In } from "typeorm";
import { ProjectWithCollaboratorsDto } from "./dtos/project-with-colaborators.dto.js";

export class ProjectService {
  private readonly repo = AppDataSource.getRepository(ProjectEntity);
  private readonly dataSource = AppDataSource;

  async create(dto: CreateProjectDTO): Promise<Result<ProjectDto>> {
    return await this.dataSource.transaction(async (manager) => {
      const project = manager.create(ProjectEntity, {
        name: dto.name,
        description: dto.description,
        startDate: dto.startDate,
        endDate: dto.endDate,
        ownerId: dto.ownerId,
      });

      const savedProject = await manager.save(project);

      if (dto.collaborators && dto.collaborators.length > 0) {
        const existingUsers = await manager.find(UserEntity, {
          where: { id: In(dto.collaborators) },
        });

        if (existingUsers.length !== dto.collaborators.length) {
          return Result.error<ProjectDto>(
            "One or more collaborators do not exist",
            400,
          );
        }

        const collaborators = dto.collaborators.map((userId) => {
          return manager.create(CollaboratorEntity, {
            projectId: savedProject.id,
            userId,
          });
        });

        await manager.save(collaborators);
      }

      return Result.success(ProjectDto.fromEntity(savedProject), 201);
    });
  }

  async getAll(): Promise<Result<ProjectDto[]>> {
    const projects = await this.repo.find();
    return Result.success(projects.map(ProjectDto.fromEntity));
  }

  async getAllWithCollaborators(): Promise<
    Result<ProjectWithCollaboratorsDto[]>
  > {
    const projects = await this.repo.find({
      relations: {
        collaborators: { user: true },
      },
    });
    return Result.success(
      projects.map(ProjectWithCollaboratorsDto.fromEntityWithCollaborators),
    );
  }

  async getById(id: number): Promise<Result<ProjectDto>> {
    const project = await this.repo.findOne({ where: { id } });
    if (!project) {
      return Result.error(`Project not found with id ${id}`, 404);
    }
    return Result.success(ProjectDto.fromEntity(project));
  }

  async getByIdWithCollaborators(
    id: number,
  ): Promise<Result<ProjectWithCollaboratorsDto>> {
    const project = await this.repo.findOne({
      where: { id },
      relations: {
        collaborators: { user: true },
      },
    });
    if (!project) {
      return Result.error(`Project not found with id ${id}`, 404);
    }
    return Result.success(
      ProjectWithCollaboratorsDto.fromEntityWithCollaborators(project),
    );
  }

  async update(id: number, dto: UpdateProjectDTO): Promise<Result<ProjectDto>> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) {
      return Result.error(`Project not found with id ${id}`, 404);
    }

    if (dto.name !== undefined) existing.name = dto.name;
    if (dto.description !== undefined) existing.description = dto.description;
    if (dto.startDate !== undefined) existing.startDate = dto.startDate;
    if (dto.endDate !== undefined) existing.endDate = dto.endDate;

    const saved = await this.repo.save(existing);
    return Result.success(ProjectDto.fromEntity(saved));
  }

  async delete(id: number): Promise<Result<void>> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) {
      return Result.error(`Project not found with id ${id}`, 404);
    }

    await this.repo.remove(existing);
    return Result.success(undefined);
  }
}
