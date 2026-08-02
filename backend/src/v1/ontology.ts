/**
 * @openapi
 * tags:
 *   - name: v1/Ontology
 *     description: Partner-facing ontology access — the surface the generated SDK talks to
 */
// S306/S307 — Partner-facing Ontology API. Mounted under /api/v1/ontology,
// reachable only via apiKeyAuth (see index.ts `/api/v1` mount). Distinct from
// admin-ontology.ts, which is JWT+ADMIN-only and has no scoping concept.
// An empty scope array on the calling ProgrammaticApiKey means unrestricted
// (matches pre-S307 keys); a non-empty array allow-lists specific type/action names.
import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { ObjectSetService, QueryNode } from '../services/objectSet.service'
import { ActionEngine } from '../services/actionEngine.service'

export const ontologyV1Router = Router()

function apiKeyScope(req: Request): { objectTypes: string[]; actions: string[] } {
  const key = (req as any).apiKey ?? {}
  return { objectTypes: key.scopedObjectTypes ?? [], actions: key.scopedActions ?? [] }
}

function scopeAllows(scopeList: string[], name: string): boolean {
  return scopeList.length === 0 || scopeList.includes(name)
}

/**
 * @openapi
 * /v1/ontology/objects/{typeName}/query:
 *   post:
 *     tags: [v1/Ontology]
 *     summary: Query objects of a given OntologyObjectType by equality filter
 *     security: [{ apiKeyAuth: [] }]
 */
ontologyV1Router.post('/objects/:typeName/query', async (req: Request, res: Response) => {
  try {
    const { typeName } = req.params
    const { objectTypes } = apiKeyScope(req)
    if (!scopeAllows(objectTypes, typeName)) {
      res.status(403).json({ error: `API key is not scoped for object type '${typeName}'` })
      return
    }

    const filter: Record<string, unknown> = req.body?.filter ?? {}
    const query: QueryNode = {
      type: 'intersection',
      sets: [
        { type: 'filter', field: 'typeName', op: 'eq', value: typeName },
        ...Object.entries(filter).map(([field, value]) => ({
          type: 'filter' as const, field: `properties.${field}`, op: 'eq' as const, value,
        })),
      ],
    }

    const { objects, count } = await ObjectSetService.preview(query)
    res.json({ objects, count })
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'Internal error' })
  }
})

/**
 * @openapi
 * /v1/ontology/objects/{typeName}/{id}:
 *   get:
 *     tags: [v1/Ontology]
 *     summary: Get a single object by id, scoped to its type
 *     security: [{ apiKeyAuth: [] }]
 */
ontologyV1Router.get('/objects/:typeName/:id', async (req: Request, res: Response) => {
  try {
    const { typeName, id } = req.params
    const { objectTypes } = apiKeyScope(req)
    if (!scopeAllows(objectTypes, typeName)) {
      res.status(403).json({ error: `API key is not scoped for object type '${typeName}'` })
      return
    }

    const object = await prisma.ontologyObject.findFirst({
      where: { id, type: { name: typeName } },
    })
    if (!object) { res.status(404).json({ error: 'Not found' }); return }
    res.json({ object })
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'Internal error' })
  }
})

/**
 * @openapi
 * /v1/ontology/object-sets/{id}/execute:
 *   post:
 *     tags: [v1/Ontology]
 *     summary: Execute a saved ObjectSet and return its live members
 *     security: [{ apiKeyAuth: [] }]
 */
ontologyV1Router.post('/object-sets/:id/execute', async (req: Request, res: Response) => {
  try {
    const set = await prisma.objectSet.findUnique({
      where: { id: req.params.id },
      include: { rootType: { select: { name: true } } },
    })
    if (!set) { res.status(404).json({ error: 'Object set not found' }); return }

    const { objectTypes } = apiKeyScope(req)
    if (set.rootType && !scopeAllows(objectTypes, set.rootType.name)) {
      res.status(403).json({ error: `API key is not scoped for object type '${set.rootType.name}'` })
      return
    }

    const { objects, count } = await ObjectSetService.execute(set.id)
    res.json({ objects, count })
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'Internal error' })
  }
})

/**
 * @openapi
 * /v1/ontology/actions/{id}/execute:
 *   post:
 *     tags: [v1/Ontology]
 *     summary: Execute an OntologyAction with typed parameters
 *     security: [{ apiKeyAuth: [] }]
 */
ontologyV1Router.post('/actions/:id/execute', async (req: Request, res: Response) => {
  try {
    const action = await prisma.ontologyAction.findUnique({ where: { id: req.params.id } })
    if (!action) { res.status(404).json({ error: 'Action not found' }); return }

    const { actions } = apiKeyScope(req)
    if (!scopeAllows(actions, action.name)) {
      res.status(403).json({ error: `API key is not scoped for action '${action.name}'` })
      return
    }

    const { params, objectId } = req.body ?? {}
    const execution = await ActionEngine.execute({
      actionId: action.id,
      params: params ?? {},
      objectId: objectId ?? null,
      actorId: (req as any).user?.userId,
      actorType: 'HUMAN',
    })
    res.json({ execution })
  } catch (e: any) {
    res.status(400).json({ error: e?.message ?? 'Internal error' })
  }
})
