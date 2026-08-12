function bool(name: string, defaultValue: boolean): boolean {
  const raw = process.env[name];
  if (raw === undefined) return defaultValue;
  const v = raw.toLowerCase().trim();
  return v === '1' || v === 'true' || v === 'yes' || v === 'on';
}

export const KangqoreVisFlags = {
  enabled: () => bool('KANGQORE_VIS_ENABLED', true),
  technicalSeo: () => bool('KANGQORE_VIS_TECHNICAL_SEO', true),
  performance: () => bool('KANGQORE_VIS_PERFORMANCE', true),
  contentMapping: () => bool('KANGQORE_VIS_CONTENT_MAPPING', true),
  informationArchitecture: () => bool('KANGQORE_VIS_INFORMATION_ARCHITECTURE', true),
  onPageSeo: () => bool('KANGQORE_VIS_ON_PAGE_SEO', true),
  internalLinking: () => bool('KANGQORE_VIS_INTERNAL_LINKING', true),
  structuredData: () => bool('KANGQORE_VIS_STRUCTURED_DATA', true),
  entityArchitecture: () => bool('KANGQORE_VIS_ENTITY_ARCHITECTURE', true),
  eeat: () => bool('KANGQORE_VIS_EEAT', true),
  authority: () => bool('KANGQORE_VIS_AUTHORITY', true),
  aiAnswerability: () => bool('KANGQORE_VIS_AI_ANSWERABILITY', true),
  sxo: () => bool('KANGQORE_VIS_SXO', true),
  governance: () => bool('KANGQORE_VIS_GOVERNANCE', true),
  conciergeBridge: () => bool('KANGQORE_VIS_CONCIERGE_BRIDGE', true),
  dataSources: () => bool('KANGQORE_VIS_DATA_SOURCES', true),
  kpi: () => bool('KANGQORE_VIS_KPI', true),
  internationalSeo: () => bool('KANGQORE_VIS_INTERNATIONAL_SEO', true),
  localSeo: () => bool('KANGQORE_VIS_LOCAL_SEO', true),
  programmaticSeo: () => bool('KANGQORE_VIS_PROGRAMMATIC_SEO', true),
  geo: () => bool('KANGQORE_VIS_GEO', true),
  cro: () => bool('KANGQORE_VIS_CRO', true),
  uxOptimization: () => bool('KANGQORE_VIS_UX_OPTIMIZATION', true),
  accessibility: () => bool('KANGQORE_VIS_ACCESSIBILITY', true),
  semanticSeo: () => bool('KANGQORE_VIS_SEMANTIC_SEO', true),
  videoSeo: () => bool('KANGQORE_VIS_VIDEO_SEO', true),
  imageSeo: () => bool('KANGQORE_VIS_IMAGE_SEO', true),
  voiceSearch: () => bool('KANGQORE_VIS_VOICE_SEARCH', true),
  multimodalContent: () => bool('KANGQORE_VIS_MULTIMODAL_CONTENT', true),
  intelligence: () => bool('KANGQORE_VIS_INTELLIGENCE', true),
  priorityRegistry: () => bool('KANGQORE_VIS_PRIORITY_REGISTRY', true),
  cronEnabled: () => bool('KANGQORE_VIS_CRON_ENABLED', false),
  governanceMode: (): 'audit' | 'blocking' | 'off' => {
    const raw = (process.env.KANGQORE_VIS_GOVERNANCE_MODE ?? 'audit').toLowerCase().trim();
    if (raw === 'blocking' || raw === 'off') return raw;
    return 'audit';
  },
};

export function logFlagSummary(): void {
  const summary: Record<string, unknown> = {};
  summary.enabled = KangqoreVisFlags.enabled();
  summary.governanceMode = KangqoreVisFlags.governanceMode();
  summary.cronEnabled = KangqoreVisFlags.cronEnabled();
  console.log(`   -> flags: ${JSON.stringify(summary)}`);
}
