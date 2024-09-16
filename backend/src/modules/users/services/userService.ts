import UserRepository from "@/modules/users/repositories/userRepository";
import { User } from "@/modules/shared/models/issue";
import { APIResponse, APIError } from "@/types/response";
import supabase from "@/modules/shared/services/supabaseClient";
import { MulterFile } from "@/types/users";

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

    if (updateData.location) {
      const locationData = JSON.parse(updateData.location as unknown as string);
      const { data: locationRecord, error: locationError } = await supabase
        .from('location')
        .upsert({
          province: locationData.value.province,
          city: locationData.value.city,
          suburb: locationData.value.suburb,
          district: locationData.value.district,
          place_id: locationData.value.place_id,
          latitude: locationData.value.lat,
          longitude: locationData.value.lng,
        })
        .select()
        .single();
  
      if (locationError) {
        throw APIError({
          code: 500,
          success: false,
          error: "Failed to update location",
        });
      }
  
      updateData.location_id = locationRecord.location_id;
      delete updateData.location; // Remove the location object from updateData
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

  async updateUserLocation(userId: string, locationId: number): Promise<APIResponse<User>> {
    const updatedUser = await this.userRepository.updateUserLocation(userId, locationId);
    if (!updatedUser) {
      throw APIError({
        code: 404,
        success: false,
        error: "User not found",
      });
    }

    return {
      code: 200,
      success: true,
      data: updatedUser,
    };
  }

  async getUserWithLocation(userId: string): Promise<APIResponse<User>> {
    const user = await this.userRepository.getUserWithLocation(userId);
    if (!user) {
      throw APIError({
        code: 404,
        success: false,
        error: "User not found",
      });
    }

    return {
      code: 200,
      success: true,
      data: user,
    };
  }
}
