import { IntelligenceProvider } from './types';
import { KeosEventBus } from '../kernel/KeosEventBus';

export class IntelligenceRegistry {
  private static providers: Map<string, IntelligenceProvider> = new Map();

  static register(provider: IntelligenceProvider) {
    this.providers.set(provider.name, provider);
    console.log(`[Intelligence Registry] Registered Provider: ${provider.name}`);
    
    // Broadcast Provider Registration Event
    KeosEventBus.publish('AWARENESS_PROVIDER_REGISTERED', {
      provider: provider.name,
      capabilities: provider.capabilities.map(c => c.id)
    });
  }

  static getProvider(name: string): IntelligenceProvider | undefined {
    return this.providers.get(name);
  }

  static getAllProviders(): IntelligenceProvider[] {
    return Array.from(this.providers.values());
  }
}

export class CapabilityResolver {
  /**
   * Resolves the best (highest priority and healthy) provider for a given capability category.
   */
  static resolve(category: string): IntelligenceProvider | undefined {
    const allProviders = IntelligenceRegistry.getAllProviders();
    
    // Filter providers that support this category and are healthy
    const capableProviders = allProviders.filter(provider => 
      provider.health.healthy && 
      provider.capabilities.some(cap => cap.category === category)
    );

    if (capableProviders.length === 0) {
      return undefined;
    }

    // Sort by priority descending
    capableProviders.sort((a, b) => b.priority - a.priority);

    return capableProviders[0];
  }
}
