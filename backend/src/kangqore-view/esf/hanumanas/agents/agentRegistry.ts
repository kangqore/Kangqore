import { HanumanasAgentDef } from './types'

const registry = new Map<string, HanumanasAgentDef>()

export function registerAgent(def: HanumanasAgentDef): void {
  registry.set(def.id, def)
}

export function getAgent(id: string): HanumanasAgentDef | undefined {
  return registry.get(id)
}

export function agentsForTrigger(trigger: string): HanumanasAgentDef[] {
  return [...registry.values()].filter(a => a.triggers.includes(trigger as any))
}

export function agentsForEngine(engine: string): HanumanasAgentDef[] {
  return [...registry.values()].filter(a => a.engine === engine)
}

export function allAgents(): HanumanasAgentDef[] {
  return [...registry.values()]
}

export function registryStats(): { total: number; engines: Record<string, number> } {
  const engines: Record<string, number> = {}
  for (const a of registry.values()) {
    engines[a.engine] = (engines[a.engine] ?? 0) + 1
  }
  return { total: registry.size, engines }
}
