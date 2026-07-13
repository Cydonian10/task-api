import { SignJWT, jwtVerify } from "jose";
import { Payload } from "../../entities/payload";
import { envs } from "@/src/config/envs";

export class JwtAdapter {
  private static getSecret() {
    return new TextEncoder().encode(envs.JWT_SECRET);
  }

  static async generateToken(
    payload: Payload | Record<string, any>,
    expiresIn = "1d",
  ): Promise<string> {
    const tokenBuilder = new SignJWT({ ...payload }).setProtectedHeader({
      alg: "HS256",
    });

    if (expiresIn) {
      tokenBuilder.setExpirationTime(expiresIn as any);
    }

    const token = await tokenBuilder.sign(this.getSecret());
    return token;
  }

  static async verifyToken(token: string): Promise<Payload | null> {
    try {
      const { payload } = await jwtVerify(token, this.getSecret());
      return Payload.fromObject(payload);
    } catch (error) {
      return null;
    }
  }
}
