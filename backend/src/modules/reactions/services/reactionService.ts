import ReactionRepository from "@/modules/reactions/repositories/reactionRepository";
import { Reaction } from "@/modules/shared/models/reaction";
import { APIData, APIError } from "@/types/response";
import { PointsService } from "@/modules/points/services/pointsService";

export default class ReactionService {
  private reactionRepository: ReactionRepository;
  private pointsService: PointsService;

  constructor() {
    this.reactionRepository = new ReactionRepository();
    this.pointsService = new PointsService();
  }

  setReactionRepository(reactionRepository: ReactionRepository): void {
    this.reactionRepository = reactionRepository;
  }

  async addOrRemoveReaction(reaction: Partial<Reaction>) {
    if (!reaction.user_id) {
      throw APIError({
        code: 401,
        success: false,
        error: "You need to be signed in to react",
      });
    }

    if (!reaction.issue_id || !reaction.emoji) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for reacting",
      });
    }

    let added: string | undefined;
    let removed: string | undefined;

    const existingReaction =
      await this.reactionRepository.getReactionByUserAndIssue(
        reaction.issue_id,
        reaction.user_id,
      );

    if (existingReaction) {
      const removedReaction = await this.reactionRepository.deleteReaction(
        reaction.issue_id,
        reaction.user_id,
      );

      removed = removedReaction.emoji;
    }

    if (reaction.emoji !== removed) {
      const addedReaction = await this.reactionRepository.addReaction(reaction);
      added = addedReaction.emoji;

      await this.pointsService.awardPoints(reaction.user_id, 5, "Reacted to an issue");
    }

    return APIData({
      code: 200,
      success: true,
      data: {
        added,
        removed,
      },
    });
  }
}