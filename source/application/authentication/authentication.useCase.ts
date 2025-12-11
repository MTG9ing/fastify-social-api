import { loginSchema, registerSchema, type LoginDTO, type RegisterDTO, type AuthenticationResponse  } from "../../shared/types/authentication.types.ts"
import type { FastifyReply } from "fastify"
import type { IUserRepository } from "../../infrastructure/database/prisma/user.repository.ts"
import type { BcryptHasher } from "../../infrastructure/security/bcrypt.hasher.ts"
import type { JwtProvider } from "../../infrastructure/security/jwt.provider.ts"
import { setRefreshTokenCookie } from "../../shared/utils/cookie.util.ts"
import type { ISessionRepository } from "../../infrastructure/database/prisma/session.repository.ts"

const REFRESH_TOKEN_EXPIRY_SECONDS = 30 * 24 * 60 * 60;

export class RegisterUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly sessionRepository: ISessionRepository,
        private readonly hasher: BcryptHasher,
        private readonly jwt: JwtProvider
    ) {}

    async execute(input: RegisterDTO, response: FastifyReply): Promise<AuthenticationResponse> {
        const { username, email, password } = registerSchema.parse(input)

        const existing = await Promise.all([
            this.userRepository.findByEmail(email),
            this.userRepository.findByUsername(username)
        ])

        if(existing[0]) throw new Error("Email already exists")
        if(existing[1]) throw new Error("Username already taken")

        const hashedPassword = await this.hasher.hash(password)

        const user = await this.userRepository.create({
            email,
            username,
            password: hashedPassword
        })
        const [accessToken, refreshToken] = [this.jwt.signAccessToken({ userId: user.id }), this.jwt.signRefreshToken({ userId: user.id })]

        const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_SECONDS * 1000);
        await this.sessionRepository.create({
            userId: user.id,
            refreshToken,
            ipAddress: response.request.ip || 'unknown', // Access IP from FastifyReply's request object
            expiresAt,
            deviceType: response.request.headers['user-agent'] || 'unknown',
        });

        setRefreshTokenCookie(response, refreshToken)

        return {
            user: {
                id: user.id,
                email: user.email,
                username: username, 
                role: user.role,
                status: user.status,
            },
            accessToken
        };
    } 
}

export class LoginUseCase {
        constructor(
        private readonly userRepository: IUserRepository,
        private readonly sessionRepository: ISessionRepository,
        private readonly hasher: BcryptHasher,
        private readonly jwt: JwtProvider
    ) {}

    async execute(input: LoginDTO, response: FastifyReply): Promise<AuthenticationResponse> {
        const { identifier, password } = loginSchema.parse(input)

        const user = 
                (await this.userRepository.findByEmail(identifier)) ||
                (await this.userRepository.findByUsername(identifier));

        if (!user || !await this.hasher.compare(password, user.password)) throw new Error('Invalid credentials');
        
        if (user.status !== 'ACTIVE') throw new Error('Account inactive. Please verify your email.');

        const [accessToken, refreshToken] = [this.jwt.signAccessToken({ userId: user.id }), this.jwt.signRefreshToken({ userId: user.id })]

        const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_SECONDS * 1000);
        await this.sessionRepository.create({
            userId: user.id,
            refreshToken,
            ipAddress: response.request.ip || 'unknown', // Access IP from FastifyReply's request object
            expiresAt,
            deviceType: response.request.headers['user-agent'] || 'unknown',
        });


        setRefreshTokenCookie(response, refreshToken)

        return {
            user: {
                id: user.id,
                email: user.email,
                username: user.profile!.username, // Guaranteed to exist here
                role: user.role,
                status: user.status,
            },
            accessToken
        };
    }
}