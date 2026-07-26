/**
 * nlpSchedulingParser.js
 * ─────────────────────────────────────────────────────────────
 * Advanced NLP date/time parser for eQORE scheduling automation.
 *
 * Handles natural language scheduling requests:
 *   "next Friday afternoon"
 *   "sometime next week"
 *   "30-minute call in the morning"
 *   "book after lunch tomorrow"
 *   "reschedule to any available slot before 5"
 *   "Thursday at 2pm"
 *   "tomorrow at 10:00 AM"
 *
 * Returns a structured intent object that the BookingWidget can consume.
 */

import { addDays, startOfWeek, endOfWeek, format, setHours, setMinutes } from 'date-fns';

// ─── Time-of-day ranges (in 24h) ──────────────────────────────────────────────
const TIME_RANGES = {
  morning:   { start: 9,  end: 12 },
  afternoon: { start: 13, end: 17 },
  evening:   { start: 17, end: 20 },
  lunch:     { start: 12, end: 14 },  // "after lunch" → 12-2pm range
};

// ─── Day name mapping ─────────────────────────────────────────────────────────
const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

/**
 * @typedef {Object} ParsedSchedulingIntent
 * @property {boolean} understood   - Whether we parsed something useful
 * @property {Date|null} targetDate - The resolved target date
 * @property {string|null} timeStr  - Exact time string (e.g. "2:00 PM") or null
 * @property {Object|null} timeRange - { start: hour, end: hour } for fuzzy time
 * @property {string} summary      - Human-readable summary of what we understood
 * @property {string} type         - 'exact' | 'fuzzy' | 'week' | 'unknown'
 */

/**
 * Parse a natural language scheduling request.
 * @param {string} input - The user's raw text
 * @returns {ParsedSchedulingIntent}
 */
