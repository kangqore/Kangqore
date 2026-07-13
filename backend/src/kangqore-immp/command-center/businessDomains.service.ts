// ---------------------------------------------------------------------------
// Phase 6.1 — Business Domain Service
//
// Translates internal KIMMP system state into 8 CEO-facing business domains.
// Never throws — each domain degrades to UNKNOWN on error.
// ---------------------------------------------------------------------------

import { prisma }           from '../../lib/prisma';
import { SignalLedger }     from '../signals/signalLedger.service';
import { PredictionStore }  from '../prediction/predictionStore.service';
import { computeGate8 }     from '../../waanda/intelligence/gate8.service';
import { WaandaTrainingPipeline } from '../../waanda-training/trainingPipeline.service';

export type DomainStatus = 'HEALTHY' | 'ATTENTION' | 'CRITICAL' | 'UNKNOWN';
export type DomainTrend  = 'UP' | 'DOWN' | 'STABLE' | null;

export interface BusinessDomain {
  id:      string
  label:   string
  status:  DomainStatus
  summary: string
  count:   number
  unit:    string
  detail:  unknown[]
  trend:   DomainTrend
}

const UNKNOWN_DOMAIN = (id: string, label: string): BusinessDomain => ({
  id, label, status: 'UNKNOWN', summary: 'Unavailable', count: 0, unit: '', detail: [], trend: null,
});

// ── Domain builders ──────────────────────────────────────────────────────────

async function revenueDomain(): Promise<BusinessDomain> {
  try {
    const atRisk = await PredictionStore.listTopAtRisk(10);
    const arr = Array.isArray(atRisk) ? atRisk : [];
    const highRisk = arr.filter((p: any) => p.deliveryRisk === 'HIGH' || p.conversionProbability < 0.35);
    const totalAcv = highRisk.reduce((s: number, p: any) => s + (Number(p.acvEstimate) || 0), 0);
    const count = highRisk.length;
    const acvStr = totalAcv > 0 ? `₹${(totalAcv / 100_000).toFixed(1)}L ACV exposure` : '';
    return {
      id: 'revenue', label: 'Revenue',
      status: count >= 3 ? 'CRITICAL' : count > 0 ? 'ATTENTION' : 'HEALTHY',
      summary: count > 0 ? `${count} leads at risk${acvStr ? ', ' + acvStr : ''}` : 'Pipeline healthy',
      count, unit: 'leads at risk', detail: highRisk, trend: null,
    };
  } catch { return UNKNOWN_DOMAIN('revenue', 'Revenue'); }
}

async function customersDomain(): Promise<BusinessDomain> {
  try {
    const atRiskClients = await (prisma as any).clientCRM.findMany({
      where:  { health: { in: ['at-risk', 'critical'] }, status: 'active' },
      select: { id: true, name: true, health: true, arr: true, satisfactionScore: true },
      take:   20,
    });
    const critical = atRiskClients.filter((c: any) => c.health === 'critical');
    const count    = atRiskClients.length;
    return {
      id: 'customers', label: 'Customers',
      status: critical.length > 0 ? 'CRITICAL' : count > 0 ? 'ATTENTION' : 'HEALTHY',
      summary: count > 0
        ? `${count} at-risk client${count > 1 ? 's' : ''}${critical.length > 0 ? ` (${critical.length} critical)` : ''}`
        : 'All clients healthy',
      count, unit: 'at-risk clients', detail: atRiskClients, trend: null,
    };
  } catch { return UNKNOWN_DOMAIN('customers', 'Customers'); }
}

async function peopleDomain(): Promise<BusinessDomain> {
  try {
    const [pending, openJobs] = await Promise.all([
      (prisma as any).jobApplication.count({ where: { status: 'RECEIVED' } }).catch(() => 0),
      (prisma as any).job.count({ where: { status: 'OPEN' } }).catch(() => 0),
    ]);
    const count = pending;
    return {
      id: 'people', label: 'People',
      status: pending > 5 ? 'ATTENTION' : 'HEALTHY',
      summary: pending > 0
        ? `${pending} application${pending > 1 ? 's' : ''} awaiting review · ${openJobs} open role${openJobs !== 1 ? 's' : ''}`
        : 'No pending applications',
      count, unit: 'applications pending', detail: [], trend: null,
    };
  } catch { return UNKNOWN_DOMAIN('people', 'People'); }
}

async function operationsDomain(): Promise<BusinessDomain> {
  try {
    const [overdueDeliverables, atRiskProjects] = await Promise.all([
      (prisma as any).projectDeliverable
        .count({ where: { status: { notIn: ['COMPLETED', 'CANCELLED'] }, dueDate: { lt: new Date() } } })
        .catch(() => 0),
      (prisma as any).project
        .count({ where: { health: { in: ['at-risk', 'critical'] }, status: { notIn: ['COMPLETED', 'CANCELLED'] } } })
        .catch(() => 0),
    ]);
    const count  = overdueDeliverables + atRiskProjects;
    const status: DomainStatus = count >= 5 ? 'CRITICAL' : count > 0 ? 'ATTENTION' : 'HEALTHY';
    return {
      id: 'operations', label: 'Operations',
      status,
      summary: count > 0
        ? `${atRiskProjects} project${atRiskProjects !== 1 ? 's' : ''} at risk · ${overdueDeliverables} overdue`
        : 'Operations on track',
      count, unit: 'blockers', detail: [], trend: null,
    };
  } catch { return UNKNOWN_DOMAIN('operations', 'Operations'); }
}

