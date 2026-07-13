import { describe, it, expect } from "vitest";
import { CreateUserSchema } from "@/src/features/user/dtos/create-user.dto.js";

describe("CreateUserSchema", () => {
  describe("camino feliz", () => {
    it("debería validar un usuario correcto", () => {
      const result = CreateUserSchema.safeParse({
        name: "Juan Pérez",
        email: "juan@test.com",
        password: "123456",
        roles: ["user"],
        dateOfBirth: "1990-01-15",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("Juan Pérez");
        expect(result.data.roles).toEqual(["user"]);
        expect(result.data.dateOfBirth).toBeInstanceOf(Date);
      }
    });

    it("debería aceptar múltiples roles", () => {
      const result = CreateUserSchema.safeParse({
        name: "Admin",
        email: "admin@test.com",
        password: "123456",
        roles: ["admin", "user"],
        dateOfBirth: "2000-12-31",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("camino malo", () => {
    it("debería rechazar nombre muy corto (menos de 3 caracteres)", () => {
      const result = CreateUserSchema.safeParse({
        name: "Ab",
        email: "a@test.com",
        password: "123456",
        roles: ["user"],
        dateOfBirth: "1990-01-01",
      });

      expect(result.success).toBe(false);
    });

    it("debería rechazar password muy corta (menos de 6 caracteres)", () => {
      const result = CreateUserSchema.safeParse({
        name: "Test User",
        email: "test@test.com",
        password: "123",
        roles: ["user"],
        dateOfBirth: "1990-01-01",
      });

      expect(result.success).toBe(false);
    });

    it("debería rechazar roles inválidos", () => {
      const result = CreateUserSchema.safeParse({
        name: "Test User",
        email: "test@test.com",
        password: "123456",
        roles: ["superadmin"],
        dateOfBirth: "1990-01-01",
      });

      const pathError = result.error?.issues.find((issue) =>
        issue.path.includes("roles"),
      );

      expect(pathError).toBeDefined();
      expect(pathError?.path).toContain("roles");
      expect(pathError?.message).toContain(
        'Invalid option: expected one of "admin"|"user"',
      );
      expect(result.success).toBe(false);
    });

    it("debería rechazar campos faltantes", () => {
      const result = CreateUserSchema.safeParse({ name: "Test" });

      expect(result.success).toBe(false);
    });
  });
});
