import { ExecutiveDecision } from '../contracts/types'

export interface DecisionPattern {
  patternId:     string
  label:         string
  frequency:     number
  avgConfidence: number
  avgRiskScore:  number
  dominantUrgency: string
  examples:      string[]
}

export class DecisionPatternAnalyzer {
  analyze(decisions: ExecutiveDecision[]): DecisionPattern[] {
    if (decisions.length === 0) return []

    // Group by selected strategy to surface recurring decision patterns
    const groups = new Map<string, ExecutiveDecision[]>()
    for (const d of decisions) {
      const key = d.selectedStrategy.slice(0, 40)
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(d)
    }

    return Array.from(groups.entries())
      .filter(([, ds]) => ds.length > 1)
      .map(([label, ds]) => ({
        patternId:       `pat_${label.replace(/\s+/g, '_').toLowerCase()}`,
        label,
        frequency:       ds.length,
        avgConfidence:   ds.reduce((s, d) => s + d.decisionConfidence, 0) / ds.length,
        avgRiskScore:    ds.reduce((s, d) => s + d.riskAssessment.riskScore, 0) / ds.length,
        dominantUrgency: this._mode(ds.map(d => d.urgency)),
        examples:        ds.slice(0, 3).map(d => d.decisionId),
      }))
      .sort((a, b) => b.frequency - a.frequency)
  }

  private _mode(values: string[]): string {
    const counts = new Map<string, number>()
    for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1)
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? values[0]
  }
}
