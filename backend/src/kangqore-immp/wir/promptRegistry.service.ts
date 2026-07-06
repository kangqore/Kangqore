// E2 — Prompt Registry
// Every system prompt is versioned, stored, and retrievable by name.
// Enables: which prompt generated this output? roll back a bad prompt in seconds.

import { prisma } from '../../lib/prisma'

export interface PromptVersion {
  id:        string
  name:      string
  version:   number
  content:   string
  active:    boolean
  notes:     string | null
  createdAt: Date
}

// Built-in default prompts seeded on first access
const DEFAULTS: Array<{ name: string; content: string; notes: string }> = [
  {
    name:    'planner_system',
    content: 'You are KIMMP\'s Autonomous Planning Engine — part of WAANDA (Kangqore\'s AI Operating System). Decompose goals into typed, dependency-aware workflow steps. Return only valid JSON.',
    notes:   'Default planning system prompt v1',
  },
  {
    name:    'decision_system',
    content: 'You are KIMMP — the strategic intelligence brain of Kangqore OS. Analyse the enterprise context and produce structured, auditable business decisions with options, evidence, and a clear recommendation. Return only valid JSON.',
    notes:   'Default strategic decision system prompt v1',
  },
  {
    name:    'coordinator_system',
    content: 'You are a KIMMP specialist agent contributing to a multi-agent coordination task. Return a concise JSON with your findings, confidence, and flags.',
    notes:   'Default agent coordinator system prompt v1',
  },
  {
    name:    'consensus_system',
    content: 'You are KIMMP\'s Coordination Engine. Integrate findings from multiple specialist agents and produce a single consensus recommendation. Return JSON.',
    notes:   'Default consensus system prompt v1',
  },
  {
    name:    'goal_engine_system',
    content: 'You are KIMMP\'s Goal Engine. Evaluate whether the current enterprise context warrants autonomous action toward the given goal. Return JSON with needsAction boolean and reasoning.',
    notes:   'Default goal engine system prompt v1',
  },
  {
    name:    'simulation_system',
    content: 'You are KIMMP\'s Simulation Engine. Analyse the enterprise data and model the impact of the given scenario. Return structured findings with severity assessment.',
    notes:   'Default simulation system prompt v1',
  },
]

export class PromptRegistry {

  static async get(name: string, version?: number): Promise<string | null> {
    try {
      await PromptRegistry._seedIfNeeded(name)

      const prompt = await (prisma as any).aIPrompt.findFirst({
        where: version
          ? { name, version }
          : { name, active: true },
        orderBy: { version: 'desc' },
      })
      return prompt?.content ?? null
    } catch {
      // Fallback: return default if DB unavailable
      return DEFAULTS.find(d => d.name === name)?.content ?? null
    }
  }

  // Create new version (deactivates current active)
  static async create(name: string, content: string, notes?: string, createdBy?: string): Promise<PromptVersion> {
    const latest = await (prisma as any).aIPrompt.findFirst({
      where: { name },
      orderBy: { version: 'desc' },
      select: { version: true },
    }).catch(() => null)

    const nextVersion = (latest?.version ?? 0) + 1

    // Deactivate current
    await (prisma as any).aIPrompt.updateMany({
      where: { name, active: true },
      data:  { active: false },
    }).catch(() => {})

    return (prisma as any).aIPrompt.create({
      data: { name, version: nextVersion, content, notes, createdBy, active: true },
    })
  }

  // Roll back to a specific version
  static async rollback(name: string, version: number): Promise<void> {
    // Deactivate current
    await (prisma as any).aIPrompt.updateMany({
      where: { name, active: true },
      data:  { active: false },
    }).catch(() => {})
    // Activate target
    await (prisma as any).aIPrompt.updateMany({
      where: { name, version },
      data:  { active: true },
    })
  }

  static async list(): Promise<PromptVersion[]> {
    return (prisma as any).aIPrompt.findMany({
      orderBy: [{ name: 'asc' }, { version: 'desc' }],
    }).catch(() => [])
  }

  static async listNames(): Promise<Array<{ name: string; activeVersion: number; totalVersions: number }>> {
    const all = await (prisma as any).aIPrompt.findMany({
      select: { name: true, version: true, active: true },
      orderBy: { version: 'desc' },
    }).catch(() => [])

    const grouped: Record<string, { versions: number[]; active: number }> = {}
    for (const p of all) {
      if (!grouped[p.name]) grouped[p.name] = { versions: [], active: 0 }
      grouped[p.name].versions.push(p.version)
      if (p.active) grouped[p.name].active = p.version
    }

    return Object.entries(grouped).map(([name, { versions, active }]) => ({
      name, activeVersion: active, totalVersions: versions.length,
    }))
  }

  private static _seeded = new Set<string>()

  private static async _seedIfNeeded(name: string): Promise<void> {
    if (PromptRegistry._seeded.has(name)) return
    PromptRegistry._seeded.add(name)

    const exists = await (prisma as any).aIPrompt.findFirst({ where: { name } }).catch(() => null)
    if (exists) return

    const def = DEFAULTS.find(d => d.name === name)
    if (!def) return

    await PromptRegistry.create(def.name, def.content, def.notes, 'SYSTEM').catch(() => {})
  }
}
