// ---------------------------------------------------------------------------
// WAANDA Training Data Exporter
//
// Exports the training corpus as JSONL files ready for fine-tuning with:
//   - Unsloth (fastest QLoRA fine-tuning)
//   - Axolotl
//   - LLaMA-Factory
//   - HuggingFace TRL
//
// Two export formats:
//   alpaca.jsonl  — {instruction, input, output}  (Alpaca SFT format)
//   chat.jsonl    — {conversations: [{from, value}]}  (ShareGPT chat format)
//
// Export logic:
//   - Only includes examples with qualityScore >= 0.5 (ACCEPTED or unlabelled)
//   - DISMISSED examples exported separately as dpo_negative.jsonl for DPO
//   - Marks exported=true after each export so incremental runs only pick up new data
// ---------------------------------------------------------------------------

import fs   from 'fs'
import path from 'path'
import os   from 'os'
import { prisma } from '../../../lib/prisma'
import logger     from '../../../utils/logger'

const EXPORT_DIR = process.env.WAANDA_EXPORT_DIR ?? path.join(os.homedir(), 'models', 'WAANDAx', 'training-exports')

export interface ExportResult {
  exportDir:     string
  alpacaCount:   number
  chatCount:     number
  negativeCount: number
  totalExported: number
  timestamp:     string
}

export class WaandaTrainingExporter {

  static async export(opts: { incrementalOnly?: boolean } = {}): Promise<ExportResult> {
    // Ensure export dir exists
    fs.mkdirSync(EXPORT_DIR, { recursive: true })

    const timestamp  = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const alpacaPath = path.join(EXPORT_DIR, `alpaca_${timestamp}.jsonl`)
    const chatPath   = path.join(EXPORT_DIR, `chat_${timestamp}.jsonl`)
    const dpoPath    = path.join(EXPORT_DIR, `dpo_negative_${timestamp}.jsonl`)

    const where: Record<string, unknown> = {}
    if (opts.incrementalOnly) where.exported = false

    // Positive examples (ACCEPTED or unlabelled — qualityScore >= 0.5 or null)
    const positiveExamples = await (prisma as any).waandaTrainingExample.findMany({
      where: {
        ...where,
        OR: [
          { feedback: 'ACCEPTED' },
          { feedback: null,       qualityScore: null  },
          { qualityScore: { gte: 0.5 } },
        ],
      },
      orderBy: { createdAt: 'asc' },
      take:    50_000,
    })

    // Negative examples (DISMISSED — for DPO training)
    const negativeExamples = await (prisma as any).waandaTrainingExample.findMany({
      where: { ...where, feedback: 'DISMISSED' },
      orderBy: { createdAt: 'asc' },
      take:    10_000,
    })

    let alpacaCount = 0
    let chatCount   = 0

    // Write positive examples
    const alpacaStream = fs.createWriteStream(alpacaPath)
    const chatStream   = fs.createWriteStream(chatPath)

    for (const ex of positiveExamples as any[]) {
      if (!ex.systemPrompt && !ex.userPrompt) continue

      const alpacaRow = {
        instruction: (ex.systemPrompt ?? '').slice(0, 2000),
        input:       (ex.userPrompt   ?? '').slice(0, 2000),
        output:      (ex.completion   ?? '').slice(0, 3000),
      }
      alpacaStream.write(JSON.stringify(alpacaRow) + '\n')
      alpacaCount++

      const chatRow = {
        conversations: [
          { from: 'system', value: ex.systemPrompt ?? '' },
          { from: 'human',  value: ex.userPrompt   ?? '' },
          { from: 'gpt',    value: ex.completion   ?? '' },
        ],
      }
      chatStream.write(JSON.stringify(chatRow) + '\n')
      chatCount++
    }

    alpacaStream.end()
    chatStream.end()

    // Write negative examples (DPO pairs)
    let negativeCount = 0
    if (negativeExamples.length > 0) {
      const dpoStream = fs.createWriteStream(dpoPath)
      for (const ex of negativeExamples as any[]) {
        if (!ex.systemPrompt && !ex.userPrompt) continue
        dpoStream.write(JSON.stringify({
          instruction: (ex.systemPrompt ?? '').slice(0, 2000),
          input:       (ex.userPrompt   ?? '').slice(0, 2000),
          rejected:    (ex.completion   ?? '').slice(0, 3000),
          chosen:      ex.correction ?? '',
        }) + '\n')
        negativeCount++
      }
      dpoStream.end()
    }

    // Mark as exported
    const allIds = [...positiveExamples, ...negativeExamples].map((e: any) => e.id)
    if (allIds.length > 0) {
      await (prisma as any).waandaTrainingExample.updateMany({
        where: { id: { in: allIds } },
        data:  { exported: true },
      })
    }

    const totalExported = positiveExamples.length + negativeExamples.length

    logger.info(`[WAANDA:EXPORT] Exported ${totalExported} examples → ${EXPORT_DIR}`)
    logger.info(`[WAANDA:EXPORT] alpaca=${alpacaCount} chat=${chatCount} dpo_negative=${negativeCount}`)

    return { exportDir: EXPORT_DIR, alpacaCount, chatCount, negativeCount, totalExported, timestamp }
  }

  // List all previous exports in the export directory
  static listExports(): { file: string; size: number; created: Date }[] {
    try {
      if (!fs.existsSync(EXPORT_DIR)) return []
      return fs.readdirSync(EXPORT_DIR)
        .filter(f => f.endsWith('.jsonl'))
        .map(f => {
          const stat = fs.statSync(path.join(EXPORT_DIR, f))
          return { file: f, size: stat.size, created: stat.birthtime }
        })
        .sort((a, b) => b.created.getTime() - a.created.getTime())
    } catch {
      return []
    }
  }

  // Read a specific export file for download
  static readExport(filename: string): string | null {
    try {
      const safeName = path.basename(filename)  // prevent path traversal
      const filePath = path.join(EXPORT_DIR, safeName)
      if (!fs.existsSync(filePath)) return null
      return fs.readFileSync(filePath, 'utf8')
    } catch {
      return null
    }
  }

  // Quick summary of what a fine-tuning run would look like
  static finetuneRecipe(exampleCount: number): {
    baseModel:       string
    method:          string
    estimatedTime:   string
    estimatedCost:   string
    minExamples:     number
    ready:           boolean
    tool:            string
  } {
    const ready = exampleCount >= 1000
    return {
      baseModel:     'meta-llama/Llama-3.2-8B-Instruct  OR  mistralai/Mistral-7B-Instruct-v0.3',
      method:        'QLoRA (4-bit quantised LoRA) — single GPU, low VRAM',
      estimatedTime: exampleCount < 500 ? 'Need more data' :
                     exampleCount < 2000 ? '1–2 hours on A100 (Google Colab ~$3–$8)' :
                     '2–4 hours on A100 (Google Colab ~$6–$15)',
      estimatedCost: exampleCount < 500 ? 'N/A' : '$3 – $15 per training run',
      minExamples:   1000,
      ready,
      tool:          'Unsloth (https://github.com/unslothai/unsloth) — fastest QLoRA fine-tuning',
    }
  }
}
