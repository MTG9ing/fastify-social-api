import Fastify from 'fastify';
import { healthPlugin } from '../infrastructure/plugins/health.plugin.ts';
import rateLimitPlugin from '../shared/plugins/rate-limit.plugin.ts';
import jwtAuthPlugin from '../shared/plugins/jwt-authentication.plugin.ts';

export const application = Fastify({
  logger: process.env.NODE_ENV !== 'development',
});

// Register all plugins here
await application.register(jwtAuthPlugin)
await application.register(rateLimitPlugin);
await application.register(healthPlugin);

