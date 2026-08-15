// ---------------------------------------------------------------------------
// WaandaIntelligence — WAANDA's self-awareness layer
//
// Gate 8 / OIS is WAANDA's self-measurement: it answers "how intelligent is
// this enterprise right now?" This wrapper unifies OIS, OII, and COIG into
// a single self-awareness snapshot that WAANDA can include in status() and
// expose to the Authority layer.
// ---------------------------------------------------------------------------

import { computeGate8 }            from './gate8.service'

export interface WaandaIntelligenceSnapshot {
  ois:       number   // Organizational Intelligence Score (Gate 8, 0–100)
  oii:       number   // Organizational Intelligence Index composite (9 dims)
  coig:      number   // Cognitive OIG growth delta from baseline
  grade:     string   // A/B/C/D/F
  computedAt: string
}

export const WaandaIntelligence = {

  async compute(): Promise<WaandaIntelligenceSnapshot> {
    const [gate8, oiiResult, coigTrend] = await Promise.all([
      computeGate8().catch(() => null),
      // Dynamic imports to avoid circular deps at module load time
      import('../../../kangqore-immp/cognition/oii.service').then(m =>
        m.OIIService.compute()
      ).catch(() => null),
      import('../../../kangqore-immp/cognition/coigEvolution.service').then(m =>
        m.CoigEvolutionService.trend()
      ).catch(() => null),
    ])

    const ois  = gate8?.oisScore ?? 0
    const oii  = oiiResult?.score ?? 0
    const coig = coigTrend?.coig ?? 0
    const grade = oiiResult?.grade ?? gradeOf(oii)

    return {
      ois:        Math.round(ois),
      oii:        Math.round(oii),
      coig:       Math.round(coig * 10) / 10,
      grade,
      computedAt: new Date().toISOString(),
    }
  },
}

function gradeOf(s: number): string {
  if (s >= 90) return 'A'
  if (s >= 75) return 'B'
  if (s >= 60) return 'C'
  if (s >= 40) return 'D'
  return 'F'
}
