// Client Onboarding board — over the pipeline that actually exists.
//
// An earlier version of this file invented seven stages (Kickoff, Platform
// Setup, Training, Go-Live, Handover…) lifted from CSOnboarding.tsx, a mock file
// containing five fabricated clients. Two of those stages provisioned nothing.
// It was a generic SaaS pattern sitting next to, and duplicating, the real
// pipeline.
//
// The real one is `BidsEngagement.status` — an eight-value enum every step of
// which is already written and transitioned by live code:
//
//   DRAFT               contact.ts:316          client submits the BIDS request
//   INTAKE_IN_PROGRESS  bids.ts:399             team activates → creates User(CLIENT)
//   WAANDA_PROCESSING   bids-client.ts:129      client submits the 16-pillar intake
//   WAANDA_DRAFT        bidsDiagnosticAgent:296 WAANDA produces the diagnostic
//   CONSULTANT_REVIEW   bids.ts:192             a consultant reviews it
//   ACTIVE              bids.ts:279-329         creates Project + Deliverables + Objectives
//
// This board is a view over that, not a second pipeline beside it.
//
// The important honesty: a team member cannot drag a card to every column.
// Three transitions are driven by someone else — the client submitting an
// intake, WAANDA producing a diagnostic — and the board says so rather than
// offering a control that would lie.

import { prisma } from '../../lib/prisma'

export const ONBOARDING_STAGES = [
  'DRAFT',
  'INTAKE_IN_PROGRESS',
  'WAANDA_PROCESSING',
  'WAANDA_DRAFT',
  'CONSULTANT_REVIEW',
  'ACTIVE',
] as const

export type OnboardingStage = (typeof ONBOARDING_STAGES)[number]

/** Who moves a card into this column. */
export type Driver = 'TEAM' | 'CLIENT' | 'WAANDA'

export const STAGE_META: Record<
  OnboardingStage,
  { label: string; color: string; driver: Driver; description: string; effect: string }
> = {
  DRAFT: {
    label: 'Request received', color: '#94a3b8', driver: 'TEAM',
    description: 'Enquiry captured, not yet activated',
    effect: 'Creates the CRM record and primary contact',
  },
  INTAKE_IN_PROGRESS: {
    label: 'Client activated', color: '#6366f1', driver: 'TEAM',
    description: 'Portal account created, intake open',
    effect: 'Creates User(role=CLIENT) with BIDS access and opens the 16-pillar intake',
  },
  WAANDA_PROCESSING: {
    label: 'Intake submitted', color: '#0ea5e9', driver: 'CLIENT',
    description: 'Waiting on the client to finish their intake',
    effect: 'The client submits the intake — the team cannot do this for them',
  },
  WAANDA_DRAFT: {
    label: 'Diagnostic ready', color: '#f59e0b', driver: 'WAANDA',
    description: 'Waiting on WAANDA to produce the diagnostic',
    effect: 'BidsDiagnosticAgent scores the 16 pillars and drafts the roadmap',
  },
  CONSULTANT_REVIEW: {
    label: 'Consultant review', color: '#8b5cf6', driver: 'TEAM',
    description: 'A consultant is reviewing the diagnostic',
    effect: 'Records consultant notes and adjusted pillar scores',
  },
  ACTIVE: {
    label: 'Engagement live', color: '#10b981', driver: 'TEAM',
    description: 'Roadmap accepted, delivery running',
    effect: 'Creates the Project, a Deliverable per roadmap phase, and BusinessObjectives',
  },
}

export interface TransitionEffect {
  step: string
  status: 'DONE' | 'SKIPPED' | 'BLOCKED'
  detail: string
}

function indexOf(s: OnboardingStage) { return ONBOARDING_STAGES.indexOf(s) }

