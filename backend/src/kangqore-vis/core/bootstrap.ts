import type { Express } from 'express';
import { WAANDA } from '../../waanda/WaandaBootstrap';
import { KangqoreVisRegistry } from './KangqoreVisRegistry';
import { KANGQORE_VIS_VERSION } from './types';
import { KangqoreVisFlags, logFlagSummary } from './flags';

import { registerDataSources } from '../data-sources';
import { mountTechnicalSeoRoutes } from '../technical-seo/routes';
import { mountStructuredDataRoutes } from '../structured-data/routes';
import { mountContentMappingRoutes } from '../content-mapping/routes';
import { mountInformationArchitectureRoutes } from '../information-architecture/routes';
import { mountOnPageSeoRoutes } from '../on-page-seo/routes';
import { mountInternalLinkingRoutes } from '../internal-linking/routes';
import { mountEntityArchitectureRoutes } from '../entity-architecture/routes';
import { mountEeatRoutes } from '../eeat/routes';
import { mountAuthorityRoutes } from '../authority/routes';
import { mountAiAnswerabilityRoutes } from '../ai-answerability/routes';
import { mountSxoRoutes } from '../sxo/routes';
import { mountGovernanceRoutes } from '../governance/routes';
import { mountConciergeBridgeRoutes } from '../concierge-bridge/routes';
import { mountDataSourcesRoutes } from '../data-sources/routes';
import { mountKpiRoutes } from '../kpi/routes';
import { mountPerformanceRoutes } from '../performance/routes';
import { mountCronRoutes } from '../cron/routes';
import { KangqoreVisCronManager } from '../cron/KangqoreVisCronManager';
import { mountInternationalSeoRoutes } from '../international-seo/routes';
import { mountLocalSeoRoutes } from '../local-seo/routes';
import { mountProgrammaticSeoRoutes } from '../programmatic-seo/routes';
import { mountGeoRoutes } from '../geo/routes';
import { mountCroRoutes } from '../cro/routes';
import { mountUxOptimizationRoutes } from '../ux-optimization/routes';
import { mountAccessibilityRoutes } from '../accessibility/routes';
import { mountSemanticSeoRoutes } from '../semantic-seo/routes';
import { mountVideoSeoRoutes } from '../video-seo/routes';
import { mountImageSeoRoutes } from '../image-seo/routes';
import { mountVoiceSearchRoutes } from '../voice-search/routes';
import { mountMultimodalContentRoutes } from '../multimodal-content/routes';
import { mountIntelligenceRoutes } from '../intelligence/routes';
import { mountPriorityRegistryRoutes } from '../priority-registry/routes';

export interface KangqoreVisBootstrapOptions {
  app: Express;
}

const MODULE_IDS = [
  'core',
  'technical-seo',
  'performance',
  'content-mapping',
  'information-architecture',
  'on-page-seo',
  'internal-linking',
  'structured-data',
  'entity-architecture',
  'eeat',
  'authority',
  'ai-answerability',
  'sxo',
  'governance',
  'concierge-bridge',
  'data-sources',
  'cron',
  'kpi',
  'international-seo',
  'local-seo',
  'programmatic-seo',
  'geo',
  'cro',
  'ux-optimization',
  'accessibility',
  'semantic-seo',
  'video-seo',
  'image-seo',
  'voice-search',
  'multimodal-content',
  'intelligence',
  'priority-registry',
];

export function kangqoreVisBootstrap({ app }: KangqoreVisBootstrapOptions): void {
  if (!KangqoreVisFlags.enabled()) {
    console.log('⚡ KangqoreVis disabled via KANGQORE_VIS_ENABLED=false — skipping bootstrap.');
    return;
  }

  console.log(`⚡ KangqoreVis v${KANGQORE_VIS_VERSION} bootstrapping…`);
  logFlagSummary();

  for (const id of MODULE_IDS) {
    KangqoreVisRegistry.registerModule({ id, description: `KangqoreVis ${id} module` });
  }

  if (KangqoreVisFlags.dataSources()) registerDataSources();

  if (KangqoreVisFlags.technicalSeo()) mountTechnicalSeoRoutes(app);
  if (KangqoreVisFlags.performance()) mountPerformanceRoutes(app);
  if (KangqoreVisFlags.structuredData()) mountStructuredDataRoutes(app);
  if (KangqoreVisFlags.contentMapping()) mountContentMappingRoutes(app);
  if (KangqoreVisFlags.informationArchitecture()) mountInformationArchitectureRoutes(app);
  if (KangqoreVisFlags.onPageSeo()) mountOnPageSeoRoutes(app);
  if (KangqoreVisFlags.internalLinking()) mountInternalLinkingRoutes(app);
  if (KangqoreVisFlags.entityArchitecture()) mountEntityArchitectureRoutes(app);
  if (KangqoreVisFlags.eeat()) mountEeatRoutes(app);
  if (KangqoreVisFlags.authority()) mountAuthorityRoutes(app);
  if (KangqoreVisFlags.aiAnswerability()) mountAiAnswerabilityRoutes(app);
  if (KangqoreVisFlags.sxo()) mountSxoRoutes(app);
  if (KangqoreVisFlags.governance()) mountGovernanceRoutes(app);
  if (KangqoreVisFlags.conciergeBridge()) mountConciergeBridgeRoutes(app);
  if (KangqoreVisFlags.dataSources()) mountDataSourcesRoutes(app);
  if (KangqoreVisFlags.kpi()) mountKpiRoutes(app);
  if (KangqoreVisFlags.internationalSeo()) mountInternationalSeoRoutes(app);
  if (KangqoreVisFlags.localSeo()) mountLocalSeoRoutes(app);
  if (KangqoreVisFlags.programmaticSeo()) mountProgrammaticSeoRoutes(app);
  if (KangqoreVisFlags.geo()) mountGeoRoutes(app);
  if (KangqoreVisFlags.cro()) mountCroRoutes(app);
  if (KangqoreVisFlags.uxOptimization()) mountUxOptimizationRoutes(app);
  if (KangqoreVisFlags.accessibility()) mountAccessibilityRoutes(app);
  if (KangqoreVisFlags.semanticSeo()) mountSemanticSeoRoutes(app);
  if (KangqoreVisFlags.videoSeo()) mountVideoSeoRoutes(app);
  if (KangqoreVisFlags.imageSeo()) mountImageSeoRoutes(app);
  if (KangqoreVisFlags.voiceSearch()) mountVoiceSearchRoutes(app);
  if (KangqoreVisFlags.multimodalContent()) mountMultimodalContentRoutes(app);
  if (KangqoreVisFlags.intelligence()) mountIntelligenceRoutes(app);
  if (KangqoreVisFlags.priorityRegistry()) mountPriorityRegistryRoutes(app);
  mountCronRoutes(app);

  KangqoreVisCronManager.initialize();

  const adapterCount = KangqoreVisRegistry.listAdapters().length;
  const cronJobs     = KangqoreVisCronManager.list();

  console.log(
    `   -> ${MODULE_IDS.length} modules registered, ${adapterCount} adapters wired (all unconnected by default).`
  );

  // Report to WAANDA so the OS has visibility into VIS lifecycle and cron state.
  WAANDA.reportSubsystem('vis', {
    status:  'OPERATIONAL',
    details: {
      version:           KANGQORE_VIS_VERSION,
      modulesRegistered: MODULE_IDS.length,
      adaptersWired:     adapterCount,
      cronJobs:          cronJobs.map(j => ({ id: j.id, cron: j.cron, enabled: j.enabled })),
    },
  });
}
