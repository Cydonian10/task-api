import { AppDataSource } from "@/src/database/data-source";
import { UserEntity } from "@/src/database/entities/user.entity";
import { Result } from "@/src/common/entities/result";
import { User } from "./entity/user.entity";
import { CreateUserDTO } from "./dtos/create-user.dto";
import { BcryptAdapter } from "@/src/common/adapters/bcrypt/bcrypt-adapter";
import { UserDto } from "./dtos/user.dto";
import { UpdateUserDTO } from "./dtos/update-user.dto";
import { TaskDto } from "../task/dtos/task.dto";
import { TaskEntity } from "@/src/database/entities/task.entity";

export class UserService {
  private readonly repo = AppDataSource.getRepository(UserEntity);
  private readonly taskRepo = AppDataSource.getRepository(TaskEntity);

  async createUser(dto: CreateUserDTO): Promise<Result<UserDto>> {
    const user = this.repo.create({
      name: dto.name,
      email: dto.email,
      passwordHash: BcryptAdapter.hash(dto.password),
      roles: dto.roles,
      dateOfBirth: dto.dateOfBirth,
    });

    const saved = await this.repo.save(user);
    return Result.success(UserDto.fromEntity(saved));
  }

  async getAll(): Promise<Result<UserDto[]>> {
    const users = await this.repo.find();
    return Result.success(users.map(UserDto.fromEntity));
  }

  async getByEmail(email: string): Promise<Result<User>> {
    const user = await this.repo.findOne({ where: { email } });

    if (!user) {
      return Result.error(`User not found with email ${email}`, 404);
    }

    return Result.success(User.fromObject(user));
  }

  async getById(id: number): Promise<Result<UserDto>> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      return Result.error(`User not found with id ${id}`, 404);
    }

    return Result.success(UserDto.fromEntity(user));
  }

  async updateUser(userId: number, dto: UpdateUserDTO) {
    const existing = await this.repo.findOne({ where: { id: userId } });
    if (!existing) {
      return Result.error(`User not found with id ${userId}`, 404);
    }

    if (dto.name !== undefined) existing.name = dto.name;
    if (dto.email !== undefined) existing.email = dto.email;
    if (dto.roles !== undefined) existing.roles = dto.roles;
    if (dto.dateOfBirth !== undefined) existing.dateOfBirth = dto.dateOfBirth;

    const saved = await this.repo.save(existing);
    return Result.success(UserDto.fromEntity(saved));
  }

  async deleteUser(userId: number) {
    const existing = await this.repo.findOne({ where: { id: userId } });
    if (!existing) {
      return Result.error(`User not found with id ${userId}`, 404);
    }

    await this.repo.remove(existing);
    return Result.success(undefined);
  }

  async getTasksByUserId(userId: number): Promise<Result<TaskDto[]>> {
    const query = this.taskRepo
      .createQueryBuilder("task")
      .innerJoinAndSelect("task.collaborator", "collaborator")
      .innerJoinAndSelect("collaborator.project", "project")
      .innerJoinAndSelect("project.owner", "owner")
      .where("collaborator.user_id = :userId", { userId });

    const tasks = await query.getMany();
    return Result.success(tasks.map((dto) => TaskDto.fromEntity(dto)));
  }
}
