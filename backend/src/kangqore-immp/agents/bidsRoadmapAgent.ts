// ---------------------------------------------------------------------------
// BIDS™ Roadmap Agent — WAANDA-powered Transformation Roadmap generator
//
// Takes: approved 16-pillar scores + recommendations + client context
// Produces: structured 30/60/90/180-day Transformation Roadmap JSON
//   → phases[]     : each with goals[] + projects[]
//   → servicePrescriptions[] : pillar gaps → Kangqore service recommendations
//
// Called by: POST /api/admin/bids/engagements/:id/generate-roadmap
// Output: stored to BidsEngagement.roadmap + .roadmapGeneratedAt
// ---------------------------------------------------------------------------

import { prisma } from '../../lib/prisma'
import logger from '../../utils/logger'
import { sonnetWithTools, textOf } from '../llm/kimmpLLMRouter'
import { KimmpRag } from '../rag/kimmpRag.service'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RoadmapGoal {
  title:         string
  pillarId:      number
  pillarName:    string
  successMetric: string
  category:      string
}

export interface RoadmapProject {
  title:           string
  description:     string
  linkedPillarIds: number[]
  durationWeeks:   number
  category:        string
  type:            'Assessment' | 'Implementation' | 'Training' | 'Governance' | 'Migration'
}

export interface RoadmapPhase {
  horizon:  '30-day' | '60-day' | '90-day' | '180-day'
  label:    string
  focus:    string
  priority: 'Critical' | 'High' | 'Medium'
  goals:    RoadmapGoal[]
  projects: RoadmapProject[]
}

export interface ServicePrescription {
  pillarId:           number
  pillarName:         string
  currentScore:       number
  targetScore:        number
  recommendedService: string
  rationale:          string
  displaces:          string[]  // tools/processes this service replaces
  competitorContext:  string    // why Kangqore View is better than the incumbent for this pillar
}

export interface TransformationRoadmap {
  phases:               RoadmapPhase[]
  servicePrescriptions: ServicePrescription[]
}

interface PillarScore {
  pillarId: number; pillarName: string; score: number; maturity: string
  finding: string; recommendations: string[]
}

export interface BidsRoadmapInput {
  engagementId: string
  clientName:   string
  industry:     string
  pillarScores: PillarScore[]
}

// ─── Kangqore service catalogue (deterministic mapping used as seed context) ──

const SERVICE_CATALOGUE = [
  'AI Readiness & Deployment Programme',
  'Data Foundation & Governance Programme',
  'Automation & Process Intelligence Programme',
  'Cloud Migration & Infrastructure Modernisation',
  'Cybersecurity Posture & Compliance Programme',
  'Digital Transformation Strategy Programme',
  'Operational Excellence Programme',
  'Executive Leadership Intelligence Programme',
  'Revenue Engine & Growth Strategy Programme',
  'Enterprise Platform Consolidation Programme',
  'Workforce Skills & Change Management Programme',
  'Governance, Risk & Compliance Programme',
]

// ─── Agent ────────────────────────────────────────────────────────────────────

