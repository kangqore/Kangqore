// ---------------------------------------------------------------------------
// AEGIS Sovereignty Engine
//
// Stamps ADMIN ownership on every intelligence asset KIMMP produces.
// Every briefing, synthesis, signal, and RAG document is ADMIN property.
// The sovereignty stamp is a verifiable receipt — it proves what was produced,
// when, by which system, and who owns it.
// ---------------------------------------------------------------------------

import { AegisLedger } from './hanumanasLedger.service'
import logger from '../../../utils/logger'

export type ClassificationLevel = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED'

export interface SovereigntyStamp {
  owner:          string          // always 'C.O.D.E. (Mahesh Kumar)'
  system:         string
  assetId:        string
  assetType:      string
  classification: ClassificationLevel
  stampedAt:      string          // ISO timestamp
  retainUntil:    string          // ISO timestamp — default 365 days
}

// Classification rules: what type of asset gets what default classification
const CLASSIFICATION_MAP: Record<string, ClassificationLevel> = {
  briefing:             'CONFIDENTIAL',
  synthesis:            'CONFIDENTIAL',
  signal:               'CONFIDENTIAL',
  learning_record:      'CONFIDENTIAL',
  meta_briefing:        'RESTRICTED',
  cross_system_pattern: 'RESTRICTED',
  cross_system_signal:  'CONFIDENTIAL',
  contradiction_report: 'RESTRICTED',
  debate_record:        'CONFIDENTIAL',
  inquiry:              'INTERNAL',
  meeting:              'CONFIDENTIAL',
  playbook:             'INTERNAL',
}

const RETENTION_DAYS: Record<ClassificationLevel, number> = {
  PUBLIC:       90,
  INTERNAL:     180,
  CONFIDENTIAL: 365,
  RESTRICTED:   730,
}

export class AegisSovereignty {
  static classify(assetType: string): ClassificationLevel {
    return CLASSIFICATION_MAP[assetType] ?? 'CONFIDENTIAL'
  }

  static stamp(params: {
    system:    string
    assetId:   string
    assetType: string
    source?:   string
  }): SovereigntyStamp {
    const classification = AegisSovereignty.classify(params.assetType)
    const retainDays     = RETENTION_DAYS[classification]
    const retainUntil    = new Date(Date.now() + retainDays * 86_400_000).toISOString()

    const stamp: SovereigntyStamp = {
      owner:          'C.O.D.E. (Mahesh Kumar)',
      system:         params.system,
      assetId:        params.assetId,
      assetType:      params.assetType,
      classification,
      stampedAt:      new Date().toISOString(),
      retainUntil,
    }

    // Log to AEGIS ledger as KNOWLEDGE_ASSET
    AegisLedger.logKnowledgeAsset({
      system:      params.system,
      assetId:     params.assetId,
      assetType:   params.assetType,
      assetSource: params.source,
      metadata:    { classification, retainUntil, owner: 'C.O.D.E. (Mahesh Kumar)' },
    }).catch(() => {})

    logger.debug(`[AEGIS:SOVEREIGNTY] Stamped ${params.assetType}:${params.assetId} → ${classification} (retain ${retainDays}d)`)

    return stamp
  }

  // Summary of what C.O.D.E. owns across all systems
  static async ownershipSummary(): Promise<{
    totalAssets:         number
    bySystem:            Record<string, number>
    byClassification:    Record<ClassificationLevel, number>
    restrictedAssets:    number
  }> {
    try {
      const { rows, total } = await AegisLedger.query({ eventType: 'KNOWLEDGE_ASSET', limit: 1000 })

      const bySystem: Record<string, number> = {}
      const byClass: Record<string, number>  = {}
      let restricted = 0

      for (const row of rows as any[]) {
        if (row.system) bySystem[row.system] = (bySystem[row.system] ?? 0) + 1
        const cls = row.metadata?.classification ?? 'CONFIDENTIAL'
        byClass[cls] = (byClass[cls] ?? 0) + 1
        if (cls === 'RESTRICTED') restricted++
      }

      return {
        totalAssets:      total,
        bySystem,
        byClassification: byClass as Record<ClassificationLevel, number>,
        restrictedAssets: restricted,
      }
    } catch {
      return { totalAssets: 0, bySystem: {}, byClassification: {} as any, restrictedAssets: 0 }
    }
  }
}
