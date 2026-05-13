import type { Express } from 'express';
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
  mountCronRoutes(app);

  KangqoreVisCronManager.initialize();

  console.log(
    `   -> ${MODULE_IDS.length} modules registered, ${KangqoreVisRegistry.listAdapters().length} adapters wired (all unconnected by default).`
  );
}
