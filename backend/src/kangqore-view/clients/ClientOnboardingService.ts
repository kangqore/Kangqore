// Client Onboarding — the board where a team member onboards a client.
//
// The board IS the workflow. A client is a row; onboarding is its stage; moving
// the row between groups is what performs the work. There is no wizard and no
// separate onboarding module.
//
// What makes this different from the same board in Monday: moving a card does
// not just change a colour. Each transition runs real provisioning — creating
// the portal login, granting access, provisioning the first project, opening
// the Day-0 milestone — and every one of those is recorded.
//
// Transitions are idempotent: dragging a card back and forth does not create a
// second user or a second project. Each step checks for its own prior effect
// before acting, because a board is a surface people fidget with.

import { prisma } from '../../lib/prisma'
import { hashPassword } from '../../utils/password'
import crypto from 'crypto'

export const ONBOARDING_STAGES = [
  'PROSPECT',
  'KICKOFF',
  'PLATFORM_SETUP',
  'TRAINING',
  'GO_LIVE',
  'HANDOVER',
  'ACTIVE',
] as const

export type OnboardingStage = (typeof ONBOARDING_STAGES)[number]

/** Board group presentation. Colours carried over from the CS team's own model. */
export const STAGE_META: Record<OnboardingStage, { label: string; color: string; description: string }> = {
  PROSPECT:       { label: 'Prospect',       color: '#94a3b8', description: 'Identified, not yet started' },
  KICKOFF:        { label: 'Kickoff',        color: '#6366f1', description: 'Account created, kickoff booked' },
  PLATFORM_SETUP: { label: 'Platform Setup', color: '#0ea5e9', description: 'Portal access granted, workspace prepared' },
  TRAINING:       { label: 'Training',       color: '#f59e0b', description: 'Team onboarded, first project running' },
  GO_LIVE:        { label: 'Go-Live',        color: '#10b981', description: 'Live on the platform' },
  HANDOVER:       { label: 'Handover',       color: '#8b5cf6', description: 'Transitioning to steady-state CS' },
  ACTIVE:         { label: 'Active',         color: '#22c55e', description: 'Fully onboarded' },
}

export interface TransitionEffect {
  step: string
  status: 'DONE' | 'SKIPPED' | 'FAILED'
  detail: string
}

export interface TransitionResult {
  clientId: string
  from: OnboardingStage
  to: OnboardingStage
  effects: TransitionEffect[]
  client: any
}

function isForward(from: OnboardingStage, to: OnboardingStage): boolean {
  return ONBOARDING_STAGES.indexOf(to) > ONBOARDING_STAGES.indexOf(from)
}

// ── Provisioning steps ────────────────────────────────────────────────────────
// Each returns an effect describing what it did, so the board can show it.

/** KICKOFF — the client becomes a real person who can eventually log in. */
async function ensureClientUser(client: any, actorId: string): Promise<TransitionEffect> {
  if (client.userId) {
    return { step: 'Client account', status: 'SKIPPED', detail: 'Account already exists' }
  }

  const primary = client.contacts?.find((c: any) => c.isPrimary) ?? client.contacts?.[0]
  if (!primary?.email) {
    return { step: 'Client account', status: 'FAILED', detail: 'No contact with an email address — add a primary contact first' }
  }

  const existing = await prisma.user.findUnique({ where: { email: primary.email } })
  if (existing) {
    await prisma.clientCRM.update({ where: { id: client.id }, data: { userId: existing.id } })
    return { step: 'Client account', status: 'SKIPPED', detail: `Linked existing user ${primary.email}` }
  }

  // No password is set. The invite step sends a set-password link, so a
  // half-onboarded client can never be logged into.
  const user = await prisma.user.create({
    data: {
      email: primary.email,
      name: primary.name || client.name,
      company: client.name,
      password: await hashPassword(crypto.randomBytes(24).toString('hex')),
      role: 'CLIENT' as any,
      status: 'ACTIVE',
    },
  })

  await prisma.clientProfile.create({
    data: { userId: user.id, interestedServices: [] },
  }).catch(() => null)

  await prisma.clientCRM.update({ where: { id: client.id }, data: { userId: user.id } })

  return { step: 'Client account', status: 'DONE', detail: `Created ${primary.email} with a client profile` }
}

