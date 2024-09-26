"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
require("dotenv/config");
let redisClient = null;
try {
    redisClient = new ioredis_1.default(process.env.REDIS_URL);
    redisClient.on('error', (err) => {
        console.error('Redis Client Error', err);
        redisClient = null;
    });
    redisClient.on('connect', () => console.log('Connected to Redis'));
}
catch (error) {
    console.error('Failed to initialize Redis client:', error);
}
exports.default = redisClient;
