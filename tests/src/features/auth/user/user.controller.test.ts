import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserController } from "@/src/features/user/user.controller";
import { Result } from "@/src/common/entities/result";

const crearMockReq = (overrides: any = {}) => ({
  body: {},
  params: {},
  query: {},
  ...overrides,
});

const crearMockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("UserController", () => {
  let controller: UserController;
  let mockUserService: any;

  beforeEach(() => {
    mockUserService = {
      createUser: vi.fn(),
      getAll: vi.fn(),
      updateUser: vi.fn(),
      deleteUser: vi.fn(),
    };
    controller = new UserController(mockUserService);
  });

  describe("createUser", () => {
    it("debería retornar 400 si el body es inválido", async () => {
      const req = crearMockReq({ body: { name: "Ab" } });
      const res = crearMockRes();

      await controller.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("debería crear usuario y retornar 201", async () => {
      const dto = {
        name: "Juan Pérez",
        email: "juan@test.com",
        password: "123456",
        roles: ["USER"],
        dateOfBirth: "1990-01-15",
      };
      const req = crearMockReq({ body: dto });
      const res = crearMockRes();
      const userDto = { id: 1, name: "Juan Pérez", email: "juan@test.com" };
      mockUserService.createUser.mockResolvedValue(Result.success(userDto));

      await controller.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "User created successfully" }),
      );
    });
  });

  describe("getAllUsers", () => {
    it("debería retornar usuarios exitosamente", async () => {
      const req = crearMockReq();
      const res = crearMockRes();
      const users = [{ id: 1, name: "Juan" }];
      mockUserService.getAll.mockResolvedValue(Result.success(users));

      await controller.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Users retrieved successfully" }),
      );
    });
  });

  describe("updateUser", () => {
    it("debería retornar 400 si el ID es inválido", async () => {
      const req = crearMockReq({ params: { id: "abc" } });
      const res = crearMockRes();

      await controller.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Invalid user ID" }),
      );
    });

    it("debería retornar 400 si el body es inválido", async () => {
      const req = crearMockReq({
        params: { id: "1" },
        body: { password: "1" },
      });
      const res = crearMockRes();

      await controller.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("debería actualizar usuario exitosamente", async () => {
      const req = crearMockReq({
        params: { id: "1" },
        body: { name: "Nuevo" },
      });
      const res = crearMockRes();
      const updated = { id: 1, name: "Nuevo" };
      mockUserService.updateUser.mockResolvedValue(Result.success(updated));

      await controller.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "User updated successfully" }),
      );
    });

    it("debería retornar 404 si el usuario no existe", async () => {
      const req = crearMockReq({
        params: { id: "999" },
        body: { name: "Nuevo" },
      });
      const res = crearMockRes();
      mockUserService.updateUser.mockResolvedValue(
        Result.error("User not found with id 999", 404),
      );

      await controller.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("deleteUser", () => {
    it("debería retornar 400 si el ID es inválido", async () => {
      const req = crearMockReq({ params: { id: "xyz" } });
      const res = crearMockRes();

      await controller.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("debería eliminar usuario exitosamente", async () => {
      const req = crearMockReq({ params: { id: "1" } });
      const res = crearMockRes();
      mockUserService.deleteUser.mockResolvedValue(Result.success(undefined));

      await controller.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "User deleted successfully" }),
      );
    });

    it("debería retornar 404 si el usuario no existe", async () => {
      const req = crearMockReq({ params: { id: "999" } });
      const res = crearMockRes();
      mockUserService.deleteUser.mockResolvedValue(
        Result.error("User not found with id 999", 404),
      );

      await controller.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
