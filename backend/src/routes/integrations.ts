import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { requireRole }  from '../middleware/rbac'
import { KimmpToolDispatch } from '../kangqore-immp/actions/kimmpToolDispatch.service'
import { ConnectorRegistry } from '../integrations/registry'
import '../integrations' // side-effect: registers all connectors

const router = Router()
const guard  = [authenticate, requireRole(['ADMIN'])]

// ── Manifest + capability registry ───────────────────────────────────────────

router.get('/manifests', ...guard, (_req, res) => {
  const { category } = _req.query
  const manifests = category
    ? ConnectorRegistry.list().filter(m => m.category === category)
    : ConnectorRegistry.list()
  res.json({ manifests, total: ConnectorRegistry.size })
})

router.get('/capabilities', ...guard, (_req, res) => {
  res.json({ capabilities: KimmpToolDispatch.allCapabilities() })
})

router.get('/capabilities/:action', ...guard, (req, res) => {
  const platforms = KimmpToolDispatch.whoCanDo(req.params.action)
  res.json({ action: req.params.action, platforms })
})

// ── List user integrations ────────────────────────────────────────────────────

router.get('/', ...guard, async (req, res) => {
  try {
    const userId = (req as any).user.userId
    const items  = await KimmpToolDispatch.listForUser(userId)
    res.json({ integrations: items })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// ── Save config ───────────────────────────────────────────────────────────────

router.put('/:platform', ...guard, async (req, res) => {
  try {
    const userId   = (req as any).user.userId
    const platform = req.params.platform
    if (!ConnectorRegistry.get(platform)) return res.status(400).json({ error: `Unknown platform: ${platform}` })
    const { config } = req.body
    if (!config || typeof config !== 'object') return res.status(400).json({ error: 'config object required' })
    await KimmpToolDispatch.saveConfig(userId, platform as any, config)
    res.json({ ok: true })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// ── Test connectivity ─────────────────────────────────────────────────────────

router.post('/:platform/test', ...guard, async (req, res) => {
  try {
    const userId   = (req as any).user.userId
    const platform = req.params.platform
    const result   = await KimmpToolDispatch.test(userId, platform as any)
    res.json(result)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// ── Health ────────────────────────────────────────────────────────────────────

router.get('/:platform/health', ...guard, (req, res) => {
  const userId   = (req as any).user.userId
  const platform = req.params.platform
  res.json(KimmpToolDispatch.getHealth(userId, platform as any))
})

// ── Dead-letter queue ─────────────────────────────────────────────────────────

router.get('/dead-letter', ...guard, (_req, res) => {
  res.json({ items: KimmpToolDispatch.getDeadLetterQueue() })
})

// ── Delete config ─────────────────────────────────────────────────────────────

router.delete('/:platform', ...guard, async (req, res) => {
  try {
    const userId   = (req as any).user.userId
    const platform = req.params.platform
    const { prisma } = await import('../lib/prisma')
    await prisma.orgIntegrationConfig.deleteMany({ where: { userId, platform } })
    res.json({ ok: true })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

export default router
