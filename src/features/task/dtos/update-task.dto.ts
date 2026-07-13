import { z } from "zod";
import { CreateTaskSchema } from "./create-task.dto";

export const UpdateTaskSchema = CreateTaskSchema.partial();

export type UpdateTaskDTO = z.infer<typeof UpdateTaskSchema>;
