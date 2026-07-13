import z from "zod";
import { CreateUserSchema } from "./create-user.dto";

export const UpdateUserSchema = CreateUserSchema.partial();

export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
