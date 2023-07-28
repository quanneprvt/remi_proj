import { Status } from "./../interfaces";
export default class AppError extends Error {
  status: string;
  isOperational: boolean;

  constructor(public message: string, public statusCode: number = 500) {
    super(message);
    this.status =
      statusCode === 401
        ? Status.TOKEN_INVALID
        : `${statusCode}`.startsWith("4")
        ? Status.FAIL
        : Status.ERROR;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
