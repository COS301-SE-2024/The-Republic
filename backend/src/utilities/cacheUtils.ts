import redisClient from '@/modules/shared/services/redisClient';

export const clearCache = (path: string, body?: unknown) => {
  if (!redisClient) return;

  const key = `__express__${path}${body ? `__${JSON.stringify(body)}` : ''}`;
  redisClient.del(key).catch(err => console.error('Failed to clear cache:', err));
};

export const clearCachePattern = (pattern: string) => {
  if (!redisClient) return;

  redisClient.keys(pattern)
    .then((keys) => {
      if (keys.length > 0) {
        redisClient?.del(keys);
      }
    })
    .catch(err => console.error('Failed to clear cache pattern:', err));
};