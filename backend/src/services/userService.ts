import UserRepository from "../db/userRepository";
import { APIData } from "../types/response";

export class UserService {
  userRepository = new UserRepository();

  async getUserById(user_id: string) {
    const user = await this.userRepository.getUserById(user_id);

    /* TODO: Its probably best to move the APIData to calls to
     * the service classes. Then there will be less logic in
     * the repositories and we can get data from them without
     * having to extract it from an APIResponse */

    return APIData({
      code: 200,
      success: true,
      data: user
    });
  }
}
