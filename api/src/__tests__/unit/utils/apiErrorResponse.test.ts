import type { Response } from "express";
import { apiErrorResponse } from "../../../utils/apiErrorResponse.js";

const makeMockRes = () => {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  return { res: { status } as unknown as Response, status, json };
};

describe("apiErrorResponse", () => {
  it("should call res.status() with the given statusCode", () => {
    const { res, status } = makeMockRes();
    apiErrorResponse(res, 404, "Not Found");
    expect(status).toHaveBeenCalledWith(404);
  });

  it("should call res.json() with the given message", () => {
    const { res, json } = makeMockRes();
    apiErrorResponse(res, 404, "Not Found");
    expect(json).toHaveBeenCalledWith("Not Found");
  });

  it("should handle 500 status with a server error message", () => {
    const { res, status, json } = makeMockRes();
    apiErrorResponse(res, 500, "Internal Server Error");
    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith("Internal Server Error");
  });

  it("should handle 400 status with a bad request message", () => {
    const { res, status, json } = makeMockRes();
    apiErrorResponse(res, 400, "Bad Request");
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith("Bad Request");
  });
});
