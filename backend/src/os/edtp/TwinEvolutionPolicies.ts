import { ITwinNetwork, TwinMutation, TwinEvolutionPolicy } from './contracts/types';

export const TwinEvolutionPolicies = {
  CUSTOMER_TRUST_BOUNDS: {
    policyId: 'TWIN_POL_001',
    name: 'Customer Trust Bounds',
    evaluate: (network: ITwinNetwork, pendingMutation: TwinMutation) => {
      if (network.networkId !== 'TWIN_CUSTOMER') return { passed: true };
      const current = network.getState().customerTrustIndex || 0;
      const proposed = pendingMutation.changes.customerTrustIndex;
      if (proposed !== undefined && (proposed < 0 || proposed > 100)) {
        return { passed: false, reason: `Trust index ${proposed} out of bounds (0-100)` };
      }
      return { passed: true };
    }
  } as TwinEvolutionPolicy,
  
  NON_NEGATIVE_CASH: {
    policyId: 'TWIN_POL_002',
    name: 'Non-Negative Cash Reserves',
    evaluate: (network: ITwinNetwork, pendingMutation: TwinMutation) => {
      if (network.networkId !== 'TWIN_FINANCE') return { passed: true };
      const proposed = pendingMutation.changes.cashReserves;
      if (proposed !== undefined && proposed < 0) {
        return { passed: false, reason: `Cash reserves cannot be negative (${proposed})` };
      }
      return { passed: true };
    }
  } as TwinEvolutionPolicy,
  
  MAX_CHURN_LIMIT: {
    policyId: 'TWIN_POL_003',
    name: 'Max Monthly Churn Limit',
    evaluate: (network: ITwinNetwork, pendingMutation: TwinMutation) => {
      if (network.networkId !== 'TWIN_CUSTOMER') return { passed: true };
      const proposed = pendingMutation.changes.baseChurnRate;
      if (proposed !== undefined && proposed > 50) {
        return { passed: false, reason: `Base churn rate exceeds extreme bounds (${proposed}%)` };
      }
      return { passed: true };
    }
  } as TwinEvolutionPolicy,

  getAllPolicies: () => [
    TwinEvolutionPolicies.CUSTOMER_TRUST_BOUNDS,
    TwinEvolutionPolicies.NON_NEGATIVE_CASH,
    TwinEvolutionPolicies.MAX_CHURN_LIMIT
  ]
};
