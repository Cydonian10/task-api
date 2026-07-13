import { describe, it, expect } from "vitest";
import { BcryptAdapter } from "./bcrypt-adapter";

describe("BcryptAdapter", () => {
  it("should hash a password and return a string", () => {
    const password = "mySecret123";
    const hash = BcryptAdapter.hash(password);
    expect(typeof hash).toBe("string");
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(0);
  });

  it("should return true when comparing a correct password with its hash", () => {
    const password = "anotherSecret!";
    const hash = BcryptAdapter.hash(password);
    const isMatch = BcryptAdapter.compare(password, hash);
    expect(isMatch).toBe(true);
  });

  it("should return false when comparing an incorrect password with a hash", () => {
    const password = "password1";
    const wrongPassword = "password2";
    const hash = BcryptAdapter.hash(password);
    const isMatch = BcryptAdapter.compare(wrongPassword, hash);
    expect(isMatch).toBe(false);
  });

  it("should return false when comparing with an invalid hash", () => {
    const password = "test";
    const invalidHash = "invalid_hash";
    const isMatch = BcryptAdapter.compare(password, invalidHash);
    expect(isMatch).toBe(false);
  });
});
