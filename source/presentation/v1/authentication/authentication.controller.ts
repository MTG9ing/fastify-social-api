import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { RegisterUseCase, LoginUseCase, LogoutUseCase, RefreshUseCase } from '../../../application/authentication/authentication.useCase.ts'; 
import type { LoginDTO, RegisterDTO } from '../../../shared/types/authentication.types.ts';

// Define the dependencies the controller needs
interface AuthenticationDependencies {
    registerUseCase: RegisterUseCase;
    loginUseCase: LoginUseCase;
    logoutUseCase: LogoutUseCase;
    refreshUseCase: RefreshUseCase;
}

// The controller is now a function that sets up routes using the injected dependencies
export function authenticationController(fastify: FastifyInstance, dependencies: AuthenticationDependencies) {

    // POST /api/v1/authentication/register
    fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
        const result = await dependencies.registerUseCase.execute(request.body as RegisterDTO, reply);
        reply.code(201).send(result);
    });

    // POST /api/v1/authentication/login
    fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
        const result = await dependencies.loginUseCase.execute(request.body as LoginDTO, reply);
        reply.code(200).send(result);
    });

    // POST /api/v1/authentication/logout
    fastify.post('/logout', async (request: FastifyRequest, reply: FastifyReply) => {
        await dependencies.logoutUseCase.execute(request.cookies.refreshToken!, reply);
        reply.code(206);
    });

    // POST /api/v1/authentication/refresh
    fastify.post('/refresh', async (request, reply) => {
        const { newAccess: accessToken } = await dependencies.refreshUseCase.execute(request.cookies.refreshToken, reply);
        reply.send({ accessToken });
    });
}