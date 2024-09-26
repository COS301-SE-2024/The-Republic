"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pointsController_1 = require("../controllers/pointsController");
const router = express_1.default.Router();
const pointsController = new pointsController_1.PointsController();
router.post('/leaderboard', pointsController.getLeaderboard);
exports.default = router;
