import UserRepository from "../db/userRepository";
import { User } from "../models/issue";
import { APIResponse } from "../types/response";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  setUserRepository(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async getUserById(userId: string): Promise<APIResponse<User>> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw {
        code: 404,
        success: false,
        error: "User not found"
      };
    }

    return {
      code: 200,
      success: true,
      data: user,
    };
  }
}
