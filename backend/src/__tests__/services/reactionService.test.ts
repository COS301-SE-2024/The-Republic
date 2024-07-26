import ReactionService from "@/modules/reactions/services/reactionService";
import ReactionRepository from "@/modules/reactions/repositories/reactionRepository";
import { Reaction } from "@/modules/shared/models/reaction";
import { APIResponse } from "@/types/response";

jest.mock("@/modules/reactions/repositories/reactionRepository");

describe("ReactionService", () => {
  let reactionService: ReactionService;
  let reactionRepository: jest.Mocked<ReactionRepository>;

  beforeEach(() => {
    reactionRepository =
      new ReactionRepository() as jest.Mocked<ReactionRepository>;
    reactionService = new ReactionService();
    reactionService.setReactionRepository(reactionRepository);
  });

  describe("addOrRemoveReaction", () => {
    it("should add a new reaction", async () => {
      const newReaction: Partial<Reaction> = {
        issue_id: 1,
        user_id: "1",
        emoji: "👍",
      };
      const addedReaction: Reaction = {
        ...newReaction,
        issue_id: 1,
        user_id: "1",
        reaction_id: 1,
        emoji: "👍",
        created_at: "2022-01-01",
      };
      reactionRepository.getReactionByUserAndIssue.mockResolvedValue(null);
      reactionRepository.addReaction.mockResolvedValue(addedReaction);

      const response = await reactionService.addOrRemoveReaction(
        newReaction as Reaction,
      );

      expect(response.data).toEqual({
        added: "👍",
        removed: undefined,
      });
      expect(reactionRepository.getReactionByUserAndIssue).toHaveBeenCalledWith(
        1,
        "1",
      );
      expect(reactionRepository.addReaction).toHaveBeenCalledWith(
        newReaction as Reaction,
      );
      expect(reactionRepository.addReaction).toHaveBeenCalledTimes(1);
    });

    it("should remove an existing reaction", async () => {
      const reaction: Partial<Reaction> = {
        issue_id: 1,
        user_id: "1",
        emoji: "👍",
      };
      const existingReaction: Reaction = {
        ...reaction,
        issue_id: 1,
        user_id: "1",
        reaction_id: 1,
        emoji: "👍",
        created_at: "2022-01-01",
      };
      reactionRepository.getReactionByUserAndIssue.mockResolvedValue(
        existingReaction,
      );
      reactionRepository.deleteReaction.mockResolvedValue(existingReaction);

      const response = await reactionService.addOrRemoveReaction(
        reaction as Reaction,
      );

      expect(response.data).toEqual({
        added: undefined,
        removed: "👍",
      });
      expect(reactionRepository.getReactionByUserAndIssue).toHaveBeenCalledWith(
        1,
        "1",
      );
      expect(reactionRepository.deleteReaction).toHaveBeenCalledWith(1, "1");
      expect(reactionRepository.deleteReaction).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when user_id is missing", async () => {
      const reaction: Partial<Reaction> = {
        issue_id: 1,
        emoji: "👍",
      };

      await expect(
        (async () => {
          try {
            await reactionService.addOrRemoveReaction(reaction as Reaction);
          } catch (error) {
            throw new Error((error as APIResponse).error);
          }
        })(),
      ).rejects.toThrow("You need to be signed in to react");
      expect(
        reactionRepository.getReactionByUserAndIssue,
      ).not.toHaveBeenCalled();
      expect(reactionRepository.addReaction).not.toHaveBeenCalled();
      expect(reactionRepository.deleteReaction).not.toHaveBeenCalled();
    });

    it("should throw an error when required fields are missing", async () => {
      const reaction: Partial<Reaction> = {
        user_id: "1",
      };

      await expect(
        (async () => {
          try {
            await reactionService.addOrRemoveReaction(reaction as Reaction);
          } catch (error) {
            throw new Error((error as APIResponse).error);
          }
        })(),
      ).rejects.toThrow("Missing required fields for reacting");
      expect(
        reactionRepository.getReactionByUserAndIssue,
      ).not.toHaveBeenCalled();
      expect(reactionRepository.addReaction).not.toHaveBeenCalled();
      expect(reactionRepository.deleteReaction).not.toHaveBeenCalled();
    });
  });
});
