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
exports.updateUserProfile = exports.getUserById = void 0;
const response_1 = require("@/utilities/response");
const userService_1 = require("@/modules/users/services/userService");
const cacheMiddleware_1 = require("@/middleware/cacheMiddleware");
const cacheUtils_1 = require("@/utilities/cacheUtils");
const userService = new userService_1.UserService();
exports.getUserById = [
    (0, cacheMiddleware_1.cacheMiddleware)(300),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield userService.getUserById(req.params.id, req.body.user_id);
            (0, response_1.sendResponse)(res, response);
        }
        catch (error) {
            (0, response_1.sendResponse)(res, error);
        }
    })
];
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield userService.updateUserProfile(req.params.id, req.body, req.file);
        (0, cacheUtils_1.clearCache)(`/api/users/${req.params.id}`);
        (0, cacheUtils_1.clearCachePattern)('__express__/api/users*');
        (0, response_1.sendResponse)(res, response);
    }
    catch (error) {
        (0, response_1.sendResponse)(res, error);
    }
});
exports.updateUserProfile = updateUserProfile;
