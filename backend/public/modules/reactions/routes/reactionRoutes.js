"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reactionController_1 = __importDefault(require("@/modules/reactions/controllers/reactionController"));
const middleware_1 = require("@/middleware/middleware");
const router = (0, express_1.Router)();
router.use(middleware_1.verifyAndGetUser);
router.post("/", reactionController_1.default.addOrRemoveReaction);
exports.default = router;
