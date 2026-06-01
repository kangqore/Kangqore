import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { authenticate, AuthenticatedRequest as AuthRequest } from '../../middleware/auth';
import { createError } from '../../middleware/errorHandler';
import { randomBytes } from 'crypto';
import dns from 'dns/promises';
import logger from '../../utils/logger';

const router = Router();

const VERIFY_PREFIX = 'kangqore-verify=';

/**
 * GET /api/scheduling/custom-domains
 * List custom domains for the current user
 */
router.get('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const domains = await prisma.customDomain.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, domains });
  } catch (error) { next(error); }
});

/**
 * POST /api/scheduling/custom-domains
 * Register a new custom domain (starts as PENDING)
 * Body: { domain: "book.acme.com" }
 */
router.post('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const { domain } = req.body;

    if (!domain || !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain.toLowerCase())) {
      throw createError('Invalid domain format', 400);
    }

    const normalized = domain.toLowerCase().trim();

    // Check if already taken by another user
    const existing = await prisma.customDomain.findUnique({ where: { domain: normalized } });
    if (existing && existing.userId !== req.user.id) {
      throw createError('This domain is already registered', 409);
    }
    if (existing) {
      return res.json({ success: true, domain: existing });
    }

    const verifyToken = randomBytes(24).toString('hex');

    const created = await prisma.customDomain.create({
      data: {
        userId: req.user.id,
        domain: normalized,
        verifyToken,
        status: 'PENDING'
      }
    });

    res.status(201).json({
      success: true,
      domain: created,
      instructions: {
        step1: `Add a CNAME record pointing "${normalized}" to "${process.env.BOOKING_HOST || 'book.kangqore.com'}"`,
        step2: `Add a TXT record "_kangqore-verify.${normalized}" with value "${VERIFY_PREFIX}${verifyToken}"`,
        step3: 'Click "Verify" once DNS has propagated (may take up to 24h)'
      }
    });
  } catch (error) { next(error); }
});

/**
 * POST /api/scheduling/custom-domains/:id/verify
 * Check DNS TXT record and mark domain as VERIFIED if it matches
 */
router.post('/:id/verify', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);

    const record = await prisma.customDomain.findUnique({ where: { id: req.params.id } });
    if (!record) throw createError('Domain not found', 404);
    if (record.userId !== req.user.id) throw createError('Unauthorized', 403);
    if (record.status === 'VERIFIED') {
      return res.json({ success: true, verified: true, domain: record });
    }

    const txtHost = `_kangqore-verify.${record.domain}`;
    const expectedValue = `${VERIFY_PREFIX}${record.verifyToken}`;

    let verified = false;
    try {
      const txtRecords = await dns.resolveTxt(txtHost);
      verified = txtRecords.flat().some(v => v === expectedValue);
    } catch (err) {
      logger.warn(`[CustomDomain] DNS lookup failed for ${txtHost}`, err);
    }

    if (!verified) {
      await prisma.customDomain.update({
        where: { id: record.id },
        data: { status: 'ERROR' }
      });
      return res.json({
        success: false,
        verified: false,
        message: `TXT record "_kangqore-verify.${record.domain}" not found or does not match. Expected value: "${expectedValue}"`
      });
    }

    const updated = await prisma.customDomain.update({
      where: { id: record.id },
      data: { status: 'VERIFIED', verifiedAt: new Date() }
    });

    res.json({ success: true, verified: true, domain: updated });
  } catch (error) { next(error); }
});

/**
 * DELETE /api/scheduling/custom-domains/:id
 * Remove a custom domain
 */
router.delete('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);

    const record = await prisma.customDomain.findUnique({ where: { id: req.params.id } });
    if (!record) throw createError('Domain not found', 404);
    if (record.userId !== req.user.id) throw createError('Unauthorized', 403);

    await prisma.customDomain.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Domain removed' });
  } catch (error) { next(error); }
});

export default router;
