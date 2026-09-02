/**
 * SwarmActivityEngine
 * Drives realistic live task cycles for KIMMP agents.
 * Each agent role has a curated task library drawn from what KIMMP actually does.
 */

import { SwarmManager, AgentRole, AgentStatus } from './swarmManager.service';
import logger from '../../../utils/logger';

interface TaskDefinition {
  task: string;
  durationMs: number; // how long it stays "WORKING"
  successLog: string;
}

const TASK_LIBRARY: Record<AgentRole, TaskDefinition[]> = {
  RESEARCH: [
    { task: 'Crawling /pricing page for intent signals', durationMs: 6000, successLog: '>> AG-402: Found 3 high-intent visitors on /pricing (past 15m).' },
    { task: 'Analyzing session depth on /enterprise', durationMs: 5000, successLog: '>> AG-402: Avg session depth 4.2 pages — enterprise funnel is engaged.' },
    { task: 'Scanning lead activity: enterprise@acme.io', durationMs: 7000, successLog: '>> AG-402: Corporate email detected — escalating to conversion sequence.' },
    { task: 'Cross-referencing visitor vs. ICP criteria', durationMs: 5500, successLog: '>> AG-402: ICP match score 87% — recommend outreach within 4h window.' },
    { task: 'Profiling repeat visitor (3rd session)', durationMs: 4500, successLog: '>> AG-402: Repeat visitor pattern confirmed — memory context loaded.' },
    { task: 'Comparing competitor mention freq (7-day)', durationMs: 6500, successLog: '>> AG-402: Competitor mentions ↑12% — alert flagged for VIS module.' },
    { task: 'Evaluating semantic context of /demo CTA', durationMs: 5000, successLog: '>> AG-402: CTA conversion signal strength: HIGH.' },
  ],
  SCRAPER: [
    { task: 'Extracting structured data from /blog/ai-tools', durationMs: 5000, successLog: '>> AG-719: 14 semantic entities extracted — pushed to Knowledge Graph.' },
    { task: 'Indexing competitor pricing page delta', durationMs: 6000, successLog: '>> AG-719: Price delta detected — Competitor A raised by 12%.' },
    { task: 'Scraping LinkedIn signal: 3 job postings matched ICP', durationMs: 8000, successLog: '>> AG-719: Target account hiring signals → Sales flag raised.' },
    { task: 'Parsing inbound form submissions (last 1h)', durationMs: 4000, successLog: '>> AG-719: 2 new enterprise submissions parsed and classified.' },
    { task: 'Extracting FAQ interactions from chat logs', durationMs: 5500, successLog: '>> AG-719: Top 5 new FAQs identified — routed to Content Engine.' },
    { task: 'Monitoring public review sentiment (G2, Capterra)', durationMs: 7000, successLog: '>> AG-719: Sentiment score: 4.6/5 — no critical issues found.' },
    { task: 'Building semantic embeddings for /case-studies', durationMs: 6000, successLog: '>> AG-719: 4 new embeddings pushed to Vector DB.' },
  ],
  DIAGNOSTICS: [
    { task: 'Running BIDS health scan: Core API', durationMs: 4000, successLog: '>> AG-991: Core API p95 latency: 142ms — within threshold.' },
    { task: 'Checking KIMMP loop integrity (last 24h)', durationMs: 5000, successLog: '>> AG-991: 0 failed loops. 18 completed. System nominal.' },
    { task: 'Auditing Knowledge Graph edge consistency', durationMs: 6000, successLog: '>> AG-991: 2 orphaned edges detected — quarantined for review.' },
    { task: 'Validating HANUMANAS firewall rules (inbound)', durationMs: 4500, successLog: '>> AG-991: 847 requests scanned. 3 anomalies flagged.' },
    { task: 'Measuring eQORE session token expiry rates', durationMs: 5000, successLog: '>> AG-991: Token refresh rate normal. 0 auth errors in last hour.' },
    { task: 'Profiling Redis cache hit/miss ratio', durationMs: 4000, successLog: '>> AG-991: Cache hit ratio: 91.3% — optimal.' },
    { task: 'Scanning Prisma query performance (slow queries)', durationMs: 7000, successLog: '>> AG-991: 1 slow query identified (>500ms) — flagged for index review.' },
  ],
  EXECUTION: [
    { task: 'Triggering enterprise outreach sequence', durationMs: 6000, successLog: '>> EXEC: Playbook ENTERPRISE_NUDGE executed → email queued.' },
    { task: 'Executing demo scheduling nudge', durationMs: 4000, successLog: '>> EXEC: Demo CTA injected into session context.' },
    { task: 'Running conversion playbook: PRICING_VISITOR_V2', durationMs: 5000, successLog: '>> EXEC: Playbook fired. Personalization layer updated.' },
  ],
  COACH: [
    { task: 'Analysing WAANDA conversation quality (last 50 sessions)', durationMs: 7000, successLog: '>> COACH: Avg quality score 8.2/10. Top gap: objection handling.' },
    { task: 'Generating weekly context briefing for eQORE', durationMs: 6000, successLog: '>> COACH: Briefing pushed to eQORE context layer.' },
  ],
};

