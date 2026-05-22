// ---------------------------------------------------------------------------
// KIMMP — Kangqore Intelligence Mind Management Processor
// Module entry point.
//
// KIMMP is Kangqore's mother intelligence layer — the brain that connects
// eQORE, eQORE Lead Intelligence, ALIS, and VIS. PR 1 ships its first faculty:
// the Human Behavior Intelligence Layer (two-tier behavior analysis).
//
// See ./README.md for architecture and roadmap.
// ---------------------------------------------------------------------------

export { kangqoreImmpRoutes } from './routes';
export { KIMMP_VERSION } from './core/types';
export { KimmpFlags } from './core/flags';
export { BehaviorAnalyzer } from './behavior/behaviorAnalyzer.service';
export { KimmpEqoreShadowObserver } from './eqore-bridge/eqoreShadowObserver.service';
export { KimmpEqoreInfluence } from './eqore-bridge/eqoreInfluence.service';
export { SignalLedger } from './signals/signalLedger.service';
export type { BehaviorProfile, BehaviorSignal, AnalyzeInput } from './core/types';
