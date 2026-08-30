// Phase 5.3 — App Sandbox Engine
//
// Executes a third-party app action. Authorisation is delegated wholesale to
// GovernanceKernel, so this engine cannot execute anything the kernel refused
// and cannot report governance it did not obtain.

import { prisma } from '../../lib/prisma'
import { ActionEngine } from '../automation/ActionEngine'
import { GovernanceKernel } from './GovernanceKernel'

export interface SandboxExecutionInput {
  appId: string
  actionName: string
  params: Record<string, any>
  actorId: string
  tenantId?: string
  /** Dry-run: authorise and audit, but never mutate. Used by the test framework. */
  dryRun?: boolean
}

export interface SandboxExecutionResult {
  success: boolean
  executionId: string
  auditId: string
  result?: any
  error?: string
  governanceDetails: {
    outcome: string
    policyChecked: boolean
    policyName?: string | null
    policyEffect?: string
    governancePassed: boolean
    approvalRequired: boolean
    auditLogged: boolean
    creditsCharged: number
    creditsRemaining: number
    inherited: Record<string, boolean>
  }
}

export const AppSandboxEngine = {
  async execute(input: SandboxExecutionInput): Promise<SandboxExecutionResult> {
    const started = Date.now()
    const tenantId = input.tenantId || 'default'

    // Single authorisation chokepoint — all six layers.
    const decision = await GovernanceKernel.authorize({
      appId: input.appId,
      tenantId,
      actorId: input.actorId,
      actionName: input.actionName,
      params: input.params,
      creditCost: 1,
    })

    const governanceDetails = {
      outcome: decision.outcome,
      policyChecked: decision.policy.checked,
      policyName: decision.policy.policyName,
      policyEffect: decision.policy.effect,
      governancePassed: decision.allowed,
      approvalRequired: decision.outcome === 'PENDING_APPROVAL',
      auditLogged: true,
      creditsCharged: decision.billing.creditsCharged,
      creditsRemaining: decision.billing.creditsRemaining,
      inherited: decision.inherited,
    }

    if (!decision.allowed) {
      return {
        success: false,
        executionId: `exec-${Date.now()}`,
        auditId: decision.auditId,
        error: decision.reason,
        governanceDetails,
      }
    }

    if (input.dryRun) {
      const result = { dryRun: true, actionName: input.actionName, wouldExecute: true }
      await GovernanceKernel.recordResult(decision.auditId, result)
      return {
        success: true,
        executionId: `exec-dry-${Date.now()}`,
        auditId: decision.auditId,
        result,
        governanceDetails,
      }
    }

    // Authorised — delegate to the real action engine.
    try {
      const action = await prisma.ontologyAction.findFirst({ where: { name: input.actionName } })
      if (!action) {
        const err = `Action "${input.actionName}" is not registered in the ontology.`
        await GovernanceKernel.recordResult(decision.auditId, null, err)
        return {
          success: false,
          executionId: `exec-${Date.now()}`,
          auditId: decision.auditId,
          error: err,
          governanceDetails,
        }
      }

      const execResult: any = await ActionEngine.execute({
        actionId: action.id,
        params: input.params,
        actorId: input.actorId,
        actorType: 'DEVELOPER_APP',
      })

      // execute() returns the ActionExecution row: the outcome is `status`.
      // Testing a non-existent `success` field recorded every failure as a
      // success in the governance audit.
      const failed = execResult?.status === 'FAILED'
      await GovernanceKernel.recordResult(
        decision.auditId,
        execResult,
        failed ? execResult?.errorMessage ?? 'Action execution failed' : undefined,
      )

      return {
        success: !failed,
        // The real audit id, never a synthesised one — an invented execution id
        // points at no record and cannot be traced.
        executionId: execResult?.id ?? null,
        auditId: decision.auditId,
        result: execResult,
        error: failed ? execResult?.errorMessage : undefined,
        governanceDetails: { ...governanceDetails, outcome: failed ? 'ERROR' : 'ALLOWED' },
      }
    } catch (err: any) {
      await GovernanceKernel.recordResult(decision.auditId, null, err.message)
      return {
        success: false,
        executionId: `exec-${Date.now()}`,
        auditId: decision.auditId,
        error: err.message,
        governanceDetails: { ...governanceDetails, outcome: 'ERROR' },
      }
    } finally {
      void (Date.now() - started)
    }
  },
}
