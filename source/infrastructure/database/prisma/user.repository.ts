import type { PrismaClient, Profile, User } from "@prisma/client";
import type { RegisterDTO } from "../../../shared/types/authentication.types.ts";

export interface IUserRepository {
    findByEmail(email: User['email']): Promise<(User & { profile: { username: string } | null }) | null>
    findById(id: User['id']): Promise<User | null>
    findByUsername(username: Profile['username']): Promise<User | null>
    create(data: RegisterDTO): Promise<User>
    activateUser(userId: User['id']): Promise<User>
}

export class UserRepository implements IUserRepository {
    private readonly selectFields = { 
        id: true, 
        email: true, 
        password: true, 
        role: true, 
        status: true,
        createdAt: true,
        updatedAt: true,
        profile: { select: { username: true } } 
    }

    constructor(private readonly prisma: PrismaClient) {}

    async findByEmail(email: User['email']): Promise<(User & { profile: { username: string } | null }) | null> {
        return this.prisma.user.findUnique({
            where: { email },
            select: this.selectFields
        })
    }

    async findById(id: User['id']): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { id }, select: this.selectFields })
    }

    async findByUsername(username: Profile['username']): Promise<User | null> {
        const profile = await this.prisma.profile.findUnique({
            where: { username },
            select: { userId: true }
        });
        
        if (!profile) return null;

        return this.prisma.user.findUnique({
            where: { id: profile.userId },
            select: this.selectFields
        });
    }

    async create({ username, email, password}: RegisterDTO): Promise<User> {
        return this.prisma.user.create({
            data: {
                email,
                password,
                // Creates the Profile record in the same transaction
                profile: {
                    create: {
                        username,
                        displayName: username, // Default display name
                        isProfileComplete: false,
                    }
                }
            }
        })
    }

    async activateUser(userId: User['id']): Promise<User> {
        return this.prisma.user.update({ where: { id: userId }, data: { status: "ACTIVE" } })
    }
}