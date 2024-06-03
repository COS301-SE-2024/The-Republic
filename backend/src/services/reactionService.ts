import ReactionRepository, { Reaction } from "../db/reactionRepository";

export default class ReactionService {
  private reactionRepository: ReactionRepository;

  constructor() {
    this.reactionRepository = new ReactionRepository();
  }

  async addOrRemoveReaction(issueId: number, userId: string, emoji: string): Promise<Reaction | void> {
    // Check if the user already has a reaction for this issue with the same emoji
    const existingReactions = await this.reactionRepository.getReactionsByUserAndIssue(issueId, userId);
    const existingReaction = existingReactions.find(reaction => reaction.emoji === emoji);

    if (existingReaction) {
      // If the reaction exists, remove it (unreact)
      await this.reactionRepository.deleteReaction(issueId, userId, emoji);
      return;
    }

    // If no existing reaction with the same emoji, add the new reaction
    return await this.reactionRepository.addReaction(issueId, userId, emoji);
  }

  async getReactionsByIssueId(issueId: number): Promise<{ emoji: string; count: number }[]> {
    return await this.reactionRepository.getReactionCountsByIssueId(issueId);
  }
}
