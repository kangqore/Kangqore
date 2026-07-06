// ---------------------------------------------------------------------------
// WAANDA Training Routes — ADMIN dataset management API
//
// Mounted at /api/admin/waanda-training (ADMIN auth enforced upstream).
//
// GET  /stats              — corpus statistics + fine-tune readiness
// GET  /examples           — browse examples (filterable)
// GET  /export             — trigger export, return file list
// GET  /export/:file       — download a specific export file
// GET  /recipe             — fine-tune recipe for current dataset size
// POST /examples/:id/rate  — manually rate example quality
// DELETE /examples/:id     — remove a bad example from the corpus
// ---------------------------------------------------------------------------

import { Router, Request, Response } from 'express'
import { WaandaTrainingPipeline }    from './trainingPipeline.service'
import { WaandaTrainingExporter }    from './trainingExporter.service'
import { LocalReasonService }        from './localReason.service'
import { prisma }                    from '../lib/prisma'

export const waandaTrainingRouter = Router()

// ── Stats ─────────────────────────────────────────────────────────────────────

waandaTrainingRouter.get('/stats', async (_req: Request, res: Response) => {
  const stats  = await WaandaTrainingPipeline.stats()
  const recipe = WaandaTrainingExporter.finetuneRecipe(stats.exportReady)
  res.json({
    pipeline: 'WAANDA Training Data Pipeline',
    generation: 'Gen 1 → Gen 2 data collection',
    ...stats,
    finetuneRecipe: recipe,
    progressToFinetune: `${Math.min(100, Math.round((stats.exportReady / 1000) * 100))}%`,
  })
})

// ── Browse examples ───────────────────────────────────────────────────────────

waandaTrainingRouter.get('/examples', async (req: Request, res: Response) => {
  const { exampleType, system, feedback, limit, offset } = req.query

  const where: Record<string, unknown> = {}
  if (exampleType) where.exampleType = exampleType
  if (system)      where.system      = system
  if (feedback)    where.feedback    = feedback === 'unlabelled' ? null : feedback

  const take = Math.min(Number(limit ?? 50), 200)
  const skip = Number(offset ?? 0)

  const [rows, total] = await Promise.all([
    (prisma as any).waandaTrainingExample.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take,
      skip,
      select: {
        id: true, exampleType: true, system: true, trigger: true,
        priority: true, confidence: true, agentsUsed: true,
        feedback: true, qualityScore: true, exported: true,
        createdAt: true,
        // Truncate for browsing
        completion: true,
      },
    }),
    (prisma as any).waandaTrainingExample.count({ where }),
  ])

  res.json({ total, rows })
})

// ── Export ────────────────────────────────────────────────────────────────────

waandaTrainingRouter.get('/export', async (req: Request, res: Response) => {
  const incremental = req.query.incremental !== 'false'
  const result  = await WaandaTrainingExporter.export({ incrementalOnly: incremental })
  const exports = WaandaTrainingExporter.listExports()
  res.json({ result, availableExports: exports })
})

waandaTrainingRouter.get('/export/:file', (req: Request, res: Response) => {
  const content = WaandaTrainingExporter.readExport(req.params.file)
  if (!content) { res.status(404).json({ error: 'Export file not found' }); return }
  res.setHeader('Content-Type', 'application/x-ndjson')
  res.setHeader('Content-Disposition', `attachment; filename="${req.params.file}"`)
  res.send(content)
})

// ── Fine-tune recipe ──────────────────────────────────────────────────────────

waandaTrainingRouter.get('/recipe', async (_req: Request, res: Response) => {
  const stats  = await WaandaTrainingPipeline.stats()
  const recipe = WaandaTrainingExporter.finetuneRecipe(stats.exportReady)
  res.json({
    pipeline: 'WAANDA Gen 2 Fine-Tune Recipe',
    currentExamples: stats.exportReady,
    negativePairs:   stats.negativePairs,
    ...recipe,
    nextSteps: recipe.ready
      ? [
          '1. GET /export to download alpaca.jsonl and chat.jsonl',
          '2. Install Unsloth: pip install unsloth',
          '3. Run fine-tune script against meta-llama/Llama-3.2-8B-Instruct',
          '4. Evaluate WAANDA-v0.1 on held-out examples',
          '5. Deploy as hybrid router: routine → WAANDA-v0.1, CRITICAL → Claude',
        ]
      : [
          `Need ${Math.max(0, 1000 - stats.exportReady)} more positive examples before first fine-tune`,
          'Keep KIMMP running — each activation generates 2-3 training examples',
          `Current progress: ${stats.exportReady}/1000 (${Math.round((stats.exportReady / 1000) * 100)}%)`,
        ],
  })
})

// ── Manual quality rating ─────────────────────────────────────────────────────

waandaTrainingRouter.post('/examples/:id/rate', async (req: Request, res: Response) => {
  const { quality, note } = req.body   // quality: 0.0–1.0, note: optional
  if (typeof quality !== 'number' || quality < 0 || quality > 1) {
    res.status(400).json({ error: 'quality must be 0.0–1.0' }); return
  }
  await (prisma as any).waandaTrainingExample.update({
    where: { id: req.params.id },
    data:  { qualityScore: quality, correction: note ?? null },
  })
  res.json({ ok: true })
})

// ── Local model status (Gen 2) ────────────────────────────────────────────────

waandaTrainingRouter.get('/local-model/status', async (_req: Request, res: Response) => {
  const [status, stats] = await Promise.all([
    LocalReasonService.status(),
    WaandaTrainingPipeline.stats(),
  ])
  const recipe = WaandaTrainingExporter.finetuneRecipe(stats.exportReady)
  res.json({
    localModel: status,
    trainingProgress: {
      total:              stats.total,
      reasonExamples:     (stats.byType as Record<string,number>)?.REASON ?? 0,
      exportReady:        stats.exportReady,
      threshold:          1000,
      pct:                Math.min(100, Math.round(((stats.byType as Record<string,number>)?.REASON ?? 0) / 1000 * 100)),
      readyToFinetune:    ((stats.byType as Record<string,number>)?.REASON ?? 0) >= 1000,
    },
    recipe,
  })
})

// ── Remove bad example ────────────────────────────────────────────────────────

waandaTrainingRouter.delete('/examples/:id', async (req: Request, res: Response) => {
  await (prisma as any).waandaTrainingExample.delete({ where: { id: req.params.id } }).catch(() => {})
  res.json({ ok: true })
})
