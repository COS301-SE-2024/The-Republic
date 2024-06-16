import UserRepository from "../db/userRepository";
import { APIData } from "../types/response";

export class UserService {
  userRepository = new UserRepository();

  async getUserById(user_id: string) {
    const user = await this.userRepository.getUserById(user_id);

    return APIData({
      code: 200,
      success: true,
      data: user
    });
  }
}
