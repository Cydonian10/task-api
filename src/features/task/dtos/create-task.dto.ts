import { TaskStatus } from "@/src/database/entities/task.entity";
import { z } from "zod";

export const CreateTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  status: z.preprocess(
    (value) => (typeof value === "string" ? value.replace(/ /g, "_") : value),
    z.enum(Object.values(TaskStatus)),
  ),
  dueDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  order: z.number().nonnegative(),
  collaboratorId: z.number().int().positive(),
});

export type CreateTaskDTO = z.infer<typeof CreateTaskSchema>;
