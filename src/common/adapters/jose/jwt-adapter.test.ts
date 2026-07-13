import { describe, it, expect } from "vitest";
import { JwtAdapter } from "./jwt-adapter";

describe("JwtAdapter", () => {
  const payload = { email: "test@example.com" };

  it("should generate a valid JWT token", async () => {
    const token = await JwtAdapter.generateToken(payload);
    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3); // JWT has 3 parts
  });

  it("should verify a valid token and return the payload", async () => {
    const token = await JwtAdapter.generateToken(payload);
    const verifiedPayload = await JwtAdapter.verifyToken(token);
    expect(verifiedPayload).toMatchObject(payload);
  });

  it("should return null for an invalid token", async () => {
    const invalidToken = "invalid.token.value";
    const result = await JwtAdapter.verifyToken(invalidToken);
    expect(result).toBeNull();
  });

  it("should return null for a token signed with a different secret", async () => {
    // Manually create a token with a different secret
    const { SignJWT } = await import("jose");
    const otherSecret = new TextEncoder().encode("another_secret");
    const forgedToken = await new SignJWT({ email: "test@example.com" })
      .setProtectedHeader({ alg: "HS256" })
      .sign(otherSecret);

    const result = await JwtAdapter.verifyToken(forgedToken);
    expect(result).toBeNull();
  });

  it("should not include extra properties in the payload", async () => {
    const token = await JwtAdapter.generateToken(payload);
    const verifiedPayload = await JwtAdapter.verifyToken(token);
    expect(verifiedPayload).not.toHaveProperty("password");
    expect(verifiedPayload).not.toHaveProperty("iat"); // jose does not add iat by default
  });
});
