import { describe, it, expect } from "vitest";
import { UpdateUserSchema } from "@/src/features/user/dtos/update-user.dto";

describe("UpdateUserSchema", () => {
  describe("camino feliz", () => {
    it("debería validar con todos los campos", () => {
      const result = UpdateUserSchema.safeParse({
        name: "Nuevo Nombre",
        email: "nuevo@test.com",
        password: "nueva123",
        roles: ["USER"],
        dateOfBirth: "1995-05-20",
      });

      expect(result.success).toBe(true);
    });

    it("debería validar con un solo campo", () => {
      const result = UpdateUserSchema.safeParse({ name: "Solo Nombre" });

      expect(result.success).toBe(true);
    });

    it("debería validar con objeto vacío (todos opcionales)", () => {
      const result = UpdateUserSchema.safeParse({});

      expect(result.success).toBe(true);
    });
  });

  describe("camino malo", () => {
    it("debería rechazar nombre muy corto", () => {
      const result = UpdateUserSchema.safeParse({ name: "Ab" });

      expect(result.success).toBe(false);
    });

    it("debería rechazar password muy corta", () => {
      const result = UpdateUserSchema.safeParse({ password: "12" });

      expect(result.success).toBe(false);
    });

    it("debería rechazar roles inválidos", () => {
      const result = UpdateUserSchema.safeParse({ roles: ["INVALID"] });

      expect(result.success).toBe(false);
    });
  });
});
