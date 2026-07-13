export class CustomError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number
  ) {
    super(message);
  }

  static badRequest(message: string) {
    return new CustomError(message, 400);
  }

  static notFound(message: string) {
    return new CustomError(message, 404);
  }

  static forbidden(message: string) {
    return new CustomError(message, 403);
  }

  static unauthorized(message: string) {
    return new CustomError(message, 401);
  }

  static internalServerError(message: string) {
    return new CustomError(message, 500);
  }
}
