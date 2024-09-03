import { Request, Response, NextFunction } from "express";
import * as userController from "@/modules/users/controllers/userController";
import { UserService } from "@/modules/users/services/userService";
import { sendResponse } from "@/utilities/response";

jest.mock("@/modules/users/services/userService");
jest.mock("@/utilities/response");
jest.mock("@/modules/shared/services/redisClient", () => ({
  __esModule: true,
  default: {
    on: jest.fn(),
    get: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
    keys: jest.fn().mockResolvedValue([]),
  },
}));

describe("User Controller", () => {
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	let mockNext: NextFunction;
	let mockUserService: jest.Mocked<UserService>;

	beforeEach(() => {
		mockRequest = { body: {}, params: {}, query: {}, file: {} as Express.Multer.File };
		mockResponse = {
			json: jest.fn(),
			status: jest.fn().mockReturnThis(),
		};
		mockNext = jest.fn();
		mockUserService = {
			getUserById: jest.fn(),
			updateUserProfile: jest.fn(),
		} as unknown as jest.Mocked<UserService>;
		(UserService as jest.Mock).mockImplementation(() => mockUserService);
	});

	const testControllerMethod = async (
		methodName: keyof typeof userController,
	) => {
		const controllerMethod = userController[methodName];
		if (Array.isArray(controllerMethod)) {
			const lastMiddleware = controllerMethod[controllerMethod.length - 1];
			if (typeof lastMiddleware === 'function') {
				await lastMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
			}
		} else if (typeof controllerMethod === 'function') {
			await controllerMethod(mockRequest as Request, mockResponse as Response);
		}
		expect(sendResponse).toHaveBeenCalled();
	};

	it("should handle getUserById", () => testControllerMethod("getUserById"));
	it("should handle updateUserProfile", () => testControllerMethod("updateUserProfile"));

	it("should handle errors in getUserById", async () => {
		mockUserService.getUserById.mockRejectedValue(new Error("Test error"));
		await testControllerMethod("getUserById");
		expect(sendResponse).toHaveBeenCalled();
	});

	it("should handle errors in updateUserProfile", async () => {
		mockUserService.updateUserProfile.mockRejectedValue(new Error("Test error"));
		await testControllerMethod("updateUserProfile");
		expect(sendResponse).toHaveBeenCalled();
	});
});
