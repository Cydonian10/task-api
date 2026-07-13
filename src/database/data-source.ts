import "reflect-metadata";
import { DataSource } from "typeorm";
import { envs } from "@/src/config/envs.js";
import { UserEntity } from "./entities/user.entity.js";
import { ProjectEntity } from "./entities/project.entity.js";
import { CollaboratorEntity } from "./entities/collaborator.entity.js";
import { TaskEntity } from "./entities/task.entity.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: envs.POSTGRES_HOST,
  port: envs.POSTGRES_PORT,
  username: envs.POSTGRES_USER,
  password: envs.POSTGRES_PASSWORD,
  database: envs.POSTGRES_DB_NAME,
  entities: [UserEntity, ProjectEntity, CollaboratorEntity, TaskEntity],
  dropSchema: false,
  synchronize: true,
  ssl: envs.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});
