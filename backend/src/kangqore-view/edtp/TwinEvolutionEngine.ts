import { SimulationBranch, TwinMutation, ITwinNetwork } from './contracts/types';
import { TwinEvolutionPolicies } from './TwinEvolutionPolicies';

export class TwinEvolutionEngine {
  public applyMutation(branch: SimulationBranch, mutation: TwinMutation): boolean {
    console.log(`[TwinEvolutionEngine] Evaluating Mutation for ${mutation.targetNetworkId} in Branch ${branch.branchId}`);
    
    const network = branch.twinNetworks.get(mutation.targetNetworkId);
    if (!network) {
      console.warn(`[TwinEvolutionEngine] Network ${mutation.targetNetworkId} not found in branch ${branch.branchId}`);
      return false;
    }

    const policies = TwinEvolutionPolicies.getAllPolicies();
    for (const policy of policies) {
      const result = policy.evaluate(network, mutation);
      if (!result.passed) {
        console.warn(`[TwinEvolutionEngine] Mutation REJECTED by Policy ${policy.name}: ${result.reason}`);
        return false;
      }
    }

    // Apply valid mutation
    network.applyMutation(mutation);
    console.log(`[TwinEvolutionEngine] Mutation APPLIED successfully to ${network.name}`);
    return true;
  }
}
