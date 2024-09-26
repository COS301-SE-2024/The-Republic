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
const response_1 = require("@/utilities/response");
const cacheUtils_1 = require("@/utilities/cacheUtils");
const reactionService = new reactionService_1.default();
const addOrRemoveReaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield reactionService.addOrRemoveReaction(req.body);
        (0, cacheUtils_1.clearCachePattern)('__express__/api/reactions*');
        (0, response_1.sendResponse)(res, response);
    }
    catch (error) {
        (0, response_1.sendResponse)(res, error);
    }
});
exports.default = {
    addOrRemoveReaction,
};
