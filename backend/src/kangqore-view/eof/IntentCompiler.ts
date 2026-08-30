// "Show me all high-risk projects" → a real query over the ontology.
//
// This is §4 of the Monday analysis: grouping should be semantic, not a UI
// affordance. The user asks for a view; the system works out what that means.
//
// Deliberately deterministic rather than an LLM call. Every term it recognises
// comes from the model itself — type names, WORK_STATES, real column names —
// so the parse is grounded in what actually exists and cannot invent a field.
// When it cannot parse something it says so and returns nothing, because a
// confidently wrong filter silently hides the rows that mattered.
//
// An LLM front-end can sit on top of this later and emit the same structure.
// What it must not do is bypass it and hand raw SQL to the database.

import { prisma } from '../../lib/prisma'
import { ModelIntrospection } from './ModelIntrospection'
import { WORK_STATES } from './EnterpriseObjectModel'
import type { QueryNode } from './ObjectSet'
import type { ObjectQuery } from './ObjectQueryCompiler'

export interface CompiledIntent {
  ok: true
  typeName: string
  query: ObjectQuery
  /** Plain-English restatement, so the user can see what was understood. */
  explanation: string
  /** Terms that were recognised, for transparency. */
  matched: string[]
  /** Words that were ignored — the honest part. */
  ignored: string[]
}
export interface FailedIntent {
  ok: false
  reason: string
  /** What it would have needed to succeed. */
  hint: string
}

const RISK_THRESHOLD = 0.5

/** Singular and plural surface forms for every declared type. */
function typeAliases(): Array<{ name: string; forms: string[] }> {
  return ModelIntrospection.catalogue().map(t => {
    const base = t.displayName.toLowerCase()
    const forms = new Set([base, base + 's', t.name.toLowerCase(), t.name.toLowerCase() + 's'])
    // "EnterpriseGoal" should also answer to "goal".
    const tail = t.displayName.split(' ').pop()!.toLowerCase()
    forms.add(tail); forms.add(tail + 's')
    return { name: t.name, forms: [...forms] }
  })
}

