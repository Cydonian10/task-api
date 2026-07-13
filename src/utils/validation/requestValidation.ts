import { Request, Response } from "express";
import type { ZodType } from "zod";

export type Parsed<T> = { success: true; data: T } | { success: false };

/**
 * Validate a route param using a Zod schema. If invalid, responds 400 and returns { success: false }.
 * On success returns { success: true, data }
 */
export const validateParam = <T>(
  req: Request,
  res: Response,
  paramName: string,
  schema: ZodType<T>
): Parsed<T> => {
  const raw = req.params[paramName];
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    res.status(400).json({
      error: `Invalid parameter '${paramName}' in url`,
      details: parsed.error.issues,
    });
    return { success: false };
  }
  return { success: true, data: parsed.data };
};

/**
 * Validate request body using a Zod schema. If invalid, responds 400 and returns { success: false }.
 * On success returns { success: true, data }
 */
export const validateBody = <T>(
  req: Request,
  res: Response,
  schema: ZodType<T>
): Parsed<T> => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Invalid request data",
      details: parsed.error.issues,
    });
    return { success: false };
  }
  return { success: true, data: parsed.data };
};
/**
 * Validate request query using a Zod schema. If invalid, responds 400 and returns { success: false }.
 * On success returns { success: true, data }
 */
export const validateQuery = <T>(
  req: Request,
  res: Response,
  schema: ZodType<T>
): Parsed<T> => {
  const parsed = schema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({
      error: "Invalid query parameters",
      details: parsed.error.issues,
    });
    return { success: false };
  }
  return { success: true, data: parsed.data };
};
