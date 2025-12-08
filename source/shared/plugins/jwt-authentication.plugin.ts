import type { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { JwtProvider } from '../../infrastructure/security/jwt.provider.ts';

interface AuthenticatedRequest extends FastifyRequest {
  user?: { userId: string };  // ← This is what you want
}

const jwtAuthPlugin: FastifyPluginAsync = async (fastify) => {
  // Decorator — adds user to request
  fastify.decorateRequest('user', null as { userId: string } | null);

  // Auth hook — runs on every request
  fastify.addHook('onRequest', async (request: AuthenticatedRequest) => {
    const token = request.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      request.user = undefined;
      return;
    }

    try {
        const jwt = new JwtProvider()
        const decoded = jwt.verifyAccessToken(token);
        request.user = { userId: decoded.userId };
    } catch {
      request.user = undefined;
    }
  });
};

export default jwtAuthPlugin;