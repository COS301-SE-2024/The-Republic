import { PointsRepository } from "./../repositories/pointsRepository";
import supabase from "@/modules/shared/services/supabaseClient";

export class PointsService {
  private pointsRepository: PointsRepository;

  constructor() {
    this.pointsRepository = new PointsRepository();
  }

  async awardPoints(userId: string, points: number, reason: string) {
    const newScore = await this.pointsRepository.updateUserScore(userId, points) as number;
    await this.pointsRepository.logPointsTransaction(userId, points, reason);
  
    if (newScore < -150) {
      await this.pointsRepository.blockUser(userId);
    }
  
    return newScore;
  }

  async penalizeUser(userId: string, points: number, reason: string) {
    const newScore = await this.pointsRepository.updateUserScore(userId, -points) as number;
    await this.pointsRepository.logPointsTransaction(userId, -points, reason);

    if (reason === "Falsely resolving someone else's issue") {
      await this.pointsRepository.suspendUserFromResolving(userId);
    }

    if (newScore < -150) {
      await this.pointsRepository.blockUser(userId);
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
}