// ---------------------------------------------------------------------------
// KIMMP Signal Ledger — signal taxonomy + ingest validation (zod v4)
// ---------------------------------------------------------------------------

import { z } from 'zod';

/** Which system a signal came from. */
export const SIGNAL_SOURCE_MODULES = [
  'eqore',
  'lead-intelligence',
  'alis',
  'vis',
  'kimmp',
] as const;

/** The kind of signal — drives which consumer cares about it. */
export const SIGNAL_CATEGORIES = [
  'BEHAVIOR',
  'INTENT',
  'MARKET',
  'CONTENT',
  'RISK',
  'SYSTEM',
] as const;

export const SIGNAL_SEVERITIES = ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'] as const;
export const SIGNAL_STATUSES = ['NEW', 'PROCESSED', 'DISMISSED'] as const;

/** Body accepted by POST /signals — also used internally by signal producers. */
export const signalIngestSchema = z.object({
  sourceModule: z.enum(SIGNAL_SOURCE_MODULES),
  signalType: z.string().min(1).max(80),
  signalCategory: z.enum(SIGNAL_CATEGORIES),
  signalValue: z.string().min(1).max(500),
  confidence: z.number().min(0).max(1).default(0),
  severity: z.enum(SIGNAL_SEVERITIES).default('LOW'),
  conversationId: z.string().optional(),
  leadId: z.string().optional(),
  sessionId: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type SignalIngestInput = z.infer<typeof signalIngestSchema>;
