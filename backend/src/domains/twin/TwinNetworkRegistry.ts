import { ITwinNetwork } from '../../os/edtp/contracts/types';

export class TwinNetworkRegistry {
  private static instance: TwinNetworkRegistry;
  private readonly networks: Map<string, ITwinNetwork> = new Map();

  private constructor() {}

  public static getInstance(): TwinNetworkRegistry {
    if (!TwinNetworkRegistry.instance) {
      TwinNetworkRegistry.instance = new TwinNetworkRegistry();
    }
    return TwinNetworkRegistry.instance;
  }

  public registerNetwork(network: ITwinNetwork): void {
    if (this.networks.has(network.networkId)) {
      throw new Error(`[TwinNetworkRegistry] Network '${network.networkId}' is already registered.`)
    }
    console.log(`[TwinNetworkRegistry] Registered Network: ${network.name}`);
    this.networks.set(network.networkId, network);
  }

  public getNetwork(networkId: string): ITwinNetwork | undefined {
    return this.networks.get(networkId);
  }

  public getAllNetworks(): ITwinNetwork[] {
    return Array.from(this.networks.values());
  }
}
