import { KeosEventBus } from '../kernel/KeosEventBus';
import { CapabilityResolver } from './registry';
import { EnterpriseAwarenessContext, AwarenessFragment, AwarenessMetadata } from './types';

export class AwarenessEngine {
  /**
   * Evaluates required categories, resolves providers, fetches intelligence,
   * creates fragments, and aggregates them into the Context.
   */
  static async refreshAwareness(): Promise<EnterpriseAwarenessContext> {
    console.log('[Enterprise Awareness] Starting Awareness Refresh Cycle...');

    const requiredCategories = ['visibility', 'market', 'regulation'];
    const fragments: AwarenessFragment[] = [];

    for (const category of requiredCategories) {
      const provider = CapabilityResolver.resolve(category);
      if (!provider) {
        console.warn(`[Enterprise Awareness] No healthy provider found for category: ${category}`);
        KeosEventBus.publish('AWARENESS_PROVIDER_UNAVAILABLE', { category });
        continue;
      }

      // Find the specific capability ID for this category
      const capability = provider.capabilities.find(c => c.category === category);
      if (!capability) continue;

      try {
        const payload = await provider.gatherIntelligence(capability.id);
        
        const fragment: AwarenessFragment = {
          capabilityId: capability.id,
          provider: provider.name,
          timestamp: new Date(),
          confidence: 'HIGH',
          freshness: 'LIVE',
          provenance: `${provider.name}@${provider.health.version}::${capability.id}`,
          payload
        };

        fragments.push(fragment);

        KeosEventBus.publish('AWARENESS_FRAGMENT_CREATED', {
          fragmentId: `${fragment.provider}-${Date.now()}`,
          category
        });

      } catch (e) {
        console.error(`[Enterprise Awareness] Provider ${provider.name} failed to gather ${category}`, e);
      }
    }

    const context = this.aggregate(fragments);

    KeosEventBus.publish('AWARENESS_REFRESH_COMPLETED', {
      fragmentsGathered: fragments.length
    });

    KeosEventBus.publish('AWARENESS_CONTEXT_UPDATED', context);

    return context;
  }

  private static aggregate(fragments: AwarenessFragment[]): EnterpriseAwarenessContext {
    const context: EnterpriseAwarenessContext = {};

    for (const fragment of fragments) {
      const category = fragment.capabilityId.split('.')[1]; // e.g., 'market' from 'kvis.market.intel'
      
      const metadata: AwarenessMetadata = {
        confidence: fragment.confidence,
        freshness: fragment.freshness,
        validUntil: new Date(Date.now() + 3600000), // 1 hour validity
        sourceProvider: fragment.provider,
        version: '1.0'
      };

      if (category === 'visibility') context.visibility = { metadata, data: fragment.payload };
      if (category === 'market') context.market = { metadata, data: fragment.payload };
      if (category === 'regulation') context.regulation = { metadata, data: fragment.payload };
    }

    // Synthesize Threats and Opportunities based on fragments
    context.threats = this.synthesizeThreats(context);
    context.opportunities = this.synthesizeOpportunities(context);

    return context;
  }

  private static synthesizeThreats(context: EnterpriseAwarenessContext) {
    if (context.regulation?.data.riskLevel === 'MODERATE') {
      return {
        metadata: { ...context.regulation.metadata, sourceProvider: 'AwarenessEngineSynthesis' },
        data: { activeThreats: ['Upcoming Regulatory Compliance Requirement'] }
      };
    }
    return undefined;
  }

  private static synthesizeOpportunities(context: EnterpriseAwarenessContext) {
    if (context.market?.data.marketTrend?.includes('Increased demand')) {
      return {
        metadata: { ...context.market.metadata, sourceProvider: 'AwarenessEngineSynthesis' },
        data: { activeOpportunities: ['Capitalize on Autonomous OS demand'] }
      };
    }
    return undefined;
  }
}
