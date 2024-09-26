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
const reactionRepository_1 = __importDefault(require("@/modules/reactions/repositories/reactionRepository"));
const response_1 = require("@/types/response");
const pointsService_1 = require("@/modules/points/services/pointsService");
class ReactionService {
    constructor() {
        this.reactionRepository = new reactionRepository_1.default();
        this.pointsService = new pointsService_1.PointsService();
    }
    setReactionRepository(reactionRepository) {
        this.reactionRepository = reactionRepository;
    }
    setPointsService(pointsService) {
        this.pointsService = pointsService;
    }
    addOrRemoveReaction(reaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!reaction.user_id) {
                throw (0, response_1.APIError)({
                    code: 401,
                    success: false,
                    error: "You need to be signed in to react",
                });
            }
            if ((!reaction.issue_id && !reaction.post_id) || !reaction.emoji || !reaction.itemType) {
                throw (0, response_1.APIError)({
                    code: 400,
                    success: false,
                    error: "Missing required fields for reacting",
                });
            }
            const itemId = reaction.issue_id || reaction.post_id;
            const itemType = reaction.itemType;
            let added;
            let removed;
            const existingReaction = yield this.reactionRepository.getReactionByUserAndItem(itemId.toString(), itemType, reaction.user_id);
            if (existingReaction) {
                const removedReaction = yield this.reactionRepository.deleteReaction(itemId.toString(), itemType, reaction.user_id);
                removed = removedReaction.emoji;
            }
            if (reaction.emoji !== removed) {
                const addedReaction = yield this.reactionRepository.addReaction(reaction);
                added = addedReaction.emoji;
                yield this.pointsService.awardPoints(reaction.user_id, 5, `reacted to an ${itemType}`);
            }
            return (0, response_1.APIData)({
                code: 200,
                success: true,
                data: {
                    added,
                    removed,
                },
            });
        });
    }
}
exports.default = ReactionService;
