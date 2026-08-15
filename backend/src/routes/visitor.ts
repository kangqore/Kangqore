// ─── Visitor Tracking + Identity Stitching ───────────────────────────────────
// Public routes: /api/public/visitor/*
// Admin routes:  /api/admin/visitor/*  (requires ADMIN role)

import { Router, Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import geoip from 'geoip-lite'
import { prisma } from '../lib/prisma'
import { requireAuth, requireRole } from '../middleware/rbac'
import type { AuthRequest } from '../middleware/rbac'
import logger from '../utils/logger'
import { upsertPresence, getActivePresence } from '../kangqore-view/awareness/VisitorPresenceRegistry'
import { getIO } from '../socket'
import { WaandaTrainingPipeline } from '../waanda-training'
import { LeadEnrichmentService } from '../kangqore-view/awareness/LeadEnrichmentService'

function extractIp(req: Request): string | null {
  const forwarded = req.headers['x-forwarded-for']
  if (forwarded) {
    const first = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0]
    return first.trim()
  }
  return req.ip ?? null
}

function geoLookup(ip: string | null): { country: string | null; city: string | null; isp: string | null } {
  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return { country: null, city: null, isp: null }
  }
  const geo = geoip.lookup(ip)
  if (!geo) return { country: null, city: null, isp: null }
  return {
    country: geo.country ?? null,
    city:    geo.city    ?? null,
    isp:     (geo as any).org ?? null,
  }
}

export const publicVisitorRouter  = Router()
export const adminVisitorRouter   = Router()

// ── Validation ────────────────────────────────────────────────────────────────

const identifySchema = Joi.object({
  visitorUuid:   Joi.string().uuid().required(),
  fingerprint:   Joi.string().max(128).optional().allow('', null),
  deviceSignals: Joi.object().optional(),
  utmSource:     Joi.string().max(100).optional().allow('', null),
  utmMedium:     Joi.string().max(100).optional().allow('', null),
  utmCampaign:   Joi.string().max(100).optional().allow('', null),
  referrer:      Joi.string().max(500).optional().allow('', null),
})

const eventSchema = Joi.object({
  visitorUuid: Joi.string().uuid().required(),
  type:        Joi.string().valid(
    'PAGE_VIEW', 'SCROLL_DEPTH', 'EQORE_QUERY',
    'CTA_CLICK', 'EXIT_INTENT', 'SESSION_START', 'TIME_ON_PAGE'
  ).required(),
  path:  Joi.string().max(500).required(),
  data:  Joi.object().optional().default({}),
})

const stitchSchema = Joi.object({
  visitorUuid: Joi.string().uuid().required(),
  userId:      Joi.string().required(),
})

const consentSchema = Joi.object({
  visitorUuid: Joi.string().uuid().required(),
  preferences: Joi.object({
    necessary: Joi.boolean().required(),
    functional: Joi.boolean().required(),
    targeting: Joi.boolean().required(),
    performance: Joi.boolean().required(),
  }).required(),
})

// ── Alert throttle — prevent re-alerting same visitor within 1 hour ───────────
const alertedThisHour = new Map<string, Set<string>>()
setInterval(() => alertedThisHour.clear(), 60 * 60 * 1000)

function shouldAlert(visitorId: string, threshold: string): boolean {
  const key = `${visitorId}:${threshold}`
  const alerted = alertedThisHour.get(key)
  if (alerted) return false
  alertedThisHour.set(key, new Set([threshold]))
  return true
}

// ── Helper: extract top pages + intent tags from recent events ─────────────────

