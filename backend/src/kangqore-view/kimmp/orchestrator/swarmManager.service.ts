import { Server as SocketIOServer } from 'socket.io';
import logger from '../../../utils/logger';

export type AgentStatus = 'IDLE' | 'WORKING' | 'ERROR' | 'OFFLINE';
export type AgentRole = 'RESEARCH' | 'SCRAPER' | 'DIAGNOSTICS' | 'EXECUTION' | 'COACH';

export interface AgentNode {
  id: string;
  name: string;
  role: AgentRole;
  status: AgentStatus;
  currentTask?: string;
  taskProgress?: number; // 0–100, only set while WORKING
  spawnedAt: string;
  completedTasks?: number; // lifetime counter
}

class SwarmManagerService {
  private io: SocketIOServer | null = null;
  private readonly agents: Map<string, AgentNode> = new Map();

  constructor() {
    // Initialize with some default agents for the swarm
    this.spawnAgent('ag-402', 'Agent 402', 'RESEARCH');
    this.spawnAgent('ag-719', 'Agent 719', 'SCRAPER');
    this.spawnAgent('ag-991', 'Agent 991', 'DIAGNOSTICS');
  }

  public attachSocket(io: SocketIOServer) {
    this.io = io;
    logger.info('[KIMMP:SWARM] WebSocket server attached to SwarmManager');
    // Note: individual socket topology sends are triggered by socket.ts
    // after JWT auth verification via SwarmManager.sendTopologyToSocket(socket)
  }

  /**
   * Called from socket.ts after JWT auth, sends current topology to a single socket.
   */
  public sendTopologyToSocket(socket: any) {
    socket.emit('SWARM_TOPOLOGY', this.getTopology());
  }

  public spawnAgent(id: string, name: string, role: AgentRole) {
    const agent: AgentNode = {
      id,
      name,
      role,
      status: 'IDLE',
      taskProgress: 0,
      completedTasks: 0,
      spawnedAt: new Date().toISOString()
    };
    this.agents.set(id, agent);
    logger.info(`[KIMMP:SWARM] Spawned new agent: ${name} (${role})`);
    
    if (this.io) {
      this.io.emit('AGENT_SPAWNED', agent);
      this.io.emit('SWARM_LOG', `>> KIMMP: Swarm node [${name}] activated online.`);
    }
  }

  public updateAgentStatus(id: string, status: AgentStatus, task?: string) {
    const agent = this.agents.get(id);
    if (agent) {
      const wasWorking = agent.status === 'WORKING';
      agent.status = status;

      if (task) {
        agent.currentTask = task;
        agent.taskProgress = 0;
      }

      // When returning to IDLE after WORKING, increment completed counter and clear task
      if (wasWorking && status === 'IDLE') {
        agent.completedTasks = (agent.completedTasks ?? 0) + 1;
        agent.taskProgress = 0;
        agent.currentTask = undefined;
      }
      
      if (this.io) {
        this.io.emit('AGENT_UPDATED', agent);
        if (task) {
          this.io.emit('SWARM_LOG', `>> [${agent.name}]: Executing -> ${task}`);
        }
      }
    }
  }

  /**
   * Broadcast granular task progress for an agent (0–100).
   * Emits a lightweight AGENT_PROGRESS event to avoid flooding with full AGENT_UPDATED payloads.
   */
  public broadcastAgentProgress(agentId: string, progress: number) {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.taskProgress = progress;
      if (this.io) {
        this.io.emit('AGENT_PROGRESS', { id: agentId, progress });
      }
    }
  }

  /**
   * Broadcast a plain log string to all connected sockets.
   */
  public broadcastLog(message: string) {
    if (this.io) {
      this.io.emit('SWARM_LOG', message);
    }
  }

  public getTopology() {
    return Array.from(this.agents.values());
  }
}

export const SwarmManager = new SwarmManagerService();
