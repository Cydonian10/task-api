import "reflect-metadata";
import { DataSource } from "typeorm";
import { envs } from "@/src/config/envs";
import { UserEntity } from "./entities/user.entity";
import { ProjectEntity } from "./entities/project.entity";
import { CollaboratorEntity } from "./entities/collaborator.entity";
import { TaskEntity } from "./entities/task.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: envs.POSTGRES_HOST,
  port: envs.POSTGRES_PORT,
  username: envs.POSTGRES_USER,
  password: envs.POSTGRES_PASSWORD,
  database: envs.POSTGRES_DB_NAME,
  entities: [UserEntity, ProjectEntity, CollaboratorEntity, TaskEntity],
  dropSchema: false,
  synchronize: envs.NODE_ENV !== "production",
});
