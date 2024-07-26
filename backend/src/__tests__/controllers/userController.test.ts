import { Request, Response } from "express";
import * as userController from "@/modules/users/controllers/userController";
import { UserService } from "@/modules/users/services/userService";
import { sendResponse } from "@/modules/infrastructure/utilities/response";

jest.mock("@/modules/users/services/userService");
jest.mock("@/modules/infrastructure/utilities/response");

describe("User Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(() => {
    mockRequest = { body: {}, params: {}, file: {} as Express.Multer.File };
    mockResponse = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    mockUserService = new UserService() as jest.Mocked<UserService>;
    (UserService as jest.Mock).mockImplementation(() => mockUserService);
  });

  it("should handle getUserById", async () => {
    await userController.getUserById(
      mockRequest as Request,
      mockResponse as Response,
    );
    expect(sendResponse).toHaveBeenCalled();
  });

  it("should handle updateUserProfile", async () => {
    await userController.updateUserProfile(
      mockRequest as Request,
      mockResponse as Response,
    );
    expect(sendResponse).toHaveBeenCalled();
  });

  it("should handle errors in getUserById", async () => {
    mockUserService.getUserById.mockRejectedValue(new Error("Test error"));
    await userController.getUserById(
      mockRequest as Request,
      mockResponse as Response,
    );
    expect(sendResponse).toHaveBeenCalled();
  });

  it("should handle errors in updateUserProfile", async () => {
    mockUserService.updateUserProfile.mockRejectedValue(
      new Error("Test error"),
    );
    await userController.updateUserProfile(
      mockRequest as Request,
      mockResponse as Response,
    );
    expect(sendResponse).toHaveBeenCalled();
  });
});
