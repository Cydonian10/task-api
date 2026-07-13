import { describe, it, expect } from "vitest";
import { NumberSchema } from "@/src/common/validations/number-schema";

describe("NumberSchema", () => {
  describe("camino feliz", () => {
    it("debería aceptar un número entero positivo", () => {
      const result = NumberSchema.safeParse(5);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(5);
      }
    });

    it("debería coercer un string numérico a número", () => {
      const result = NumberSchema.safeParse("10");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(10);
      }
    });
  });

  describe("camino malo", () => {
    it("debería rechazar un número negativo", () => {
      const result = NumberSchema.safeParse(-1);

      expect(result.success).toBe(false);
    });

    it("debería rechazar cero", () => {
      const result = NumberSchema.safeParse(0);

      expect(result.success).toBe(false);
    });

    it("debería rechazar un número decimal", () => {
      const result = NumberSchema.safeParse(3.5);

      expect(result.success).toBe(false);
    });

    it("debería rechazar un string no numérico", () => {
      const result = NumberSchema.safeParse("abc");

      expect(result.success).toBe(false);
    });
  });
});