async function generate(input: BidsRoadmapInput): Promise<TransformationRoadmap> {
  const overallScore = Math.round(
    input.pillarScores.reduce((s, p) => s + p.score, 0) / input.pillarScores.length
  )

  const weakest  = [...input.pillarScores].sort((a, b) => a.score - b.score).slice(0, 6)
  const critical = weakest.filter(p => p.score < 40)
  const high     = weakest.filter(p => p.score >= 40 && p.score < 55)

  const system = `You are WAANDA — Kangqore's enterprise intelligence system. You are producing a Transformation Roadmap from a completed BIDS™ diagnostic assessment. Your output is a precise, actionable roadmap that converts diagnostic findings into a structured implementation plan with 4 time-bound phases.

KANGQORE SERVICE CATALOGUE (use these exact names for service prescriptions):
${SERVICE_CATALOGUE.map((s, i) => `${i + 1}. ${s}`).join('\n')}

OUTPUT FORMAT: Respond ONLY with valid JSON matching this exact structure (no markdown, no explanation):
{
  "phases": [
    {
      "horizon": "30-day",
      "label": "String — phase name (e.g., 'Critical Risk Mitigation')",
      "focus": "String — 1 sentence describing the strategic focus of this phase",
      "priority": "Critical",
      "goals": [
        {
          "title": "String — specific, measurable goal",
          "pillarId": 12,
          "pillarName": "AI Intelligence™",
          "successMetric": "String — how success is measured",
          "category": "String — one of: Strategy, Technology, Operations, Security, Data, People, Governance"
        }
      ],
      "projects": [
        {
          "title": "String — project name",
          "description": "String — 1 sentence describing what this project delivers",
          "linkedPillarIds": [12, 15],
          "durationWeeks": 4,
          "category": "String",
          "type": "Governance"
        }
      ]
    }
    // exactly 4 phases: 30-day (priority: Critical), 60-day (High), 90-day (High), 180-day (Medium)
  ],
  "servicePrescriptions": [
    {
      "pillarId": 12,
      "pillarName": "AI Intelligence™",
      "currentScore": 28,
      "targetScore": 65,
      "recommendedService": "AI Readiness & Deployment Programme",
      "rationale": "String — 1 sentence explaining why this service addresses the gap",
      "displaces": ["Salesforce Einstein", "Monday AI", "manual Excel analysis"],
      "competitorContext": "String — 1 sentence on why Kangqore View delivers superior results for this pillar vs the displaced tools"
    }
    // one prescription per pillar scoring below 65 (max 8 prescriptions)
  ]
}

ROADMAP RULES:
- 30-day phase: address CRITICAL gaps (score < 40) — governance, quick wins, risk reduction
- 60-day phase: address HIGH gaps (score 40–54) — foundational programmes, assessments
- 90-day phase: address MEDIUM gaps (score 55–64) — capability building, process improvement
- 180-day phase: strategic transformation — technology modernisation, growth programmes
- Each phase should have 2–4 goals and 2–3 projects
- Goals must be specific to THIS client's weakest pillars
- Projects must be actionable and deliverable within the phase horizon
- Service prescriptions: only for pillars scoring below 65; max 8 prescriptions; use EXACT service names from the catalogue
- For each prescription, populate "displaces" with 1–3 specific tools/processes this Kangqore service replaces. Use these reference mappings:
  • Pillar 1 (Strategy): displaces ["generic strategy consultants", "manual planning spreadsheets"]
  • Pillars 4,5 (Operations, Project Management): displaces ["ClickUp", "Asana", "Monday.com", "manual Excel tracking"]
  • Pillar 7 (Financial Intelligence): displaces ["QuickBooks standalone", "manual financial reports"]
  • Pillar 11 (Data Intelligence): displaces ["Power BI standalone", "Palantir Foundry (for governance aspects)", "manual data reporting"]
  • Pillar 12 (AI Intelligence): displaces ["Salesforce Einstein", "SAP Joule", "Monday AI", "ChatGPT ad-hoc usage"]
  • Pillar 13 (Digital Experience): displaces ["legacy CMS platforms", "fragmented marketing tools"]
  • Pillar 14 (Cybersecurity): displaces ["manual security audits", "standalone SIEM tools", "spreadsheet risk registers"]
  • Pillar 15 (Governance & Risk): displaces ["ServiceNow GRC", "manual compliance spreadsheets", "standalone audit tools"]
  • Pillar 16 (Enterprise Architecture): displaces ["SAP standalone modules", "legacy ERP configuration", "manual integration layers"]
- For "competitorContext", write 1 sentence explaining why Kangqore View's diagnostic-first + WAANDA approach delivers better ROI than the displaced tool for this specific pillar. Be specific about the client's score.`

  const user = `CLIENT: ${input.clientName}
INDUSTRY: ${input.industry}
OVERALL SCORE: ${overallScore}/100

CRITICAL GAPS (score < 40 — must address in 30-day phase):
${critical.length > 0 ? critical.map(p => `• [${p.score}] ${p.pillarName}: ${p.finding}`).join('\n') : '(none)'}

HIGH PRIORITY GAPS (score 40–54 — address in 60-day phase):
${high.length > 0 ? high.map(p => `• [${p.score}] ${p.pillarName}: ${p.finding}`).join('\n') : '(none)'}

ALL PILLAR SCORES (sorted by priority):
${[...input.pillarScores].sort((a, b) => a.score - b.score).map(p => `• [${p.score}] ${p.pillarName} (${p.maturity})`).join('\n')}

TOP RECOMMENDATIONS FROM DIAGNOSTIC:
${weakest.flatMap(p => p.recommendations.slice(0, 2).map(r => `• ${p.pillarName}: ${r}`)).join('\n')}

Generate the Transformation Roadmap now. Return ONLY the JSON object.`

  // Ground roadmap generation with KB context for this industry
  const { contextBlock } = await KimmpRag.query(
    `${input.industry} digital transformation roadmap best practices`, 3
  ).catch(() => ({ contextBlock: '', chunkCount: 0 }))

  const systemWithRag = contextBlock
    ? `${system}\n\n## Kangqore Knowledge Base\n${contextBlock}`
    : system

  const res  = await sonnetWithTools(systemWithRag, user, 3000, 'intelligence', { agentType: 'BIDS_ROADMAP', agentSystem: 'BIDS' })
  const raw  = textOf(res).trim()
  const json = raw.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim()

  try {
    const parsed = JSON.parse(json) as TransformationRoadmap
    if (!Array.isArray(parsed.phases) || parsed.phases.length === 0) {
      throw new Error('No phases in response')
    }
    return parsed
  } catch (err) {
    logger.error('[BIDS:ROADMAP] Failed to parse roadmap JSON', raw.slice(0, 300))
    // Return a minimal fallback so the engagement doesn't get stuck
    return buildFallbackRoadmap(input, overallScore)
  }
}

