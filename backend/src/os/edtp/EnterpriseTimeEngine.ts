import { SimulationBranch, EnterpriseTwinSnapshot } from './contracts/types';

export class EnterpriseTimeEngine {
  private readonly branches: Map<string, SimulationBranch> = new Map();

  public createBranch(
    branchId: string, 
    snapshot: EnterpriseTwinSnapshot,
    assumptions: string[] = [],
    constraints: string[] = []
  ): SimulationBranch {
    console.log(`\n[EnterpriseTimeEngine] Creating SimulationBranch: ${branchId} from Snapshot: ${snapshot.snapshotId}`);
    
    // In a real system, we would clone the actual twin networks from the TwinNetworkRegistry
    // For now, we initialize an empty map that the TwinHydrator or ESF will populate
    const branch: SimulationBranch = {
      branchId,
      parentSnapshotId: snapshot.snapshotId,
      assumptions,
      constraints,
      currentSimulatedDate: new Date(snapshot.capturedAt),
      twinNetworks: new Map(),
      executionStatus: 'INITIALIZED',
      simulationMetrics: {}
    };

    this.branches.set(branchId, branch);
    return branch;
  }

  public getBranch(branchId: string): SimulationBranch | undefined {
    return this.branches.get(branchId);
  }

  public advance(branchId: string, days: number): void {
    const branch = this.branches.get(branchId);
    if (!branch) {
      throw new Error(`Branch ${branchId} not found.`);
    }

    if (branch.executionStatus === 'INITIALIZED') {
      branch.executionStatus = 'RUNNING';
    }

    const current = branch.currentSimulatedDate;
    branch.currentSimulatedDate = new Date(current.getTime() + days * 24 * 60 * 60 * 1000);
    console.log(`[EnterpriseTimeEngine] Branch ${branchId} advanced ${days} days. Simulated Date: ${branch.currentSimulatedDate.toISOString().split('T')[0]}`);
  }

  public checkpoint(branchId: string): string {
    const branch = this.branches.get(branchId);
    if (!branch) throw new Error('Branch not found');
    const checkpointId = `CHK_${branchId}_${Date.now()}`;
    console.log(`[EnterpriseTimeEngine] Checkpoint created for ${branchId}: ${checkpointId}`);
    // Real implementation would deep-copy the twinNetworks state
    return checkpointId;
  }

  public archive(branchId: string): void {
    const branch = this.branches.get(branchId);
    if (branch) {
      branch.executionStatus = 'ARCHIVED';
      console.log(`[EnterpriseTimeEngine] Branch ${branchId} ARCHIVED.`);
    }
  }
}
