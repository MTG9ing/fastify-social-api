import type { FastifyPluginAsync } from 'fastify';

export const authenticationController: FastifyPluginAsync = async (fastify) => {
    fastify.post('/register', async (request, reply) => {
        reply.send({ message: 'register route works' });
    });

    fastify.post('/login', async (request, reply) => {
        reply.send({ message: 'login route works' });
    });

    fastify.post('/refresh', async (request, reply) => {
        reply.send({ message: 'refresh route works' });
    });

    fastify.post('/logout', async (request, reply) => {
        reply.send({ message: 'logout route works' });
    });
};
