// Lets the intelligence layer see the enterprise object model.
//
// Until now every consumer of EnterpriseObjectModel lived inside eof/. KIMMP
// could read individual OntologyObject rows but had no idea that a Project sits
// under a Program, that a Contract is what carries money, or that `threatens`
// is the edge that makes something a risk. It could see the nouns and not the
// grammar.
//
// This is READ-ONLY by design. Nothing here writes, and nothing here executes.
// The intelligence layer gets to understand the model and propose views over
// it; changing anything still goes through OntologyGateway and, for actions,
// the approval gate in AgentMissionEngine.

import {
  ENTERPRISE_OBJECTS, ENTERPRISE_RELATIONSHIPS, WORK_STATES,
  RESPONSIBILITY_ROLES, schemaFor, columnsOfClass,
  type ColumnClass,
} from './EnterpriseObjectModel'

export interface TypeSummary {
  name: string
  displayName: string
  /** Position in the execution chain, 1 (goal) → 10 (outcome). Null for non-hierarchy types. */
  tier: number | null
  description: string
  columns: Record<ColumnClass, string[]>
}

export interface EdgeSummary {
  from: string
  to: string
  type: string
  cardinality: string
  description: string
}

/** Adjacency built once — the relationship set is static. */
const OUT = new Map<string, EdgeSummary[]>()
const IN = new Map<string, EdgeSummary[]>()
for (const r of ENTERPRISE_RELATIONSHIPS) {
  const e: EdgeSummary = {
    from: r.sourceType, to: r.targetType, type: r.relationshipType,
    cardinality: r.cardinality, description: r.description,
  }
  if (!OUT.has(r.sourceType)) OUT.set(r.sourceType, [])
  if (!IN.has(r.targetType)) IN.set(r.targetType, [])
  OUT.get(r.sourceType)!.push(e)
  IN.get(r.targetType)!.push(e)
}

export const ModelIntrospection = {
  /** Every declared type with its columns grouped by class. */
  catalogue(): TypeSummary[] {
    return ENTERPRISE_OBJECTS.map(d => {
      const s = schemaFor(d)
      return {
        name: d.name,
        displayName: d.displayName,
        tier: d.tier ?? null,
        description: d.description ?? '',
        columns: {
          CORE: columnsOfClass(s, 'CORE').map(c => c.field),
          ENTERPRISE: columnsOfClass(s, 'ENTERPRISE').map(c => c.field),
          INTELLIGENCE: columnsOfClass(s, 'INTELLIGENCE').map(c => c.field),
          GOVERNANCE: columnsOfClass(s, 'GOVERNANCE').map(c => c.field),
        },
      }
    })
  },

  typeNames(): string[] {
    return ENTERPRISE_OBJECTS.map(o => o.name)
  },

  /** Does this column exist on this type? Guards query compilation. */
  hasColumn(typeName: string, field: string): boolean {
    const d = ENTERPRISE_OBJECTS.find(o => o.name === typeName)
    if (!d) return false
    return field in schemaFor(d)
  },

  edgesFrom(typeName: string): EdgeSummary[] { return OUT.get(typeName) ?? [] },
  edgesTo(typeName: string): EdgeSummary[] { return IN.get(typeName) ?? [] },

  /**
   * How does one type reach another? Breadth-first over the relationship
   * graph, following edges in both directions — "what threatens this goal"
   * walks backwards, "what does this task serve" walks forwards.
   *
   * This is what makes "reason from CEO objective down to execution" possible:
   * without it the intelligence layer cannot know that EnterpriseGoal and Task
   * are connected at all, let alone through which five hops.
   */
  pathBetween(fromType: string, toType: string, maxDepth = 6): EdgeSummary[] | null {
    if (fromType === toType) return []
    const seen = new Set<string>([fromType])
    const queue: Array<{ node: string; path: EdgeSummary[] }> = [{ node: fromType, path: [] }]

    while (queue.length) {
      const { node, path } = queue.shift()!
      if (path.length >= maxDepth) continue

      const neighbours = [
        ...(OUT.get(node) ?? []).map(e => ({ e, next: e.to })),
        ...(IN.get(node) ?? []).map(e => ({ e, next: e.from })),
      ]
      for (const { e, next } of neighbours) {
        if (seen.has(next)) continue
        const extended = [...path, e]
        if (next === toType) return extended
        seen.add(next)
        queue.push({ node: next, path: extended })
      }
    }
    return null
  },

  /** The execution chain in tier order — goal down to evidence. */
  executionChain(): TypeSummary[] {
    return this.catalogue()
      .filter(t => t.tier !== null)
      .sort((a, b) => (a.tier ?? 0) - (b.tier ?? 0))
  },

  /**
   * A compact rendering for an LLM prompt. Deliberately terse: the model is
   * large, and a context window spent listing every column is a context window
   * not spent on the actual question.
   */
  describeForPrompt(): string {
    const chain = this.executionChain().map(t => t.name).join(' → ')
    const flat = this.catalogue()
      .filter(t => t.tier === null)
      .map(t => t.name).join(', ')

    const edges = ENTERPRISE_RELATIONSHIPS
      .map(r => `${r.sourceType} -${r.relationshipType}-> ${r.targetType}`)
      .join('\n  ')

    return [
      'ENTERPRISE OBJECT MODEL',
      '',
      `Execution chain (tier order): ${chain}`,
      `Other types: ${flat}`,
      '',
      `Work states: ${WORK_STATES.join(', ')}`,
      `Responsibility roles: ${RESPONSIBILITY_ROLES.join(', ')}`,
      '',
      'Relationships:',
      `  ${edges}`,
      '',
      'Column classes: CORE (identity), ENTERPRISE (typed business fields),',
      'INTELLIGENCE (inferred — never entered by a human), GOVERNANCE (policy and audit).',
    ].join('\n')
  },
}
