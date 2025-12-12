import Fastify from 'fastify';
import fastifyCookie from '@fastify/cookie'; 

// --- Infrastructure / Dependency Imports ---
import { UserRepository, type IUserRepository } from '../infrastructure/database/prisma/user.repository.ts';
import { SessionRepository, type ISessionRepository } from '../infrastructure/database/prisma/session.repository.ts';
import { BcryptHasher } from '../infrastructure/security/bcrypt.hasher.ts'; 
import { JwtProvider } from '../infrastructure/security/jwt.provider.ts';
import { RegisterUseCase, LoginUseCase, LogoutUseCase, RefreshUseCase } from '../application/authentication/authentication.useCase.ts'; 

// --- Plugin / Controller Imports ---
import { healthPlugin } from '../infrastructure/plugins/health.plugin.ts';
import { rateLimitPlugin } from '../shared/plugins/rate-limit.plugin.ts';
import { jwtAuthPlugin } from '../shared/plugins/jwt-authentication.plugin.ts';
import { authenticationController } from '../presentation/v1/authentication/authentication.controller.ts';
import { prisma } from '../infrastructure/database/prisma/client.ts';


export const application = Fastify({
    logger: {
        level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
        
        // Dev-only: pretty logs
        transport: process.env.NODE_ENV === 'development' 
        ? { target: 'pino-pretty', options: { colorize: true } }
        : undefined,
    },
});

// --- 1. CORE SERVICE INITIALIZATION ---
// Initialize services that are only created once (Singletons) 
const jwtProvider = new JwtProvider();
const bcryptHasher = new BcryptHasher; 

// --- 3. REPOSITORY & USE CASE INITIALIZATION ---
// Inject dependencies into our architectural layers
const userRepository: IUserRepository = new UserRepository(prisma);
const sessionRepository: ISessionRepository = new SessionRepository(prisma);

const registerUseCase = new RegisterUseCase(userRepository, sessionRepository, bcryptHasher, jwtProvider);
const loginUseCase = new LoginUseCase(userRepository, sessionRepository, bcryptHasher, jwtProvider);
const logoutUseCase = new LogoutUseCase(sessionRepository);
const refreshUseCase = new RefreshUseCase(sessionRepository, userRepository, jwtProvider)

// --- 4. REGISTER PLUGINS AND CONTROLLERS ---
// Register standard Fastify plugins
await application.register(fastifyCookie); // Must be registered early!
await application.register(jwtAuthPlugin);
await application.register(rateLimitPlugin);
await application.register(healthPlugin);


// --- 5. REGISTER CONTROLLER (INJECTING USE CASES) ---
// We create a factory function pattern to inject the Use Cases into the controller
await application.register(async (app) => {
    // Pass the initialized use cases to the controller's factory function
    authenticationController(app, {
        registerUseCase,
        loginUseCase,
        logoutUseCase,
        refreshUseCase
    });
}, { prefix: '/api/v1/authentication' });