export function parseSchedulingRequest(input) {
  if (!input || typeof input !== 'string') {
    return { understood: false, targetDate: null, timeStr: null, timeRange: null, summary: '', type: 'unknown' };
  }

  const text = input.toLowerCase().trim();
  const now = new Date();

  let targetDate = null;
  let timeStr = null;
  let timeRange = null;
  let type = 'unknown';

  // ═══ 1. EXTRACT DATE ═══════════════════════════════════════════════════════

  // "today"
  if (/\btoday\b/.test(text)) {
    targetDate = new Date(now);
  }

  // "tomorrow"
  if (/\btomorrow\b/.test(text)) {
    targetDate = addDays(now, 1);
  }

  // "day after tomorrow"
  if (/\bday after tomorrow\b/.test(text)) {
    targetDate = addDays(now, 2);
  }

  // "next week" / "sometime next week"
  if (/\bnext week\b/.test(text)) {
    // Return Monday of next week
    const nextWeekStart = addDays(startOfWeek(now, { weekStartsOn: 1 }), 7);
    targetDate = nextWeekStart;
    type = 'week';
  }

  // "this week"
  if (/\bthis week\b/.test(text) && !targetDate) {
    targetDate = now;
    type = 'week';
  }

  // "next <day>" — e.g. "next friday", "next monday"
  const nextDayMatch = text.match(/\bnext\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/);
  if (nextDayMatch) {
    const targetDayIdx = DAYS.indexOf(nextDayMatch[1]);
    const todayIdx = now.getDay();
    let diff = targetDayIdx - todayIdx;
    if (diff <= 0) diff += 7; // Always goes to *next* occurrence
    targetDate = addDays(now, diff);
    type = 'fuzzy';
  }

  // Bare day name without "next" — e.g. "friday at 2pm"
  if (!targetDate) {
    const bareDayMatch = text.match(/\b(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/);
    if (bareDayMatch) {
      const targetDayIdx = DAYS.indexOf(bareDayMatch[1]);
      const todayIdx = now.getDay();
      let diff = targetDayIdx - todayIdx;
      if (diff <= 0) diff += 7;
      targetDate = addDays(now, diff);
    }
  }

  // "in X days"
  const inDaysMatch = text.match(/\bin\s+(\d+)\s+days?\b/);
  if (inDaysMatch) {
    targetDate = addDays(now, parseInt(inDaysMatch[1], 10));
  }

  // Explicit dates: "27th july", "july 27", "27 july"
  if (!targetDate) {
    const explicitDateMatch = text.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b|\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2})(?:st|nd|rd|th)?\b/);
    if (explicitDateMatch) {
      const day = parseInt(explicitDateMatch[1] || explicitDateMatch[4], 10);
      const monthStr = explicitDateMatch[2] || explicitDateMatch[3];
      const monthMap = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11, january: 0, february: 1, march: 2, april: 3, june: 5, july: 6, august: 7, september: 8, october: 9, november: 10, december: 11 };
      const month = monthMap[monthStr];
      const year = now.getFullYear();
      let parsedDate = new Date(year, month, day);
      if (parsedDate < now && (now - parsedDate) > 24 * 60 * 60 * 1000) {
        parsedDate.setFullYear(year + 1);
      }
      targetDate = parsedDate;
      type = 'exact';
    }
  }

  // ═══ 2. EXTRACT TIME ═══════════════════════════════════════════════════════

  // Exact time: "10:00 AM", "2pm", "3:30 pm", "10 am"
  const exactTimeMatch = text.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (exactTimeMatch) {
    let hours = parseInt(exactTimeMatch[1], 10);
    const mins = exactTimeMatch[2] || '00';
    const ampm = exactTimeMatch[3].toUpperCase();
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    timeStr = `${hours > 12 ? hours - 12 : hours || 12}:${mins} ${ampm}`;
    type = 'exact';
  }

  // "before X" — e.g. "before 5", "before 5pm"
  const beforeMatch = text.match(/\bbefore\s+(\d{1,2})\s*(am|pm)?\b/i);
  if (beforeMatch && !timeStr) {
    let h = parseInt(beforeMatch[1], 10);
    const period = beforeMatch[2]?.toLowerCase();
    if (period === 'pm' && h < 12) h += 12;
    if (!period && h <= 6) h += 12; // "before 5" likely means 5pm
    timeRange = { start: 9, end: h };
    type = 'fuzzy';
  }

  // "after X" — e.g. "after 2", "after 2pm", "after lunch"
  const afterMatch = text.match(/\bafter\s+(\d{1,2})\s*(am|pm)?\b/i);
  if (afterMatch && !timeStr && !timeRange) {
    let h = parseInt(afterMatch[1], 10);
    const period = afterMatch[2]?.toLowerCase();
    if (period === 'pm' && h < 12) h += 12;
    if (!period && h <= 6) h += 12;
    timeRange = { start: h, end: 17 };
    type = 'fuzzy';
  }

  // Time-of-day keywords: "morning", "afternoon", "evening", "after lunch"
  if (!timeStr && !timeRange) {
    if (/\bafter\s+lunch\b/.test(text)) {
      timeRange = TIME_RANGES.lunch;
      type = type === 'unknown' ? 'fuzzy' : type;
    } else if (/\bmorning\b/.test(text)) {
      timeRange = TIME_RANGES.morning;
      type = type === 'unknown' ? 'fuzzy' : type;
    } else if (/\bafternoon\b/.test(text)) {
      timeRange = TIME_RANGES.afternoon;
      type = type === 'unknown' ? 'fuzzy' : type;
    } else if (/\bevening\b/.test(text)) {
      timeRange = TIME_RANGES.evening;
      type = type === 'unknown' ? 'fuzzy' : type;
    }
  }

  // ═══ 3. DURATION HINT ═══════════════════════════════════════════════════════
  // "30-minute call", "1 hour meeting" — informational only
  let durationHint = null;
  const durationMatch = text.match(/(\d+)\s*[-–]?\s*(minute|min|hour|hr)s?\b/i);
  if (durationMatch) {
    const val = parseInt(durationMatch[1], 10);
    const unit = durationMatch[2].toLowerCase();
    durationHint = unit.startsWith('hour') || unit.startsWith('hr') ? val * 60 : val;
  }

  // ═══ 4. DEFAULT DATE if we got a time but no date ═══════════════════════════
  if (!targetDate && (timeStr || timeRange)) {
    targetDate = new Date(now); // assume today
  }

  // ═══ 5. BUILD SUMMARY ══════════════════════════════════════════════════════

  const understood = !!(targetDate || timeStr || timeRange);

  let summary = '';
  if (understood) {
    if (type === 'week' && targetDate) {
      const weekEnd = endOfWeek(targetDate, { weekStartsOn: 1 });
      summary = `Showing availability for the week of ${format(targetDate, 'MMM do')}`;
      if (timeRange) {
        summary += `, ${timeRange.start <= 12 ? 'morning' : 'afternoon'} slots`;
      }
    } else if (type === 'exact' && targetDate && timeStr) {
      summary = `Setting consultation for ${format(targetDate, 'EEEE, MMM do')} at ${timeStr}`;
    } else if (type === 'fuzzy' && targetDate) {
      const dayLabel = format(targetDate, 'EEEE, MMM do');
      if (timeRange) {
        const rangeLabel = `${timeRange.start <= 12 ? timeRange.start : timeRange.start - 12}${timeRange.start < 12 ? 'AM' : 'PM'}–${timeRange.end <= 12 ? timeRange.end : timeRange.end - 12}${timeRange.end < 12 ? 'AM' : 'PM'}`;
        summary = `Showing ${dayLabel} slots between ${rangeLabel}`;
      } else {
        summary = `Showing availability for ${dayLabel}`;
      }
    } else if (targetDate) {
      summary = `Showing availability for ${format(targetDate, 'EEEE, MMM do')}`;
    }
  }

  return {
    understood,
    targetDate,
    timeStr,
    timeRange,
    durationHint,
    summary,
    type,
  };
}

/**
 * Convert a timeRange to a "best guess" time string for the BookingWidget.
 * Picks the start of the range as the target time.
 * @param {{ start: number, end: number }} range
 * @returns {string} e.g. "2:00 PM"
 */
export function timeRangeToTimeStr(range) {
  if (!range) return null;
  const h = range.start;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h > 12 ? h - 12 : h || 12;
  return `${displayH}:00 ${ampm}`;
}

// ─── Backend NLP API URL ─────────────────────────────────────────────────────
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

/**
 * Async NLP parser — calls the backend chrono-node endpoint.
 * Falls back to the sync regex parser if the API is unreachable.
 *
 * @param {string} input - The user's raw text
 * @returns {Promise<ParsedSchedulingIntent>}
 */
export async function parseSchedulingRequestAsync(input) {
  if (!input || typeof input !== 'string') {
    return { understood: false, targetDate: null, timeStr: null, timeRange: null, durationHint: null, summary: '', type: 'unknown' };
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/scheduling/nlp-parse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: input,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }),
    });

    if (!res.ok) throw new Error(`NLP API error: ${res.status}`);

    const data = await res.json();

    // Re-hydrate targetDate from ISO string back to Date object
    if (data.targetDate) {
      data.targetDate = new Date(data.targetDate);
    }

    return data;
  } catch (err) {
    // Fallback to sync regex parser
    console.debug('NLP API unavailable, falling back to regex parser:', err.message);
    return parseSchedulingRequest(input);
  }
}

