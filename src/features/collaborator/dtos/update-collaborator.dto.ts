import { z } from "zod";
import { CreateCollaboratorSchema } from "./create-collaborator.dto";

export const UpdateCollaboratorSchema = CreateCollaboratorSchema.partial();

export type UpdateCollaboratorDTO = z.infer<typeof UpdateCollaboratorSchema>;
