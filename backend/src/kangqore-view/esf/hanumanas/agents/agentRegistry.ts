import { AegisAgentDef } from './types'

const registry = new Map<string, AegisAgentDef>()

export function registerAgent(def: AegisAgentDef): void {
  registry.set(def.id, def)
}

export function getAgent(id: string): AegisAgentDef | undefined {
  return registry.get(id)
}

export function agentsForTrigger(trigger: string): AegisAgentDef[] {
  return [...registry.values()].filter(a => a.triggers.includes(trigger as any))
}

export function agentsForEngine(engine: string): AegisAgentDef[] {
  return [...registry.values()].filter(a => a.engine === engine)
}

export function allAgents(): AegisAgentDef[] {
  return [...registry.values()]
}

export function registryStats(): { total: number; engines: Record<string, number> } {
  const engines: Record<string, number> = {}
  for (const a of registry.values()) {
    engines[a.engine] = (engines[a.engine] ?? 0) + 1
  }
  return { total: registry.size, engines }
}
