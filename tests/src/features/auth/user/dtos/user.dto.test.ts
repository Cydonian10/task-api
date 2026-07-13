import { describe, it, expect, vi } from "vitest";
import { UserDto } from "@/src/features/user/dtos/user.dto.js";

vi.mock("luxon", () => {
  const fixedDate = { years: 30 };
  return {
    DateTime: {
      now: () => ({
        diff: () => ({ years: fixedDate.years }),
      }),
      fromJSDate: () => ({
        diff: () => ({ years: fixedDate.years }),
        toFormat: () => "1990-01-15",
      }),
    },
  };
});

describe("UserDto", () => {
  describe("fromEntity", () => {
    it("debería mapear una entidad a DTO correctamente", () => {
      const entity = {
        id: 1,
        name: "Juan",
        email: "juan@test.com",
        roles: ["USER"],
        dateOfBirth: new Date("1990-01-15"),
      } as any;

      const dto = UserDto.fromEntity(entity);

      expect(dto.id).toBe(1);
      expect(dto.name).toBe("Juan");
      expect(dto.email).toBe("juan@test.com");
      expect(dto.roles).toEqual(["USER"]);
      expect(dto.age).toBe(30);
      expect(dto.dateBirth).toBe("1990-01-15");
    });

    it("debería convertir id a número", () => {
      const entity = {
        id: "5",
        name: "Test",
        email: "t@t.com",
        roles: [],
        dateOfBirth: new Date(),
      } as any;

      const dto = UserDto.fromEntity(entity);

      expect(dto.id).toBe(5);
    });
  });
});
