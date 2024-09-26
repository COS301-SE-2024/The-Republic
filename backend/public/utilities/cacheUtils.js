"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCachePattern = exports.clearCache = void 0;
const redisClient_1 = __importDefault(require("@/modules/shared/services/redisClient"));
const clearCache = (path, body) => {
    if (!redisClient_1.default)
        return;
    const key = `__express__${path}${body ? `__${JSON.stringify(body)}` : ''}`;
    redisClient_1.default.del(key).catch(err => console.error('Failed to clear cache:', err));
};
exports.clearCache = clearCache;
const clearCachePattern = (pattern) => {
    if (!redisClient_1.default)
        return;
    redisClient_1.default.keys(pattern)
        .then((keys) => {
        if (keys.length > 0) {
            redisClient_1.default === null || redisClient_1.default === void 0 ? void 0 : redisClient_1.default.del(keys);
        }
    })
        .catch(err => console.error('Failed to clear cache pattern:', err));
};
exports.clearCachePattern = clearCachePattern;
