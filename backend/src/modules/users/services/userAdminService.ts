import UserAdminRepository from "@/modules/users/repositories/userAdminRepository";
import { APIResponse, APIError } from "@/types/response";
import { UserExists } from "@/types/users";

export class UserAdminService {
  private userAdminRepository: UserAdminRepository;

  constructor() {
    this.userAdminRepository = new UserAdminRepository();
  }

  setUserAdminRepository(userAdminRepository: UserAdminRepository) {
    this.userAdminRepository = userAdminRepository;
  }

  async usernameExists(
    params: Partial<UserExists>,
  ): Promise<APIResponse<boolean>> {
    try {
      const data = 
        await this.userAdminRepository.usernameExists(
          params,
        );
      return {
        code: 200,
        success: true,
        data: !data,
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while checking username availability.",
      });
    }
  }

  async deleteAccountById(
    userId: string,
    authenticatedUserId: string,
    username: string,
    email_address: string
  ): Promise<APIResponse<null>> {
    if (userId !== authenticatedUserId) {
      throw APIError({
        code: 403,
        success: false,
        error: "You do not have permission to delete this account."
      });
    }
  
    const user = await this.userAdminRepository.deleteAccountById(userId, username, email_address);
    
    if (!user) {
      throw APIError({
        code: 404,
        success: false,
        error: "User not found"
      });
    }
  
    return {
      code: 204,
      success: true,
      data: null
    };
  } 
}