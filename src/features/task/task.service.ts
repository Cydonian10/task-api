import { AppDataSource } from "@/src/database/data-source.js";
import { TaskEntity, TaskStatus } from "@/src/database/entities/task.entity.js";
import { Result } from "@/src/common/entities/result.js";
import { CreateTaskDTO } from "./dtos/create-task.dto.js";
import { UpdateTaskDTO } from "./dtos/update-task.dto.js";
import { TaskDto } from "./dtos/task.dto.js";
import { notifyTaskCompleted } from "@/src/dashboard/index.js";

export class TaskService {
  private readonly repo = AppDataSource.getRepository(TaskEntity);

  async create(dto: CreateTaskDTO): Promise<Result<TaskDto>> {
    const task = this.repo.create(dto);
    await this.repo.save(task);
    return Result.success(TaskDto.fromEntity(task), 201);
  }

  async getAll(collaboratorId: number): Promise<Result<TaskDto[]>> {
    const tasks = await this.repo.find({
      where: { collaboratorId },
    });
    return Result.success(tasks.map(TaskDto.fromEntity));
  }

  async getById(id: number): Promise<Result<TaskDto>> {
    const task = await this.repo.findOneBy({ id });
    if (!task) {
      return Result.error("Task not found", 404);
    }
    return Result.success(TaskDto.fromEntity(task));
  }

  async update(id: number, dto: UpdateTaskDTO): Promise<Result<TaskDto>> {
    const task = await this.repo.findOne({
      where: { id },
      relations: { collaborator: { project: true } },
    });

    if (!task) {
      return Result.error("Task not found", 404);
    }

    this.repo.merge(task, dto);

    notifyTaskCompleted({
      taskId: task.id,
      taskTitle: task.title,
      collaboratorId: task.collaboratorId,
      projectId: task.collaborator.projectId,
      completedAt: new Date().toISOString(),
      projectName: task.collaborator.project.name,
      status: task.status,
    });

    await this.repo.save(task);
    return Result.success(TaskDto.fromEntity(task));
  }

  async delete(id: number): Promise<Result<void>> {
    const task = await this.repo.findOneBy({ id });
    if (!task) {
      return Result.error("Task not found", 404);
    }
    await this.repo.remove(task);
    return Result.success(undefined);
  }

  async complete(id: number): Promise<Result<TaskDto>> {
    const task = await this.repo.findOne({
      where: { id },
      relations: { collaborator: { project: true } },
    });
    if (!task) {
      return Result.error("Task not found", 404);
    }
    task.status = TaskStatus.COMPLETED;
    const saved = await this.repo.save(task);

    return Result.success(TaskDto.fromEntity(saved));
  }
}