async function riskDomain(gate8: any): Promise<BusinessDomain> {
  try {
    const criticalSignals = await SignalLedger.query({ limit: 5, severity: 'CRITICAL' } as any).catch(() => []);
    const arr   = Array.isArray(criticalSignals) ? criticalSignals : [];
    const count = arr.length;
    const trustScore: number = gate8?.pillars?.trust ?? gate8?.oisScore ?? 0;
    return {
      id: 'risk', label: 'Risk',
      status: count > 0 ? 'CRITICAL' : trustScore < 60 ? 'ATTENTION' : 'HEALTHY',
      summary: count > 0
        ? `${count} CRITICAL signal${count > 1 ? 's' : ''} · Trust score ${Math.round(trustScore)}`
        : `Trust score ${Math.round(trustScore)} · No critical signals`,
      count, unit: 'critical signals', detail: arr, trend: null,
    };
  } catch { return UNKNOWN_DOMAIN('risk', 'Risk'); }
}

async function aiDomain(): Promise<BusinessDomain> {
  try {
    const stats = await WaandaTrainingPipeline.stats().catch(() => null);
    const exportReady: number = (stats as any)?.exportReady ?? 0;
    const status: DomainStatus = exportReady > 100 ? 'HEALTHY' : exportReady > 10 ? 'ATTENTION' : 'UNKNOWN';
    return {
      id: 'ai', label: 'AI',
      status,
      summary: exportReady > 0
        ? `${exportReady} training examples ready · WAANDA active`
        : 'WAANDA active · Building training data',
      count: exportReady, unit: 'training examples', detail: [], trend: null,
    };
  } catch { return UNKNOWN_DOMAIN('ai', 'AI'); }
}

async function financeDomain(): Promise<BusinessDomain> {
  try {
    const overdueInvoices = await (prisma as any).invoice
      .findMany({
        where:  { status: { in: ['OVERDUE', 'PAST_DUE'] } },
        select: { id: true, amount: true, dueDate: true, clientId: true },
        take:   10,
      })
      .catch(() => []);
    const arr   = Array.isArray(overdueInvoices) ? overdueInvoices : [];
    const count = arr.length;
    const totalOverdue = arr.reduce((s: number, inv: any) => s + (Number(inv.amount) || 0), 0);
    return {
      id: 'finance', label: 'Finance',
      status: count >= 3 ? 'CRITICAL' : count > 0 ? 'ATTENTION' : 'HEALTHY',
      summary: count > 0
        ? `${count} overdue invoice${count > 1 ? 's' : ''} · ₹${(totalOverdue / 100_000).toFixed(1)}L outstanding`
        : 'No overdue invoices',
      count, unit: 'overdue invoices', detail: arr, trend: null,
    };
  } catch { return UNKNOWN_DOMAIN('finance', 'Finance'); }
}

async function marketDomain(): Promise<BusinessDomain> {
  try {
    const since48h = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const count = await (prisma as any).kimmpSignal
      .count({ where: { signalType: 'COMPETITOR_MOVE', createdAt: { gte: since48h } } })
      .catch(() => 0);
    return {
      id: 'market', label: 'Market',
      status: count >= 3 ? 'CRITICAL' : count > 0 ? 'ATTENTION' : 'HEALTHY',
      summary: count > 0
        ? `${count} competitor move${count > 1 ? 's' : ''} detected in last 48h`
        : 'No competitor activity detected',
      count, unit: 'competitor signals', detail: [], trend: null,
    };
  } catch { return UNKNOWN_DOMAIN('market', 'Market'); }
}

// ── Priority sort: CRITICAL → ATTENTION → HEALTHY → UNKNOWN ──────────────────
const STATUS_ORDER: Record<DomainStatus, number> = { CRITICAL: 0, ATTENTION: 1, HEALTHY: 2, UNKNOWN: 3 };

export class BusinessDomainsService {
  static async aggregate(): Promise<BusinessDomain[]> {
    const gate8 = await computeGate8().catch(() => null);

    const [revenue, customers, people, operations, risk, ai, finance, market] = await Promise.all([
      revenueDomain(),
      customersDomain(),
      peopleDomain(),
      operationsDomain(),
      riskDomain(gate8),
      aiDomain(),
      financeDomain(),
      marketDomain(),
    ]);

    return [revenue, customers, people, operations, risk, ai, finance, market]
      .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
  }
}