/** PLATFORM_SETUP — they can now actually reach the portal. */
async function grantPortalAccess(client: any): Promise<TransitionEffect> {
  if (!client.userId) {
    return { step: 'Portal access', status: 'FAILED', detail: 'No client account yet — move through Kickoff first' }
  }
  await prisma.user.update({
    where: { id: client.userId },
    data: { status: 'ACTIVE' },
  })
  return { step: 'Portal access', status: 'DONE', detail: 'Portal enabled; invite can be sent' }
}

/** TRAINING — there is now real work for them to look at. */
async function provisionFirstProject(client: any, actorId: string): Promise<TransitionEffect> {
  if (!client.userId) {
    return { step: 'First project', status: 'FAILED', detail: 'No client account yet' }
  }
  const existing = await prisma.project.findFirst({ where: { clientId: client.userId } })
  if (existing) {
    return { step: 'First project', status: 'SKIPPED', detail: `Already has "${existing.title}"` }
  }

  const project = await prisma.project.create({
    data: {
      title: `${client.name} — Onboarding`,
      description: `Initial engagement created during onboarding for ${client.name}.`,
      clientId: client.userId,
      status: 'ACTIVE' as any,
      progress: 0,
      health: 100,
      dueDate: new Date(Date.now() + 90 * 86_400_000),
    },
  })
  return { step: 'First project', status: 'DONE', detail: `Created "${project.title}"` }
}

/** GO_LIVE — start the Day 0/1/7/30/90 clock that has never once run. */
async function openDayZeroMilestone(client: any): Promise<TransitionEffect> {
  const existing = await prisma.customerOnboardingMilestone.findUnique({
    where: { customerId_milestone: { customerId: client.id, milestone: 'DAY_0' } },
  }).catch(() => null)
  if (existing) {
    return { step: 'Day-0 milestone', status: 'SKIPPED', detail: 'Already open' }
  }

  await prisma.customerOnboardingMilestone.createMany({
    data: ['DAY_0', 'DAY_1', 'DAY_7', 'DAY_30', 'DAY_90'].map(m => ({
      customerId: client.id,
      milestone: m,
      status: m === 'DAY_0' ? 'COMPLETED' : 'PENDING',
      completedAt: m === 'DAY_0' ? new Date() : null,
    })),
    skipDuplicates: true,
  })
  return { step: 'Day-0 milestone', status: 'DONE', detail: 'Opened DAY_0 and scheduled 1/7/30/90' }
}

