/**
 * nlp-parse.ts
 * ─────────────────────────────────────────────────────────────
 * POST /api/scheduling/nlp-parse
 *
 * Server-side NLP date/time parser powered by chrono-node.
 * Accepts natural-language scheduling text and returns a
 * structured ParsedSchedulingIntent consumable by the
 * BookingWidget and InlineSchedulingCard.
 *
 * Handles:
 *   "next Friday afternoon"
 *   "sometime next week"
 *   "30-minute call in the morning"
 *   "book after lunch tomorrow"
 *   "reschedule to any available slot before 5"
 *   "Thursday at 2pm"
 *   "tomorrow at 10:00 AM"
 *
 * The core parser is exported as `parseSchedulingText()` so other
 * callers (e.g. the voice assistant's conversation agent) can reuse
 * the exact same intent-extraction logic instead of duplicating it.
 */

import { Router, Request, Response, NextFunction } from 'express';
import * as chrono from 'chrono-node';
import {
  addDays,
  startOfWeek,
  format,
} from 'date-fns';

const router = Router();

// ─── Time-of-day ranges (24h) ──────────────────────────────────────────────
const TIME_RANGES: Record<string, { start: number; end: number }> = {
  morning:   { start: 9,  end: 12 },
  afternoon: { start: 13, end: 17 },
  evening:   { start: 17, end: 20 },
  lunch:     { start: 12, end: 14 },
};

// ─── Duration extraction regex ─────────────────────────────────────────────
const DURATION_RX = /(\d+)\s*[-–]?\s*(minute|min|hour|hr)s?\b/i;

// ─── Helper: format hour to "2:00 PM" style ────────────────────────────────
function hourToTimeStr(h: number, m: number = 0): string {
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h > 12 ? h - 12 : h || 12;
  return `${displayH}:${String(m).padStart(2, '0')} ${ampm}`;
}

export interface ParsedSchedulingIntent {
  understood: boolean;
  targetDate: string | null; // ISO string
  timeStr: string | null;
  timeRange: { start: number; end: number } | null;
  durationHint: number | null;
  summary: string;
  type: 'exact' | 'fuzzy' | 'week' | 'unknown';
  chrono: { text: string; index: number; refDate: string } | null;
}

/**
 * Core NLP scheduling-intent extraction. Shared by the /nlp-parse HTTP
 * route and the voice assistant's conversation agent.
 */
