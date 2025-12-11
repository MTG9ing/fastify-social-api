import type { FastifyReply } from 'fastify';

export const setRefreshTokenCookie = (response: FastifyReply, token: string) => {
  response.setCookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/authentication/refresh',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
};

export const clearRefreshTokenCookie = (response: FastifyReply) => {
  response.clearCookie('refreshToken', {
    path: '/authentication/refresh',
  });
};