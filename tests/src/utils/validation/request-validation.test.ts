import { describe, it, expect, vi } from "vitest";
import { validateBody, validateParam, validateQuery } from "@/src/utils/validation/requestValidation";
import { z } from "zod";

const crearMockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const TestSchema = z.object({
  nombre: z.string().min(2),
  edad: z.number().positive(),
});

const NumberParam = z.coerce.number().int().positive();

describe("requestValidation", () => {
  describe("validateBody", () => {
    it("debería retornar éxito con datos válidos", () => {
      const req: any = { body: { nombre: "Juan", edad: 25 } };
      const res = crearMockRes();

      const result = validateBody(req, res, TestSchema);

      expect(result).toEqual({ success: true, data: { nombre: "Juan", edad: 25 } });
      expect(res.status).not.toHaveBeenCalled();
    });

    it("debería retornar fallo y enviar 400 con datos inválidos", () => {
      const req: any = { body: { nombre: "A", edad: -1 } };
      const res = crearMockRes();

      const result = validateBody(req, res, TestSchema);

      expect(result).toEqual({ success: false });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: "Invalid request data" })
      );
    });
  });

  describe("validateParam", () => {
    it("debería retornar éxito con parámetro válido", () => {
      const req: any = { params: { id: "5" } };
      const res = crearMockRes();

      const result = validateParam(req, res, "id", NumberParam);

      expect(result).toEqual({ success: true, data: 5 });
    });

    it("debería retornar fallo con parámetro inválido", () => {
      const req: any = { params: { id: "-1" } };
      const res = crearMockRes();

      const result = validateParam(req, res, "id", NumberParam);

      expect(result).toEqual({ success: false });
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("validateQuery", () => {
    it("debería retornar éxito con query válido", () => {
      const req: any = { query: { nombre: "María", edad: 30 } };
      const res = crearMockRes();

      const result = validateQuery(req, res, TestSchema);

      expect(result).toEqual({ success: true, data: { nombre: "María", edad: 30 } });
    });

    it("debería retornar fallo con query inválido", () => {
      const req: any = { query: { nombre: "", edad: 0 } };
      const res = crearMockRes();

      const result = validateQuery(req, res, TestSchema);

      expect(result).toEqual({ success: false });
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
