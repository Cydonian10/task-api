import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthController } from "@/src/features/auth/auth.controller";
import { Result } from "@/src/common/entities/result";

const crearMockReq = (overrides: any = {}) => ({
  body: {},
  params: {},
  query: {},
  user: undefined,
  ...overrides,
});

const crearMockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("AuthController", () => {
  let controller: AuthController;
  let mockAuthService: any;

  beforeEach(() => {
    mockAuthService = {
      loginUser: vi.fn(),
    };
    controller = new AuthController(mockAuthService);
  });

  describe("loginUser", () => {
    it("debería retornar 400 si el body es inválido", async () => {
      const req = crearMockReq({ body: { email: "", password: "" } });
      const res = crearMockRes();

      await controller.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("debería retornar token si el login es exitoso", async () => {
      const req = crearMockReq({
        body: { email: "user@test.com", password: "123456" },
      });
      const res = crearMockRes();
      mockAuthService.loginUser.mockResolvedValue(
        Result.success({ token: "abc.def.ghi" }),
      );

      await controller.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { token: "abc.def.ghi" },
      });
    });

    it("debería retornar error si las credenciales son inválidas", async () => {
      const req = crearMockReq({
        body: { email: "user@test.com", password: "wrongpass" },
      });
      const res = crearMockRes();
      mockAuthService.loginUser.mockResolvedValue(
        Result.error("Invalid email or password", 401),
      );

      await controller.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false }),
      );
    });
  });

  describe("profile", () => {
    it("debería retornar el usuario autenticado", async () => {
      const userMock = { id: 1, name: "Juan", email: "juan@test.com" };
      const req = crearMockReq({ user: userMock });
      const res = crearMockRes();

      await controller.profile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: userMock,
      });
    });
  });
});
