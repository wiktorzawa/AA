export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
  ) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Zachowaj stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