async function recomputeSummary(visitorId: string) {
  const events = await prisma.visitorEvent.findMany({
    where:   { visitorId },
    orderBy: { createdAt: 'desc' },
    take:    200,
  })

  // Top pages — by visit count
  const pageCounts: Record<string, number> = {}
  const eqoreQueries: string[] = []
  const intentTags   = new Set<string>()

  for (const ev of events) {
    if (ev.type === 'PAGE_VIEW') {
      pageCounts[ev.path] = (pageCounts[ev.path] ?? 0) + 1
    }
    if (ev.type === 'EQORE_QUERY') {
      const d = ev.data as any
      if (d?.query) eqoreQueries.push(String(d.query).slice(0, 200))
      if (d?.intentTag) intentTags.add(String(d.intentTag))
    }
  }

  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([p]) => p)

  const updated = await prisma.anonymousVisitor.update({
    where: { id: visitorId },
    data: {
      topPages,
      eqoreQueries: [...new Set(eqoreQueries)].slice(0, 20),
      intentTags:   [...intentTags].slice(0, 20),
    },
    select: { id: true, sessionCount: true, eqoreQueries: true, country: true, city: true, stitchedToId: true },
  })

  // Hot visitor alerts — push to all admin sockets
  const alerts: { message: string; visitorId: string }[] = []
  const loc = [updated.city, updated.country].filter(Boolean).join(', ') || 'Unknown location'
  const who = updated.stitchedToId ? 'Identified visitor' : 'Anonymous visitor'

  if (updated.eqoreQueries.length === 1 && shouldAlert(visitorId, 'first_eqore')) {
    alerts.push({ message: `${who} in ${loc} just ran their first eQORE query`, visitorId })
  }
  if (updated.sessionCount === 3 && shouldAlert(visitorId, '3rd_session')) {
    alerts.push({ message: `${who} in ${loc} is back for their 3rd session`, visitorId })
  }
  if (updated.sessionCount === 5 && shouldAlert(visitorId, '5th_session')) {
    alerts.push({ message: `${who} in ${loc} has visited 5 times — high intent`, visitorId })
  }
  if (updated.eqoreQueries.length === 5 && shouldAlert(visitorId, '5_eqore')) {
    alerts.push({ message: `${who} in ${loc} has run 5 eQORE queries`, visitorId })
  }
  // Pricing/services page signal
  const pricingHit = topPages.some(p => p.includes('pricing') || p.includes('/services'))
  if (pricingHit && updated.sessionCount >= 2 && shouldAlert(visitorId, 'pricing_returning')) {
    alerts.push({ message: `${who} in ${loc} is back browsing pricing/services pages`, visitorId })
  }

  if (alerts.length) {
    try {
      const io = getIO()
      for (const alert of alerts) {
        io.to('admin').emit('visitor:hot:alert', alert)
      }
    } catch { /* socket not ready */ }
  }
}

// ── POST /identify ─────────────────────────────────────────────────────────────

publicVisitorRouter.post('/identify', async (req: Request, res: Response) => {
  const { error, value } = identifySchema.validate(req.body)
  if (error) return res.status(400).json({ error: error.details[0].message })

  const ip  = extractIp(req)
  const geo = geoLookup(ip)

  try {
    const existing = await prisma.anonymousVisitor.findUnique({
      where: { visitorUuid: value.visitorUuid },
    })

    if (existing) {
      // Returning visitor — bump session count, update IP/geo if changed
      const updated = await prisma.anonymousVisitor.update({
        where: { id: existing.id },
        data:  {
          sessionCount: { increment: 1 },
          ...(ip && { ipAddress: ip }),
          ...(geo.country && { country: geo.country }),
          ...(geo.city    && { city: geo.city }),
          ...(geo.isp     && { isp: geo.isp }),
        },
      })
      return res.json({ visitorId: updated.id, sessionCount: updated.sessionCount, returning: true })
    }

    // New visitor
    const created = await prisma.anonymousVisitor.create({
      data: {
        visitorUuid:   value.visitorUuid,
        fingerprint:   value.fingerprint   ?? null,
        deviceSignals: value.deviceSignals ?? undefined,
        utmSource:     value.utmSource     ?? null,
        utmMedium:     value.utmMedium     ?? null,
        utmCampaign:   value.utmCampaign   ?? null,
        referrer:      value.referrer      ?? null,
        ipAddress:     ip,
        country:       geo.country,
        city:          geo.city,
        isp:           geo.isp,
      },
    })
    return res.json({ visitorId: created.id, sessionCount: 1, returning: false })
  } catch (err: any) {
    logger.error(`visitor.identify.error: ${err.message}`)
    return res.status(500).json({ error: 'Identify failed' })
  }
})

// ── POST /event ────────────────────────────────────────────────────────────────

publicVisitorRouter.post('/event', async (req: Request, res: Response) => {
  // Accept array or single event
  const body = Array.isArray(req.body) ? req.body : [req.body]

  // Validate each event
  const valid: any[] = []
  for (const item of body.slice(0, 25)) {
    const { error, value } = eventSchema.validate(item)
    if (!error) valid.push(value)
  }
  if (!valid.length) return res.status(400).json({ error: 'No valid events' })

  try {
    // Resolve visitorUuids → IDs (batch)
    const uuids = [...new Set(valid.map((e: any) => e.visitorUuid))]
    const visitors = await prisma.anonymousVisitor.findMany({
      where: { visitorUuid: { in: uuids } },
      select: { id: true, visitorUuid: true },
    })
    const uuidToId = Object.fromEntries(visitors.map(v => [v.visitorUuid, v.id]))

    const rows = valid
      .filter((e: any) => uuidToId[e.visitorUuid])
      .map((e: any) => ({
        visitorId: uuidToId[e.visitorUuid],
        type:      e.type,
        path:      e.path,
        data:      e.data ?? {},
      }))

    if (!rows.length) return res.status(404).json({ error: 'Visitor not found — call /identify first' })

    await prisma.visitorEvent.createMany({ data: rows })

    // Async summary recompute (fire and forget)
    const visitorIds = [...new Set(rows.map(r => r.visitorId))]
    for (const vid of visitorIds) {
      recomputeSummary(vid).catch(() => {})
    }

    return res.json({ logged: rows.length })
  } catch (err: any) {
    logger.error(`visitor.event.error: ${err.message}`)
    return res.status(500).json({ error: 'Event log failed' })
  }
})

