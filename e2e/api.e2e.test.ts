import request from "supertest";
import { testServer, initTestDb, closeTestDb } from "./test-server.js";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

beforeAll(async () => {
  await initTestDb();
});

afterAll(async () => {
  await closeTestDb();
});

describe("API E2E - server.ts", () => {
  it("POST /api/auth/login -> 400 when body is invalid", async () => {
    const res = await request(testServer.app)
      .post("/api/auth/login")
      .send({ email: "x" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /api/auth/login -> 401 when credentials do not match", async () => {
    const res = await request(testServer.app)
      .post("/api/auth/login")
      .send({ email: "noone@example.com", password: "wrongpassword" });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("GET /api/auth/profile -> 401 when no token provided", async () => {
    const res = await request(testServer.app).get("/api/auth/profile");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });
});
