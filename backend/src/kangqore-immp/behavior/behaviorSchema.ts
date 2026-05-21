// ---------------------------------------------------------------------------
// KIMMP — validation schemas (zod v4) for inputs and the Tier-2 Claude payload
// ---------------------------------------------------------------------------

import { z } from 'zod';
import { ALL_BEHAVIOR_STATES } from '../core/types';

/** Public analyze-request body. */
export const analyzeInputSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.string().min(1),
        content: z.string(),
      })
    )
    .min(1, 'at least one message is required')
    .max(100, 'too many messages in one request'),
  conversationId: z.string().optional(),
  sessionId: z.string().optional(),
  analyzedRole: z.string().optional(),
});

export type AnalyzeInputParsed = z.infer<typeof analyzeInputSchema>;

/** Structured JSON the Tier-2 reasoner is required to return. */
export const tier2ResponseSchema = z.object({
  states: z
    .array(
      z.object({
        type: z.enum(ALL_BEHAVIOR_STATES as [string, ...string[]]),
        intensity: z.number().min(0).max(1),
        confidence: z.number().min(0).max(1),
        evidence: z.array(z.string()).max(8).default([]),
      })
    )
    .max(9),
  communicationStyle: z.enum(['DIRECT', 'EXPLORATORY', 'ANXIOUS', 'ANALYTICAL', 'NEUTRAL']),
  recommendedResponseMode: z.enum([
    'STANDARD',
    'CALM_ASSURANCE_FIRST',
    'SIMPLIFY',
    'SHOW_PROOF',
    'DISCOVERY',
    'EXECUTIVE',
  ]),
  emotionalSummary: z.string().min(1).max(600),
  traits: z
    .object({
      openness: z.number().min(0).max(1),
      conscientiousness: z.number().min(0).max(1),
      extraversion: z.number().min(0).max(1),
      agreeableness: z.number().min(0).max(1),
      emotionalSensitivity: z.number().min(0).max(1),
    })
    .nullable()
    .optional(),
});

export type Tier2ResponseParsed = z.infer<typeof tier2ResponseSchema>;
