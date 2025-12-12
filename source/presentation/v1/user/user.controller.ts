import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

// Define the dependencies the controller needs
interface UserDependencies {

}

// The controller is now a function that sets up routes using the injected dependencies
export function authenticationController(fastify: FastifyInstance, dependencies: UserDependencies) {

    // POST /authentication/register
    fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    });

    // POST /authentication/login
    fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    });
}