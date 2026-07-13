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
  BcryptAdapter: { compare: vi.fn() },
}));

vi.mock("@/src/common/adapters/jose/jwt-adapter", () => ({
  JwtAdapter: { generateToken: vi.fn() },
}));

import { AuthService } from "@/src/features/auth/auth.service";
import { BcryptAdapter } from "@/src/common/adapters/bcrypt/bcrypt-adapter";
import { JwtAdapter } from "@/src/common/adapters/jose/jwt-adapter";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AuthService();
  });

  describe("loginUser", () => {
    const dto = { email: "user@test.com", password: "123456" };

    it("debería retornar error si el usuario no existe", async () => {
      mockRepo.findOne.mockResolvedValue(null);

      const result = await service.loginUser(dto);

      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe("Invalid email or password");
      expect(result.getStatusCode()).toBe(401);
    });

    it("debería retornar error si la contraseña no coincide", async () => {
      mockRepo.findOne.mockResolvedValue({
        email: "user@test.com",
        passwordHash: "hashIncorrecto",
      });
      vi.mocked(BcryptAdapter.compare).mockReturnValue(false);

      const result = await service.loginUser(dto);

      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe("Invalid email or password");
      expect(result.getStatusCode()).toBe(401);
    });

    it("debería retornar token si las credenciales son válidas", async () => {
      mockRepo.findOne.mockResolvedValue({
        email: "user@test.com",
        passwordHash: "hashValido",
      });
      vi.mocked(BcryptAdapter.compare).mockReturnValue(true);
      vi.mocked(JwtAdapter.generateToken).mockResolvedValue("token.jwt.aqui");

      const result = await service.loginUser(dto);

      expect(result.isSuccess()).toBe(true);
      expect(result.getValue()).toEqual({ token: "token.jwt.aqui" });
      expect(JwtAdapter.generateToken).toHaveBeenCalled();
    });
  });
});
