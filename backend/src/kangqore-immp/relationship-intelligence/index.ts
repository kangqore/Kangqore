// Initialize all listeners
import { urgiEventBus } from './events/eventBus';
import { erootPipeline } from './orchestration/eroot.pipeline';
import './orchestration/waanda.iepBuilder';
import './orchestration/eqore.executor';
import './governance/governance.engine';
import './memory/waanda.memoryGovernor';

export const URGIPlatform = {
  processInteraction: (visitorId: string, contextData: any) => {
    return erootPipeline.processVisitorInteraction(visitorId, contextData);
  },
  eventBus: urgiEventBus
};
