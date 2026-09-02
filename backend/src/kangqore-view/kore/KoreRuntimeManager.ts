import { KeosEventBus } from '../kernel/KeosEventBus';
import {
  EnterpriseDigitalTwin,
  TwinIdentity,
  TwinType,
  TwinMutationProposal,
  TwinTransaction,
  KoreQuery
} from './types';
import { AegisShield } from '../esf/aegis/AegisShield';
import { MissionRequest } from '../kernel/KeosKernel';

class IdentityEngine {
  static generateId(type: TwinType): TwinIdentity {
    return {
      twinId: `${type}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`.toUpperCase(),
      type,
      createdAt: new Date(),
      namespace: 'keos.enterprise'
    };
  }
}

class CommitEngine {
  static apply(currentTwin: EnterpriseDigitalTwin, proposal: TwinMutationProposal): EnterpriseDigitalTwin {
    return {
      ...currentTwin,
      version: currentTwin.version + 1,
      state: {
        ...currentTwin.state,
        ...proposal.changes
      }
    };
  }
}

class SnapshotEngine {
  private static snapshots: Map<string, EnterpriseDigitalTwin[]> = new Map();

  static record(twin: EnterpriseDigitalTwin) {
    if (!this.snapshots.has(twin.identity.twinId)) {
      this.snapshots.set(twin.identity.twinId, []);
    }
    this.snapshots.get(twin.identity.twinId)!.push({ ...twin });
  }

  static getSnapshotAtVersion(twinId: string, version: number): EnterpriseDigitalTwin | undefined {
    const history = this.snapshots.get(twinId) || [];
    return history.find(t => t.version === version);
  }
}

class TwinRegistry {
  private static activeTwins: Map<string, EnterpriseDigitalTwin> = new Map();

  static register(twin: EnterpriseDigitalTwin) {
    this.activeTwins.set(twin.identity.twinId, twin);
    SnapshotEngine.record(twin);
  }

  static get(twinId: string): EnterpriseDigitalTwin | undefined {
    return this.activeTwins.get(twinId);
  }

  static getAll(): EnterpriseDigitalTwin[] {
    return Array.from(this.activeTwins.values());
  }
}

class TwinIndex {
  static executeKQL(query: KoreQuery): EnterpriseDigitalTwin[] {
    let results = TwinRegistry.getAll();
    
    if (query.type) {
      results = results.filter(t => t.identity.type === query.type);
    }
    
    if (query.where) {
      for (const [key, val] of Object.entries(query.where)) {
        results = results.filter(t => t.state[key] === val);
      }
    }
    
    return results;
  }
}

class TransactionEngine {
  static async execute(transaction: TwinTransaction): Promise<boolean> {
    console.log(`[KORE Runtime] Executing Transaction ${transaction.transactionId}`);
    
    // 1. AEGIS Validation Phase — real policy evaluation per proposal
    for (const proposal of transaction.proposals) {
      const missionId = `KORE_TX_${transaction.transactionId}_${proposal.twinId}`;
      const mission: MissionRequest = {
        id:          missionId,
        goal:        `KORE_TWIN_MUTATION:${proposal.twinId}`,
        description: `${proposal.reason} (proposed by ${proposal.proposedBy}, confidence ${proposal.confidence})`,
        requester:   proposal.proposedBy,
      };

      const aegisResult = await AegisShield.evaluatePolicy(mission);

      if (aegisResult.action === 'DENY') {
        console.error(`[KORE Transaction] Rolled back: AEGIS denied ${proposal.twinId} — ${aegisResult.reason}`);
        transaction.status = 'ROLLED_BACK';
        void AegisShield.writeToLedger(missionId, proposal.proposedBy, 'KORE_MUTATION_DENIED', 'BLOCKED', {
          riskScore:        aegisResult.riskScore,
          policyEvaluated:  aegisResult.policiesEvaluated,
          executionDetails: { twinId: proposal.twinId, reason: aegisResult.reason },
        });
        return false;
      }

      if (aegisResult.action === 'REQUIRE_APPROVAL') {
        console.warn(`[KORE Transaction] Held for approval: ${proposal.twinId} — ${aegisResult.reason}`);
        transaction.status = 'PENDING';
        void AegisShield.writeToLedger(missionId, proposal.proposedBy, 'KORE_MUTATION_PENDING_APPROVAL', 'PENDING', {
          riskScore:        aegisResult.riskScore,
          policyEvaluated:  aegisResult.policiesEvaluated,
          executionDetails: { twinId: proposal.twinId, reason: aegisResult.reason },
        });
        return false;
      }
    }

    // 2. Commit Phase
    for (const proposal of transaction.proposals) {
      const currentTwin = TwinRegistry.get(proposal.twinId);
      if (!currentTwin) continue;

      const newTwin = CommitEngine.apply(currentTwin, proposal);
      TwinRegistry.register(newTwin);

      void AegisShield.writeToLedger(
        `KORE_TX_${transaction.transactionId}_${proposal.twinId}`,
        proposal.proposedBy,
        'KORE_MUTATION_COMMITTED',
        'SUCCESS',
        { executionDetails: { twinId: proposal.twinId, version: newTwin.version } },
      );

      KeosEventBus.publish('TWIN_VERSION_CREATED', {
        twinId: newTwin.identity.twinId,
        version: newTwin.version
      });
    }

    transaction.status = 'COMMITTED';
    return true;
  }
}

export class KoreRuntimeManager {
  static createTwin(type: TwinType, initialState: Record<string, any> = {}, capabilities: string[] = []): EnterpriseDigitalTwin {
    const identity = IdentityEngine.generateId(type);
    const twin: EnterpriseDigitalTwin = {
      identity,
      version: 1,
      lifecycle: 'CREATED',
      state: initialState,
      capabilities
    };

    TwinRegistry.register(twin);
    KeosEventBus.publish('TWIN_CREATED', { twinId: identity.twinId, type });
    
    return twin;
  }

  static async submitProposal(proposal: TwinMutationProposal): Promise<boolean> {
    const tx: TwinTransaction = {
      transactionId: `TX_${Date.now()}`,
      proposals: [proposal],
      status: 'PENDING'
    };
    return await TransactionEngine.execute(tx);
  }

  static query(kql: KoreQuery): EnterpriseDigitalTwin[] {
    return TwinIndex.executeKQL(kql);
  }

  static getSnapshot(twinId: string, version: number) {
    return SnapshotEngine.getSnapshotAtVersion(twinId, version);
  }
}
