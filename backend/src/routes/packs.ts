// Track H — Enterprise Solution Framework: Packs Routes
// /api/admin/packs/*

import { Router }      from 'express'
import { authenticate } from '../middleware/auth'
import { requireRole }  from '../middleware/rbac'
import { PackRegistry, PackCategory } from '../kangqore-view/automation/PackRegistryService'

const router = Router()
const guard  = [authenticate, requireRole(['ADMIN'])]

router.get('/', ...guard, async (req, res) => {
  try {
    const { category } = req.query
    const packs = await PackRegistry.list(category as PackCategory | undefined)
    const stats = await PackRegistry.stats()
    res.json({ packs, stats })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

router.get('/stats', ...guard, async (_req, res) => {
  try {
    res.json(await PackRegistry.stats())
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

router.post('/:packId/install', ...guard, async (req, res) => {
  try {
    const packId = decodeURIComponent(req.params.packId)
    await PackRegistry.install(packId, (req as any).user?.id)
    res.json({ ok: true, packId })
  } catch (e: any) { res.status(400).json({ error: e.message }) }
})

router.post('/:packId/uninstall', ...guard, async (req, res) => {
  try {
    const packId = decodeURIComponent(req.params.packId)
    await PackRegistry.uninstall(packId)
    res.json({ ok: true, packId })
  } catch (e: any) { res.status(400).json({ error: e.message }) }
})

export default router
