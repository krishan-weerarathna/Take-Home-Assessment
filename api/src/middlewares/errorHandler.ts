import type { Request, Response, NextFunction } from "express";
import { apiErrorResponse } from "../utils/apiErrorResponse.js";

const serverErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = 500;
  const message = error.message || "Internal Server Error";

  return apiErrorResponse(res, statusCode, message);
};
export default serverErrorHandler;
