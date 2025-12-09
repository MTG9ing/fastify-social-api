import { loginSchema, registerSchema, type LoginDTO, type LoginResult, type RegisterDTO, type RegisterResult } from "../../shared/types/authentication.types.ts"
import type { FastifyReply } from "fastify"
import type { UserRepository } from "../../infrastructure/database/prisma/user.repository.ts"
import type { BcryptHasher } from "../../infrastructure/security/bcrypt.hasher.ts"
import type { JwtProvider } from "../../infrastructure/security/jwt.provider.ts"
import { setRefreshTokenCookie } from "../../shared/utils/cookie.util.ts"

export class RegisterUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly hasher: BcryptHasher,
        private readonly jwt: JwtProvider
    ) {}

    async execute(input: RegisterDTO, response: FastifyReply): Promise<RegisterResult> {
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

        setRefreshTokenCookie(response, refreshToken)

        return {
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
            accessToken
        }
    } 
}

export class LoginUseCase {
        constructor(
        private readonly userRepository: UserRepository,
        private readonly hasher: BcryptHasher,
        private readonly jwt: JwtProvider
    ) {}

    async execute(input: LoginDTO, response: FastifyReply): Promise<LoginResult> {
        const { identifier, password } = loginSchema.parse(input)

        const user = 
                (await this.userRepository.findByEmail(identifier)) ||
                (await this.userRepository.findByUsername(identifier));

        if (!user || !await this.hasher.compare(password, user.password)) throw new Error('Invalid credentials');
        
        const [accessToken, refreshToken] = [this.jwt.signAccessToken({ userId: user.id }), this.jwt.signRefreshToken({ userId: user.id })]

        setRefreshTokenCookie(response, refreshToken)

        return {
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
            accessToken
        }
    }
}