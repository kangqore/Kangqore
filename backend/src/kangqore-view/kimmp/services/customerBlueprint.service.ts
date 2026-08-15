import { prisma } from '../../../lib/prisma'

export interface BlueprintOptions {
  customerName:   string
  industry:       string
  planTier:       string        // STARTER | PRO | ENTERPRISE
  size:           string        // e.g. "51–200 employees"
  oisBaseline:    number
  oisTarget:      number
  enabledModules: string[]
  packId?:        string        // e.g. "kangqore/digital-transformation"
}

// Generate a structured blueprint.json spec for an enterprise customer
export function buildBlueprintSpec(opts: BlueprintOptions): Record<string, unknown> {
  const now = new Date().toISOString()
  return {
    $blueprint:   'kangqore/enterprise-deployment',
    version:      '1.0',
    generatedAt:  now,
    pack:         opts.packId ?? 'kangqore/enterprise-pro',
    organization: {
      name:     opts.customerName,
      industry: opts.industry,
      size:     opts.size,
      pack:     opts.packId ?? 'kangqore/enterprise-pro',
    },
    modules: opts.enabledModules,
    departments: [
      { id: 'projects',  name: 'Projects & Delivery' },
      { id: 'finance',   name: 'Finance'              },
      { id: 'sales',     name: 'Sales & Revenue'      },
      { id: 'hr',        name: 'People & HR'          },
      { id: 'leadership', name: 'Leadership'          },
    ],
    goals: [
      { pillar: 'Decision Intelligence',   label: 'Decisions routed through KIMMP', target: 80,  unit: '%'  },
      { pillar: 'Workflow Automation',     label: 'Workflows active',               target: 15,  unit: 'count' },
      { pillar: 'AI Integration',          label: 'WAANDA sessions / user / week',  target: 5,   unit: 'sessions' },
      { pillar: 'Knowledge Management',    label: 'Ontology nodes mapped',          target: 200, unit: 'nodes'  },
      { pillar: 'Operational Efficiency',  label: 'OIS score at 90 days',           target: opts.oisTarget, unit: 'score' },
    ],
    oisProfile: {
      baseline:           opts.oisBaseline,
      target:             opts.oisTarget,
      checkpointInterval: 'weekly',
    },
    policies: [
      { name: 'require_decision_audit',    effect: 'ENFORCE', priority: 1 },
      { name: 'kimmp_signal_threshold',    effect: 'ENFORCE', priority: 2 },
      { name: 'aegis_data_residency',      effect: 'ENFORCE', priority: 3 },
      { name: 'waanda_cycle_mandatory',    effect: 'RECOMMEND', priority: 4 },
    ],
    agents: [
      { id: 'SIGNAL_READ'      },
      { id: 'DECISION_ENGINE'  },
      { id: 'STRATEGIST'       },
      { id: 'FINANCIAL_SNAPSHOT', schedule: 'daily' },
      { id: 'LEAD_ANALYSIS'    },
      { id: 'COMPLIANCE'       },
    ],
    kpis: {
      pillarWeights: {
        'Decision Intelligence':   0.22,
        'Workflow Automation':     0.20,
        'AI Integration':          0.18,
        'Knowledge Management':    0.15,
        'Operational Efficiency':  0.15,
        'Strategic Alignment':     0.10,
      },
    },
    coig: { northStar: true, dimensions: ['velocity', 'depth', 'breadth', 'quality'] },
    governance: { approvalLevels: { DECISION: 'KIMMP', POLICY: 'AEGIS' }, auditRetentionDays: 365 },
  }
}

// Create a new CustomerBlueprint record
export async function createCustomerBlueprint(opts: BlueprintOptions & { deployedBy?: string }) {
  const spec = buildBlueprintSpec(opts)
  return (prisma as any).customerBlueprint.create({
    data: {
      customerName:   opts.customerName,
      planTier:       opts.planTier,
      industry:       opts.industry,
      oisBaseline:    opts.oisBaseline,
      oisTarget:      opts.oisTarget,
      enabledModules: opts.enabledModules,
      spec,
      status: 'DRAFT',
    },
  })
}

// Provision a tenant + blueprint in one atomic sequence
export async function provisionCustomer(opts: {
  customerName:    string
  subdomain:       string
  industry:        string
  planTier:        string
  size:            string
  oisBaseline:     number
  oisTarget:       number
  enabledModules:  string[]
  packId?:         string
  deployedBy:      string
}) {
  // 1 — Create TenantOrganisation
  const existing = await (prisma as any).tenantOrganisation.findUnique({ where: { subdomain: opts.subdomain } })
  let tenant = existing
  if (!existing) {
    tenant = await (prisma as any).tenantOrganisation.create({
      data: {
        name:           opts.customerName,
        subdomain:      opts.subdomain,
        planTier:       opts.planTier,
        isolationMode:  'ROW_LEVEL',
        maxUsers:       opts.planTier === 'ENTERPRISE' ? 200 : opts.planTier === 'PRO' ? 50 : 10,
        maxAgents:      opts.planTier === 'ENTERPRISE' ? 80  : opts.planTier === 'PRO' ? 30 : 10,
        enabledModules: opts.enabledModules,
        disabledModules: [],
        provisionedBy:  opts.deployedBy,
        provisionedAt:  new Date(),
        subscriptionStatus: 'trial',
        isActive:       true,
      },
    })
  }

  // 2 — Generate + store Blueprint
  const spec = buildBlueprintSpec(opts)
  const blueprint = await (prisma as any).customerBlueprint.create({
    data: {
      customerName:   opts.customerName,
      tenantId:       tenant.id,
      planTier:       opts.planTier,
      industry:       opts.industry,
      oisBaseline:    opts.oisBaseline,
      oisTarget:      opts.oisTarget,
      enabledModules: opts.enabledModules,
      spec,
      status:    'ACTIVE',
      deployedAt: new Date(),
      deployedBy: opts.deployedBy,
    },
  })

  // 3 — Link blueprint back to tenant
  await (prisma as any).tenantOrganisation.update({
    where: { id: tenant.id },
    data:  { blueprintId: blueprint.id, blueprintVersion: '1.0' },
  })

  // 4 — Fire CUSTOMER_ONE_DEPLOYED signal
  await (prisma as any).kimmpSignal.create({
    data: {
      type:        'CUSTOMER_ONE_DEPLOYED',
      source:      'SYSTEM',
      priority:    'HIGH',
      title:       `Customer One deployed: ${opts.customerName}`,
      description: `Blueprint v1.0 · OIS Baseline ${opts.oisBaseline} · Target ${opts.oisTarget} · Plan: ${opts.planTier} · Subdomain: ${opts.subdomain}`,
      status:      'ACTIVE',
      createdBy:   opts.deployedBy,
    },
  })

  return { tenant, blueprint }
}
