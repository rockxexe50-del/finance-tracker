import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;

export type TokenType = 'access' | 'refresh';

const TOKEN_CONFIG = {
  access: { secretEnv: 'JWT_ACCESS_SECRET', expiresIn: '15m' },
  refresh: { secretEnv: 'JWT_REFRESH_SECRET', expiresIn: '7d' },
} as const;

function secretFor(type: TokenType): string {
  const secret = process.env[TOKEN_CONFIG[type].secretEnv];
  if (!secret) {
    throw new Error(`missing env var: ${TOKEN_CONFIG[type].secretEnv}`);
  }
  return secret;
}

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

function signToken(userId: string, type: TokenType): string {
  return jwt.sign({ sub: userId }, secretFor(type), {
    expiresIn: TOKEN_CONFIG[type].expiresIn,
  });
}

export function generateTokens(userId: string): TokenPair {
  return {
    accessToken: signToken(userId, 'access'),
    refreshToken: signToken(userId, 'refresh'),
  };
}

/**
 * Returns the userId (`sub` claim) when the token is valid for the given type.
 * Throws JsonWebTokenError/TokenExpiredError otherwise — callers map that to 401.
 */
export function verifyToken(token: string, type: TokenType): string {
  const payload = jwt.verify(token, secretFor(type));
  if (typeof payload === 'string' || typeof payload.sub !== 'string') {
    throw new jwt.JsonWebTokenError('invalid token payload');
  }
  return payload.sub;
}