function buildFallbackRoadmap(input: BidsRoadmapInput, overallScore: number): TransformationRoadmap {
  const weakest = [...input.pillarScores].sort((a, b) => a.score - b.score).slice(0, 4)

  return {
    phases: [
      {
        horizon:  '30-day',
        label:    'Critical Risk Mitigation',
        focus:    'Address the highest-risk diagnostic findings and establish governance foundations.',
        priority: 'Critical',
        goals:    weakest.slice(0, 2).map(p => ({
          title:         `Improve ${p.pillarName.replace('™', '')}`,
          pillarId:      p.pillarId,
          pillarName:    p.pillarName,
          successMetric: p.recommendations[0] ?? `Score improvement in ${p.pillarName}`,
          category:      'Governance',
        })),
        projects: [
          {
            title:           'Diagnostic Quick Wins Programme',
            description:     'Address the most critical findings from the BIDS™ diagnostic assessment.',
            linkedPillarIds: weakest.slice(0, 2).map(p => p.pillarId),
            durationWeeks:   4,
            category:        'Governance',
            type:            'Assessment',
          },
        ],
      },
      {
        horizon:  '60-day',
        label:    'Foundation Building',
        focus:    'Establish core capabilities and address high-priority gaps.',
        priority: 'High',
        goals:    weakest.slice(2, 4).map(p => ({
          title:         `Strengthen ${p.pillarName.replace('™', '')}`,
          pillarId:      p.pillarId,
          pillarName:    p.pillarName,
          successMetric: p.recommendations[0] ?? `Measurable improvement in ${p.pillarName}`,
          category:      'Technology',
        })),
        projects: [
          {
            title:           'Capability Foundation Programme',
            description:     'Build foundational capabilities across priority areas identified in the diagnostic.',
            linkedPillarIds: weakest.slice(2, 4).map(p => p.pillarId),
            durationWeeks:   8,
            category:        'Technology',
            type:            'Implementation',
          },
        ],
      },
      {
        horizon:  '90-day',
        label:    'Capability Development',
        focus:    'Scale improvements and build organisational capability.',
        priority: 'High',
        goals:    [],
        projects: [
          {
            title:           'Transformation Acceleration Programme',
            description:     'Scale diagnostic improvements across the organisation.',
            linkedPillarIds: input.pillarScores.slice(0, 3).map(p => p.pillarId),
            durationWeeks:   12,
            category:        'Operations',
            type:            'Training',
          },
        ],
      },
      {
        horizon:  '180-day',
        label:    'Strategic Transformation',
        focus:    'Achieve target maturity levels and position for long-term competitive advantage.',
        priority: 'Medium',
        goals:    [],
        projects: [
          {
            title:           'Enterprise Transformation Programme',
            description:     'Drive strategic modernisation aligned to BIDS™ roadmap targets.',
            linkedPillarIds: input.pillarScores.map(p => p.pillarId),
            durationWeeks:   24,
            category:        'Strategy',
            type:            'Implementation',
          },
        ],
      },
    ],
    servicePrescriptions: input.pillarScores
      .filter(p => p.score < 65)
      .slice(0, 6)
      .map(p => ({
        pillarId:           p.pillarId,
        pillarName:         p.pillarName,
        currentScore:       p.score,
        targetScore:        Math.min(p.score + 30, 80),
        recommendedService: SERVICE_CATALOGUE[p.pillarId % SERVICE_CATALOGUE.length],
        rationale:          p.recommendations[0] ?? `Targeted intervention required to improve ${p.pillarName} maturity.`,
        displaces:          [],
        competitorContext:  '',
      })),
  }
}

// ─── Main Entry Point ─────────────────────────────────────────────────────────

export class BidsRoadmapAgent {
  static async run(input: BidsRoadmapInput): Promise<TransformationRoadmap> {
    logger.info(`[BIDS:ROADMAP] Generating for engagement ${input.engagementId} — ${input.clientName}`)
    const start = Date.now()

    const roadmap = await generate(input)

    await prisma.bidsEngagement.update({
      where: { id: input.engagementId },
      data: {
        roadmap:            roadmap as any,
        roadmapGeneratedAt: new Date(),
      },
    })

    logger.info(`[BIDS:ROADMAP] Done in ${Date.now() - start}ms — ${roadmap.phases.length} phases, ${roadmap.servicePrescriptions.length} prescriptions`)
    return roadmap
  }
}
