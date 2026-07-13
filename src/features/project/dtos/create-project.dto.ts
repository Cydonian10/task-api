import { z } from "zod";

export const CreateProjectSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)),
  ownerId: z.number().int().positive().optional(),
  collaborators: z.array(z.number().int().positive()).optional(),
});

export type CreateProjectDTO = z.infer<typeof CreateProjectSchema>;
