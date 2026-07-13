import { ITwinNetwork, EnterpriseTwinSnapshot, TwinMutation } from '../../os/edtp/contracts/types';

export class FinanceTwinNetwork implements ITwinNetwork {
  networkId = 'TWIN_FINANCE';
  name = 'Finance Twin Network';
  
  private state: any = {};

  hydrate(snapshot: EnterpriseTwinSnapshot): void {
    const initialState = snapshot.twinStates[this.networkId];
    if (initialState) {
      this.state = structuredClone(initialState);
    }
  }

  clone(): ITwinNetwork {
    const clone = new FinanceTwinNetwork();
    clone.state = structuredClone(this.state);
    return clone;
  }

  applyMutation(mutation: TwinMutation): void {
    if (mutation.targetNetworkId !== this.networkId) return;
    
    for (const [key, value] of Object.entries(mutation.changes)) {
      if (this.state[key] !== undefined) {
        this.state[key] = value;
      }
    }
  }

  getState(): Record<string, any> {
    return structuredClone(this.state);
  }
}
