import { describe, it, expect } from "vitest";
import { Payload } from "@/src/common/entities/payload";

describe("Payload", () => {
  describe("constructor", () => {
    it("debería crear un payload con email y expiración", () => {
      const payload = new Payload("test@test.com", 12345);

      expect(payload.email).toBe("test@test.com");
      expect(payload.exp).toBe(12345);
    });

    it("debería crear un payload sin expiración", () => {
      const payload = new Payload("test@test.com");

      expect(payload.email).toBe("test@test.com");
      expect(payload.exp).toBeUndefined();
    });
  });

  describe("fromObject", () => {
    it("debería crear un payload desde un objeto válido", () => {
      const payload = Payload.fromObject({ email: "user@mail.com", exp: 999 });

      expect(payload.email).toBe("user@mail.com");
      expect(payload.exp).toBe(999);
    });

    it("debería convertir email a string", () => {
      const payload = Payload.fromObject({ email: 123 });

      expect(payload.email).toBe("123");
    });

    it("debería usar 0 si exp no existe", () => {
      const payload = Payload.fromObject({ email: "a@b.com" });

      expect(payload.exp).toBe(0);
    });
  });
});
