import { describe, it, expect, vi, beforeEach } from "vitest";

const mockRepo = {
  findOne: vi.fn(),
  find: vi.fn(),
  create: vi.fn(),
  save: vi.fn(),
  remove: vi.fn(),
};

vi.mock("@/src/database/data-source", () => ({
  AppDataSource: { getRepository: () => mockRepo },
}));

vi.mock("@/src/common/adapters/bcrypt/bcrypt-adapter", () => ({
  BcryptAdapter: { hash: vi.fn().mockReturnValue("hashedPassword") },
}));

vi.mock("@/src/features/auth/user/dtos/user.dto", () => ({
  UserDto: {
    fromEntity: vi.fn((entity: any) => ({
      id: entity.id,
      name: entity.name,
      email: entity.email,
      roles: entity.roles,
      age: 30,
      dateBirth: "1990-01-15",
    })),
  },
}));

import { UserService } from "@/src/features/user/user.service";

describe("UserService", () => {
  let service: UserService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new UserService();
  });

  describe("createUser", () => {
    it("debería crear un usuario exitosamente", async () => {
      const dto = {
        name: "Juan",
        email: "juan@test.com",
        password: "123456",
        roles: ["USER" as const],
        dateOfBirth: new Date("1990-01-15"),
      };
      const savedUser = { id: 1, ...dto, passwordHash: "hashedPassword" };

      mockRepo.create.mockReturnValue(savedUser);
      mockRepo.save.mockResolvedValue(savedUser);

      const result = await service.createUser(dto);

      expect(result.isSuccess()).toBe(true);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });

  describe("getAll", () => {
    it("debería retornar todos los usuarios", async () => {
      const users = [
        {
          id: 1,
          name: "Juan",
          email: "juan@test.com",
          roles: ["USER"],
          dateOfBirth: new Date(),
        },
        {
          id: 2,
          name: "María",
          email: "maria@test.com",
          roles: ["ADMIN"],
          dateOfBirth: new Date(),
        },
      ];
      mockRepo.find.mockResolvedValue(users);

      const result = await service.getAll();

      expect(result.isSuccess()).toBe(true);
      expect(result.getValue()).toHaveLength(2);
    });

    it("debería retornar array vacío si no hay usuarios", async () => {
      mockRepo.find.mockResolvedValue([]);

      const result = await service.getAll();

      expect(result.isSuccess()).toBe(true);
      expect(result.getValue()).toEqual([]);
    });
  });

  describe("getByEmail", () => {
    it("debería retornar usuario si existe", async () => {
      mockRepo.findOne.mockResolvedValue({
        id: 1,
        name: "Juan",
        email: "juan@test.com",
        roles: ["USER"],
        dateOfBirth: new Date("1990-01-15"),
      });

      const result = await service.getByEmail("juan@test.com");

      expect(result.isSuccess()).toBe(true);
    });

    it("debería retornar error si el usuario no existe", async () => {
      mockRepo.findOne.mockResolvedValue(null);

      const result = await service.getByEmail("noexiste@test.com");

      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toContain("noexiste@test.com");
      expect(result.getStatusCode()).toBe(404);
    });
  });

  describe("getById", () => {
    it("debería retornar usuario si existe", async () => {
      mockRepo.findOne.mockResolvedValue({
        id: 1,
        name: "Juan",
        email: "juan@test.com",
        roles: ["USER"],
        dateOfBirth: new Date(),
      });

      const result = await service.getById(1);

      expect(result.isSuccess()).toBe(true);
    });

    it("debería retornar error si el usuario no existe", async () => {
      mockRepo.findOne.mockResolvedValue(null);

      const result = await service.getById(999);

      expect(result.isFailure()).toBe(true);
      expect(result.getStatusCode()).toBe(404);
    });
  });

  describe("updateUser", () => {
    it("debería actualizar un usuario existente", async () => {
      const existing = {
        id: 1,
        name: "Juan",
        email: "juan@test.com",
        roles: ["USER"],
        dateOfBirth: new Date(),
      };
      mockRepo.findOne.mockResolvedValue(existing);
      mockRepo.save.mockResolvedValue({ ...existing, name: "Nuevo" });

      const result = await service.updateUser(1, { name: "Nuevo" });

      expect(result.isSuccess()).toBe(true);
      expect(existing.name).toBe("Nuevo");
    });

    it("debería retornar error si el usuario no existe", async () => {
      mockRepo.findOne.mockResolvedValue(null);

      const result = await service.updateUser(999, { name: "Nuevo" });

      expect(result.isFailure()).toBe(true);
      expect(result.getStatusCode()).toBe(404);
    });
  });

  describe("deleteUser", () => {
    it("debería eliminar un usuario existente", async () => {
      const existing = { id: 1, name: "Juan", email: "juan@test.com" };
      mockRepo.findOne.mockResolvedValue(existing);
      mockRepo.remove.mockResolvedValue(undefined);

      const result = await service.deleteUser(1);

      expect(result.isSuccess()).toBe(true);
      expect(mockRepo.remove).toHaveBeenCalledWith(existing);
    });

    it("debería retornar error si el usuario no existe", async () => {
      mockRepo.findOne.mockResolvedValue(null);

      const result = await service.deleteUser(999);

      expect(result.isFailure()).toBe(true);
      expect(result.getStatusCode()).toBe(404);
    });
  });
});
