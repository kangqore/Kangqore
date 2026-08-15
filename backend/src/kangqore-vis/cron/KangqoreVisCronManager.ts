import cron, { ScheduledTask } from 'node-cron';
import { KangqoreVisFlags } from '../core/flags';
import { getVisPriorityModule } from '../../kangqore-view/waanda/adapters/VisAdapter';
import { SitemapService } from '../technical-seo/SitemapService';
import { SchemaContentAuditor } from '../structured-data/SchemaContentAuditor';
import { WebVitalsCollector } from '../performance/WebVitalsCollector';
import { InternalLinkGraph } from '../information-architecture/InternalLinkGraph';
import { FaqBank } from '../ai-answerability/FaqBank';
import { KpiSnapshotService } from '../kpi/KpiSnapshotService';
import { BrokenLinkAuditor } from '../technical-seo/BrokenLinkAuditor';
import { BacklinkService } from '../authority/BacklinkService';

export interface KangqoreVisJobDescriptor {
  id: string;
  cron: string;
  description: string;
  task: () => Promise<unknown>;
}

const JOBS: KangqoreVisJobDescriptor[] = [
  {
    id: 'sitemap-regen',
    cron: '0 2 * * *',
    description: 'Regenerate sitemap.xml from blueprints',
    task: async () => SitemapService.generate(),
  },
  {
    id: 'schema-content-audit',
    cron: '30 2 * * *',
    description: 'Run schema-content match auditor',
    task: () => SchemaContentAuditor.audit(),
  },
  {
    id: 'cwv-rollup',
    cron: '0 * * * *',
    description: 'Rollup Web Vitals metrics',
    task: async () => {
      await WebVitalsCollector.rollup('LCP');
      await WebVitalsCollector.rollup('INP');
      await WebVitalsCollector.rollup('CLS');
    },
  },
  {
    id: 'internal-link-graph',
    cron: '0 3 * * *',
    description: 'Rebuild internal link graph',
    task: () => InternalLinkGraph.build(),
  },
  {
    id: 'faq-sync-from-concierge',
    cron: '0 4 * * *',
    description: 'Sync FAQs from concierge KB',
    task: () => FaqBank.importFromKB(),
  },
  {
    id: 'kpi-snapshot',
    cron: '0 5 * * *',
    description: 'Capture KPI snapshot',
    task: () => KpiSnapshotService.snapshot(),
  },
  {
    id: 'weekly-friday-snapshot',
    cron: '0 6 * * 5',
    description: 'Weekly Friday EOW snapshot — OIS baseline, KPI delta, deployment health',
    task: () => KpiSnapshotService.snapshot(),
  },
  {
    id: 'broken-link-sweep',
    cron: '0 6 * * 0',
    description: 'Weekly broken-link sweep',
    task: () => BrokenLinkAuditor.run(),
  },
  {
    id: 'backlink-poll',
    cron: '0 7 * * *',
    description: 'Poll for backlink delta (requires Ahrefs/Semrush adapter)',
    task: async () => BacklinkService.list(),
  },
];

export class KangqoreVisCronManager {
  private static tasks = new Map<string, ScheduledTask>();
  private static enabled = new Set<string>();

  static initialize(): void {
    const autoEnable = KangqoreVisFlags.cronEnabled();
    console.log(
      `⚡ KangqoreVis Cron — registering jobs (${autoEnable ? 'auto-enabled via KANGQORE_VIS_CRON_ENABLED' : 'disabled by default'})`
    );
    for (const job of JOBS) {
      try {
        const task = cron.schedule(
          job.cron,
          async () => {
            try {
              await job.task();
              import('../../kangqore-view/waanda/adapters/VisAdapter').then(({ notifyVisCronRun }) => notifyVisCronRun()).catch(() => {})
            } catch (err) {
              console.error(`kangqore-vis.cron.${job.id}.error`, err);
            }
          },
          { scheduled: autoEnable } as any
        );
        this.tasks.set(job.id, task);
        if (autoEnable) this.enabled.add(job.id);
        console.log(`   -> ${job.id} (${job.cron}) registered (${autoEnable ? 'enabled' : 'disabled'})`);
      } catch (err) {
        console.error(`kangqore-vis.cron.register.error(${job.id})`, err);
      }
    }
  }

  static list(): Array<{ id: string; cron: string; description: string; enabled: boolean }> {
    return JOBS.map((j) => ({ ...j, enabled: this.enabled.has(j.id), task: undefined as never })).map(
      ({ id, cron: cronExpr, description }) => ({
        id,
        cron: cronExpr,
        description,
        enabled: this.enabled.has(id),
      })
    );
  }

  static enable(id: string): boolean {
    const task = this.tasks.get(id);
    if (!task) return false;
    task.start();
    this.enabled.add(id);
    return true;
  }

  static disable(id: string): boolean {
    const task = this.tasks.get(id);
    if (!task) return false;
    task.stop();
    this.enabled.delete(id);
    return true;
  }

  static async runNow(id: string): Promise<{ ok: boolean; error?: string }> {
    const priorityModule = getVisPriorityModule()
    // If WAANDA issued a FOCUS directive, run that job before the requested one
    if (priorityModule && priorityModule !== id) {
      const priorityJob = JOBS.find((j) => j.id === priorityModule)
      if (priorityJob) {
        await priorityJob.task().catch(() => {})
      }
    }
    const job = JOBS.find((j) => j.id === id);
    if (!job) return { ok: false, error: 'unknown job' };
    try {
      await job.task();
      import('../../kangqore-view/waanda/adapters/VisAdapter').then(({ notifyVisCronRun }) => notifyVisCronRun()).catch(() => {})
      return { ok: true };
    } catch (err) {
      return { ok: false, error: (err as Error).message };
    }
  }
}
