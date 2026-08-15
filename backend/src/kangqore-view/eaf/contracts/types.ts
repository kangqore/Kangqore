// EAF — Enterprise Agent Framework contracts
// Defines the base contract all enterprise agents must implement.

export type AgentRole = 'ANALYST' | 'EXECUTOR' | 'VALIDATOR' | 'SYNTHESIZER' | 'ORCHESTRATOR'
export type AgentStatus = 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SUSPENDED'
export type AgentPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL'

export interface AgentCapability {
  capabilityId: string
  name: string
  inputSchema: Record<string, string>
  outputSchema: Record<string, string>
  domainScope: string[]
}

export interface AgentMetadata {
  agentId: string
  name: string
  version: string
  role: AgentRole
  capabilities: AgentCapability[]
  domainAffinity: string[]
  description: string
}

export interface AgentContext {
  requestId: string
  domainId: string
  inputs: Record<string, unknown>
  priority: AgentPriority
  timeoutMs?: number
  traceId?: string
}

export interface AgentResult {
  agentId: string
  requestId: string
  status: AgentStatus
  outputs: Record<string, unknown>
  confidenceScore: number
  durationMs: number
  reasoning?: string
  errors?: string[]
}

export interface EnterpriseAgent {
  getMetadata(): AgentMetadata
  execute(context: AgentContext): Promise<AgentResult>
  validate(context: AgentContext): boolean
}

export interface AgentOrchestrationPlan {
  planId: string
  objective: string
  agents: string[]
  executionOrder: 'SEQUENTIAL' | 'PARALLEL' | 'PIPELINE'
  context: AgentContext
}

export interface AgentOrchestrationResult {
  planId: string
  results: AgentResult[]
  aggregatedOutputs: Record<string, unknown>
  overallStatus: AgentStatus
  totalDurationMs: number
}