export const IntentCompiler = {
  /**
   * Compile, then bind the query to the resolved type.
   *
   * Callers should use this rather than `compile`. Identifying a type without
   * filtering on it produced queries that ran across the whole graph — "open
   * contracts" returned every unfinished object of any type. Resolving the id
   * here means no caller can forget the constraint.
   */
  async compileBound(text: string): Promise<CompiledIntent | FailedIntent> {
    const intent = this.compile(text)
    if (!intent.ok) return intent

    const type = await prisma.ontologyObjectType.findUnique({
      where: { name: intent.typeName }, select: { id: true },
    })
    if (!type) {
      return {
        ok: false,
        reason: `Type "${intent.typeName}" is declared in the model but not present in the ontology.`,
        hint: 'Run the enterprise model seeder.',
      }
    }

    const typeFilter: QueryNode = { type: 'filter', field: 'typeId', op: 'eq', value: type.id }
    const root: QueryNode = intent.query.root.type === 'intersection'
      ? { type: 'intersection', sets: [typeFilter, ...intent.query.root.sets] }
      : { type: 'intersection', sets: [typeFilter, intent.query.root] }

    return { ...intent, query: { ...intent.query, root } }
  },

  /**
   * Parse a request into a query. Returns a failure rather than a guess when
   * no object type can be identified — a query over "everything" is almost
   * never what someone meant.
   */
  compile(text: string): CompiledIntent | FailedIntent {
    const lower = ' ' + text.toLowerCase().replace(/[^a-z0-9%\s-]/g, ' ').replace(/\s+/g, ' ') + ' '
    const matched: string[] = []
    const filters: QueryNode[] = []

    // ── Which type? Longest surface form wins, so "strategic objective"
    //    is not shadowed by "objective".
    let typeName: string | null = null
    let best = 0
    for (const t of typeAliases()) {
      for (const f of t.forms) {
        if (f.length > best && lower.includes(` ${f} `)) { typeName = t.name; best = f.length }
      }
    }
    if (!typeName) {
      return {
        ok: false,
        reason: 'No object type was named, so there is nothing to select from.',
        hint: `Name one of: ${ModelIntrospection.typeNames().slice(0, 8).join(', ')}…`,
      }
    }
    matched.push(`type=${typeName}`)

    const has = (...words: string[]) => words.some(w => lower.includes(` ${w} `) || lower.includes(` ${w}`))
    const field = (f: string) => ModelIntrospection.hasColumn(typeName!, f)

    // ── Risk ────────────────────────────────────────────────────────────────
    if (has('high-risk', 'high risk', 'at risk', 'risky', 'in trouble') && field('predictedRisk')) {
      filters.push({ type: 'filter', field: 'predictedRisk', op: 'gte', value: RISK_THRESHOLD })
      matched.push(`predictedRisk >= ${RISK_THRESHOLD}`)
    }
    if (has('low-risk', 'low risk', 'healthy', 'on track') && field('predictedRisk')) {
      filters.push({ type: 'filter', field: 'predictedRisk', op: 'lt', value: RISK_THRESHOLD })
      matched.push(`predictedRisk < ${RISK_THRESHOLD}`)
    }

    // ── Explicit state ──────────────────────────────────────────────────────
    for (const s of WORK_STATES) {
      const phrase = s.toLowerCase().replace(/_/g, ' ')
      if (lower.includes(` ${phrase} `)) {
        filters.push({ type: 'filter', field: 'status', op: 'eq', value: s })
        matched.push(`status = ${s}`)
        break
      }
    }
    // "open" / "active" means not finished, which is a different shape.
    if (has('open', 'active', 'unfinished', 'outstanding') &&
        !matched.some(m => m.startsWith('status'))) {
      filters.push({ type: 'filter', field: 'status', op: 'neq', value: 'COMPLETED' })
      matched.push('status != COMPLETED')
    }

    // ── Overdue ─────────────────────────────────────────────────────────────
    if (has('overdue', 'late', 'past due', 'missed') && field('dueDate')) {
      filters.push({ type: 'filter', field: 'dueDate', op: 'lt', value: new Date().toISOString() })
      filters.push({ type: 'filter', field: 'status', op: 'neq', value: 'COMPLETED' })
      matched.push('dueDate in the past, not completed')
    }

    // ── Money ───────────────────────────────────────────────────────────────
    const valueField = ['value', 'budget', 'arr'].find(f => field(f))
    const amount = lower.match(/\b(?:over|above|more than|greater than)\s*[£$€]?\s*([\d,]+)\s*(k|m)?/)
    if (amount && valueField) {
      let n = Number(amount[1].replace(/,/g, ''))
      if (amount[2] === 'k') n *= 1_000
      if (amount[2] === 'm') n *= 1_000_000
      filters.push({ type: 'filter', field: valueField, op: 'gt', value: n })
      matched.push(`${valueField} > ${n}`)
    }

    if (!filters.length) {
      matched.push('no filters — every object of this type')
    }

    // ── Sort: money first if there is money, else soonest deadline ──────────
    const sort = valueField && filters.some(f => (f as any).field === valueField)
      ? [{ field: valueField, direction: 'desc' as const }]
      : field('dueDate')
        ? [{ field: 'dueDate', direction: 'asc' as const }]
        : undefined

    // ── What was ignored ────────────────────────────────────────────────────
    const understood = new Set(
      matched.join(' ').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean),
    )
    const stop = new Set(['show','me','all','the','a','an','of','with','and','or','my','that','are','is','which','list','find','get','in','to','for','by','on'])
    const ignored = [...new Set(
      lower.trim().split(' ').filter(w => w && !stop.has(w) && !understood.has(w) &&
        !typeAliases().some(t => t.forms.includes(w))),
    )]

    const root: QueryNode = filters.length === 1
      ? filters[0]
      : filters.length > 1
        ? { type: 'intersection', sets: filters }
        : { type: 'filter', field: 'status', op: 'neq', value: '__no_such_status__' }  // matches every row

    return {
      ok: true,
      typeName,
      query: { root, sort, limit: 200 },
      explanation: `${typeName} where ${matched.slice(1).join(', ') || 'no condition'}`,
      matched,
      ignored,
    }
  },
}
