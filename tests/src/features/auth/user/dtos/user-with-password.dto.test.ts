import { describe, it, expect } from "vitest";
import { UserWithPassword } from "@/src/features/user/dtos/user-with-password.dto.js";

describe("UserWithPassword", () => {
  describe("fromEntity", () => {
    it("debería crear una instancia desde un objeto válido", () => {
      const result = UserWithPassword.fromEntity({
        id: 1,
        name: "Juan",
        email: "juan@test.com",
        password: "hash123",
      });

      expect(result.id).toBe(1);
      expect(result.name).toBe("Juan");
      expect(result.email).toBe("juan@test.com");
      expect(result.password).toBe("hash123");
    });

    it("debería convertir id a número", () => {
      const result = UserWithPassword.fromEntity({
        id: "10",
        name: "Test",
        email: "t@t.com",
        password: "abc",
      });

      expect(result.id).toBe(10);
    });
  });
});