export const ClientOnboardingService = {
  ONBOARDING_STAGES,
  STAGE_META,

  /** The board: every engagement, grouped by the status it genuinely holds. */
  async board() {
    const engagements = await prisma.bidsEngagement.findMany({
      orderBy: { updatedAt: 'desc' },
    })

    const groups = ONBOARDING_STAGES.map(stage => ({
      id: stage,
      ...STAGE_META[stage],
      items: engagements
        .filter(e => String(e.status) === stage)
        .map(e => this.toCard(e)),
    }))

    // Anything in a lifecycle state that is not part of the onboarding path.
    const offPipeline = engagements.filter(
      e => !ONBOARDING_STAGES.includes(String(e.status) as OnboardingStage),
    )

    return {
      groups,
      total: engagements.length,
      inProgress: engagements.filter(
        e => !['DRAFT', 'ACTIVE'].includes(String(e.status)),
      ).length,
      offPipeline: offPipeline.map(e => ({ ...this.toCard(e), status: String(e.status) })),
    }
  },

  toCard(e: any) {
    const intake = (e.intakeData ?? {}) as any
    const started = e.startedAt ? new Date(e.startedAt) : null
    return {
      id: e.id,
      name: e.clientName,
      industry: e.industry,
      stage: String(e.status),
      contactEmail: intake.email ?? null,
      contactName: intake.fullName ?? null,
      source: intake.source ?? null,
      clientUserId: e.clientUserId,
      hasPortalAccess: !!e.clientUserId,
      hasIntake: !!(e.intakeData && Object.keys(intake).length > 3),
      startedAt: e.startedAt,
      daysInPipeline: started
        ? Math.max(0, Math.round((Date.now() - started.getTime()) / 86_400_000))
        : null,
    }
  },

  /**
   * Move an engagement forward.
   *
   * Only transitions whose driver is TEAM are permitted here. The other two are
   * refused with an explanation rather than faked — a board that lets you drag a
   * card into "Intake submitted" when the client has not submitted anything is
   * a board that lies.
   */
  async moveToStage(engagementId: string, to: OnboardingStage, actorId: string) {
    if (!ONBOARDING_STAGES.includes(to)) throw new Error(`Unknown stage "${to}"`)

    const e: any = await prisma.bidsEngagement.findUnique({ where: { id: engagementId } })
    if (!e) throw new Error('Engagement not found')

    const from = String(e.status) as OnboardingStage
    const effects: TransitionEffect[] = []
    const meta = STAGE_META[to]

    if (from === to) {
      return { engagementId, from, to, moved: false, effects, engagement: this.toCard(e) }
    }

    if (meta.driver !== 'TEAM') {
      effects.push({
        step: meta.label,
        status: 'BLOCKED',
        detail:
          meta.driver === 'CLIENT'
            ? 'Only the client can advance this — they must submit their intake from the portal.'
            : 'WAANDA advances this once the diagnostic finishes. It cannot be set by hand.',
      })
      return { engagementId, from, to, moved: false, effects, engagement: this.toCard(e) }
    }

    // Guard the preconditions the real routes enforce, rather than letting a
    // drag create a half-provisioned engagement.
    if (to === 'ACTIVE' && !e.clientUserId) {
      effects.push({
        step: 'Engagement live',
        status: 'BLOCKED',
        detail: 'No client account yet — activate the client first so the Project has an owner.',
      })
      return { engagementId, from, to, moved: false, effects, engagement: this.toCard(e) }
    }

    if (indexOf(to) < indexOf(from)) {
      effects.push({
        step: 'Moved back',
        status: 'DONE',
        detail: `Corrected to ${meta.label}. Nothing already provisioned was reversed.`,
      })
    } else {
      effects.push({ step: meta.label, status: 'DONE', detail: meta.effect })
    }

    const updated = await prisma.bidsEngagement.update({
      where: { id: engagementId },
      data: {
        status: to as any,
        startedAt: e.startedAt ?? (to !== 'DRAFT' ? new Date() : null),
      },
    })

    return { engagementId, from, to, moved: true, effects, engagement: this.toCard(updated) }
  },

  /** Add an enquiry to the board — the same record contact.ts creates. */
  async createEngagement(input: {
    clientName: string
    industry?: string
    contactName?: string
    contactEmail?: string
    actorId: string
  }) {
    if (!input.clientName?.trim()) throw new Error('clientName is required')

    const e = await prisma.bidsEngagement.create({
      data: {
        clientName: input.clientName.trim(),
        industry: input.industry?.trim() || 'Other',
        status: 'DRAFT' as any,
        intakeData: {
          fullName: input.contactName ?? null,
          email: input.contactEmail ?? null,
          company: input.clientName.trim(),
          source: 'onboarding-board',
        } as any,
      },
    })
    return this.toCard(e)
  },
}
