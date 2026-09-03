// ---------------------------------------------------------------------------
// WAANDA Constitutional Types
//
// The cognitive lifecycle is the constitutional law of Kangqore OS:
//   Observe → Understand → Decide → Act → Learn
//
// Every subsystem maps to exactly one stage. A subsystem that doesn't map
// to a stage has no place in the OS.
// ---------------------------------------------------------------------------

export type CognitiveStage = 'OBSERVE' | 'UNDERSTAND' | 'DECIDE' | 'ACT' | 'LEARN'

export interface WaandaCognitivePipeline {
  stage:      CognitiveStage
  question:   string        // The CEO question this stage answers
  subsystems: string[]      // Subsystems registered to this stage
  status:     'ACTIVE' | 'DEGRADED' | 'INACTIVE'
}

// The constitutional map — every subsystem's stage assignment.
// Adding a new subsystem requires declaring which cognitive stage it extends.
export const COGNITIVE_STAGE_MAP: Record<string, CognitiveStage> = {
  // OBSERVE — WAANDA perceives reality
  'kore':          'OBSERVE',
  'eroot':         'OBSERVE',
  'signals':       'OBSERVE',
  'evidence':      'OBSERVE',
  'alis':          'OBSERVE',  // Autonomous Lead Intelligence System — perception layer
  'eqore':         'OBSERVE',  // Conversation AI — perceives visitor intent
  'vis':           'OBSERVE',  // Visitor Intelligence — web perception
  'awareness':     'OBSERVE',  // OS awareness layer
  'perception':    'OBSERVE',  // OS perception engine

  // UNDERSTAND — WAANDA composes meaning from what it perceived
  'urgi':          'UNDERSTAND',
  'twins':         'UNDERSTAND',
  'knowledge':     'UNDERSTAND',
  'edf':           'UNDERSTAND',  // Enterprise Domain Framework — structures understanding
  'edtp':          'UNDERSTAND',  // Digital Twin evolution — deepens profile understanding
  'rag':           'UNDERSTAND',  // Retrieval-augmented generation — enriches understanding

  // DECIDE — WAANDA reasons toward a position
  'ecf':           'DECIDE',      // Executive Cortex Framework
  'epf':           'DECIDE',      // Enterprise Prediction Framework
  'simulation':    'DECIDE',
  'optimization':  'DECIDE',      // Enterprise Optimization (eof)
  'planner':       'DECIDE',
  'decision':      'DECIDE',

  // ACT — WAANDA executes governed by HANUMANAS
  'kimmp':         'ACT',
  'mission':       'ACT',
  'keos':          'ACT',
  'hanumanas':         'ACT',
  'capabilities':  'ACT',
  'automation':    'ACT',
  'kernel':        'ACT',

  // LEARN — WAANDA improves from outcomes
  'learning':      'LEARN',
  'feedback':      'LEARN',
  'memory':        'LEARN',
  'observability': 'LEARN',  // System observability feeds back into WAANDA's self-awareness
}

// The five CEO questions — UI contract. Screens must answer these, not expose engineering names.
export const STAGE_QUESTIONS: Record<CognitiveStage, string> = {
  OBSERVE:    'What is happening?',
  UNDERSTAND: 'Why is it happening?',
  DECIDE:     'What should we do?',
  ACT:        'What are we doing?',
  LEARN:      'What did we learn?',
}
