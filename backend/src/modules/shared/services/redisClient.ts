import Redis from "ioredis";
import "dotenv/config";

let redisClient: Redis | null = null;

try {
  redisClient = new Redis(process.env.REDIS_URL as string);

  redisClient.on("error", (err) => {
    // console.error("Redis Client Error", err);
    redisClient = null;
  });

  // redisClient.on('connect', () => console.log('Connected to Redis'));
} catch (error) {
  // console.error("Failed to initialize Redis client:", error);
}

export default redisClient;
