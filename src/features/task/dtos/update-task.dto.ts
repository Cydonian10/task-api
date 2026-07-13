import { z } from "zod";
import { CreateTaskSchema } from "./create-task.dto.js";

export const UpdateTaskSchema = CreateTaskSchema.partial();

export type UpdateTaskDTO = z.infer<typeof UpdateTaskSchema>;
