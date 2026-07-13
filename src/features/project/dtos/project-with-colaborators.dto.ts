import { ProjectEntity } from "@/src/database/entities/project.entity.js";
import { ProjectDto } from "./project.dto.js";

export class CollaboratorInfoDto {
  constructor(
    public id: number,
    public userId: number,
    public userName: string,
    public userEmail: string,
  ) {}
}

export class ProjectWithCollaboratorsDto extends ProjectDto {
  constructor(
    id: number,
    name: string,
    description: string,
    startDate: Date,
    endDate: Date,
    ownerId: number,
    public collaborators: CollaboratorInfoDto[],
  ) {
    super(id, name, description, startDate, endDate, ownerId);
  }

  public static fromEntityWithCollaborators(
    object: ProjectEntity,
  ): ProjectWithCollaboratorsDto {
    const collaborators = (object.collaborators || []).map((collab) => {
      return new CollaboratorInfoDto(
        Number(collab.id),
        Number(collab.userId),
        String(collab.user?.name ?? ""),
        String(collab.user?.email ?? ""),
      );
    });

    return new ProjectWithCollaboratorsDto(
      Number(object.id),
      String(object.name),
      String(object.description),
      object.startDate,
      object.endDate,
      Number(object.ownerId),
      collaborators,
    );
  }
}
