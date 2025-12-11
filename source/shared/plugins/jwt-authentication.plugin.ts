import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import { JwtProvider } from '../../infrastructure/security/jwt.provider.ts';


declare module 'fastify' {
    interface FastifyInstance {
        jwt: JwtProvider; // Declares the decorated property
    }
}
export interface AuthenticatedRequest extends FastifyRequest {
  user?: { userId: string };  // ← This is what you want
}

export const jwtAuthPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate('authenticate', async (request: AuthenticatedRequest, response: FastifyReply) => {
        if (!request.user) {
            response.code(401).send({ message: 'Authentication required.' });
        }
    });

  // Auth hook — runs on every request
  fastify.addHook('onRequest', async (request: AuthenticatedRequest) => {
    const token = request.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      request.user = undefined;
      return;
    }

    try {
        const decoded = fastify.jwt.verifyAccessToken(token);
        request.user = { userId: decoded.userId };
    } catch {
      request.user = undefined;
    }
  });
};
