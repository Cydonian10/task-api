import { describe, it, expect } from "vitest";
import { Result } from "@/src/common/entities/result";

describe("Result", () => {
  describe("success", () => {
    it("debería crear un resultado exitoso con valor", () => {
      const result = Result.success({ id: 1, name: "test" });

      expect(result.isSuccess()).toBe(true);
      expect(result.isFailure()).toBe(false);
      expect(result.getValue()).toEqual({ id: 1, name: "test" });
      expect(result.getError()).toBeUndefined();
      expect(result.getStatusCode()).toBe(200);
    });

    it("debería crear un resultado exitoso sin valor", () => {
      const result = Result.success();

      expect(result.isSuccess()).toBe(true);
      expect(result.getValue()).toBeUndefined();
      expect(result.getStatusCode()).toBe(200);
    });

    it("debería aceptar un código de estado personalizado", () => {
      const result = Result.success("creado", 201);

      expect(result.isSuccess()).toBe(true);
      expect(result.getValue()).toBe("creado");
      expect(result.getStatusCode()).toBe(201);
    });
  });

  describe("error", () => {
    it("debería crear un resultado de error con mensaje", () => {
      const result = Result.error("algo falló");

      expect(result.isSuccess()).toBe(false);
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe("algo falló");
      expect(result.getValue()).toBeUndefined();
      expect(result.getStatusCode()).toBe(500);
    });

    it("debería aceptar un código de estado personalizado", () => {
      const result = Result.error("no encontrado", 404);

      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe("no encontrado");
      expect(result.getStatusCode()).toBe(404);
    });
  });
});
