import { CustomError } from "./custom-error.js";

export class Result<T> {
  private readonly success: boolean;
  private readonly statusCode: number;
  private readonly value?: T;
  private readonly error?: string;

  private constructor(
    success: boolean,
    statusCode: number,
    value?: T,
    error?: string,
  ) {
    this.success = success;
    this.statusCode = statusCode;
    this.value = value;
    this.error = error;
  }

  // 🎉 Static factory method for success cases
  static success<T>(value?: T, statusCode: number = 200): Result<T> {
    return new Result<T>(true, statusCode, value);
    // Notice: error is undefined in success cases
  }

  // ❌ Static factory method for error cases
  static error<T>(error: string, statusCode: number = 500): Result<T> {
    return new Result<T>(false, statusCode, undefined, error);
    // Notice: value is undefined in error cases
  }

  // 🔍 Type guard methods for checking state
  isSuccess(): boolean {
    return this.success;
  }

  isFailure(): boolean {
    return !this.isSuccess();
  }

  // 📦 Safe value extraction
  getValue(): T | undefined {
    return this.value;
  }

  // 🚨 Safe error extraction
  getError(): string | undefined {
    return this.error;
  }

  // 🏷️ Status code extraction
  getStatusCode(): number {
    return this.statusCode;
  }
}
