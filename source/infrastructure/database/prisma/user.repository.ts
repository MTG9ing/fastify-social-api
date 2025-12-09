import type { PrismaClient, User } from "@prisma/client"
import type { RegisterDTO } from "../../../shared/types/authentication.types.ts"

export interface UserRepository {
    findByEmail(email: RegisterDTO['email']): Promise<User | null>
    findById(id: User['id']): Promise<User | null>
    findByUsername(username: User['username']): Promise<User | null>
    create(data: RegisterDTO): Promise<User>
    updateRefreshToken(userId: User['id'], token: string): Promise<void>
}
export class UserRepository implements UserRepository {

    constructor(private readonly prisma: PrismaClient) {}

    async  findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email }})
    }
    async  findById(id: string) {
        return this.prisma.user.findUnique({ where: { id }})
    }
    async  findByUsername(username: string) {
        return this.prisma.user.findUnique({ where: { username }})
    }
    async  create(data: RegisterDTO) {
        return this.prisma.user.create({ data })
    }
    async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
        await this.prisma.user.update({
        where: { id: userId },
        data: { refreshToken }, 
        });
    }
}