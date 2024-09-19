import { PointsRepository } from "@/modules/points/repositories/pointsRepository";
import supabase from "@/modules/shared/services/supabaseClient";
import { UserService } from "@/modules/users/services/userService";

export class PointsService {
  private pointsRepository: PointsRepository;
  private userService: UserService;

  constructor() {
    this.pointsRepository = new PointsRepository();
    this.userService = new UserService();
  }

  async awardPoints(userId: string, points: number, reason: string) {
    const newScore = await this.pointsRepository.updateUserScore(userId, points) as number;
    await this.pointsRepository.logPointsTransaction(userId, points, reason);
  
    return newScore;
  }

  async penalizeUser(userId: string, points: number, reason: string) {
    const newScore = await this.pointsRepository.updateUserScore(userId, -points) as number;
    await this.pointsRepository.logPointsTransaction(userId, -points, reason);

    if (newScore <= -150) {
      await this.userService.blockUser(userId);
    }

    return newScore;
  }

  async getFirstTimeAction(userId: string, action: string) {
    const { data, error } = await supabase
      .from("points_history")
      .select("id")
      .eq("user_id", userId)
      .eq("action", action)
      .limit(1);

    if (error) {
      console.error(error);
      throw new Error("Failed to check first time action");
    }

    return data.length === 0;
  }

  async getLeaderboard(locationFilter: { province?: string, city?: string, suburb?: string }) {
    return this.pointsRepository.getLeaderboard(locationFilter);
  }

  async getUserPosition(userId: string, locationFilter: { province?: string, city?: string, suburb?: string }) {
    return this.pointsRepository.getUserPosition(userId, locationFilter);
  }

  async awardOrganizationPoints(organizationId: string, points: number, reason: string) {
    const newScore = await this.pointsRepository.updateOrganizationScore(organizationId, points) as number;
    await this.pointsRepository.logOrganizationPointsTransaction(organizationId, points, reason);
  
    return newScore;
  }

  async awardPointsForResolution(userId: string, organizationId: string | null, isSelfResolution: boolean) {
    const userPoints = isSelfResolution ? 5 : 10;
    const orgPoints = 2;

    await this.awardPoints(userId, userPoints, "Resolution accepted");

    if (organizationId) {
      await this.awardOrganizationPoints(organizationId, orgPoints, "Resolution accepted");
    }
  }
}
