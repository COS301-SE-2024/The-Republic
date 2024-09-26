import ReactionService from "@/modules/reactions/services/reactionService";
import ReactionRepository from "@/modules/reactions/repositories/reactionRepository";
import { Reaction } from "@/modules/shared/models/reaction";
import { APIResponse } from "@/types/response";
import { PointsService } from "@/modules/points/services/pointsService";

jest.mock("@/modules/reactions/repositories/reactionRepository");
jest.mock("@/modules/points/services/pointsService");

describe("ReactionService", () => {
  let reactionService: ReactionService;
  let reactionRepository: jest.Mocked<ReactionRepository>;
  let mockPointsService: jest.Mocked<PointsService>;

  beforeEach(() => {
    reactionRepository =
      new ReactionRepository() as jest.Mocked<ReactionRepository>;
    reactionService = new ReactionService();
    reactionService.setReactionRepository(reactionRepository);
    mockPointsService = {
      awardPoints: jest.fn().mockResolvedValue(100),
    } as unknown as jest.Mocked<PointsService>;
    reactionService.setPointsService(mockPointsService);
  });

  describe("addOrRemoveReaction", () => {
    it("should add a new reaction", async () => {
      const newReaction: Partial<Reaction> & { itemType: "issue" | "post" } = {
        issue_id: 1,
        user_id: "1",
        emoji: "👍",
        itemType: "issue",
      };
      const addedReaction: Reaction = {
        reaction_id: 1,
        issue_id: 1,
        user_id: "1",
        emoji: "👍",
        created_at: "2022-01-01",
      };
      reactionRepository.getReactionByUserAndItem.mockResolvedValue(null);
      reactionRepository.addReaction.mockResolvedValue(addedReaction);

      const response = await reactionService.addOrRemoveReaction(newReaction);

      expect(mockPointsService.awardPoints).toHaveBeenCalledWith(
        "1",
        5,
        "reacted to an issue",
      );

      expect(response.data).toEqual({
        added: "👍",
        removed: undefined,
      });
      expect(reactionRepository.getReactionByUserAndItem).toHaveBeenCalledWith(
        "1",
        "issue",
        "1",
      );
      expect(reactionRepository.addReaction).toHaveBeenCalledWith(newReaction);
      expect(reactionRepository.addReaction).toHaveBeenCalledTimes(1);
    });

    it("should remove an existing reaction", async () => {
      const reaction: Partial<Reaction> & { itemType: "issue" | "post" } = {
        issue_id: 1,
        user_id: "1",
        emoji: "👍",
        itemType: "issue",
      };
      const existingReaction: Reaction = {
        reaction_id: 1,
        issue_id: 1,
        user_id: "1",
        emoji: "👍",
        created_at: "2022-01-01",
      };
      reactionRepository.getReactionByUserAndItem.mockResolvedValue(
        existingReaction,
      );
      reactionRepository.deleteReaction.mockResolvedValue(existingReaction);

      const response = await reactionService.addOrRemoveReaction(reaction);

      expect(response.data).toEqual({
        added: undefined,
        removed: "👍",
      });
      expect(reactionRepository.getReactionByUserAndItem).toHaveBeenCalledWith(
        "1",
        "issue",
        "1",
      );
      expect(reactionRepository.deleteReaction).toHaveBeenCalledWith(
        "1",
        "issue",
        "1",
      );
      expect(reactionRepository.deleteReaction).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when user_id is missing", async () => {
      const reaction: Partial<Reaction> & { itemType: "issue" | "post" } = {
        issue_id: 1,
        emoji: "👍",
        itemType: "issue",
      };

      await expect(
        (async () => {
          try {
            await reactionService.addOrRemoveReaction(reaction);
          } catch (error) {
            throw new Error((error as APIResponse).error);
          }
        })(),
      ).rejects.toThrow("You need to be signed in to react");
      expect(
        reactionRepository.getReactionByUserAndItem,
      ).not.toHaveBeenCalled();
      expect(reactionRepository.addReaction).not.toHaveBeenCalled();
      expect(reactionRepository.deleteReaction).not.toHaveBeenCalled();
    });

    it("should throw an error when required fields are missing", async () => {
      const reaction: Partial<Reaction> & { itemType: "issue" | "post" } = {
        user_id: "1",
        itemType: "issue",
      };

      await expect(
        (async () => {
          try {
            await reactionService.addOrRemoveReaction(reaction);
          } catch (error) {
            throw new Error((error as APIResponse).error);
          }
        })(),
      ).rejects.toThrow("Missing required fields for reacting");
      expect(
        reactionRepository.getReactionByUserAndItem,
      ).not.toHaveBeenCalled();
      expect(reactionRepository.addReaction).not.toHaveBeenCalled();
      expect(reactionRepository.deleteReaction).not.toHaveBeenCalled();
    });
  });
});
