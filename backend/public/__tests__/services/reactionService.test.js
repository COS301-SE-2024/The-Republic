"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reactionService_1 = __importDefault(require("@/modules/reactions/services/reactionService"));
const reactionRepository_1 = __importDefault(require("@/modules/reactions/repositories/reactionRepository"));
jest.mock("@/modules/reactions/repositories/reactionRepository");
jest.mock("@/modules/points/services/pointsService");
describe("ReactionService", () => {
    let reactionService;
    let reactionRepository;
    let mockPointsService;
    beforeEach(() => {
        reactionRepository =
            new reactionRepository_1.default();
        reactionService = new reactionService_1.default();
        reactionService.setReactionRepository(reactionRepository);
        mockPointsService = {
            awardPoints: jest.fn().mockResolvedValue(100),
        };
        reactionService.setPointsService(mockPointsService);
    });
    describe("addOrRemoveReaction", () => {
        it("should add a new reaction", () => __awaiter(void 0, void 0, void 0, function* () {
            const newReaction = {
                issue_id: 1,
                user_id: "1",
                emoji: "👍",
                itemType: 'issue',
            };
            const addedReaction = {
                reaction_id: 1,
                issue_id: 1,
                user_id: "1",
                emoji: "👍",
                created_at: "2022-01-01",
            };
            reactionRepository.getReactionByUserAndItem.mockResolvedValue(null);
            reactionRepository.addReaction.mockResolvedValue(addedReaction);
            const response = yield reactionService.addOrRemoveReaction(newReaction);
            expect(mockPointsService.awardPoints).toHaveBeenCalledWith("1", 5, "reacted to an issue");
            expect(response.data).toEqual({
                added: "👍",
                removed: undefined,
            });
            expect(reactionRepository.getReactionByUserAndItem).toHaveBeenCalledWith("1", 'issue', "1");
            expect(reactionRepository.addReaction).toHaveBeenCalledWith(newReaction);
            expect(reactionRepository.addReaction).toHaveBeenCalledTimes(1);
        }));
        it("should remove an existing reaction", () => __awaiter(void 0, void 0, void 0, function* () {
            const reaction = {
                issue_id: 1,
                user_id: "1",
                emoji: "👍",
                itemType: 'issue',
            };
            const existingReaction = {
                reaction_id: 1,
                issue_id: 1,
                user_id: "1",
                emoji: "👍",
                created_at: "2022-01-01",
            };
            reactionRepository.getReactionByUserAndItem.mockResolvedValue(existingReaction);
            reactionRepository.deleteReaction.mockResolvedValue(existingReaction);
            const response = yield reactionService.addOrRemoveReaction(reaction);
            expect(response.data).toEqual({
                added: undefined,
                removed: "👍",
            });
            expect(reactionRepository.getReactionByUserAndItem).toHaveBeenCalledWith("1", 'issue', "1");
            expect(reactionRepository.deleteReaction).toHaveBeenCalledWith("1", 'issue', "1");
            expect(reactionRepository.deleteReaction).toHaveBeenCalledTimes(1);
        }));
        it("should throw an error when user_id is missing", () => __awaiter(void 0, void 0, void 0, function* () {
            const reaction = {
                issue_id: 1,
                emoji: "👍",
                itemType: 'issue',
            };
            yield expect((() => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield reactionService.addOrRemoveReaction(reaction);
                }
                catch (error) {
                    throw new Error(error.error);
                }
            }))()).rejects.toThrow("You need to be signed in to react");
            expect(reactionRepository.getReactionByUserAndItem).not.toHaveBeenCalled();
            expect(reactionRepository.addReaction).not.toHaveBeenCalled();
            expect(reactionRepository.deleteReaction).not.toHaveBeenCalled();
        }));
        it("should throw an error when required fields are missing", () => __awaiter(void 0, void 0, void 0, function* () {
            const reaction = {
                user_id: "1",
                itemType: 'issue',
            };
            yield expect((() => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield reactionService.addOrRemoveReaction(reaction);
                }
                catch (error) {
                    throw new Error(error.error);
                }
            }))()).rejects.toThrow("Missing required fields for reacting");
            expect(reactionRepository.getReactionByUserAndItem).not.toHaveBeenCalled();
            expect(reactionRepository.addReaction).not.toHaveBeenCalled();
            expect(reactionRepository.deleteReaction).not.toHaveBeenCalled();
        }));
    });
});
