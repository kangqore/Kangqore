import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required and must not be empty');
}
const ACCESS_TOKEN_EXPIRY = '1d'; // 1 day (extended for better UX)
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

export interface TokenPayload {
  userId: string;
  role: string;
  sessionId: string;
  sub?: string;
  currentOrgId?: string;
  deptId?: string;
  departmentSlug?: string;
  isDepartmentLead?: boolean;
  isDepartmentHr?: boolean;
  teamCategory?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Generate access and refresh tokens for a user
 */
export const generateTokenPair = (
  userId: string, 
  role: string, 
  currentOrgId?: string,
  rbac?: { deptId?: string, departmentSlug?: string, isDepartmentLead?: boolean, isDepartmentHr?: boolean, teamCategory?: string }
): TokenPair => {
  const sessionId = uuidv4();

  const payload: TokenPayload = {
    userId,
    role,
    sessionId,
    sub: userId,
    ...(currentOrgId ? { currentOrgId } : {}),
    ...(rbac?.deptId ? { deptId: rbac.deptId } : {}),
    ...(rbac?.departmentSlug ? { departmentSlug: rbac.departmentSlug } : {}),
    ...(rbac?.isDepartmentLead ? { isDepartmentLead: rbac.isDepartmentLead } : {}),
    ...(rbac?.isDepartmentHr ? { isDepartmentHr: rbac.isDepartmentHr } : {}),
    ...(rbac?.teamCategory ? { teamCategory: rbac.teamCategory } : {}),
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
    issuer: 'kangqore',
    audience: 'kangqore-client'
  });

  const refreshToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
    issuer: 'kangqore',
    audience: 'kangqore-client'
  });

  return { accessToken, refreshToken };
};

/**
 * Verify and decode access token
 */
export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'kangqore',
      audience: 'kangqore-client'
    }) as TokenPayload;
    
    return decoded;
  } catch (error) {
    console.error('Access token verification failed:', error);
    return null;
  }
};

/**
 * Verify and decode refresh token
 */
export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'kangqore',
      audience: 'kangqore-client'
    }) as TokenPayload;
    
    return decoded;
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    return null;
  }
};

const TWO_FA_CHALLENGE_EXPIRY = '5m';

export interface TwoFactorChallengePayload {
  userId: string;
}

/**
 * Short-lived token issued after password verification when 2FA is enabled.
 * Uses a distinct audience so it can never be accepted by verifyAccessToken.
 */
export const generateTwoFactorChallengeToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: TWO_FA_CHALLENGE_EXPIRY,
    issuer: 'kangqore',
    audience: 'kangqore-2fa-challenge',
  });
};

export const verifyTwoFactorChallengeToken = (token: string): TwoFactorChallengePayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'kangqore',
      audience: 'kangqore-2fa-challenge',
    }) as TwoFactorChallengePayload;

    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * Decode token without verification (for debugging)
 */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: any = jwt.decode(token);
    if (!decoded || !decoded.exp) return true;
    
    const now = Date.now() / 1000;
    return decoded.exp < now;
  } catch (error) {
    return true;
  }
};
