import { sendResponse } from "@/utilities/response";
import { APIResponse } from "@/types/response";
import { Response } from "express";

describe("sendResponse", () => {
  let res: Partial<Response>;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it("should set the status code and send the response as JSON", () => {
    const response: APIResponse<string> = {
      code: 200,
      success: true,
      data: "Test data",
    };

    sendResponse(res as Response, response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(response);
  });

  it("should handle different status codes", () => {
    const response: APIResponse<null> = {
      code: 404,
      success: false,
      data: null,
    };

    sendResponse(res as Response, response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(response);
  });
});