import { UserService } from "../../services/userService";
import UserRepository from "../../repositories/userRepository";
import { User } from "../../models/issue";
import supabase from "../../services/supabaseClient";
import mockUser from "../../data/mockUser";
import mockFile from "../../data/mockFile";

jest.mock("../../repositories/userRepository");

jest.mock("../../services/supabaseClient", () => ({
  storage: {
    from: jest.fn(() => ({
      upload: jest.fn(),
      getPublicUrl: jest.fn(),
      remove: jest.fn(),
    })),
  },
}));

describe("UserService", () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    userRepository = new UserRepository() as jest.Mocked<UserRepository>;
    userService = new UserService();
    userService.setUserRepository(userRepository);
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  describe("getUserById", () => {
    it("should return a user by ID", async () => {
      const userId = "1";
      const authenticatedUserId = "1";
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

  describe("updateUserProfile", () => {
    const updateData: Partial<User> = { fullname: "Updated User" };

    it("should update user profile without file", async () => {
      userRepository.getUserById.mockResolvedValue(mockUser);
      userRepository.updateUserProfile.mockResolvedValue({
        ...mockUser,
        ...updateData,
      });

      const response = await userService.updateUserProfile(
        mockUser.user_id || "",
        updateData,
      );

      expect(response.data).toEqual({ ...mockUser, ...updateData });
      expect(userRepository.getUserById).toHaveBeenCalledWith(mockUser.user_id);
      expect(userRepository.updateUserProfile).toHaveBeenCalledWith(
        mockUser.user_id,
        updateData,
      );
    });

    it("should throw an error when user is not found", async () => {
      userRepository.getUserById.mockResolvedValue(null);

      await expect(
        userService.updateUserProfile(mockUser.user_id || "", updateData),
      ).rejects.toEqual(
        expect.objectContaining({
          code: 404,
          success: false,
          error: "User not found",
        }),
      );
      expect(userRepository.getUserById).toHaveBeenCalledWith(mockUser.user_id);
    });

    it("should throw an error when file upload fails", async () => {
      userRepository.getUserById.mockResolvedValue(mockUser);
      (supabase.storage.from("user").upload as jest.Mock).mockResolvedValue({
        error: new Error("Upload failed"),
      });

      await expect(
        userService.updateUserProfile(
          mockUser.user_id || "",
          updateData,
          mockFile,
        ),
      ).rejects.toEqual(
        expect.objectContaining({
          code: 500,
          success: false,
          error: "Failed to delete old profile picture",
        }),
      );
      expect(userRepository.getUserById).toHaveBeenCalledWith(mockUser.user_id);
      expect(supabase.storage.from("user").upload).not.toBe(null);
    });

    it("should throw an error when deleting old profile picture fails", async () => {
      userRepository.getUserById.mockResolvedValue(mockUser);
      (supabase.storage.from("user").remove as jest.Mock).mockResolvedValue({
        error: new Error("Delete failed"),
      });

      await expect(
        userService.updateUserProfile(
          mockUser.user_id || "",
          updateData,
          mockFile,
        ),
      ).rejects.toEqual(
        expect.objectContaining({
          code: 500,
          success: false,
          error: "Failed to delete old profile picture",
        }),
      );
      expect(userRepository.getUserById).toHaveBeenCalledWith(mockUser.user_id);
      expect(supabase.storage.from("user").remove).not.toBe(null);
    });
  });
});
