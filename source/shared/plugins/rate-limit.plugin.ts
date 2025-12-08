import type { FastifyPluginAsync } from 'fastify';
import redisClient from '../../infrastructure/cache/redis.client.ts';

const IP_LIMIT = 100;     // 100 requests per minute per IP
const USER_LIMIT = 500;   // 500 requests per minute per authenticated user

const rateLimitPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', async (request, reply) => {
    const ip = request.ip;
    const userId = request.user?.userId; // from jwt-auth plugin

    const now = Date.now();
    const minute = Math.floor(now / 60000);

    // Key format: rl:ip:{ip}:{minute}  or  rl:user:{userId}:{minute}
    const ipKey = `rl:ip:${ip}:${minute}`;
    const userKey = userId ? `rl:user:${userId}:${minute}` : null;

    // Increment counters
    const [ipCount, userCount] = await Promise.all([
      redisClient.incr(ipKey),
      userKey ? redisClient.incr(userKey) : Promise.resolve(0),
    ]);

    // Set expiry on first request of the minute
    if (ipCount === 1) await redisClient.expire(ipKey, 120); // 2 minutes
    if (userCount === 1 && userKey) await redisClient.expire(userKey, 120);

    // Check limits
    if (ipCount > IP_LIMIT) {
      reply.code(429).send({
        error: 'Too Many Requests',
        message: 'IP rate limit exceeded',
        retryAfter: 60,
      });
      return;
    }

    if (userCount > USER_LIMIT) {
      reply.code(429).send({
        error: 'Too Many Requests',
        message: 'User rate limit exceeded',
        retryAfter: 60,
      });
      return;
    }

    // Add headers (real companies do this)
    reply.headers({
      'X-RateLimit-Limit': userId ? USER_LIMIT : IP_LIMIT,
      'X-RateLimit-Remaining': userId
        ? Math.max(0, USER_LIMIT - userCount)
        : Math.max(0, IP_LIMIT - ipCount),
      'X-RateLimit-Reset': Math.ceil((minute + 1) * 60000 - now) / 1000, // seconds
    });
  });
};

export default rateLimitPlugin;