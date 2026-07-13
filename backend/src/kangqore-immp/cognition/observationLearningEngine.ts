// ---------------------------------------------------------------------------
// Observation & Learning Engine — Levels 1 + 2
// Transforms evidence into observations (what happened / why)
// and lessons (what it means / policy implications).
// Two Haiku calls per evidence artifact: one to observe, one to learn.
// ---------------------------------------------------------------------------

import { prisma }       from '../../lib/prisma';
import { haiku, textOf } from '../llm/kimmpLLMRouter';
import { cognitionBus } from './cognitionBus';

const SYSTEM_OBSERVE =
  'You are WAANDA, the enterprise cognition system. Given raw execution data, ' +
  'produce a structured observation. Answer two questions in JSON: ' +
  '{"whatHappened":"...(one sentence)","whyItHappened":"...(one sentence)"}. ' +
  'Be factual. No markdown. No opinions.';

const SYSTEM_LEARN =
  'You are WAANDA. Given an enterprise observation, extract the lesson and note any policy implication. ' +
  'Reply in JSON: {"lesson":"...(one sentence)","policyChange":"...(one sentence or null)"}. ' +
  'policyChange is non-null only when this observation clearly implies a standing rule change. ' +
  'No markdown.';

function confidenceFromEvidenceCount(n: number): number {
  if (n >= 20) return 0.95;
  if (n >= 10) return 0.85;
  if (n >= 5)  return 0.75;
  if (n >= 3)  return 0.65;
  return 0.50;
}

function tagsFromRaw(raw: unknown, domain: string): string[] {
  const base = [domain];
  try {
    const r = raw as any;
    if (r.decisionType) base.push(r.decisionType.toLowerCase());
    if (r.targetModule)  base.push(r.targetModule.toLowerCase());
    if (r.outcome)       base.push(r.outcome.toLowerCase().split(' ')[0]);
  } catch { /* ignore */ }
  return [...new Set(base)];
}

export class ObservationLearningEngine {
  static async observe(evidenceId: string): Promise<any> {
    const ev = await (prisma as any).enterpriseEvidence.findUnique({ where: { id: evidenceId } });
    if (!ev) throw new Error(`EnterpriseEvidence ${evidenceId} not found`);

    const userPrompt = `Domain: ${ev.domain}\nTier: ${ev.tier}\nRaw data: ${JSON.stringify(ev.rawData).slice(0, 600)}`;

    let whatHappened  = 'An enterprise event occurred.';
    let whyItHappened = 'Context was not fully captured.';

    try {
      const res  = await haiku(SYSTEM_OBSERVE, userPrompt, 120, { hint: 'cognition-observe' });
      const text = textOf(res).trim();
      const parsed = JSON.parse(text);
      if (parsed.whatHappened)  whatHappened  = parsed.whatHappened;
      if (parsed.whyItHappened) whyItHappened = parsed.whyItHappened;
    } catch { /* degrade gracefully */ }

    const observation = await (prisma as any).enterpriseObservation.create({
      data: {
        evidenceId,
        domain:       ev.domain,
        tier:         ev.tier,
        whatHappened,
        whyItHappened,
        confidence:   0.70,
        evidenceCount: 1,
        tags:          tagsFromRaw(ev.rawData, ev.domain),
      },
    });

    cognitionBus.publish({
      type:        'observation_created',
      artifactId:  observation.id,
      artifactType: 'EnterpriseObservation',
      domain:      observation.domain,
      payload:     observation,
      emittedAt:   new Date(),
    });

    return observation;
  }

  static async learn(observationId: string): Promise<any> {
    const obs = await (prisma as any).enterpriseObservation.findUnique({ where: { id: observationId } });
    if (!obs) throw new Error(`EnterpriseObservation ${observationId} not found`);

    const userPrompt = `Domain: ${obs.domain}\nWhat happened: ${obs.whatHappened}\nWhy: ${obs.whyItHappened}`;

    let lesson       = 'This event provides data for future calibration.';
    let policyChange: string | null = null;

    try {
      const res  = await haiku(SYSTEM_LEARN, userPrompt, 120, { hint: 'cognition-learn' });
      const text = textOf(res).trim();
      const parsed = JSON.parse(text);
      if (parsed.lesson)       lesson       = parsed.lesson;
      if (parsed.policyChange) policyChange = parsed.policyChange;
    } catch { /* degrade gracefully */ }

    const lessonRow = await (prisma as any).enterpriseLesson.create({
      data: {
        observationId,
        domain:       obs.domain,
        tier:         obs.tier,
        lesson,
        policyChange,
        confidence:   confidenceFromEvidenceCount(1),
        evidenceCount: 1,
        tags:          obs.tags,
      },
    });

    // Wire junction
    await (prisma as any).enterpriseLessonInsight.create({
      data: { lessonId: lessonRow.id, insightId: lessonRow.id },
    }).catch(() => null); // no insight yet — linked to self as placeholder, handled by InsightEngine

    cognitionBus.publish({
      type:        'lesson_created',
      artifactId:  lessonRow.id,
      artifactType: 'EnterpriseLesson',
      domain:      lessonRow.domain,
      payload:     lessonRow,
      emittedAt:   new Date(),
    });

    // Gen 2 training capture — every lesson is a training example
    prisma.waandaTrainingExample.create({ data: {
      exampleType:  'SYNTHESIS',
      system:       'KIMMP',
      curriculum:   'EXECUTIVE',
      trigger:      'cognition:lesson_created',
      modelVersion: 'claude-haiku-4-5-20251001',
      systemPrompt: SYSTEM_LEARN,
      userPrompt,
      completion:   JSON.stringify({ lesson, policyChange }),
      alpacaFormat: { instruction: SYSTEM_LEARN, input: userPrompt, output: JSON.stringify({ lesson, policyChange }) },
    } }).catch(() => null);

    return lessonRow;
  }

  static async process(evidenceId: string): Promise<{ observation: any; lesson: any }> {
    const observation = await this.observe(evidenceId);
    const lesson      = await this.learn(observation.id);
    return { observation, lesson };
  }
}
