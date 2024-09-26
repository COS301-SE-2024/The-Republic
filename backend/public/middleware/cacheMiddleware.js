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
exports.cacheMiddleware = void 0;
const redisClient_1 = __importDefault(require("@/modules/shared/services/redisClient"));
const cacheMiddleware = (duration) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (!redisClient_1.default) {
            return next();
        }
        const key = `__express__${req.originalUrl || req.url}__${JSON.stringify(req.body)}`;
        try {
            const cachedBody = yield redisClient_1.default.get(key);
            if (cachedBody) {
                return res.send(JSON.parse(cachedBody));
            }
            else {
                const originalJson = res.json;
                res.json = function (body) {
                    redisClient_1.default === null || redisClient_1.default === void 0 ? void 0 : redisClient_1.default.setex(key, duration, JSON.stringify(body));
                    return originalJson.call(this, body);
                };
                next();
            }
        }
        catch (error) {
            console.error('Redis operation failed:', error);
            next();
        }
    });
};
exports.cacheMiddleware = cacheMiddleware;
