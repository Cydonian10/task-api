import { describe, it, expect } from "vitest";
import { User, Role } from "@/src/features/user/entity/user.entity";

describe("User (entidad de dominio)", () => {
  describe("constructor", () => {
    it("debería crear un usuario con todos los campos", () => {
      const user = new User(
        1,
        "Juan",
        "juan@test.com",
        [Role.USER],
        new Date("1990-01-15"),
      );

      expect(user.id).toBe(1);
      expect(user.name).toBe("Juan");
      expect(user.email).toBe("juan@test.com");
      expect(user.roles).toEqual([Role.USER]);
      expect(user.dateBirth).toEqual(new Date("1990-01-15"));
    });

    it("debería crear un usuario sin fecha de nacimiento", () => {
      const user = new User(1, "Juan", "juan@test.com", [Role.ADMIN]);

      expect(user.dateBirth).toBeUndefined();
    });

    it("debería usar array vacío de roles por defecto", () => {
      const user = new User(1, "Juan", "juan@test.com");

      expect(user.roles).toEqual([]);
    });
  });

  describe("fromObject", () => {
    it("debería crear un usuario desde un objeto completo", () => {
      const user = User.fromObject({
        id: 1,
        name: "María",
        email: "maria@test.com",
        roles: ["ADMIN", "USER"],
        dateOfBirth: "1995-06-20",
      });

      expect(user.id).toBe(1);
      expect(user.name).toBe("María");
      expect(user.email).toBe("maria@test.com");
      expect(user.roles).toEqual(["ADMIN", "USER"]);
      expect(user.dateBirth).toEqual(new Date("1995-06-20"));
    });

    it("debería convertir id a número", () => {
      const user = User.fromObject({ id: "5", name: "Test", email: "t@t.com" });

      expect(user.id).toBe(5);
    });

    it("debería manejar roles vacíos o undefined", () => {
      const user = User.fromObject({ id: 1, name: "Test", email: "t@t.com" });

      expect(user.roles).toEqual([]);
    });

    it("debería manejar fecha de nacimiento undefined", () => {
      const user = User.fromObject({ id: 1, name: "Test", email: "t@t.com" });

      expect(user.dateBirth).toBeUndefined();
    });
  });
});