export const ClientOnboardingService = {
  ONBOARDING_STAGES,
  STAGE_META,

  /** The board: every client, grouped by onboarding stage. */
  async board() {
    const clients = await prisma.clientCRM.findMany({
      include: { contacts: true },
      orderBy: { updatedAt: 'desc' },
    })

    const groups = ONBOARDING_STAGES.map(stage => ({
      id: stage,
      label: STAGE_META[stage].label,
      color: STAGE_META[stage].color,
      description: STAGE_META[stage].description,
      items: clients
        .filter(c => (c as any).onboardingStage === stage)
        .map(c => this.toCard(c)),
    }))

    return {
      groups,
      total: clients.length,
      inProgress: clients.filter(
        c => !['PROSPECT', 'ACTIVE'].includes((c as any).onboardingStage),
      ).length,
    }
  },

  toCard(c: any) {
    const primary = c.contacts?.find((x: any) => x.isPrimary) ?? c.contacts?.[0]
    const started = c.onboardingStartedAt ? new Date(c.onboardingStartedAt) : null
    return {
      id: c.id,
      name: c.name,
      industry: c.industry,
      tier: c.tier,
      health: c.health,
      status: c.status,
      stage: c.onboardingStage,
      contact: primary ? { name: primary.name, email: primary.email, role: primary.role } : null,
      accountManager: c.accountManager,
      userId: c.userId,
      hasPortalAccess: !!c.userId,
      startedAt: c.onboardingStartedAt,
      completedAt: c.onboardingCompletedAt,
      daysInOnboarding: started
        ? Math.max(0, Math.round((Date.now() - started.getTime()) / 86_400_000))
        : null,
    }
  },

  /** Add a client to the board. This is the "New client" button. */
  async createClient(input: {
    name: string
    industry?: string
    tier?: string
    contactName?: string
    contactEmail?: string
    accountManager?: string
    actorId: string
  }) {
    if (!input.name?.trim()) throw new Error('name is required')

    const client = await prisma.clientCRM.create({
      data: {
        name: input.name.trim(),
        industry: input.industry ?? null,
        tier: input.tier ?? 'standard',
        status: 'onboarding',
        onboardingStage: 'PROSPECT',
        onboardingOwnerId: input.actorId,
        accountManager: input.accountManager ?? null,
        contacts: input.contactEmail
          ? {
              create: [{
                name: input.contactName || input.name,
                email: input.contactEmail,
                role: 'Primary Contact',
                isPrimary: true,
              }],
            }
          : undefined,
      } as any,
      include: { contacts: true },
    })

    return this.toCard(client)
  },

  /**
   * Move a client to a stage, running whatever provisioning that entails.
   *
   * Effects run cumulatively for a forward move — dragging Prospect straight to
   * Go-Live performs every intervening step, because skipping a group on a
   * board should not silently skip the work it represents.
   */
  async moveToStage(clientId: string, to: OnboardingStage, actorId: string): Promise<TransitionResult> {
    if (!ONBOARDING_STAGES.includes(to)) throw new Error(`Unknown stage "${to}"`)

    const client: any = await prisma.clientCRM.findUnique({
      where: { id: clientId },
      include: { contacts: true },
    })
    if (!client) throw new Error('Client not found')

    const from = (client.onboardingStage ?? 'PROSPECT') as OnboardingStage
    const effects: TransitionEffect[] = []

    if (from === to) {
      return { clientId, from, to, effects, client: this.toCard(client) }
    }

    if (isForward(from, to)) {
      const fromIdx = ONBOARDING_STAGES.indexOf(from)
      const toIdx = ONBOARDING_STAGES.indexOf(to)
      let working = client

      for (let i = fromIdx + 1; i <= toIdx; i++) {
        const stage = ONBOARDING_STAGES[i]
        if (stage === 'KICKOFF')        effects.push(await ensureClientUser(working, actorId))
        if (stage === 'PLATFORM_SETUP') effects.push(await grantPortalAccess(working))
        if (stage === 'TRAINING')       effects.push(await provisionFirstProject(working, actorId))
        if (stage === 'GO_LIVE')        effects.push(await openDayZeroMilestone(working))

        // Re-read so the next step sees the userId the previous one wrote.
        working = await prisma.clientCRM.findUnique({
          where: { id: clientId }, include: { contacts: true },
        })
      }
    } else {
      // Moving backwards is a correction, not an undo. Nothing is destroyed —
      // deleting a client's login because someone dragged a card would be a
      // very expensive way to fix a mistake.
      effects.push({
        step: 'Moved back',
        status: 'DONE',
        detail: `Stage corrected to ${STAGE_META[to].label}. No provisioning was reversed.`,
      })
    }

    const updated = await prisma.clientCRM.update({
      where: { id: clientId },
      data: {
        onboardingStage: to,
        onboardingStartedAt: client.onboardingStartedAt ?? (to !== 'PROSPECT' ? new Date() : null),
        onboardingCompletedAt: to === 'ACTIVE' ? new Date() : null,
        status: to === 'ACTIVE' ? 'active' : to === 'PROSPECT' ? client.status : 'onboarding',
      } as any,
      include: { contacts: true },
    })

    return { clientId, from, to, effects, client: this.toCard(updated) }
  },
}
