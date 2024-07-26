import ReactionRepository from "../repositories/reactionRepository";
import { Reaction } from "../models/reaction";
import { APIData, APIError } from "../types/response";

export default class ReactionService {
  private reactionRepository: ReactionRepository;

  constructor() {
    this.reactionRepository = new ReactionRepository();
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

    // Check if the user already has a reaction for this issue
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
