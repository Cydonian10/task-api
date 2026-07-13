import { CollaboratorEntity } from "@/src/database/entities/collaborator.entity";
import { TaskEntity } from "@/src/database/entities/task.entity";

export class CollaboratorDto {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public age: number,
    public dateBirth: string,
    public tareas: Partial<TaskEntity>[] = [],
  ) {}

  public static fromEntity(object: CollaboratorEntity): CollaboratorDto {
    const { id, name, email, dateOfBirth } = object.user;

    return new CollaboratorDto(
      Number(object.id),
      name,
      email,
      new Date().getFullYear() - new Date(dateOfBirth).getFullYear(),
      dateOfBirth.toISOString(),
      object.tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
      })),
    );
  }
}
