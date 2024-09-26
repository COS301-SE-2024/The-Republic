import Redis from "ioredis";
import "dotenv/config";

let redisClient: Redis | null = null;

try {
  redisClient = new Redis(process.env.REDIS_URL as string);

  // redisClient.on('connect', () => console.log('Connected to Redis'));
} catch (error) {
  // no endless logs
}

export default redisClient;
