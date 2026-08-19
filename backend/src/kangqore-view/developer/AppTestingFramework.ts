// Phase 5.3 — App Testing Framework & Deployment Engine
//
// Tests run against the real sandbox in dryRun mode, so a passing suite proves
// the app's actions clear the governance kernel without mutating tenant state.

import { prisma } from '../../lib/prisma'
import { AppSandboxEngine } from './AppSandboxEngine'
import { validateAppManifest, KangqoreAppManifest } from './AppManifest'
import { scoreGovernance } from './DeveloperPlatform.service'

export interface AppTestCase {
  name: string
  actionName: string
  params?: Record<string, any>
  /** Expect the governance kernel to refuse. Use for negative permission tests. */
  expectDenied?: boolean
}

export interface AppTestCaseResult {
  name: string
  actionName: string
  passed: boolean
  outcome: string
  reason?: string
  durationMs: number
}

export const AppTestingFramework = {
  /** Run a suite. Every case is authorised through the kernel in dryRun mode. */
  async runSuite(args: {
    appId: string
    tenantId: string
    triggeredBy: string
    suiteName?: string
    cases?: AppTestCase[]
  }) {
    const started = Date.now()
    const app = await prisma.developerApp.findUnique({ where: { appId: args.appId } })
    if (!app) throw new Error(`App "${args.appId}" not found`)

    const manifest = app.manifest as unknown as KangqoreAppManifest

    // Default suite: exercise every action the manifest declares.
    const cases: AppTestCase[] =
      args.cases?.length
        ? args.cases
        : (manifest.actions ?? []).map(a => ({
            name: `action:${a.name}`,
            actionName: a.name,
            params: Object.fromEntries(
              (a.parameters ?? [])
                .filter(p => p.required)
                .map(p => [p.name, p.type === 'number' ? 0 : p.type === 'boolean' ? false : 'test']),
            ),
          }))

    const run = await prisma.appTestRun.create({
      data: {
        appId: args.appId,
        suiteName: args.suiteName ?? 'default',
        status: 'RUNNING',
        totalTests: cases.length + 1, // +1 for the manifest validation case
        triggeredBy: args.triggeredBy,
      },
    })

    const results: AppTestCaseResult[] = []

    // Case 0 — manifest must be valid and certifiable.
    const t0 = Date.now()
    const validation = validateAppManifest(manifest)
    const governance = scoreGovernance(manifest)
    results.push({
      name: 'manifest:valid',
      actionName: '—',
      passed: validation.valid,
      outcome: validation.valid ? `VALID (governance ${governance.score}/100)` : 'INVALID',
      reason: validation.valid ? undefined : validation.errors.join('; '),
      durationMs: Date.now() - t0,
    })

    for (const c of cases) {
      const t = Date.now()
      try {
        const res = await AppSandboxEngine.execute({
          appId: args.appId,
          actionName: c.actionName,
          params: c.params ?? {},
          actorId: args.triggeredBy,
          tenantId: args.tenantId,
          dryRun: true,
        })
        const denied = !res.success
        const passed = c.expectDenied ? denied : res.success
        results.push({
          name: c.name,
          actionName: c.actionName,
          passed,
          outcome: res.governanceDetails.outcome,
          reason: passed ? undefined : res.error ?? 'Unexpected outcome',
          durationMs: Date.now() - t,
        })
      } catch (err: any) {
        results.push({
          name: c.name,
          actionName: c.actionName,
          passed: false,
          outcome: 'ERROR',
          reason: err.message,
          durationMs: Date.now() - t,
        })
      }
    }

    const passed = results.filter(r => r.passed).length
    const failed = results.length - passed

    const finished = await prisma.appTestRun.update({
      where: { id: run.id },
      data: {
        status: failed === 0 ? 'PASSED' : 'FAILED',
        totalTests: results.length,
        passedTests: passed,
        failedTests: failed,
        results: results as any,
        durationMs: Date.now() - started,
      },
    })

    return {
      runId: finished.id,
      appId: args.appId,
      status: finished.status,
      totalTests: results.length,
      passedTests: passed,
      failedTests: failed,
      durationMs: finished.durationMs,
      results,
    }
  },

  async listRuns(appId: string, limit = 20) {
    return prisma.appTestRun.findMany({
      where: { appId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  },
}

export const AppDeploymentEngine = {
  /**
   * Deploy a version to an environment. Production requires a passing test run
   * and a published, certifiable app — a red suite cannot reach production.
   */
  async deploy(args: {
    appId: string
    environment: 'SANDBOX' | 'STAGING' | 'PRODUCTION'
    deployedBy: string
    releaseNotes?: string
  }) {
    const app = await prisma.developerApp.findUnique({ where: { appId: args.appId } })
    if (!app) throw new Error(`App "${args.appId}" not found`)

    const logs: string[] = []
    logs.push(`Resolving ${app.appId}@${app.version} for ${args.environment}`)

    if (args.environment === 'PRODUCTION') {
      if (app.status !== 'PUBLISHED') {
        throw new Error(`Cannot deploy to PRODUCTION — app status is ${app.status}, expected PUBLISHED`)
      }
      const lastRun = await prisma.appTestRun.findFirst({
        where: { appId: args.appId },
        orderBy: { createdAt: 'desc' },
      })
      if (!lastRun) throw new Error('Cannot deploy to PRODUCTION — no test run recorded. Run the suite first.')
      if (lastRun.status !== 'PASSED') {
        throw new Error(`Cannot deploy to PRODUCTION — latest test run ${lastRun.id} is ${lastRun.status}`)
      }
      logs.push(`Gate passed: test run ${lastRun.id} (${lastRun.passedTests}/${lastRun.totalTests})`)
    }

    const deployment = await prisma.appDeployment.create({
      data: {
        appId: args.appId,
        version: app.version,
        environment: args.environment,
        status: 'BUILDING',
        manifestSnapshot: app.manifest as any,
        releaseNotes: args.releaseNotes ?? null,
        deployedBy: args.deployedBy,
      },
    })

    logs.push('Manifest snapshot captured')
    logs.push(`Deployment ${deployment.id} promoted to ${args.environment}`)

    const completed = await prisma.appDeployment.update({
      where: { id: deployment.id },
      data: { status: 'DEPLOYED', completedAt: new Date(), logs: logs.join('\n') },
    })

    return completed
  },

  async rollback(deploymentId: string, actorId: string) {
    const deployment = await prisma.appDeployment.findUnique({ where: { id: deploymentId } })
    if (!deployment) throw new Error('Deployment not found')

    const rolled = await prisma.appDeployment.update({
      where: { id: deploymentId },
      data: {
        status: 'ROLLED_BACK',
        logs: `${deployment.logs ?? ''}\nRolled back by ${actorId} at ${new Date().toISOString()}`,
      },
    })
    return rolled
  },

  async listDeployments(appId: string) {
    return prisma.appDeployment.findMany({
      where: { appId },
      orderBy: { startedAt: 'desc' },
      take: 50,
    })
  },
}