class SwarmActivityEngineService {
  private readonly timers: Map<string, NodeJS.Timeout> = new Map();
  private readonly taskProgress: Map<string, number> = new Map(); // agentId → 0-100
  private readonly progressIntervals: Map<string, NodeJS.Timeout> = new Map();
  private running = false;

  /**
   * Start the activity engine — begins cycling all registered agents through tasks.
   */
  public start() {
    if (this.running) return;
    this.running = true;
    logger.info('[KIMMP:ACTIVITY] SwarmActivityEngine started — agents cycling.');

    // Stagger initial starts so agents don't all start simultaneously
    const agents = SwarmManager.getTopology();
    agents.forEach((agent, i) => {
      const delay = 2000 + (i * 3500); // stagger by 3.5s per agent
      setTimeout(() => this.scheduleNextTask(agent.id, agent.role), delay);
    });
  }

  public stop() {
    this.running = false;
    this.timers.forEach(t => clearTimeout(t));
    this.progressIntervals.forEach(t => clearInterval(t));
    this.timers.clear();
    this.progressIntervals.clear();
    logger.info('[KIMMP:ACTIVITY] SwarmActivityEngine stopped.');
  }

  /**
   * Get current task progress for an agent (0–100).
   */
  public getProgress(agentId: string): number {
    return this.taskProgress.get(agentId) ?? 0;
  }

  /**
   * Get all agents with their live progress attached.
   */
  public getEnrichedTopology() {
    return SwarmManager.getTopology().map(agent => ({
      ...agent,
      taskProgress: this.getProgress(agent.id),
    }));
  }

  private scheduleNextTask(agentId: string, role: AgentRole) {
    if (!this.running) return;

    // Random idle period: 4–12 seconds between tasks
    const idleMs = 4000 + Math.floor(Math.random() * 8000);

    const idleTimer = setTimeout(() => {
      if (!this.running) return;
      this.runTask(agentId, role);
    }, idleMs);

    this.timers.set(agentId, idleTimer);
  }

  private runTask(agentId: string, role: AgentRole) {
    const tasks = TASK_LIBRARY[role];
    if (!tasks || tasks.length === 0) return;

    const task = tasks[Math.floor(Math.random() * tasks.length)];

    // Set to WORKING
    SwarmManager.updateAgentStatus(agentId, 'WORKING', task.task);
    this.taskProgress.set(agentId, 0);

    // Emit progress updates
    const progressInterval = 250; // ms
    const steps = Math.floor(task.durationMs / progressInterval);
    let step = 0;

    const progressTimer = setInterval(() => {
      step++;
      const progress = Math.min(100, Math.round((step / steps) * 100));
      this.taskProgress.set(agentId, progress);

      // Broadcast progress update
      SwarmManager.broadcastAgentProgress(agentId, progress);

      if (step >= steps) {
        clearInterval(progressTimer);
        this.progressIntervals.delete(agentId);
      }
    }, progressInterval);

    this.progressIntervals.set(agentId, progressTimer);

    // After task duration — emit success log or error, return to IDLE
    const taskTimer = setTimeout(() => {
      if (!this.running) return;
      clearInterval(progressTimer);
      this.progressIntervals.delete(agentId);
      this.taskProgress.set(agentId, 0);

      // 10% chance to error out for simulation
      if (Math.random() < 0.1) {
        const errorMsg = `!! CRITICAL ERROR: Agent ${agentId} encountered a semantic failure. Neural loop broken.`;
        SwarmManager.broadcastLog(errorMsg);
        SwarmManager.updateAgentStatus(agentId, 'ERROR', 'Semantic failure in neural loop');
        
        // Recover after 10 seconds
        setTimeout(() => {
          if (this.running) {
            SwarmManager.broadcastLog(`>> RECOVERY: Agent ${agentId} neural loop restored.`);
            SwarmManager.updateAgentStatus(agentId, 'IDLE', 'Recovered');
            this.scheduleNextTask(agentId, role);
          }
        }, 10000);
      } else {
        // Log success
        SwarmManager.broadcastLog(task.successLog);
        
        // Return to IDLE
        SwarmManager.updateAgentStatus(agentId, 'IDLE');

        // Schedule next task
        this.scheduleNextTask(agentId, role);
      }
    }, task.durationMs);

    this.timers.set(agentId + ':task', taskTimer);
  }

  /**
   * Register a new agent with the activity engine after spawn.
   */
  public registerAgent(agentId: string, role: AgentRole) {
    if (!this.running) return;
    const delay = 3000 + Math.floor(Math.random() * 5000);
    setTimeout(() => this.scheduleNextTask(agentId, role), delay);
    logger.info(`[KIMMP:ACTIVITY] New agent ${agentId} registered in engine.`);
  }
}

export const SwarmActivityEngine = new SwarmActivityEngineService();
