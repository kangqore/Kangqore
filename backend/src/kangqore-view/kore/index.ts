// Kangqore Object Runtime Engine (Kore) — Barrel Export
//
// WorkItemService and DependencyGraph were removed: both queried
// `(prisma as any).workItem`, a model that never existed, so every call threw
// at runtime while the `as any` kept tsc quiet. Their replacements are
// ontology-backed — see kangqore-view/eof/WorkViewService.
export * from './KoreRuntimeManager';
export * from './types';
