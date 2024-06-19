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
      const mockUser: User = {
        user_id: "1",
        email_address: "test@example.com",
        username: "testuser",
        fullname: "Test User",
        image_url: "https://example.com/image.png",
      };
      userRepository.getUserById.mockResolvedValue(mockUser);

      const response = await userService.getUserById(userId);

      expect(response.data).toEqual(mockUser);
      expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
      expect(userRepository.getUserById).toHaveBeenCalledTimes(1);
    });
  });
});
