// ---------------------------------------------------------------------------
// WAANDA Training Data Pipeline — Core Capture Service
//
// Every KIMMP cognitive activation is a potential training example.
// This service captures the raw LLM call (systemPrompt + userPrompt +
// completion) alongside structured metadata, then pre-computes both
// Alpaca and Chat export formats so the dataset is export-ready at any time.
//
// Three example types:
//   REASON    — agent selection decisions (most valuable: teaches which agents
//               to activate for which triggers)
//   SPEAK     — synthesis decisions (teaches how to speak in each system's voice)
//   SYNTHESIS — KIMMP governing synthesis (teaches cross-system reasoning)
//
// Quality labelling happens post-hoc via applyFeedback() when the operator
// rates a briefing. ACCEPTED → positive example. DISMISSED → negative pair.
// CORRECTED → negative example + stores the correction as the ideal output.
// ---------------------------------------------------------------------------

import { prisma } from '../../../lib/prisma'
import logger    from '../../../utils/logger'
import { classifyCurriculum } from './curriculumClassifier'

export type ExampleType = 'REASON' | 'SPEAK' | 'SYNTHESIS'

// ─── Alpaca format (standard SFT) ────────────────────────────────────────────

function toAlpaca(systemPrompt: string, userPrompt: string, completion: string) {
  return { instruction: systemPrompt.slice(0, 2000), input: userPrompt.slice(0, 2000), output: completion.slice(0, 3000) }
}

// ─── Chat format (ShareGPT — works with Unsloth, axolotl, LLaMA-Factory) ─────

function toChat(systemPrompt: string, userPrompt: string, completion: string) {
  return {
    conversations: [
      { from: 'system', value: systemPrompt.slice(0, 2000) },
      { from: 'human',  value: userPrompt.slice(0, 2000)   },
      { from: 'gpt',    value: completion.slice(0, 3000)   },
    ],
  }
}

// ─── Core service ─────────────────────────────────────────────────────────────

export class WaandaTrainingPipeline {

  private static async write(data: {
    exampleType:    ExampleType
    system?:        string
    systemPrompt:   string
    userPrompt:     string
    completion:     string
    trigger?:       string
    priority?:      string
    confidence?:    number
    agentsUsed?:    string[]
    dispatchId?:    string
    conversationId?: string
    simulationId?:  string
    missionId?:     string
    workspaceId?:   string
    modelVersion?:  string
  }): Promise<string | null> {
    try {
      const alpacaFormat = toAlpaca(data.systemPrompt, data.userPrompt, data.completion)
      const chatFormat   = toChat  (data.systemPrompt, data.userPrompt, data.completion)

      const curriculum = classifyCurriculum({
        system:      data.system,
        trigger:     data.trigger,
        exampleType: data.exampleType,
        intent:      data.trigger,
      })

      const row = await (prisma as any).waandaTrainingExample.create({
        data: {
          exampleType:    data.exampleType,
          system:         data.system         ?? null,
          systemPrompt:   data.systemPrompt.slice(0, 8000),
          userPrompt:     data.userPrompt.slice(0, 8000),
          completion:     data.completion.slice(0, 8000),
          trigger:        data.trigger        ?? null,
          priority:       data.priority       ?? null,
          confidence:     data.confidence     ?? null,
          agentsUsed:     data.agentsUsed     ?? [],
          dispatchId:     data.dispatchId     ?? null,
          conversationId: data.conversationId ?? null,
          simulationId:   data.simulationId   ?? null,
          missionId:      data.missionId      ?? null,
          workspaceId:    data.workspaceId    ?? null,
          modelVersion:   data.modelVersion   ?? null,
          curriculum,
          alpacaFormat,
          chatFormat,
        },
      })
      return row.id as string
    } catch (err: any) {
      logger.debug('[WAANDA:TRAIN] Capture failed: ' + err.message)
      return null
    }
  }

  // ── Capture a REASON phase decision ─────────────────────────────────────────
  // Call after reasonPhase() returns — captures the agent selection decision.

  static captureReason(params: {
    system:        string
    trigger?:      string
    systemPrompt:  string   // the full reason prompt sent to LLM
    userPrompt:    string   // the "You are an intelligent system..." wrapper
    completion:    string   // the raw JSON output from LLM
    selectedAgents: string[]
    priority:      string
    dispatchId?:   string
    missionId?:    string
    workspaceId?:  string
  }): void {
    WaandaTrainingPipeline.write({
      exampleType:  'REASON',
      system:       params.system,
      trigger:      params.trigger,
      systemPrompt: params.systemPrompt,
      userPrompt:   params.userPrompt,
      completion:   params.completion,
      agentsUsed:   params.selectedAgents,
      priority:     params.priority,
      dispatchId:   params.dispatchId,
      missionId:    params.missionId,
      workspaceId:  params.workspaceId,
    }).catch(() => {})
  }

  // ── Capture a SPEAK phase synthesis ─────────────────────────────────────────
  // Call after speakPhase() returns — captures how the system synthesises.

  static captureSpeak(params: {
    system:          string
    trigger?:        string
    systemPrompt:    string
    userPrompt:      string
    completion:      string
    priority:        string
    confidence?:     number
    dispatchId?:     string
    conversationId?: string
    simulationId?:   string
    missionId?:      string
    workspaceId?:    string
    modelVersion?:   string
  }): void {
    WaandaTrainingPipeline.write({
      exampleType:    'SPEAK',
      system:         params.system,
      trigger:        params.trigger,
      systemPrompt:   params.systemPrompt,
      userPrompt:     params.userPrompt,
      completion:     params.completion,
      priority:       params.priority,
      confidence:     params.confidence,
      dispatchId:     params.dispatchId,
      conversationId: params.conversationId,
      simulationId:   params.simulationId,
      missionId:      params.missionId,
      workspaceId:    params.workspaceId,
      modelVersion:   params.modelVersion,
    }).catch(() => {})
  }

