import z from "zod";

export const NumberSchema = z.coerce.number().int().positive();
