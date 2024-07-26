import UserRepository from "../repositories/userRepository";
import { User } from "../models/issue";
import { APIResponse, APIError } from "../types/response";
import supabase from "../services/supabaseClient";
import { MulterFile } from "../types/users";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  setUserRepository(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async getUserById(
    userId: string,
    authenticatedUserId: string,
  ): Promise<APIResponse<User>> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw APIError({
        code: 404,
        success: false,
        error: "User not found",
      });
    }

    const isOwner = userId === authenticatedUserId;

    return {
      code: 200,
      success: true,
      data: { ...user, is_owner: isOwner },
    };
  }

  async updateUserProfile(
    userId: string,
    updateData: Partial<User>,
    file?: MulterFile,
  ): Promise<APIResponse<User>> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw APIError({
        code: 404,
        success: false,
        error: "User not found",
      });
    }

    if (file) {
      // Delete the old profile picture if it exists and is not the default one
      if (user.image_url && !user.image_url.includes("default.png")) {
        try {
          const fileName = user.image_url.split("/").pop();
          if (!fileName) {
            throw new Error("Invalid image URL format");
          }

          const { error: deleteError } = await supabase.storage
            .from("user")
            .remove([fileName]);

          if (deleteError) {
            console.error("Failed to delete old profile picture:", deleteError);
            throw APIError({
              code: 500,
              success: false,
              error: "Failed to delete old profile picture",
            });
          }
        } catch (error) {
          console.error("Error deleting old profile picture:", error);
          throw APIError({
            code: 500,
            success: false,
            error: "Failed to delete old profile picture",
          });
        }
      }

      // Upload the new profile picture
      const fileName = `profile_pictures/${userId}-${Date.now()}-${file.originalname}`;
      const { error: uploadError } = await supabase.storage
        .from("user")
        .upload(fileName, file.buffer);

      if (uploadError) {
        throw APIError({
          code: 500,
          success: false,
          error: "Failed to upload new profile picture",
        });
      }

      // Retrieve the public URL for the new profile picture
      const { data: urlData } = supabase.storage
        .from("user")
        .getPublicUrl(fileName);

      updateData.image_url = urlData.publicUrl;
    }

    const updatedUser = await this.userRepository.updateUserProfile(
      userId,
      updateData,
    );
    if (!updatedUser) {
      throw APIError({
        code: 404,
        success: false,
        error: "User does not exist",
      });
    }

    return {
      code: 200,
      success: true,
      data: updatedUser,
    };
  }
}
