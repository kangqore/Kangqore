// ---------------------------------------------------------------------------
// Phase 6.7 — Executive Simulator
// Simulates enterprise impact of hypothetical decisions.
// Uses policies and playbooks from the cognition pipeline as constraints.
// SimulationTrust is RESERVED — returns null until real baselines exist.
// ---------------------------------------------------------------------------

import { prisma }        from '../../../lib/prisma';
import { sonnet, textOf } from '../llm/kimmpLLMRouter';
import { EvolutionEngine } from './evolutionEngine';

export interface SimulationDimension {
  name:       string;
  impact:     string;     // "+8%" | "-₹1.9Cr" | "3 months"
  direction:  'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  confidence: number;
  lag?:       string;     // "12-month lag"
}

export interface SimulationResult {
  id:             string;
  prompt:         string;
  dimensions:     SimulationDimension[];
  overallConfidence: number;
  simulationTrust: null;   // RESERVED — Phase 6.7 calibration pending Customer Zero data
  policiesUsed:   string[];
  playbooksUsed:  string[];
  summary:        string;
  createdAt:      string;
}

const SYSTEM_SIMULATE =
  'You are WAANDA, the executive simulator for Kangqore OS. ' +
  'Given a hypothetical executive decision, estimate its impact across business dimensions. ' +
  'Reply in JSON with this exact shape: ' +
  '{"dimensions":[{"name":"Revenue","impact":"...","direction":"POSITIVE|NEGATIVE|NEUTRAL","confidence":0.8,"lag":"optional"}],"summary":"one sentence"}. ' +
  'Include: Revenue, Delivery, Cash, Headcount, Risk, Market. ' +
  'Be specific with numbers. Use ₹ for rupees. No markdown. Confidence 0–1.';

export class ExecutiveSimulatorService {
  static async simulate(
    prompt:  string,
    context?: unknown,
    userId?:  string,
  ): Promise<SimulationResult> {
    // Gather relevant policies as constraints
    const [policies, playbooks] = await Promise.all([
      (prisma as any).policyEvolution.findMany({ where: { status: 'ACTIVE' }, orderBy: { confidence: 'desc' }, take: 5 }),
      (prisma as any).enterprisePlaybook.findMany({ where: { status: 'ACTIVE' }, orderBy: { confidence: 'desc' }, take: 3 }),
    ]);

    const policyContext = policies.map((p: any) => `Policy: ${p.statement}`).join('\n');
    const playbookContext = playbooks.map((p: any) => `Playbook: ${p.title} — ${Array.isArray(p.steps) ? p.steps[0] : ''}`).join('\n');

    const userPrompt = [
      `Decision: "${prompt}"`,
      policyContext ? `\nEnterprise Policies:\n${policyContext}` : '',
      playbookContext ? `\nPlaybooks:\n${playbookContext}` : '',
    ].filter(Boolean).join('\n');

    let dimensions: SimulationDimension[] = [];
    let summary = 'Simulation could not be completed.';
    let overallConfidence = 0.5;

    try {
      const res    = await sonnet(SYSTEM_SIMULATE, userPrompt, 400, { hint: 'executive-simulate' });
      const parsed = JSON.parse(textOf(res).trim());
      if (Array.isArray(parsed.dimensions)) {
        dimensions = parsed.dimensions;
        overallConfidence = dimensions.reduce((s, d) => s + d.confidence, 0) / dimensions.length;
      }
      if (parsed.summary) summary = parsed.summary;
    } catch { /* degrade gracefully */ }

    const sim = await (prisma as any).executiveSimulation.create({
      data: {
        prompt,
        context:       context ?? null,
        dimensions:    dimensions as any,
        confidence:    overallConfidence,
        policiesUsed:  policies.map((p: any) => p.id),
        playbooksUsed: playbooks.map((p: any) => p.id),
        createdBy:     userId ?? null,
      },
    });

    return {
      id:               sim.id,
      prompt,
      dimensions,
      overallConfidence: Math.round(overallConfidence * 100),
      simulationTrust:  null,  // RESERVED — Phase 6.7 calibration requires Customer Zero data
      policiesUsed:     policies.map((p: any) => p.id),
      playbooksUsed:    playbooks.map((p: any) => p.id),
      summary,
      createdAt:        sim.createdAt.toISOString(),
    };
  }

  static async getHistory(limit = 10): Promise<any[]> {
    return (prisma as any).executiveSimulation.findMany({
      orderBy: { createdAt: 'desc' },
      take:    limit,
    });
  }
}
