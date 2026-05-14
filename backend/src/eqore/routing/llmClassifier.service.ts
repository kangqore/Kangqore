/**
 * eQORE Intent Gateway — LLM Classifier Service (Phase 6)
 * 
 * Provides an abstraction over the configured router model provider.
 */

import { EqoreRoutingDecision } from './intentSchema';
import { RouterClassificationInput, RouterModelProvider } from './routerModelProvider';
import { AnthropicHaikuRouterProvider } from './anthropicHaikuProvider';
import logger from '../../utils/logger';

export class LlmClassifierService {
  private static provider: RouterModelProvider | null = null;

  private static getProvider(): RouterModelProvider {
    if (!this.provider) {
      const providerName = process.env.EQORE_ROUTER_PROVIDER || 'anthropic';
      
      switch (providerName.toLowerCase()) {
        case 'anthropic':
        default:
          this.provider = new AnthropicHaikuRouterProvider();
          break;
        // Future extensions for local LLM:
        // case 'ollama':
        //   this.provider = new OllamaRouterProvider();
        //   break;
        // case 'vllm':
        //   this.provider = new VllmRouterProvider();
        //   break;
      }
    }
    return this.provider;
  }

  static async classify(input: RouterClassificationInput): Promise<EqoreRoutingDecision> {
    try {
      const provider = this.getProvider();
      return await provider.classify(input);
    } catch (error) {
      logger.error('LlmClassifierService classification failed:', error);
      throw error;
    }
  }
}
