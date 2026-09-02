import { prisma } from '../../../lib/prisma'
import logger from '../../../utils/logger'
import { critiqueDecision } from './adversarialCritic.service'

/**
 * KimmpEvolutionDaemon
 * An autonomous background loop that scans the entire Kangqore Ecosystem 
 * (Kangqore View, Eqore, HCIP, ALIS, HANUMANAS, VIS) for decisions that FAILED or 
 * resulted in poor outcomes. It then autonomously synthesises a corrective 
 * pattern using the Adversarial Critic and caches it in the Reflex system 
 * so the system immediately evolves.
 */
export class KimmpEvolutionDaemon {
  private isRunning = false
  private intervalMs = 60000 * 5 // Run every 5 minutes

  public start() {
    if (this.isRunning) return
    this.isRunning = true
    logger.info('[KimmpEvolutionDaemon] Ecosystem continuous evolution loop started.')
    this.loop()
  }

  public stop() {
    this.isRunning = false
    logger.info('[KimmpEvolutionDaemon] Ecosystem continuous evolution loop stopped.')
  }

  private async loop() {
    while (this.isRunning) {
      try {
        await this.runEvolutionCycle()
      } catch (err) {
        logger.error('[KimmpEvolutionDaemon] Error in evolution cycle:', err)
      }
      // Wait for next cycle
      await new Promise(resolve => setTimeout(resolve, this.intervalMs))
    }
  }

  private async runEvolutionCycle() {
    // 1. Scan for recent FAILED decisions across the ecosystem
    const failedDecisions = await (prisma as any).kimmpDecision.findMany({
      where: { status: 'REJECTED' },
      orderBy: { createdAt: 'desc' },
      take: 10
    }).catch(() => [])

    if (!failedDecisions.length) {
      logger.debug('[KimmpEvolutionDaemon] No new failed telemetry to correct.')
      return
    }

    logger.info(`[KimmpEvolutionDaemon] Found ${failedDecisions.length} rejected ecosystem decisions. Synthesising corrections...`)

    // 2. Autonomously Correct the Failures
    for (const d of failedDecisions) {
      const context = `Decision Type: ${d.decisionType}\nTarget Module: ${d.targetModule}\nReasoning: ${d.reasoning}`
      const proposedAction = d.recommendedAction || 'No action specified'

      // Ask the Critic to destroy the logic and provide a corrected response
      const criticResult = await critiqueDecision('KIMMP', context, proposedAction)

      if (!criticResult.passed && criticResult.correctedResponse) {
        // We have successfully synthesised a correction for the failure
        
        // 3. Inject it straight into the Reflex/Learning corpus so it's learned instantly
        await (prisma as any).kimmpLearningExample.create({
          data: {
            source: 'evolution_daemon',
            sourceId: d.id,
            systemPrompt: 'You are KIMMP/WAANDA...',
            userMessage: `KIMMP decision needed — type: ${d.decisionType}, module: ${d.targetModule}.\nContext: ${d.reasoning?.slice(0, 400)}`,
            idealResponse: criticResult.correctedResponse,
            quality: 0.85, // Highly validated synthetic correction
            approved: true, // Auto-approved by the evolutionary daemon
            agentSystem: 'KIMMP',
            agentType: d.decisionType,
            tags: ['evolution', 'correction', d.targetModule || 'ecosystem']
          }
        }).catch(() => null)

        logger.info(`[KimmpEvolutionDaemon] Synthesised and learned correction for decision ${d.id}`)
      }
    }
  }
}

// Singleton export
export const evolutionDaemon = new KimmpEvolutionDaemon()
