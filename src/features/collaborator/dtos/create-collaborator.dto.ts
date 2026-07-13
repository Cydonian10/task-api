import { z } from "zod";

export const CreateCollaboratorSchema = z.object({
  userId: z.number().int().positive(),
  projectId: z.number().int().positive().optional(),
});

export type CreateCollaboratorDTO = z.infer<typeof CreateCollaboratorSchema>;
