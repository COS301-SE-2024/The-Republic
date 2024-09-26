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
exports.PointsService = void 0;
const pointsRepository_1 = require("./../repositories/pointsRepository");
const supabaseClient_1 = __importDefault(require("@/modules/shared/services/supabaseClient"));
class PointsService {
    constructor() {
        this.pointsRepository = new pointsRepository_1.PointsRepository();
    }
    awardPoints(userId, points, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const newScore = yield this.pointsRepository.updateUserScore(userId, points);
            yield this.pointsRepository.logPointsTransaction(userId, points, reason);
            if (newScore < -150) {
                yield this.pointsRepository.blockUser(userId);
            }
            return newScore;
        });
    }
    penalizeUser(userId, points, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const newScore = yield this.pointsRepository.updateUserScore(userId, -points);
            yield this.pointsRepository.logPointsTransaction(userId, -points, reason);
            if (reason === "Falsely resolving someone else's issue") {
                yield this.pointsRepository.suspendUserFromResolving(userId);
            }
            if (newScore < -150) {
                yield this.pointsRepository.blockUser(userId);
            }
            return newScore;
        });
    }
    getFirstTimeAction(userId, action) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
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
        });
    }
    getLeaderboard(locationFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.pointsRepository.getLeaderboard(locationFilter);
        });
    }
    getUserPosition(userId, locationFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.pointsRepository.getUserPosition(userId, locationFilter);
        });
    }
}
exports.PointsService = PointsService;
