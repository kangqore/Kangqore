import { ExecutiveDecision } from '../contracts/types'
import { DecisionPatternAnalyzer, DecisionPattern } from './DecisionPatternAnalyzer'

export interface LearningInsight {
  insightId:   string
  type:        'PATTERN' | 'BIAS' | 'DRIFT' | 'ANOMALY'
  description: string
  confidence:  number
  actionable:  string
  generatedAt: Date
}

export class ExecutiveLearningEngine {
  private analyzer = new DecisionPatternAnalyzer()
  private history:  ExecutiveDecision[] = []
  private insights: LearningInsight[]   = []

  ingest(decision: ExecutiveDecision): void {
    this.history.push(decision)
    this._reanalyze()
  }

  ingestBatch(decisions: ExecutiveDecision[]): void {
    this.history.push(...decisions)
    this._reanalyze()
  }

  getInsights(): LearningInsight[] {
    return this.insights
  }

  getPatterns(): DecisionPattern[] {
    return this.analyzer.analyze(this.history)
  }

  private _reanalyze(): void {
    const patterns = this.analyzer.analyze(this.history)
    this.insights = []

    for (const p of patterns) {
      if (p.avgRiskScore > 70) {
        this.insights.push({
          insightId:   `ins_highrisk_${p.patternId}`,
          type:        'PATTERN',
          description: `Recurring high-risk decision pattern: "${p.label}" (avg risk ${p.avgRiskScore.toFixed(0)})`,
          confidence:  p.avgConfidence,
          actionable:  'Review risk mitigation strategies for this decision type',
          generatedAt: new Date(),
        })
      }

      if (p.dominantUrgency === 'IMMEDIATE' && p.frequency > 3) {
        this.insights.push({
          insightId:   `ins_urgency_${p.patternId}`,
          type:        'BIAS',
          description: `${p.frequency} decisions with IMMEDIATE urgency in pattern "${p.label}" — possible reactive decision bias`,
          confidence:  0.7,
          actionable:  'Introduce proactive planning protocols to reduce emergency decisions',
          generatedAt: new Date(),
        })
      }
    }

    // Confidence drift detection: if last 5 decisions have declining confidence
    if (this.history.length >= 5) {
      const last5 = this.history.slice(-5).map(d => d.decisionConfidence)
      const declining = last5.every((v, i) => i === 0 || v <= last5[i - 1])
      if (declining) {
        this.insights.push({
          insightId:   `ins_drift_${Date.now()}`,
          type:        'DRIFT',
          description: 'Decision confidence has been declining across the last 5 decisions',
          confidence:  0.8,
          actionable:  'Investigate evidence quality and information completeness for recent decisions',
          generatedAt: new Date(),
        })
      }
    }
  }
}
