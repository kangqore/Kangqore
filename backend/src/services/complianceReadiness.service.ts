// ---------------------------------------------------------------------------
// Compliance Readiness Service — Overshadow Roadmap P2.
//
// This is a READINESS tracker, not a certification authority. Nothing here
// ever returns 'CERTIFIED' / 'AUTHORIZED' / a fabricated auditor or agency
// name — a SOC 2 Type II report, an ISO 27001 certificate, and a FedRAMP or
// IRAP authorization can only be issued by an independent external party
// after a real engagement. This service's job is narrower: surface real,
// live technical signals (so an admin walking into an auditor conversation
// knows what's actually true today) and hold the manually-tracked
// checkpoint/audit-period state an admin updates as the real-world process
// progresses.
// ---------------------------------------------------------------------------

import { prisma } from '../lib/prisma'
import { AegisLedger } from '../kangqore-aegis/aegisLedger.service'

export interface LiveSignal {
  key:     string
  label:   string
  satisfied: boolean
  detail:  string
}

// Deliberately small and conservative — each check maps to a capability this
// session already verified is real and queryable (see publicTrust.service.ts,
// same underlying data). When in doubt, a control stays MANUAL rather than
// being auto-marked satisfied on a shaky inference.
export async function getLiveComplianceSignals(): Promise<LiveSignal[]> {
  const [stats, piiConfig, roleRows, benchmarkCount] = await Promise.all([
    AegisLedger.stats(),
    (prisma as any).piiScanConfig.findFirst({ where: { active: true } }),
    prisma.user.groupBy({ by: ['role'], _count: { _all: true } }),
    (prisma as any).kimmpBenchmarkRun.count(),
  ])

  return [
    {
      key: 'audit_logging',
      label: 'Audit logging & monitoring',
      satisfied: stats.totalActivations > 0,
      detail: `${stats.totalActivations.toLocaleString()} activations logged, ${stats.totalDenied.toLocaleString()} access denials recorded in the AEGIS ledger.`,
    },
    {
      key: 'access_control_segregation',
      label: 'Role-based access segregation',
      satisfied: roleRows.length > 1,
      detail: `${roleRows.length} distinct roles enforced (${roleRows.map((r: any) => r.role).join(', ')}).`,
    },
    {
      key: 'pii_data_protection',
      label: 'PII detection & data-handling policy',
      satisfied: !!piiConfig,
      detail: piiConfig ? `Active scan profile, mode ${piiConfig.mode}.` : 'No active PII scan profile.',
    },
    {
      key: 'monitoring_regression_detection',
      label: 'Continuous quality monitoring',
      satisfied: benchmarkCount > 0,
      detail: benchmarkCount > 0 ? `${benchmarkCount} benchmark run${benchmarkCount === 1 ? '' : 's'} on record, drift-alerting live.` : 'No benchmark runs on record.',
    },
  ]
}

