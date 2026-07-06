import type { Node, Edge } from '@xyflow/react'
import type { WorkflowStep } from './types'

export type IssueSeverity = 'error' | 'warning'

export interface ValidationIssue {
  id:       string
  severity: IssueSeverity
  nodeId?:  string
  message:  string
  code:     string
}

export interface ValidationResult {
  status:  'valid' | 'warning' | 'error'
  issues:  ValidationIssue[]
  nodeMap: Map<string, ValidationIssue[]>
}

export interface ValidationScore {
  overall: number
  domains: {
    structure:     number
    execution:     number
    businessLogic: number
    security:      number
    governance:    number
  }
}

const DOMAIN_CODES: Record<string, string[]> = {
  structure:     ['ISOLATED_NODE', 'UNREACHABLE_NODE', 'CIRCULAR_DEP', 'MULTIPLE_ENTRY_POINTS'],
  execution:     ['APPROVAL_AFTER_EXECUTE', 'MISSING_TIMEOUT_HINT'],
  businessLogic: ['NO_FAILURE_PATH', 'NO_APPROVAL_GATE'],
  security:      [],
  governance:    [],
}

function _domainScore(issues: ValidationIssue[], codes: string[]): number {
  if (codes.length === 0) return 100
  let score = 100
  for (const i of issues.filter(x => codes.includes(x.code))) {
    score -= i.severity === 'error' ? 20 : 8
  }
  return Math.max(0, score)
}

export function scoreWorkflow(result: ValidationResult): ValidationScore {
  const { issues } = result
  const structure     = _domainScore(issues, DOMAIN_CODES.structure)
  const execution     = _domainScore(issues, DOMAIN_CODES.execution)
  const businessLogic = _domainScore(issues, DOMAIN_CODES.businessLogic)
  const overall = Math.round((structure + execution + businessLogic + 100 + 100) / 5)
  return { overall, domains: { structure, execution, businessLogic, security: 100, governance: 100 } }
}

