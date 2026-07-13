import { describe, it, expect, vi } from "vitest";
import {
  errorHandler,
  customHandlerError,
  logsErrors,
} from "@/src/middlewares/error.middlware.js";
import { CustomError } from "@/src/common/entities/custom-error.js";

vi.mock("@/src/config/logger", () => ({
  default: { error: vi.fn(), warn: vi.fn() },
}));

const crearMockReq = () =>
  ({
    method: "GET",
    url: "/api/test",
    get: vi.fn(),
  }) as any;

const crearMockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("error middlewares", () => {
  describe("logsErrors", () => {
    it("debería loguear el error y llamar a next", () => {
      const error = new Error("test error");
      const req = crearMockReq();
      const res = crearMockRes();
      const next = vi.fn();

      logsErrors(error, req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("errorHandler", () => {
    it("debería retornar 500 con mensaje de error", () => {
      const error = new Error("algo explotó");
      const req = crearMockReq();
      const res = crearMockRes();
      const next = vi.fn();

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("algo explotó"),
        }),
      );
    });
  });

  describe("customHandlerError", () => {
    it("debería manejar CustomError con su código de estado", () => {
      const error = CustomError.notFound("usuario no encontrado");
      const req = crearMockReq();
      const res = crearMockRes();
      const next = vi.fn();

      customHandlerError(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 404,
        error: "usuario no encontrado",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("debería pasar al siguiente middleware si no es CustomError", () => {
      const error = new Error("error genérico");
      const req = crearMockReq();
      const res = crearMockRes();
      const next = vi.fn();

      customHandlerError(error, req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
    });

    it("debería manejar CustomError badRequest (400)", () => {
      const error = CustomError.badRequest("datos inválidos");
      const req = crearMockReq();
      const res = crearMockRes();
      const next = vi.fn();

      customHandlerError(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 400,
        error: "datos inválidos",
      });
    });
  });
});