const SOC2_SEED = [
  { code: 'CC1.1', framework: 'SOC2', criteria: 'CC1', name: 'Control Environment — Integrity & Ethics',       status: 'PARTIAL',  description: 'Organisation demonstrates commitment to integrity and ethical values' },
  { code: 'CC1.2', framework: 'SOC2', criteria: 'CC1', name: 'Control Environment — Board Oversight',           status: 'MISSING',  description: 'Board or governing body demonstrates independence from management' },
  { code: 'CC2.1', framework: 'SOC2', criteria: 'CC2', name: 'Communication — Internal Communication',          status: 'IN_PLACE', description: 'Internal communication of security responsibilities and policies' },
  { code: 'CC3.1', framework: 'SOC2', criteria: 'CC3', name: 'Risk Assessment — Risk Identification',           status: 'PARTIAL',  description: 'Identifies and assesses risks to achieving security objectives' },
  { code: 'CC4.1', framework: 'SOC2', criteria: 'CC4', name: 'Monitoring — Ongoing Evaluation',                 status: 'MISSING',  description: 'Selects, develops and performs ongoing monitoring activities' },
  { code: 'CC5.1', framework: 'SOC2', criteria: 'CC5', name: 'Control Activities — Technology Controls',        status: 'PARTIAL',  description: 'Technology controls selected and developed to achieve objectives' },
  { code: 'CC6.1', framework: 'SOC2', criteria: 'CC6', name: 'Logical Access — Access Management',              status: 'IN_PLACE', description: 'Logical access security software, infrastructure, and architectures' },
  { code: 'CC6.2', framework: 'SOC2', criteria: 'CC6', name: 'Logical Access — New Access Provisioning',        status: 'PARTIAL',  description: 'Prior to issuing system credentials and granting system access' },
  { code: 'CC6.3', framework: 'SOC2', criteria: 'CC6', name: 'Logical Access — Access Removal',                 status: 'MISSING',  description: 'Removes access to protected information assets when no longer required' },
  { code: 'CC7.1', framework: 'SOC2', criteria: 'CC7', name: 'System Operations — Vulnerability Management',    status: 'MISSING',  description: 'Detection and monitoring of vulnerabilities and threats' },
  { code: 'CC8.1', framework: 'SOC2', criteria: 'CC8', name: 'Change Management — Infrastructure Changes',      status: 'PARTIAL',  description: 'Authorises, designs, develops, tests and implements changes' },
  { code: 'CC9.1', framework: 'SOC2', criteria: 'CC9', name: 'Risk Mitigation — Vendor Risk Management',        status: 'MISSING',  description: 'Identifies, selects and develops risk mitigation activities for risks with vendors' },
]

// ISO/IEC 27001:2022 restructured Annex A into 4 themes (93 controls total).
// This is a representative starter set per theme for auditor-prep discussion,
// not the full official catalogue — an admin expands it once real ISMS
// scoping work begins.
const ISO27001_SEED = [
  { code: 'ISO-A5.1', framework: 'ISO27001', criteria: 'A.5 Organizational', name: 'Policies for information security',        status: 'PARTIAL', description: 'A defined, approved, and communicated information security policy set' },
  { code: 'ISO-A5.2', framework: 'ISO27001', criteria: 'A.5 Organizational', name: 'Roles and responsibilities',               status: 'PARTIAL', description: 'Information security roles and responsibilities defined and allocated' },
  { code: 'ISO-A6.1', framework: 'ISO27001', criteria: 'A.6 People',         name: 'Screening',                                status: 'MISSING', description: 'Background verification checks on personnel prior to employment' },
  { code: 'ISO-A6.2', framework: 'ISO27001', criteria: 'A.6 People',         name: 'Security awareness & training',            status: 'MISSING', description: 'Personnel receive appropriate security awareness education and training' },
  { code: 'ISO-A7.1', framework: 'ISO27001', criteria: 'A.7 Physical',       name: 'Physical security perimeters',             status: 'MISSING', description: 'Security perimeters defined and used to protect information-processing facilities' },
  { code: 'ISO-A7.2', framework: 'ISO27001', criteria: 'A.7 Physical',       name: 'Equipment security',                       status: 'MISSING', description: 'Equipment protected from physical and environmental threats' },
  { code: 'ISO-A8.1', framework: 'ISO27001', criteria: 'A.8 Technological',  name: 'Access control',                           status: 'IN_PLACE', description: 'Rules for logical and physical access based on business requirements' },
  { code: 'ISO-A8.2', framework: 'ISO27001', criteria: 'A.8 Technological',  name: 'Logging',                                  status: 'IN_PLACE', description: 'Event logs recording activities, exceptions, faults, and other events' },
]

export async function ensureFrameworkSeeded(framework: 'SOC2' | 'ISO27001') {
  const count = await (prisma as any).complianceControl.count({ where: { framework } })
  if (count > 0) return
  const seed = framework === 'SOC2' ? SOC2_SEED : ISO27001_SEED
  await (prisma as any).complianceControl.createMany({ data: seed, skipDuplicates: true })
}