// ── POST /enrich ───────────────────────────────────────────────────────────────
// Called when eQORE detects a corporate email

const enrichSchema = Joi.object({
  email: Joi.string().email().required(),
})

publicVisitorRouter.post('/enrich', async (req: Request, res: Response) => {
  const { error, value } = enrichSchema.validate(req.body)
  if (error) return res.status(400).json({ error: error.details[0].message })

  try {
    const data = await LeadEnrichmentService.enrichFromEmail(value.email)
    return res.json(data) // null if generic or not found
  } catch (err: any) {
    logger.error(`visitor.enrich.error: ${err.message}`)
    return res.status(500).json({ error: 'Enrichment failed' })
  }
})

// ── POST /hot-lead ─────────────────────────────────────────────────────────────
// Called by eQORE when a lead is highly qualified

const hotLeadSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().optional().allow('', null),
  company: Joi.string().optional().allow('', null),
  summary: Joi.string().optional().allow('', null),
})

publicVisitorRouter.post('/hot-lead', async (req: Request, res: Response) => {
  const { error, value } = hotLeadSchema.validate(req.body)
  if (error) return res.status(400).json({ error: error.details[0].message })

  try {
    const message = `HOT LEAD ALERT: ${value.name || value.email} from ${value.company || 'a qualified company'} is engaging with eQORE right now.\nSummary: ${value.summary || 'Ready to talk.'}`
    logger.info(message)
    
    // Broadcast to WAANDA
    const io = getIO()
    io.to('admin').emit('visitor:hot:alert', { message, visitorId: 'hot-lead-alert' })

    return res.json({ success: true })
  } catch (err: any) {
    logger.error(`visitor.hot-lead.error: ${err.message}`)
    return res.status(500).json({ error: 'Alert failed' })
  }
})

// ── POST /stitch ───────────────────────────────────────────────────────────────
// Called after login or register — links anonymous visitor → real user

publicVisitorRouter.post('/stitch', async (req: Request, res: Response) => {
  const { error, value } = stitchSchema.validate(req.body)
  if (error) return res.status(400).json({ error: error.details[0].message })

  try {
    const visitor = await prisma.anonymousVisitor.findUnique({
      where: { visitorUuid: value.visitorUuid },
    })
    if (!visitor) return res.json({ stitched: false, reason: 'visitor_not_found' })
    if (visitor.stitchedToId) return res.json({ stitched: true, reason: 'already_stitched' })

    await prisma.anonymousVisitor.update({
      where: { id: visitor.id },
      data:  { stitchedToId: value.userId, stitchedAt: new Date() },
    })

    logger.info(`visitor.stitch: ${visitor.visitorUuid} → user ${value.userId} (${visitor.sessionCount} sessions, ${visitor.topPages.length} top pages)`)

    // Pipe to WAANDA training if the visitor has meaningful journey data
    if (visitor.eqoreQueries.length > 0 || visitor.intentTags.length > 0) {
      WaandaTrainingPipeline.captureSpeak({
        system:       'VISITOR_INTELLIGENCE',
        trigger:      'VISITOR_STITCH',
        systemPrompt: 'You are WAANDA analysing a visitor journey that converted to a registered user. Extract the intent pattern and conversion signal.',
        userPrompt:   JSON.stringify({
          sessions:     visitor.sessionCount,
          topPages:     visitor.topPages.slice(0, 5),
          eqoreQueries: visitor.eqoreQueries.slice(0, 5),
          intentTags:   visitor.intentTags,
          country:      visitor.country,
        }),
        completion:   `Visitor converted after ${visitor.sessionCount} sessions. Primary intent: ${visitor.intentTags.join(', ') || 'unknown'}. Engaged via eQORE (${visitor.eqoreQueries.length} queries). Top pages: ${visitor.topPages.slice(0, 3).join(', ')}.`,
        priority:     visitor.sessionCount >= 3 ? 'HIGH' : 'MEDIUM',
        confidence:   Math.min(0.95, 0.5 + visitor.sessionCount * 0.1 + visitor.eqoreQueries.length * 0.05),
      })
    }

    return res.json({ stitched: true })
  } catch (err: any) {
    logger.error(`visitor.stitch.error: ${err.message}`)
    return res.status(500).json({ error: 'Stitch failed' })
  }
})

