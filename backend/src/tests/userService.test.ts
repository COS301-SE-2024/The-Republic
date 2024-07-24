import { UserService } from "../services/userService";
import UserRepository from "../db/userRepository";
import { User } from "../models/issue";

jest.mock("../db/userRepository");

describe("UserService", () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = new UserRepository() as jest.Mocked<UserRepository>;
    userService = new UserService();
    userService.setUserRepository(userRepository);
  });

  describe("getUserById", () => {
    it("should return a user by ID", async () => {
      const userId = "1";
      const authenticatedUserId = "1";
      const mockUser: User = {
        user_id: "1",
        email_address: "test@example.com",
        username: "testuser",
        fullname: "Test User",
        image_url: "https://example.com/image.png",
        is_owner: true,
        total_issues: 10,
        resolved_issues: 5,
      };
      userRepository.getUserById.mockResolvedValue(mockUser);

      const response = await userService.getUserById(
        userId,
        authenticatedUserId,
      );

      expect(response.data).toEqual({ ...mockUser, is_owner: true });
      expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
      expect(userRepository.getUserById).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when user is not found", async () => {
      const userId = "1";
      const authenticatedUserId = "1";
      userRepository.getUserById.mockResolvedValue(null);

      await expect(
        userService.getUserById(userId, authenticatedUserId),
      ).rejects.toEqual(
        expect.objectContaining({
          code: 404,
          success: false,
          error: "User not found",
        }),
      );
      expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
      expect(userRepository.getUserById).toHaveBeenCalledTimes(1);
    });

    it("should set is_owner to false when authenticated user is different", async () => {
      const userId = "1";
      const authenticatedUserId = "2";
      const mockUser: User = {
        user_id: "1",
        email_address: "test@example.com",
        username: "testuser",
        fullname: "Test User",
        image_url: "https://example.com/image.png",
        is_owner: false,
        total_issues: 10,
        resolved_issues: 5,
      };
      userRepository.getUserById.mockResolvedValue(mockUser);

      const response = await userService.getUserById(
        userId,
        authenticatedUserId,
      );

      expect(response.data).toEqual({ ...mockUser, is_owner: false });
      expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
      expect(userRepository.getUserById).toHaveBeenCalledTimes(1);
    });
  });
});
