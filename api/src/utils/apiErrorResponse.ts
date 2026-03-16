import { type Response } from "express";

export const apiErrorResponse = (
  res: Response,
  statusCode: number,
  message: string,
) => {
  return res.status(statusCode).json(message);
};
