import NoAuthRepository from "@/modules/users/repositories/noAuthRepository";
import { APIResponse, APIError } from "@/types/response";
import { UserExists } from "@/types/users";

export class NoAuthService {
  private noAuthRepository: NoAuthRepository;

  constructor() {
    this.noAuthRepository = new NoAuthRepository();
  }

  setnoAuthRepository(noAuthRepository: NoAuthRepository) {
    this.noAuthRepository = noAuthRepository;
  }

  async usernameExists(
    params: Partial<UserExists>,
  ): Promise<APIResponse<boolean>> {
    try {
      const data = 
        await this.noAuthRepository.usernameExists(
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
}