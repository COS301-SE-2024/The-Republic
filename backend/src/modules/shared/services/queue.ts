import Bull from 'bull';
import { createBullRedisClient } from './redisClient';

const createClient = () => {
    return createBullRedisClient();
};

const reportQueue = new Bull('reportQueue', {
  createClient,
  redis: process.env.REDIS_URL as string,
});

export { reportQueue };