  // ── Capture KIMMP governing synthesis ────────────────────────────────────────
  // Call after triggerLoop() synthesis — captures the cross-system reasoning.

  static captureSynthesis(params: {
    systemPrompt: string
    userPrompt:   string
    completion:   string
    dispatchId?:  string
  }): void {
    WaandaTrainingPipeline.write({
      exampleType:  'SYNTHESIS',
      system:       'KIMMP',
      systemPrompt: params.systemPrompt,
      userPrompt:   params.userPrompt,
      completion:   params.completion,
      dispatchId:   params.dispatchId,
    }).catch(() => {})
  }

  // ── Apply operator feedback as quality label ─────────────────────────────────
  // Called from SystemLearning.recordFeedback() after operator rates a briefing.
  // ACCEPTED   → qualityScore 1.0 — strong positive example
  // DISMISSED  → qualityScore 0.1 — negative example (used for DPO pairs)
  // CORRECTED  → qualityScore 0.0 — negative + stores correction as ideal output

  static async applyFeedback(params: {
    dispatchId:  string
    feedback:    'ACCEPTED' | 'DISMISSED' | 'CORRECTED'
    correction?: string
  }): Promise<void> {
    const qualityScore =
      params.feedback === 'ACCEPTED'  ? 1.0 :
      params.feedback === 'DISMISSED' ? 0.1 :
      0.0   // CORRECTED

    try {
      await (prisma as any).waandaTrainingExample.updateMany({
        where: { dispatchId: params.dispatchId },
        data: {
          feedback:     params.feedback,
          correction:   params.correction ?? null,
          qualityScore,
        },
      })
      logger.debug(`[WAANDA:TRAIN] Feedback applied: ${params.dispatchId} → ${params.feedback} (score ${qualityScore})`)
    } catch (err: any) {
      logger.debug('[WAANDA:TRAIN] Feedback apply failed: ' + err.message)
    }
  }

  // ── Capture an HANUMANAS governance decision ────────────────────────────────────
  // Called from aegisActionProposer.ts after the LLM chooses governance actions.
  // Teaches Gen 2 WAANDA: "given this security finding, here is the right action."

  static captureGovernanceDecision(params: {
    agentId:      string
    engine:       string
    verdict:      string
    systemPrompt: string
    userPrompt:   string   // the serialized AegisAgentResult
    completion:   string   // the raw JSON action array from LLM
  }): void {
    WaandaTrainingPipeline.write({
      exampleType:  'REASON',
      system:       `HANUMANAS:${params.engine}`,
      trigger:      params.verdict,
      systemPrompt: params.systemPrompt,
      userPrompt:   params.userPrompt,
      completion:   params.completion,
      agentsUsed:   [params.agentId],
      priority:     params.verdict === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
    }).catch(() => {})
  }

  // ── Dataset statistics ────────────────────────────────────────────────────────

  static async stats(): Promise<{
    total:          number
    byType:         Record<ExampleType, number>
    bySystem:       Record<string, number>
    byFeedback:     Record<string, number>
    exportReady:    number   // ACCEPTED or unlabelled — positive training signal
    negativePairs:  number   // DISMISSED — usable for DPO
    unexported:     number
    estimatedReadyForFinetune: boolean
  }> {
    try {
      const [total, byTypeRows, bySystemRows, byFeedbackRows, exportReady, negative, unexported] = await Promise.all([
        (prisma as any).waandaTrainingExample.count(),
        (prisma as any).waandaTrainingExample.groupBy({ by: ['exampleType'], _count: { _all: true } }),
        (prisma as any).waandaTrainingExample.groupBy({ by: ['system'],      _count: { _all: true }, where: { system: { not: null } } }),
        (prisma as any).waandaTrainingExample.groupBy({ by: ['feedback'],    _count: { _all: true }, where: { feedback: { not: null } } }),
        (prisma as any).waandaTrainingExample.count({ where: { OR: [{ feedback: 'ACCEPTED' }, { feedback: null }] } }),
        (prisma as any).waandaTrainingExample.count({ where: { feedback: 'DISMISSED' } }),
        (prisma as any).waandaTrainingExample.count({ where: { exported: false } }),
      ])

      const byType:     Record<string, number> = {}
      const bySystem:   Record<string, number> = {}
      const byFeedback: Record<string, number> = {}

      for (const r of byTypeRows     as any[]) byType    [r.exampleType] = r._count._all
      for (const r of bySystemRows   as any[]) bySystem  [r.system]      = r._count._all
      for (const r of byFeedbackRows as any[]) byFeedback[r.feedback ?? 'unlabelled'] = r._count._all

      return {
        total,
        byType:        byType     as Record<ExampleType, number>,
        bySystem,
        byFeedback,
        exportReady,
        negativePairs: negative,
        unexported,
        // Rough threshold: 1,000+ examples is enough for a first QLoRA fine-tune
        estimatedReadyForFinetune: exportReady >= 1000,
      }
    } catch {
      return {
        total: 0, byType: {} as any, bySystem: {}, byFeedback: {},
        exportReady: 0, negativePairs: 0, unexported: 0, estimatedReadyForFinetune: false,
      }
    }
  }
}
