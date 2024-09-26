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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointsController = void 0;
const pointsService_1 = require("../services/pointsService");
const locationService_1 = require("../../locations/services/locationService");
const response_1 = require("@/utilities/response");
const response_2 = require("@/types/response");
const cacheMiddleware_1 = require("@/middleware/cacheMiddleware");
class PointsController {
    constructor() {
        this.getLeaderboard = [
            (0, cacheMiddleware_1.cacheMiddleware)(300),
            (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { userId, province, city, suburb } = req.body;
                    if (!userId) {
                        throw (0, response_2.APIError)({
                            code: 400,
                            success: false,
                            error: "User ID is required",
                        });
                    }
                    const leaderboard = yield this.pointsService.getLeaderboard({ province, city, suburb });
                    const userPosition = yield this.pointsService.getUserPosition(userId, { province, city, suburb });
                    const response = {
                        code: 200,
                        success: true,
                        data: {
                            userPosition,
                            leaderboard,
                        },
                    };
                    (0, response_1.sendResponse)(res, response);
                }
                catch (err) {
                    (0, response_1.sendResponse)(res, err);
                }
            })
        ];
        this.pointsService = new pointsService_1.PointsService();
        this.locationService = new locationService_1.LocationService();
    }
}
exports.PointsController = PointsController;
