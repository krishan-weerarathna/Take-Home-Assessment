import type { Request, Response, NextFunction } from "express";
import serverErrorHandler from "../../../middlewares/errorHandler.js";

const makeMockRes = () => {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  return { res: { status } as unknown as Response, status, json };
};

describe("serverErrorHandler", () => {
  const mockReq = {} as Request;
  const mockNext = jest.fn() as unknown as NextFunction;

  it("should respond with status 500", () => {
    const { res, status } = makeMockRes();
    serverErrorHandler(new Error("Oops"), mockReq, res, mockNext);
    expect(status).toHaveBeenCalledWith(500);
  });

  it("should respond with the error message when one is provided", () => {
    const { res, json } = makeMockRes();
    serverErrorHandler(new Error("Something broke"), mockReq, res, mockNext);
    expect(json).toHaveBeenCalledWith("Something broke");
  });

  it("should fall back to 'Internal Server Error' when error message is empty", () => {
    const { res, json } = makeMockRes();
    serverErrorHandler(new Error(""), mockReq, res, mockNext);
    expect(json).toHaveBeenCalledWith("Internal Server Error");
  });

  it("should not call next", () => {
    const { res } = makeMockRes();
    serverErrorHandler(new Error("err"), mockReq, res, mockNext);
    expect(mockNext).not.toHaveBeenCalled();
  });
});
