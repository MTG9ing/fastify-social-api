import { prisma } from '../database/prisma/client.ts';
import type { FastifyPluginAsync } from 'fastify';

export const healthPlugin: FastifyPluginAsync = async (fastify) => {
  // Register the route
  fastify.get('/health', async () => {
    let dbStatus = 'ok';
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      dbStatus = 'error';
      fastify.log.error('Health check DB failed: ' + error);
    }

    return {
      status: 'ok',
      service: 'Pulse Social API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatus,
      redis: 'not-connected-yet',
    };
  });

  // Graceful shutdown — disconnect Prisma + pool
  // fastify.addHook('onClose', async () => {
  //   fastify.log.info('Shutting down — disconnecting database...');
  //   await prisma.$disconnect();
  //   await pool.end();
  // });
};
