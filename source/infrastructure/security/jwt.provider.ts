import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_EXPIRES = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error('JWT secrets are missing in environment variables');
}

export class JwtProvider {
  signAccessToken(payload: { userId: string }) {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
  }

  signRefreshToken(payload: { userId: string }) {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
  }

  verifyAccessToken(token: string) {
    return jwt.verify(token, ACCESS_SECRET) as { userId: string };
  }

  verifyRefreshToken(token: string) {
    return jwt.verify(token, REFRESH_SECRET) as { userId: string };
  }
}