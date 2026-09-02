import { prisma } from '../../../lib/prisma'
import { callLLM } from '../../esf/hanumanas/agents/llm'

const SYSTEM = `You are KIMMP's INCIDENT_RESPONDER — Kangqore's ITIL triage AI.
When a new incident is reported: (1) confirm the priority is correct, (2) identify the most likely root cause, (3) recommend immediate containment steps, (4) draft a professional initial response.
Write 3–4 sentences, ITIL-style. Be direct and actionable.`

export async function runIncidentResponder(
  incidentId: string,
  title: string,
  description: string,
  priority: string,
  category: string,
): Promise<string> {
  const similar = await (prisma as any).incident.findMany({
    where:   { category, status: 'RESOLVED', resolution: { not: null }, id: { not: incidentId } },
    orderBy: { resolvedAt: 'desc' },
    take:    5,
    select:  { number: true, title: true, resolution: true },
  }).catch(() => [])

  const similarText = (similar as any[])
    .map((i: any) => `  [${i.number}] ${i.title} → ${i.resolution}`)
    .join('\n') || '  None found'

  const userPrompt = `New Incident [${priority}]: ${title}
Category: ${category}
Description: ${description}

Similar resolved incidents:
${similarText}

Provide: (1) priority validation, (2) likely cause, (3) containment steps, (4) initial response to reporter.`

  const draft = await callLLM(SYSTEM, userPrompt, 400)

  if (draft) {
    await (prisma as any).incident.update({
      where: { id: incidentId },
      data:  { aiDraft: draft },
    }).catch(() => null)
  }

  return draft || ''
}