export function parseSchedulingText(text: string, timezone?: string): ParsedSchedulingIntent {
  if (!text || typeof text !== 'string') {
    return {
      understood: false,
      targetDate: null,
      timeStr: null,
      timeRange: null,
      durationHint: null,
      summary: '',
      type: 'unknown',
      chrono: null,
    };
  }

  const input = text.toLowerCase().trim();
  const now = new Date();

  // ═══ 1. CHRONO-NODE PARSE ═══════════════════════════════════════════════
  const chronoResults = chrono.parse(input, {
    instant: now,
    timezone: timezone || undefined,
  });

  let targetDate: Date | null = null;
  let timeStr: string | null = null;
  let timeRange: { start: number; end: number } | null = null;
  let type: 'exact' | 'fuzzy' | 'week' | 'unknown' = 'unknown';

  if (chronoResults.length > 0) {
    const primary = chronoResults[0];
    const start = primary.start;

    // Extract the date chrono found
    targetDate = start.date();

    // Check if chrono identified a specific hour
    if (start.isCertain('hour')) {
      const h = start.get('hour') ?? 0;
      const m = start.get('minute') ?? 0;
      timeStr = hourToTimeStr(h, m);
      type = 'exact';
    } else {
      // Chrono parsed a date but not a precise time
      type = 'fuzzy';
    }
  }

  // ═══ 2. TIME-OF-DAY KEYWORD ENRICHMENT ══════════════════════════════════
  // chrono doesn't resolve "morning", "afternoon", "after lunch" into ranges
  if (!timeStr) {
    if (/\bafter\s+lunch\b/.test(input)) {
      timeRange = TIME_RANGES.lunch;
      type = type === 'unknown' ? 'fuzzy' : type;
    } else if (/\bmorning\b/.test(input)) {
      timeRange = TIME_RANGES.morning;
      type = type === 'unknown' ? 'fuzzy' : type;
    } else if (/\bafternoon\b/.test(input)) {
      timeRange = TIME_RANGES.afternoon;
      type = type === 'unknown' ? 'fuzzy' : type;
    } else if (/\bevening\b/.test(input)) {
      timeRange = TIME_RANGES.evening;
      type = type === 'unknown' ? 'fuzzy' : type;
    }
  }

  // ═══ 3. "BEFORE X" / "AFTER X" RANGE ═══════════════════════════════════
  if (!timeStr && !timeRange) {
    const beforeMatch = input.match(/\bbefore\s+(\d{1,2})\s*(am|pm)?\b/i);
    if (beforeMatch) {
      let h = parseInt(beforeMatch[1], 10);
      const period = beforeMatch[2]?.toLowerCase();
      if (period === 'pm' && h < 12) h += 12;
      if (!period && h <= 6) h += 12; // "before 5" → 5 PM
      timeRange = { start: 9, end: h };
      type = 'fuzzy';
    }

    const afterMatch = input.match(/\bafter\s+(\d{1,2})\s*(am|pm)?\b/i);
    if (afterMatch && !timeRange) {
      let h = parseInt(afterMatch[1], 10);
      const period = afterMatch[2]?.toLowerCase();
      if (period === 'pm' && h < 12) h += 12;
      if (!period && h <= 6) h += 12;
      timeRange = { start: h, end: 17 };
      type = 'fuzzy';
    }
  }

  // ═══ 4. "NEXT WEEK" / "THIS WEEK" SPECIAL HANDLING ═════════════════════
  if (/\bnext\s+week\b/.test(input)) {
    const nextWeekStart = addDays(startOfWeek(now, { weekStartsOn: 1 }), 7);
    targetDate = nextWeekStart;
    type = 'week';
  } else if (/\bthis\s+week\b/.test(input) && !targetDate) {
    targetDate = now;
    type = 'week';
  }

  // ═══ 5. DEFAULT DATE ════════════════════════════════════════════════════
  if (!targetDate && (timeStr || timeRange)) {
    targetDate = new Date(now); // assume today
  }

  // ═══ 6. DURATION HINT ══════════════════════════════════════════════════
  let durationHint: number | null = null;
  const durationMatch = input.match(DURATION_RX);
  if (durationMatch) {
    const val = parseInt(durationMatch[1], 10);
    const unit = durationMatch[2].toLowerCase();
    durationHint = unit.startsWith('hour') || unit.startsWith('hr') ? val * 60 : val;
  }

  // ═══ 7. BUILD SUMMARY ══════════════════════════════════════════════════
  const understood = !!(targetDate || timeStr || timeRange);
  let summary = '';

  if (understood && targetDate) {
    if (type === 'week') {
      summary = `Showing availability for the week of ${format(targetDate, 'MMM do')}`;
      if (timeRange) {
        summary += `, ${timeRange.start <= 12 ? 'morning' : 'afternoon'} slots`;
      }
    } else if (type === 'exact' && timeStr) {
      summary = `Setting consultation for ${format(targetDate, 'EEEE, MMM do')} at ${timeStr}`;
    } else if (type === 'fuzzy') {
      const dayLabel = format(targetDate, 'EEEE, MMM do');
      if (timeRange) {
        const startLabel = `${timeRange.start <= 12 ? timeRange.start : timeRange.start - 12}${timeRange.start < 12 ? 'AM' : 'PM'}`;
        const endLabel = `${timeRange.end <= 12 ? timeRange.end : timeRange.end - 12}${timeRange.end < 12 ? 'AM' : 'PM'}`;
        summary = `Showing ${dayLabel} slots between ${startLabel}–${endLabel}`;
      } else {
        summary = `Showing availability for ${dayLabel}`;
      }
    } else {
      summary = `Showing availability for ${format(targetDate, 'EEEE, MMM do')}`;
    }
  }

  return {
    understood,
    targetDate: targetDate?.toISOString() ?? null,
    timeStr,
    timeRange,
    durationHint,
    summary,
    type,
    chrono: chronoResults.length > 0
      ? {
          text: chronoResults[0].text,
          index: chronoResults[0].index,
          refDate: now.toISOString(),
        }
      : null,
  };
}

/**
 * POST /api/scheduling/nlp-parse
 * Body: { text: string, timezone?: string }
 * Returns: ParsedSchedulingIntent
 */
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text, timezone } = req.body;
    return res.json(parseSchedulingText(text, timezone));
  } catch (error) {
    next(error);
  }
});

export default router;
