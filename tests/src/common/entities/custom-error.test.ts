import { describe, it, expect } from "vitest";
import { CustomError } from "@/src/common/entities/custom-error.js";

describe("CustomError", () => {
  describe("constructor", () => {
    it("debería crear un error con mensaje y código de estado", () => {
      const error = new CustomError("algo salió mal", 400);

      expect(error.message).toBe("algo salió mal");
      expect(error.statusCode).toBe(400);
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(CustomError);
    });
  });

  describe("badRequest", () => {
    it("debería crear un error con código 400", () => {
      const error = CustomError.badRequest("petición inválida");

      expect(error.message).toBe("petición inválida");
      expect(error.statusCode).toBe(400);
    });
  });

  describe("notFound", () => {
    it("debería crear un error con código 404", () => {
      const error = CustomError.notFound("recurso no encontrado");

      expect(error.message).toBe("recurso no encontrado");
      expect(error.statusCode).toBe(404);
    });
  });

  describe("forbidden", () => {
    it("debería crear un error con código 403", () => {
      const error = CustomError.forbidden("acceso denegado");

      expect(error.message).toBe("acceso denegado");
      expect(error.statusCode).toBe(403);
    });
  });

  describe("unauthorized", () => {
    it("debería crear un error con código 401", () => {
      const error = CustomError.unauthorized("no autorizado");

      expect(error.message).toBe("no autorizado");
      expect(error.statusCode).toBe(401);
    });
  });

  describe("internalServerError", () => {
    it("debería crear un error con código 500", () => {
      const error = CustomError.internalServerError("error interno");

      expect(error.message).toBe("error interno");
      expect(error.statusCode).toBe(500);
    });
  });
});