// ── DELETE /forget/:uuid ───────────────────────────────────────────────────────
// GDPR right-to-erasure

publicVisitorRouter.delete('/forget/:uuid', async (req: Request, res: Response) => {
  try {
    const visitor = await prisma.anonymousVisitor.findUnique({
      where: { visitorUuid: req.params.uuid },
    })
    if (!visitor) return res.json({ deleted: false })
    await prisma.anonymousVisitor.delete({ where: { id: visitor.id } })
    return res.json({ deleted: true })
  } catch (err: any) {
    logger.error(`visitor.forget.error: ${err.message}`)
    return res.status(500).json({ error: 'Delete failed' })
  }
})

// ── POST /heartbeat ────────────────────────────────────────────────────────────
// Called every 30s from the browser — keeps visitor in the live presence registry

const heartbeatSchema = Joi.object({
  visitorUuid: Joi.string().uuid().required(),
  path:        Joi.string().max(500).required(),
  title:       Joi.string().max(200).optional().allow('', null),
})

publicVisitorRouter.post('/heartbeat', async (req: Request, res: Response) => {
  const { error, value } = heartbeatSchema.validate(req.body)
  if (error) return res.status(400).json({ error: error.details[0].message })

  try {
    const visitor = await prisma.anonymousVisitor.findUnique({
      where:  { visitorUuid: value.visitorUuid },
      select: { sessionCount: true, country: true, city: true, stitchedToId: true, eqoreQueries: true },
    })
    if (!visitor) return res.json({ ok: false })

    let stitchedName: string | null  = null
    let stitchedEmail: string | null = null
    let isLead = false

    if (visitor.stitchedToId) {
      const user = await prisma.user.findUnique({
        where:  { id: visitor.stitchedToId },
        select: { name: true, email: true },
      })
      stitchedName  = user?.name  ?? null
      stitchedEmail = user?.email ?? null
      // Check if they have a lead record
      if (user?.email) {
        const lead = await prisma.eqoreLead.findFirst({ where: { email: user.email }, select: { id: true } })
        isLead = !!lead
      }
    }

    upsertPresence({
      visitorUuid:   value.visitorUuid,
      path:          value.path,
      title:         value.title ?? '',
      country:       visitor.country,
      city:          visitor.city,
      sessionCount:  visitor.sessionCount,
      isLead,
      stitchedName,
      stitchedEmail,
    })

    // Push update to all connected admins
    try {
      getIO().to('admin').emit('visitor:presence:update', getActivePresence())
    } catch { /* socket not yet ready */ }

    return res.json({ ok: true })
  } catch (err: any) {
    logger.error(`visitor.heartbeat.error: ${err.message}`)
    return res.json({ ok: false })
  }
})

// ── GET /footprint/:uuid  (public — visitor reads their own data) ──────────────

publicVisitorRouter.get('/footprint/:uuid', async (req: Request, res: Response) => {
  try {
    const visitor = await prisma.anonymousVisitor.findUnique({
      where:  { visitorUuid: req.params.uuid },
      select: { sessionCount: true, topPages: true, eqoreQueries: true, intentTags: true, firstSeen: true },
    })
    if (!visitor) return res.json(null)
    return res.json(visitor)
  } catch {
    return res.json(null)
  }
})

// ── POST /consent  (public — updates visitor's cookie consent choices) ───────

publicVisitorRouter.post('/consent', async (req: Request, res: Response) => {
  const { error, value } = consentSchema.validate(req.body)
  if (error) return res.status(400).json({ error: error.details[0].message })

  try {
    const visitor = await prisma.anonymousVisitor.findUnique({
      where: { visitorUuid: value.visitorUuid },
    })

    if (!visitor) {
      return res.status(404).json({ error: 'Visitor not found' })
    }

    const currentSignals = (visitor.deviceSignals as Record<string, any>) || {}
    const updated = await prisma.anonymousVisitor.update({
      where: { id: visitor.id },
      data: {
        deviceSignals: {
          ...currentSignals,
          cookieConsent: value.preferences,
        },
      },
    })

    logger.info(`visitor.consent.updated: ${value.visitorUuid}`)
    return res.json({ success: true, consent: value.preferences })
  } catch (err: any) {
    logger.error(`visitor.consent.error: ${err.message}`)
    return res.status(500).json({ error: 'Failed to update consent preferences' })
  }
})

