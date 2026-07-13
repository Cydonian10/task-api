import { ProjectEntity } from "@/src/database/entities/project.entity.js";

export class ProjectDto {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public startDate: Date,
    public endDate: Date,
    public ownerId: number,
  ) {}

  public static fromEntity(object: ProjectEntity): ProjectDto {
    return new ProjectDto(
      Number(object.id),
      String(object.name),
      String(object.description),
      object.startDate,
      object.endDate,
      Number(object.ownerId),
    );
  }
}