export function validateWorkflow(nodes: Node[], edges: Edge[]): ValidationResult {
  if (nodes.length === 0) return { status: 'valid', issues: [], nodeMap: new Map() }

  const issues: ValidationIssue[] = []
  let seq = 0
  const issue = (
    severity: IssueSeverity,
    code: string,
    message: string,
    nodeId?: string,
  ) => issues.push({ id: `v${++seq}`, severity, code, message, nodeId })

  // Adjacency maps
  const outEdges = new Map<string, Edge[]>()
  const inEdges  = new Map<string, Edge[]>()
  nodes.forEach(n => { outEdges.set(n.id, []); inEdges.set(n.id, []) })
  edges.forEach(e => {
    outEdges.get(e.source)?.push(e)
    inEdges.get(e.target)?.push(e)
  })

  const name = (n: Node) => (n.data?.step as WorkflowStep)?.name ?? n.id
  const type = (n: Node) => (n.data?.step as WorkflowStep)?.type ?? ''

  // ── Check 1: Isolated nodes (no connections at all) ────────────────────────
  if (nodes.length > 1) {
    nodes.forEach(n => {
      const hasOut = (outEdges.get(n.id)?.length ?? 0) > 0
      const hasIn  = (inEdges.get(n.id)?.length ?? 0) > 0
      if (!hasOut && !hasIn) {
        issue('warning', 'ISOLATED_NODE', `"${name(n)}" is not connected to the workflow`, n.id)
      }
    })
  }

  // ── Check 2: Reachability from all start nodes ─────────────────────────────
  const startNodes = nodes.filter(n => (inEdges.get(n.id)?.length ?? 0) === 0)
  if (startNodes.length > 0) {
    const reachable = bfsReachable(startNodes.map(n => n.id), outEdges)
    nodes.forEach(n => {
      if (!reachable.has(n.id)) {
        issue('error', 'UNREACHABLE_NODE', `"${name(n)}" is unreachable — no path leads to it`, n.id)
      }
    })
  }

  // ── Check 3: Circular dependencies ────────────────────────────────────────
  detectCycles(nodes, outEdges).forEach(nodeId => {
    const n = nodes.find(x => x.id === nodeId)
    if (n) issue('error', 'CIRCULAR_DEP', `"${name(n)}" is part of a circular dependency`, nodeId)
  })

  // ── Check 4: Condition nodes missing a NO/failure branch ──────────────────
  nodes.filter(n => type(n) === 'condition').forEach(n => {
    const hasNo = (outEdges.get(n.id) ?? []).some(e => e.sourceHandle === 'no')
    if (!hasNo) {
      issue('warning', 'NO_FAILURE_PATH', `"${name(n)}" has no failure path — add a NO branch`, n.id)
    }
  })

  // ── Check 5: External calls (integrate) with no upstream approval ──────────
  nodes
    .filter(n => type(n) === 'integrate' || type(n) === 'integration')
    .forEach(n => {
      const ancestors = getAncestors(n.id, inEdges)
      if (ancestors.size === 0) return // start node, skip
      const hasGate = [...ancestors].some(id => {
        const anc = nodes.find(a => a.id === id)
        const t   = type(anc!)
        return t === 'approval' || t === 'wait'
      })
      if (!hasGate) {
        issue(
          'warning', 'NO_APPROVAL_GATE',
          `"${name(n)}" makes an external call with no upstream approval gate`,
          n.id,
        )
      }
    })

  // ── Layer 2 — Execution checks ────────────────────────────────────────────────

  // ── Check 7: Approval/wait gate AFTER an integration (wrong order) ────────
  nodes.filter(n => type(n) === 'approval' || type(n) === 'wait' || type(n) === 'delay').forEach(n => {
    const ancestors = getAncestors(n.id, inEdges)
    const hasExecUpstream = [...ancestors].some(id => {
      const anc = nodes.find(a => a.id === id)
      const t   = type(anc!)
      return t === 'integrate' || t === 'integration'
    })
    if (hasExecUpstream) {
      issue(
        'warning', 'APPROVAL_AFTER_EXECUTE',
        `"${name(n)}" approval gate comes after an integration call — move it upstream to gate before the call`,
        n.id,
      )
    }
  })

  // ── Check 8: Wait/delay node with no config ────────────────────────────────
  nodes.filter(n => type(n) === 'wait' || type(n) === 'delay').forEach(n => {
    const step     = n.data?.step as WorkflowStep
    const hasConf  = step?.config && Object.keys(step.config).length > 0
    if (!hasConf) {
      issue(
        'warning', 'MISSING_TIMEOUT_HINT',
        `"${name(n)}" wait/delay has no duration configured — add a timeout to avoid indefinite blocking`,
        n.id,
      )
    }
  })

  // ── Check 6: Multiple disconnected subgraphs (not necessarily an error) ────
  if (startNodes.length > 1) {
    issue(
      'warning', 'MULTIPLE_ENTRY_POINTS',
      `Workflow has ${startNodes.length} entry points — consider connecting them or splitting into separate workflows`,
    )
  }

  // Build per-node map
  const nodeMap = new Map<string, ValidationIssue[]>()
  issues.forEach(i => {
    if (!i.nodeId) return
    if (!nodeMap.has(i.nodeId)) nodeMap.set(i.nodeId, [])
    nodeMap.get(i.nodeId)!.push(i)
  })

  const hasError   = issues.some(i => i.severity === 'error')
  const hasWarning = issues.some(i => i.severity === 'warning')
  return { status: hasError ? 'error' : hasWarning ? 'warning' : 'valid', issues, nodeMap }
}

// ── Graph primitives ──────────────────────────────────────────────────────────

function bfsReachable(startIds: string[], outEdges: Map<string, Edge[]>): Set<string> {
  const visited = new Set<string>(startIds)
  const queue   = [...startIds]
  while (queue.length) {
    for (const e of outEdges.get(queue.shift()!) ?? []) {
      if (!visited.has(e.target)) { visited.add(e.target); queue.push(e.target) }
    }
  }
  return visited
}

function detectCycles(nodes: Node[], outEdges: Map<string, Edge[]>): Set<string> {
  const color    = new Map<string, 'white' | 'grey' | 'black'>()
  const cycleIds = new Set<string>()
  nodes.forEach(n => color.set(n.id, 'white'))

  function dfs(id: string): void {
    color.set(id, 'grey')
    for (const e of outEdges.get(id) ?? []) {
      const c = color.get(e.target)
      if (c === 'grey') { cycleIds.add(id); cycleIds.add(e.target) }
      else if (c === 'white') { dfs(e.target); if (cycleIds.has(e.target)) cycleIds.add(id) }
    }
    color.set(id, 'black')
  }

  nodes.forEach(n => { if (color.get(n.id) === 'white') dfs(n.id) })
  return cycleIds
}

function getAncestors(nodeId: string, inEdges: Map<string, Edge[]>): Set<string> {
  const visited = new Set<string>()
  const queue   = [nodeId]
  while (queue.length) {
    for (const e of inEdges.get(queue.shift()!) ?? []) {
      if (!visited.has(e.source)) { visited.add(e.source); queue.push(e.source) }
    }
  }
  return visited
}
