import crypto from 'crypto';

/**
 * Service to manage secure session tokens for eQORE visitors.
 */
export class EqoreTokenService {
  /**
   * Generates a new session token for a visitor (stored in cookies/localStorage).
   * Used to connect messages and conversation. Not highly sensitive.
   */
  static generateSessionToken(): string {
    return `eq_${crypto.randomBytes(24).toString('hex')}`;
  }

  /**
   * Validates if a token matches the expected eQORE session format.
   */
  static isValidToken(token: string): boolean {
    return typeof token === 'string' && token.startsWith('eq_') && token.length === 51;
  }

  /**
   * Generates a highly secure, random token for login/register redirects.
   * Only the token is sent in the URL, never lead data.
   */
  static generateSecureRedirectToken(): { token: string; hash: string } {
    const token = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    return { token, hash };
  }

  /**
   * Hashes a provided token for DB lookup.
   */
  static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}

