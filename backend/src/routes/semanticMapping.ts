// F5 — Semantic Mapping Routes
// /api/admin/semantic/*

import { Router }          from 'express'
import { authenticate }    from '../middleware/auth'
import { requireRole }     from '../middleware/rbac'
import { SemanticMapper }  from '../services/semanticMapper.service'
import { ConnectorRegistry } from '../integrations/registry'
import '../integrations'   // registers all connectors

const router = Router()
const guard  = [authenticate, requireRole(['ADMIN'])]

// ── Stats ─────────────────────────────────────────────────────────────────────
router.get('/stats', ...guard, async (_req, res) => {
  const stats = await SemanticMapper.stats()
  // Also surface which platforms have entity types declared
  const entityCoverage = ConnectorRegistry.list()
    .filter(m => m.entityTypes && m.entityTypes.length > 0)
    .map(m => ({ platform: m.platform, displayName: m.displayName, icon: m.icon, entityTypes: m.entityTypes }))
  res.json({ ...stats, connectorCoverage: entityCoverage })
})

// ── Type Mappings ─────────────────────────────────────────────────────────────
router.get('/type-mappings', ...guard, async (req, res) => {
  const { platform } = req.query
  const rows = await SemanticMapper.listTypeMappings(platform as string | undefined)
  res.json({ rows, total: rows.length })
})

router.post('/type-mappings', ...guard, async (req, res) => {
  const { platform, externalType, ontologyTypeId, fieldMapping, priority } = req.body
  if (!platform || !externalType || !ontologyTypeId) {
    return res.status(400).json({ error: 'platform, externalType, ontologyTypeId required' })
  }
  try {
    const row = await SemanticMapper.createTypeMapping({ platform, externalType, ontologyTypeId, fieldMapping, priority })
    res.status(201).json(row)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

router.delete('/type-mappings/:id', ...guard, async (req, res) => {
  try {
    await SemanticMapper.deleteTypeMapping(req.params.id)
    res.json({ ok: true })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// ── Instance Refs ─────────────────────────────────────────────────────────────
router.get('/refs', ...guard, async (req, res) => {
  const { platform, externalType, objectId, limit } = req.query
  const rows = await SemanticMapper.listRefs({
    platform:     platform as string,
    externalType: externalType as string,
    objectId:     objectId as string,
    limit:        limit ? Number(limit) : 100,
  })
  res.json({ rows, total: rows.length })
})

router.post('/refs', ...guard, async (req, res) => {
  const { platform, externalType, externalId, objectId, confidence, inferredBy } = req.body
  if (!platform || !externalType || !externalId || !objectId) {
    return res.status(400).json({ error: 'platform, externalType, externalId, objectId required' })
  }
  try {
    const row = await SemanticMapper.createRef({ platform, externalType, externalId, objectId, confidence, inferredBy })
    res.status(201).json(row)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

router.delete('/refs/:id', ...guard, async (req, res) => {
  try {
    await SemanticMapper.deleteRef(req.params.id)
    res.json({ ok: true })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// ── Resolve ───────────────────────────────────────────────────────────────────
// POST /semantic/resolve  { refs: [{ platform, externalType, externalId }] }
// Returns: { resolved: Map-as-object }
router.post('/resolve', ...guard, async (req, res) => {
  const { refs } = req.body
  if (!Array.isArray(refs)) return res.status(400).json({ error: 'refs[] required' })
  const result = await SemanticMapper.resolveMany(refs)
  const resolved: Record<string, any> = {}
  result.forEach((v, k) => { resolved[k] = v })
  res.json({ resolved })
})

// ── Auto-link batch ───────────────────────────────────────────────────────────
// POST /semantic/auto-link  { platform, externalType, entities: [{ externalId, properties }] }
router.post('/auto-link', ...guard, async (req, res) => {
  const { platform, externalType, entities } = req.body
  if (!platform || !externalType || !Array.isArray(entities)) {
    return res.status(400).json({ error: 'platform, externalType, entities[] required' })
  }
  try {
    const result = await SemanticMapper.runAutoLinkBatch(platform, externalType, entities)
    res.json(result)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// ── External identities for a given OntologyObject ───────────────────────────
router.get('/object/:objectId/identities', ...guard, async (req, res) => {
  const identities = await SemanticMapper.getExternalIdentities(req.params.objectId)
  res.json({ identities })
})

export default router
