import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, RefreshCw, Sparkles, ArrowRight, Zap } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

/**
 * InlineSchedulingCard
 * ─────────────────────────────────────────────────────────────
 * Rendered inside the eQORE chatbot when scheduling intent is
 * detected. Shows:
 *   1. NLP parse summary ("I understood: Friday afternoon slots")
 *   2. Live availability pulse (real data, no fake urgency)
 *   3. Quick action button → scroll to BookingWidget
 *
 * Design: Dark glassmorphism matching eQORE chatbot aesthetic.
 */
const InlineSchedulingCard = ({ parsedIntent, eventTypeSlug = 'discovery-cmkfi' }) => {
  const [pulse, setPulse] = useState(null);
  const [loadingPulse, setLoadingPulse] = useState(true);

  // Fetch real availability summary
  const fetchPulse = useCallback(async () => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/scheduling/availability/summary/${eventTypeSlug}`
      );
      if (res.data.success) {
        setPulse(res.data);
      }
    } catch (err) {
      console.debug('InlineSchedulingCard: pulse fetch failed', err.message);
    } finally {
      setLoadingPulse(false);
    }
  }, [eventTypeSlug]);

  useEffect(() => {
    fetchPulse();
  }, [fetchPulse]);

  const handleViewSlots = () => {
    const widget = document.getElementById('scheduling-widget');
    if (widget) {
      widget.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // If not on homepage, navigate there
      window.location.href = '/#scheduling-widget';
    }
  };

  const understood = parsedIntent?.understood;
  const summary = parsedIntent?.summary;

  return (
    <div className="w-full max-w-[320px] rounded-xl overflow-hidden border border-cyan-400/15 bg-[#12121a] shadow-[0_0_20px_rgba(34,211,238,0.06)]">
      {/* Header Strip */}
      <div className="px-4 py-2.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-white/5 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span className="text-[11px] font-bold text-cyan-400/90 uppercase tracking-widest">
          Scheduling Intelligence
        </span>
      </div>

      <div className="p-4 space-y-3">
        {/* NLP Parse Result */}
        {understood && summary ? (
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-cyan-400/10 flex items-center justify-center shrink-0 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-0.5">
                Understood
              </p>
              <p className="text-[13px] text-white/90 font-medium leading-snug">
                {summary}
              </p>
              {parsedIntent?.durationHint && (
                <p className="text-[11px] text-white/40 mt-1">
                  Duration preference: {parsedIntent.durationHint} min
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-amber-400/10 flex items-center justify-center shrink-0 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p className="text-[12px] text-white/60 leading-snug">
              Tell me a date and time, like <span className="text-cyan-400 font-medium">"Thursday at 2pm"</span> or <span className="text-cyan-400 font-medium">"next week morning"</span>
            </p>
          </div>
        )}

        {/* Live Availability Pulse */}
        {!loadingPulse && pulse && (
          <div className="bg-white/[0.03] rounded-lg p-3 border border-white/5 space-y-2">
            {/* Slots this week */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-40" />
              </div>
              <span className="text-[12px] text-white/70">
                <span className="text-emerald-400 font-bold">{pulse.slotsThisWeek}</span>
                {' '}consultation {pulse.slotsThisWeek === 1 ? 'window' : 'windows'} this week
              </span>
            </div>

            {/* Next available */}
            {pulse.nextAvailable && (
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-white/30" />
                <span className="text-[12px] text-white/50">
                  Next slot:{' '}
                  <span className="text-white/80 font-semibold">
                    {pulse.nextAvailable.dayLabel}, {pulse.nextAvailable.time}
                  </span>
                </span>
              </div>
            )}

            {/* Refreshed label */}
            <div className="flex items-center gap-1.5 pt-0.5">
              <RefreshCw className="w-2.5 h-2.5 text-white/20" />
              <span className="text-[10px] text-white/25">
                Availability refreshed just now
              </span>
            </div>
          </div>
        )}

        {loadingPulse && (
          <div className="flex items-center gap-2 py-2">
            <RefreshCw className="w-3 h-3 text-cyan-400/50 animate-spin" />
            <span className="text-[11px] text-white/30">Checking live availability...</span>
          </div>
        )}

        {/* Zero slots state */}
        {!loadingPulse && pulse && pulse.slotsThisWeek === 0 && (
          <div className="bg-white/[0.03] rounded-lg p-3 border border-white/5">
            <p className="text-[12px] text-white/50">
              All slots are booked this week. New availability opens Monday.
            </p>
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={handleViewSlots}
          className="w-full mt-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-blue-600/80 to-cyan-500/80 hover:from-blue-600 hover:to-cyan-500 text-white text-[12px] font-bold tracking-wide transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] active:scale-[0.97]"
        >
          <Zap className="w-3.5 h-3.5" />
          View Available Slots
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default InlineSchedulingCard;
