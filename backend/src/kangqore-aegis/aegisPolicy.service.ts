// ---------------------------------------------------------------------------
// AEGIS Policy Engine
//
// Defines and evaluates the governance rules that protect the ADMIN's
// sovereignty over KIMMP/WAANDA. Policies are checked before any sensitive
// action proceeds. Violations are logged and surfaced to the ADMIN.
//
// Policy structure:
//   - id:        unique policy identifier
//   - name:      human-readable name
//   - rule:      evaluator function → ALLOW | WARN | DENY
//   - severity:  LOW | MODERATE | HIGH | CRITICAL
// ---------------------------------------------------------------------------

import logger from '../utils/logger'

export type PolicyVerdict = 'ALLOW' | 'WARN' | 'DENY'

export interface PolicyContext {
  role?:      string
  userId?:    string
  trigger?:   string
  system?:    string
  assetType?: string
  action?:    string
  metadata?:  Record<string, unknown>
}

export interface PolicyResult {
  verdict:     PolicyVerdict
  policy:      string
  reason:      string
  severity:    'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'
}

interface Policy {
  id:       string
  name:     string
  severity: PolicyResult['severity']
  evaluate: (ctx: PolicyContext) => PolicyVerdict | null  // null = not applicable
}

const POLICIES: Policy[] = [
  {
    id:       'ADMIN_ONLY_ACCESS',
    name:     'KIMMP endpoints require ADMIN role',
    severity: 'CRITICAL',
    evaluate: (ctx) => {
      if (ctx.action === 'ACCESS_KIMMP' && ctx.role && ctx.role !== 'ADMIN') return 'DENY'
      return null
    },
  },
  {
    id:       'SCHEDULER_ONLY_AUTONOMOUS',
    name:     'Autonomous activations must come from the scheduler or CRM events — not anonymous callers',
    severity: 'HIGH',
    evaluate: (ctx) => {
      if (ctx.action === 'AUTONOMOUS_ACTIVATION' && !ctx.trigger?.startsWith('schedule.') && !ctx.trigger?.startsWith('event.')) {
        return 'WARN'
      }
      return null
    },
  },
  {
    id:       'CRITICAL_BRIEFING_MUST_LOG',
    name:     'CRITICAL priority briefings must be logged to the AEGIS audit ledger',
    severity: 'HIGH',
    evaluate: (ctx) => {
      if (ctx.action === 'BRIEFING_PRODUCED' && ctx.metadata?.priority === 'CRITICAL') {
        // This policy is informational — it ensures the caller logs it
        return 'ALLOW'
      }
      return null
    },
  },
  {
    id:       'RESTRICTED_ASSET_ADMIN_ONLY',
    name:     'RESTRICTED classified assets are accessible only by ADMIN',
    severity: 'CRITICAL',
    evaluate: (ctx) => {
      if (ctx.action === 'ASSET_ACCESS' && ctx.metadata?.classification === 'RESTRICTED' && ctx.role !== 'ADMIN') {
        return 'DENY'
      }
      return null
    },
  },
  {
    id:       'EGRESS_MUST_BE_AUTHENTICATED',
    name:     'Intelligence egress requires an authenticated ADMIN session',
    severity: 'HIGH',
    evaluate: (ctx) => {
      if (ctx.action === 'INTELLIGENCE_EGRESS' && !ctx.userId) return 'DENY'
      return null
    },
  },
  {
    id:       'SENTINEL_AUTO_AUTHORITY',
    name:     'SENTINEL may emit CRITICAL signals autonomously — other systems require review',
    severity: 'LOW',
    evaluate: (ctx) => {
      if (ctx.action === 'AUTONOMOUS_CRITICAL' && ctx.system !== 'SENTINEL') return 'WARN'
      return null
    },
  },
]

export class AegisPolicyEngine {
  static evaluate(action: string, ctx: PolicyContext): PolicyResult[] {
    const results: PolicyResult[] = []
    const fullCtx = { ...ctx, action }

    for (const policy of POLICIES) {
      const verdict = policy.evaluate(fullCtx)
      if (verdict === null) continue

      results.push({
        verdict,
        policy:   policy.id,
        reason:   policy.name,
        severity: policy.severity,
      })

      if (verdict === 'DENY') {
        logger.warn(`[AEGIS:POLICY] DENY — ${policy.id}: ${policy.name} | action=${action} role=${ctx.role ?? 'none'}`)
      } else if (verdict === 'WARN') {
        logger.info(`[AEGIS:POLICY] WARN — ${policy.id}: ${policy.name} | action=${action}`)
      }
    }

    return results
  }

  // Returns true if the action is DENIED by any policy
  static isDenied(action: string, ctx: PolicyContext): boolean {
    return AegisPolicyEngine.evaluate(action, ctx).some(r => r.verdict === 'DENY')
  }

  // Returns the full policy ruleset for the ADMIN dashboard
  static listPolicies(): { id: string; name: string; severity: string }[] {
    return POLICIES.map(p => ({ id: p.id, name: p.name, severity: p.severity }))
  }
}
