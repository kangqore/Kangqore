// ---------------------------------------------------------------------------
// KIMMP — Tier-1 Deterministic Signal Extractor
//
// The "local intelligence algorithm". Runs in-process, no API call, ~1ms.
// Reads conversation text through weighted lexicons + structural heuristics
// and emits confidence-scored behavioral signals.
//
// This is intentionally explainable: every signal carries the exact evidence
// that produced it. Tier-2 (Claude) only runs when this layer is unsure.
// ---------------------------------------------------------------------------

import {
  BehaviorSignal,
  BehaviorStateType,
  CommunicationStyle,
  Severity,
} from '../core/types';
import { BEHAVIOR_LEXICONS } from './lexicons';

export interface Tier1Metrics {
  totalChars: number;
  wordCount: number;
  messageCount: number;
  exclamationCount: number;
  questionCount: number;
  capsWordRatio: number;
  avgMessageChars: number;
}

export interface Tier1Result {
  states: BehaviorSignal[];
  communicationStyle: CommunicationStyle;
  tier1Confidence: number;
  metrics: Tier1Metrics;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Count non-overlapping, word-boundaried occurrences of a phrase. */
function countMatches(haystack: string, phrase: string): number {
  const re = new RegExp(`\\b${escapeRegex(phrase)}\\b`, 'g');
  const m = haystack.match(re);
  return m ? m.length : 0;
}

function severityOf(intensity: number): Severity {
  if (intensity >= 0.67) return 'HIGH';
  if (intensity >= 0.34) return 'MODERATE';
  return 'LOW';
}

function clamp(n: number, lo = 0, hi = 1): number {
  return Math.max(lo, Math.min(hi, n));
}

export class Tier1SignalExtractor {
  /**
   * Extract behavioral signals from the supplied conversation turns.
   * `texts` should already be filtered to the role being analyzed.
   */
  static extract(texts: string[]): Tier1Result {
    const joinedRaw = texts.join('  ');
    const lower = joinedRaw.toLowerCase();

    const metrics = this.computeMetrics(texts, joinedRaw);

    const rawScores = new Map<BehaviorStateType, number>();
    const evidence = new Map<BehaviorStateType, string[]>();
    const distinctMatches = new Map<BehaviorStateType, number>();

    // ── Lexicon pass ──
    for (const lex of BEHAVIOR_LEXICONS) {
      let raw = 0;
      let distinct = 0;
      const ev: string[] = [];
      for (const entry of lex.entries) {
        const hits = countMatches(lower, entry.phrase);
        if (hits > 0) {
          raw += entry.weight * Math.min(hits, 3); // cap repeat inflation
          distinct += 1;
          ev.push(entry.phrase);
        }
      }
      rawScores.set(lex.state, raw / lex.saturation);
      evidence.set(lex.state, ev);
      distinctMatches.set(lex.state, distinct);
    }

    // ── Structural heuristics (layered on top of lexicon scores) ──
    this.applyHeuristics(rawScores, evidence, metrics);

    // ── Build signals (only states with real evidence) ──
    const states: BehaviorSignal[] = [];
    for (const [type, rawIntensity] of rawScores.entries()) {
      const ev = evidence.get(type) || [];
      const intensity = clamp(rawIntensity);
      if (intensity <= 0.001 || ev.length === 0) continue;

      const distinct = distinctMatches.get(type) || ev.length;
      const lengthBonus = clamp(metrics.wordCount / 120) * 0.15;
      const confidence = clamp(0.42 + 0.11 * distinct + lengthBonus, 0, 0.95);

      states.push({
        type,
        intensity: Number(intensity.toFixed(3)),
        confidence: Number(confidence.toFixed(3)),
        severity: severityOf(intensity),
        evidence: ev,
        source: 'TIER1',
      });
    }

    states.sort((a, b) => b.intensity * b.confidence - a.intensity * a.confidence);

    return {
      states,
      communicationStyle: this.deriveStyle(rawScores, metrics),
      tier1Confidence: this.aggregateConfidence(states, metrics),
      metrics,
    };
  }

  private static computeMetrics(texts: string[], joinedRaw: string): Tier1Metrics {
    const words = joinedRaw.split(/\s+/).filter(Boolean);
    const capsWords = words.filter((w) => w.length >= 3 && w === w.toUpperCase() && /[A-Z]/.test(w));
    return {
      totalChars: joinedRaw.length,
      wordCount: words.length,
      messageCount: texts.length,
      exclamationCount: (joinedRaw.match(/!/g) || []).length,
      questionCount: (joinedRaw.match(/\?/g) || []).length,
      capsWordRatio: words.length ? capsWords.length / words.length : 0,
      avgMessageChars: texts.length ? joinedRaw.length / texts.length : 0,
    };
  }

  private static applyHeuristics(
    rawScores: Map<BehaviorStateType, number>,
    evidence: Map<BehaviorStateType, string[]>,
    m: Tier1Metrics
  ): void {
    const bump = (state: BehaviorStateType, amount: number, note: string) => {
      rawScores.set(state, (rawScores.get(state) || 0) + amount);
      const ev = evidence.get(state) || [];
      ev.push(note);
      evidence.set(state, ev);
    };

    // Heavy exclamation use → urgency / frustration intensifier.
    if (m.exclamationCount >= 2) {
      bump('URGENCY', clamp(m.exclamationCount / 10) * 0.25, 'heuristic:exclamation-density');
      bump('FRUSTRATION', clamp(m.exclamationCount / 12) * 0.2, 'heuristic:exclamation-density');
    }
    // Shouting (ALL CAPS words) → frustration / stress.
    if (m.capsWordRatio >= 0.12) {
      bump('FRUSTRATION', clamp(m.capsWordRatio * 2) * 0.3, 'heuristic:caps-ratio');
      bump('STRESS', clamp(m.capsWordRatio * 2) * 0.2, 'heuristic:caps-ratio');
    }
    // Many questions → confusion / exploratory mindset.
    if (m.questionCount >= 3) {
      bump('CONFUSION', clamp((m.questionCount - 2) / 6) * 0.25, 'heuristic:question-density');
    }
  }

  private static deriveStyle(
    rawScores: Map<BehaviorStateType, number>,
    m: Tier1Metrics
  ): CommunicationStyle {
    const v = (s: BehaviorStateType) => clamp(rawScores.get(s) || 0);
    const stressed = Math.max(v('STRESS'), v('FRUSTRATION'));

    if (stressed >= 0.5) return 'ANXIOUS';
    if (v('TECHNICAL_DEPTH') >= 0.4 && m.exclamationCount <= 1) return 'ANALYTICAL';
    if (v('URGENCY') >= 0.4 && m.avgMessageChars < 160 && m.questionCount <= 1) return 'DIRECT';
    if (m.questionCount >= 2 && v('URGENCY') < 0.4) return 'EXPLORATORY';
    return 'NEUTRAL';
  }

  private static aggregateConfidence(states: BehaviorSignal[], m: Tier1Metrics): number {
    if (states.length === 0) {
      // Nothing detected — low confidence unless there is plenty of neutral text.
      return clamp(0.3 + clamp(m.wordCount / 200) * 0.15, 0, 0.5);
    }
    const top = states.slice(0, 3);
    const avg = top.reduce((s, x) => s + x.confidence, 0) / top.length;
    return Number(clamp(avg).toFixed(3));
  }
}
