import { TaskEntity } from "@/src/database/entities/task.entity.js";

export class TaskDto {
  constructor(
    public id: number,
    public title: string,
    public description: string | null,
    public status: string,
    public dueDate: Date | null,
    public order: number,
    public collaboratorId: number,
    public owner?: string,
    public projectName?: string,
  ) {}

  public static fromEntity(object: TaskEntity): TaskDto {
    const status = object.status.includes("_")
      ? object.status.replace("_", " ")
      : object.status;

    const owner = object.collaborator?.project?.owner?.name;
    const projectName = object.collaborator?.project?.name;

    return new TaskDto(
      Number(object.id),
      String(object.title),
      object.description,
      status,
      object.dueDate,
      Number(object.order),
      Number(object.collaboratorId),
      owner,
      projectName,
    );
  }
}
