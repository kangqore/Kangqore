// ---------------------------------------------------------------------------
// KIMMP Cross-System RAG Flow
//
// After each LOOPS cycle, KIMMP extracts key facts from every system's
// briefing and cross-indexes them into the sibling namespaces that would
// benefit from knowing them.
//
// This breaks the namespace isolation wall: when LEAD_INTEL learns something
// about a client's sector, ALIS and EQORE should know it too.
//
// Routing rules (what goes where):
//   LEAD_INTEL facts  → EQORE, ALIS (deal context informs execution)
//   EQORE facts       → LEAD_INTEL  (conversation signals inform scoring)
//   ALIS facts        → VIS         (campaign data informs content strategy)
//   VIS facts         → ALIS        (content performance informs campaigns)
//   SENTINEL facts    → ALL systems (threats are universal)
//   KIMMP synthesis   → ALL systems (governing insight belongs everywhere)
// ---------------------------------------------------------------------------

import { SystemBriefing } from './systemDispatcher'
import { SystemRAG, RAGSystem } from './systemRAG'
import logger from '../../../utils/logger'

// Which systems receive cross-indexed facts from each source system
const CROSS_ROUTES: Record<string, RAGSystem[]> = {
  LEAD_INTEL: ['EQORE', 'ALIS'],
  EQORE:      ['LEAD_INTEL'],
  ALIS:       ['VIS'],
  VIS:        ['ALIS'],
  SENTINEL:   ['EQORE', 'LEAD_INTEL', 'ALIS', 'VIS', 'KIMMP'],
  KIMMP:      ['EQORE', 'LEAD_INTEL', 'ALIS', 'VIS', 'SENTINEL'],
}

export async function crossIndexBriefings(
  briefings: SystemBriefing[],
  kimmpSynthesis: string,
): Promise<void> {
  const tasks: Promise<any>[] = []

  for (const briefing of briefings) {
    const targets = CROSS_ROUTES[briefing.system] ?? []
    if (targets.length === 0) continue

    // Only cross-index if the briefing has meaningful signal
    if (!briefing.summary || briefing.confidence < 30) continue

    const body = [
      briefing.summary,
      briefing.keyFindings.length  > 0 ? `Key findings:\n${briefing.keyFindings.map(f => `• ${f}`).join('\n')}` : '',
      briefing.recommendations.length > 0 ? `Recommendations:\n${briefing.recommendations.map(r => `• ${r}`).join('\n')}` : '',
    ].filter(Boolean).join('\n\n')

    for (const target of targets) {
      tasks.push(
        SystemRAG.ingest({
          system:  target,
          docType: 'cross_system_signal',
          title:   `Cross-signal from ${briefing.system} — ${new Date().toISOString().slice(0, 10)}`,
          body:    `[FROM ${briefing.system} — conf ${briefing.confidence}% — ${briefing.priority}]\n\n${body}`,
          source:  `cross-flow:${briefing.system.toLowerCase()}`,
          tags:    ['cross-system', briefing.system.toLowerCase(), briefing.priority.toLowerCase()],
        }).catch(() => {})
      )
    }
  }

  // KIMMP synthesis goes to all systems
  if (kimmpSynthesis && kimmpSynthesis.length > 50) {
    const allSystems: RAGSystem[] = ['EQORE', 'LEAD_INTEL', 'ALIS', 'VIS', 'SENTINEL']
    for (const target of allSystems) {
      tasks.push(
        SystemRAG.ingest({
          system:  target,
          docType: 'cross_system_signal',
          title:   `KIMMP governing synthesis — ${new Date().toISOString().slice(0, 10)}`,
          body:    `[KIMMP GOVERNING SYNTHESIS]\n\n${kimmpSynthesis.slice(0, 2000)}`,
          source:  'cross-flow:kimmp',
          tags:    ['cross-system', 'kimmp', 'governing', 'synthesis'],
        }).catch(() => {})
      )
    }
  }

  if (tasks.length > 0) {
    await Promise.allSettled(tasks)
    logger.info(`[KIMMP:CROSS-FLOW] Cross-indexed ${tasks.length} fact(s) across system namespaces`)
  }
}
