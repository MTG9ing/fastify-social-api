import { PrismaClient, type Session } from '@prisma/client';

// The input data needed to create a new Session record
export interface SessionCreationData {
    userId: string;
    refreshToken: string;
    ipAddress: string;
    deviceType?: string;
    expiresAt: Date;
}

export interface ISessionRepository {
    create(data: SessionCreationData): Promise<Session>;
    findByToken(refreshToken: string): Promise<Session | null>;
    revoke(sessionId: string): Promise<Session>;
    revokeByToken(refreshToken: string): Promise<void>;
}

export class SessionRepository implements ISessionRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async create(data: SessionCreationData): Promise<Session> {
        return this.prisma.session.create({ data });
    }

    async findByToken(refreshToken: string): Promise<Session | null> {
        return this.prisma.session.findUnique({ where: { refreshToken } });
    }

    async revoke(sessionId: string): Promise<Session> {
        return this.prisma.session.update({ 
            where: { id: sessionId }, 
            data: { isRevoked: true } 
        });
    }
    async revokeByToken(refreshToken: string): Promise<void> {
        await this.prisma.session.updateMany({
            where: { refreshToken, isRevoked: false },
            data: { isRevoked: true }
        });
    }
}