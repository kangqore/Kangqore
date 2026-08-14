import { ITwinNetwork, EnterpriseTwinSnapshot, TwinMutation } from '../../kangqore-view/edtp/contracts/types';

export class CustomerTwinNetwork implements ITwinNetwork {
  networkId = 'TWIN_CUSTOMER';
  name = 'Customer Twin Network';
  
  private state: any = {};

  hydrate(snapshot: EnterpriseTwinSnapshot): void {
    const initialState = snapshot.twinStates[this.networkId];
    if (initialState) {
      // Deep clone to ensure we own this simulation state
      this.state = structuredClone(initialState);
    }
  }

  clone(): ITwinNetwork {
    const clone = new CustomerTwinNetwork();
    clone.state = structuredClone(this.state);
    return clone;
  }

  applyMutation(mutation: TwinMutation): void {
    if (mutation.targetNetworkId !== this.networkId) return;
    
    // Apply changes
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
