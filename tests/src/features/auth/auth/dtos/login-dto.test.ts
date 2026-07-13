import { describe, it, expect } from "vitest";
import { LoginDtoSchema } from "@/src/features/auth/dtos/login-dto.js";

describe("LoginDtoSchema", () => {
  describe("camino feliz", () => {
    it("debería validar un login correcto", () => {
      const result = LoginDtoSchema.safeParse({
        email: "user@test.com",
        password: "123456",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("user@test.com");
        expect(result.data.password).toBe("123456");
      }
    });
  });

  describe("camino malo", () => {
    it("debería rechazar email vacío", () => {
      const result = LoginDtoSchema.safeParse({
        email: "",
        password: "123456",
      });

      expect(result.success).toBe(false);
    });

    it("debería rechazar email muy corto (menos de 5 caracteres)", () => {
      const result = LoginDtoSchema.safeParse({
        email: "a@b",
        password: "123456",
      });

      expect(result.success).toBe(false);
    });

    it("debería rechazar password muy corta (menos de 6 caracteres)", () => {
      const result = LoginDtoSchema.safeParse({
        email: "user@test.com",
        password: "123",
      });

      expect(result.success).toBe(false);
    });

    it("debería rechazar campos faltantes", () => {
      const result = LoginDtoSchema.safeParse({});

      expect(result.success).toBe(false);
    });

    it("debería rechazar tipos incorrectos", () => {
      const result = LoginDtoSchema.safeParse({ email: 123, password: true });

      expect(result.success).toBe(false);
    });
  });
});