// ── ADMIN: GET /api/admin/visitor  ────────────────────────────────────────────

adminVisitorRouter.get('/', requireAuth, requireRole(['ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const page  = Math.max(1, parseInt(String(req.query.page ?? '1')))
    const limit = Math.min(50, parseInt(String(req.query.limit ?? '25')))
    const skip  = (page - 1) * limit

    const [visitors, total] = await Promise.all([
      prisma.anonymousVisitor.findMany({
        orderBy: { lastSeen: 'desc' },
        skip, take: limit,
        select: {
          id: true, visitorUuid: true, fingerprint: true,
          firstSeen: true, lastSeen: true, sessionCount: true,
          topPages: true, eqoreQueries: true, intentTags: true,
          utmSource: true, utmMedium: true, utmCampaign: true,
          referrer: true, stitchedToId: true, stitchedAt: true,
          ipAddress: true, country: true, city: true, isp: true,
          _count: { select: { events: true } },
        },
      }),
      prisma.anonymousVisitor.count(),
    ])

    return res.json({ visitors, total, page, limit })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
})

// ── ADMIN: GET /api/admin/visitor/:id ─────────────────────────────────────────

adminVisitorRouter.get('/:id', requireAuth, requireRole(['ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const visitor = await prisma.anonymousVisitor.findUnique({
      where: { id: req.params.id },
      include: {
        events: {
          orderBy: { createdAt: 'desc' },
          take: 200,
        },
      },
    })
    if (!visitor) return res.status(404).json({ error: 'Not found' })

    // If stitched, also pull the user's name/email
    let user: any = null
    if (visitor.stitchedToId) {
      user = await prisma.user.findUnique({
        where:  { id: visitor.stitchedToId },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      })
    }

    return res.json({ visitor, user })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
})

// ── ADMIN: GET /api/admin/visitor/presence ────────────────────────────────────
// Snapshot of currently active visitors (for initial panel load)

adminVisitorRouter.get('/presence', requireAuth, requireRole(['ADMIN']), async (_req: AuthRequest, res: Response) => {
  return res.json(getActivePresence())
})

// ── ADMIN: GET /api/admin/visitor/funnel ──────────────────────────────────────

adminVisitorRouter.get('/funnel', requireAuth, requireRole(['ADMIN']), async (_req: AuthRequest, res: Response) => {
  try {
    const [total, engaged, stitched] = await Promise.all([
      prisma.anonymousVisitor.count(),
      prisma.anonymousVisitor.count({
        where: { OR: [{ sessionCount: { gte: 3 } }, { eqoreQueries: { isEmpty: false } }] },
      }),
      prisma.anonymousVisitor.count({ where: { stitchedToId: { not: null } } }),
    ])

    // Visitors stitched to a CLIENT-role user
    const stitchedUserIds = await prisma.anonymousVisitor
      .findMany({ where: { stitchedToId: { not: null } }, select: { stitchedToId: true }, distinct: ['stitchedToId'] })
      .then(vs => vs.map(v => v.stitchedToId!))

    const stitchedEmails = await prisma.user
      .findMany({ where: { id: { in: stitchedUserIds } }, select: { email: true } })
      .then(us => us.map(u => u.email))

    const [withConsultation, converted] = await Promise.all([
      prisma.consultation.count({ where: { email: { in: stitchedEmails } } }).catch(() => 0),
      prisma.user.count({ where: { id: { in: stitchedUserIds }, role: 'CLIENT' } }),
    ])

    return res.json({ total, engaged, stitched, withConsultation, converted })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
})

// ── ADMIN: GET /api/admin/visitor/by-user/:userId ─────────────────────────────

adminVisitorRouter.get('/by-user/:userId', requireAuth, requireRole(['ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const visitor = await prisma.anonymousVisitor.findFirst({
      where:   { stitchedToId: req.params.userId },
      include: { events: { orderBy: { createdAt: 'desc' }, take: 200 } },
    })
    return res.json(visitor ?? null)
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
})

// ── ADMIN: GET /api/admin/visitor/by-email/:email ─────────────────────────────
// Lets CRM pull pre-registration footprint by email (looks up User → visitor)

adminVisitorRouter.get('/by-email/:email', requireAuth, requireRole(['ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.params.email },
      select: { id: true },
    })
    if (!user) return res.json(null)
    const visitor = await prisma.anonymousVisitor.findFirst({
      where:   { stitchedToId: user.id },
      include: { events: { orderBy: { createdAt: 'desc' }, take: 100 } },
    })
    return res.json(visitor ?? null)
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
})
