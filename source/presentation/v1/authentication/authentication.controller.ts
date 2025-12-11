import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { RegisterUseCase, LoginUseCase } from '../../application/authentication/authentication.useCase.ts'; // Import the types
import type { LoginDTO, RegisterDTO } from '../../shared/types/authentication.types.ts';

// Define the dependencies the controller needs
interface AuthenticationDependencies {
    registerUseCase: RegisterUseCase;
    loginUseCase: LoginUseCase;
}

// The controller is now a function that sets up routes using the injected dependencies
export function authenticationController(fastify: FastifyInstance, dependencies: AuthenticationDependencies) {

    // POST /authentication/register
    fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
        // Validation is done by Zod in the Use Case, we just pass the body
        const result = await dependencies.registerUseCase.execute(request.body as RegisterDTO, reply);
        reply.code(201).send(result);
    });

    // POST /authentication/login
    fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
        const result = await dependencies.loginUseCase.execute(request.body as LoginDTO, reply);
        reply.code(200).send(result);
    });
}