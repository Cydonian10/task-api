import { AppDataSource } from "@/src/database/data-source";
import { CollaboratorEntity } from "@/src/database/entities/collaborator.entity";
import { Result } from "@/src/common/entities/result";
import { CreateCollaboratorDTO } from "./dtos/create-collaborator.dto";
import { CollaboratorDto } from "./dtos/collaborator.dto";

export class CollaboratorService {
  private readonly repo = AppDataSource.getRepository(CollaboratorEntity);

  async create(dto: CreateCollaboratorDTO): Promise<Result<CollaboratorDto>> {
    const collaborator = this.repo.create({
      userId: dto.userId,
      projectId: dto.projectId,
    });
    await this.repo.save(collaborator);

    const userEntity = await this.repo.findOne({
      where: { userId: collaborator.userId },
      relations: {
        user: true,
        tasks: true,
      },
    });

    return Result.success(CollaboratorDto.fromEntity(userEntity!));
  }

  async getAll(projectId: number): Promise<Result<CollaboratorDto[]>> {
    const collaborators = await this.repo.find({
      where: { projectId: projectId },
      relations: {
        user: true,
        tasks: true,
      },
    });

    const users = collaborators.map((collaborator) =>
      CollaboratorDto.fromEntity(collaborator),
    );

    return Result.success(users);
  }

  async delete(collaboratorId: number): Promise<Result<void>> {
    try {
      const collaborator = await this.repo.findOneBy({ id: collaboratorId });
      if (!collaborator) {
        return Result.error("Collaborator not found", 404);
      }
      await this.repo.remove(collaborator);
      return Result.success(undefined);
    } catch (error) {
      console.error("Error deleting collaborator:", error);
      return Result.error("Internal server error", 500);
    }
  }
}
