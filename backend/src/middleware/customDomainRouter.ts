import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

const PLATFORM_HOSTS = new Set([
  'kangqore.com',
  'www.kangqore.com',
  'book.kangqore.com',
  'localhost',
  '127.0.0.1'
]);

/**
 * Middleware that detects custom booking domains.
 *
 * When a request arrives at e.g. "book.acme.com", this middleware:
 *   1. Looks up a VERIFIED CustomDomain record matching that hostname
 *   2. Attaches `req.customDomain` with the domain record and host user
 *   3. The booking routes use this to white-label the response
 *
 * Falls through silently for all platform-owned hostnames.
 */
export async function customDomainRouter(req: Request & { customDomain?: any }, res: Response, next: NextFunction) {
  const host = (req.hostname || '').toLowerCase().replace(/:\d+$/, '');

  if (!host || PLATFORM_HOSTS.has(host)) return next();

  try {
    const record = await prisma.customDomain.findFirst({
      where: { domain: host, status: 'VERIFIED' },
      include: { user: { select: { id: true, name: true, avatarUrl: true, company: true } } }
    });

    if (record) {
      req.customDomain = record;
    }
  } catch {
    // Never break a request over a domain lookup failure
  }

  next();
}
