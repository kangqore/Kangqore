import React, { useState, useEffect, useCallback } from 'react';
import { Clock, RefreshCw } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

/**
 * AvailabilityPulse
 * ─────────────────────────────────────────────────────────────
 * Wide enterprise status bar showing real availability.
 *
 * Every number rendered here comes from
 * GET /api/scheduling/availability/summary/:slug — `slotsThisWeek`,
 * `nextAvailable` and `refreshedAt`. Nothing is synthesised.
 *
 * This previously seeded the count with Math.random() in the 27–34 range,
 * decremented it every 10s, and re-randomised it on "Refresh" — manufactured
 * scarcity rendered next to a genuinely fetched next-slot value. Beyond being
 * a dark pattern, presenting invented inventory as live availability is a
 * misleading commercial practice under the UK CPRs / EU UCPD, and it is
 * indefensible on a site whose proposition is governed, auditable systems.
 *
 * If the request fails we render nothing rather than guess. An absent bar is
 * honest; a fabricated one is not.
 */
const AvailabilityPulse = ({ eventTypeSlug = 'discovery-cmkfi' }) => {
  const [slotsThisWeek, setSlotsThisWeek] = useState(null);
  const [nextSlot, setNextSlot] = useState(null);
  const [refreshedAt, setRefreshedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Relative-time label, recomputed from the real `refreshedAt` timestamp.
  const [refreshLabel, setRefreshLabel] = useState('');

  const fetchSummary = useCallback(async () => {
    // The backend defaults to UTC when no timezone is supplied, which would
    // render "Next slot" in the wrong zone for every visitor outside it.
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/scheduling/availability/summary/${eventTypeSlug}`,
        { params: { timezone } }
      );
      if (res.data?.success) {
        setSlotsThisWeek(
          typeof res.data.slotsThisWeek === 'number' ? res.data.slotsThisWeek : null
        );
        setNextSlot(res.data.nextAvailable ?? null);
        setRefreshedAt(res.data.refreshedAt ? new Date(res.data.refreshedAt) : new Date());
        setFailed(false);
      } else {
        setFailed(true);
      }
    } catch (err) {
      console.debug('AvailabilityPulse: fetch failed', err.message);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [eventTypeSlug]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // Keep the "refreshed" label truthful as real time passes. This only
  // re-renders a string derived from an actual timestamp — it never invents
  // or mutates availability.
  useEffect(() => {
    if (!refreshedAt) return;

    const render = () => {
      const seconds = Math.floor((Date.now() - refreshedAt.getTime()) / 1000);
      if (seconds < 60) return 'Refreshed just now';
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `Refreshed ${minutes} min ago`;
      const hours = Math.floor(minutes / 60);
      return `Refreshed ${hours} hr ago`;
    };

    setRefreshLabel(render());
    const interval = setInterval(() => setRefreshLabel(render()), 30000);
    return () => clearInterval(interval);
  }, [refreshedAt]);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setRefreshLabel('Refreshing…');
    await fetchSummary();
    setIsRefreshing(false);
  };

  // Render nothing until we have real data, and nothing at all if we could
  // not get it. There is no fallback number by design.
  if (loading || failed) return null;

  const hasCount = typeof slotsThisWeek === 'number';
  const countLabel =
    slotsThisWeek === 1
      ? 'consultation window available this week'
      : 'consultation windows available this week';

  return (
    <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 mb-8">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-4 py-4 px-8 sm:px-12 rounded-[20px] bg-white dark:bg-[#11131a] border border-gray-100 dark:border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-500">

        {/* Section 1: Availability count — real `slotsThisWeek` */}
        {hasCount && (
          <div className="flex items-center gap-4 flex-1 justify-center lg:justify-start">
            <div className="relative shrink-0">
              <div
                className={`w-2.5 h-2.5 rounded-full ${slotsThisWeek > 0 ? 'bg-emerald-500' : 'bg-amber-500'}`}
              />
              {slotsThisWeek > 0 && (
                <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping opacity-40" />
              )}
            </div>
            <p className="text-[14px] font-medium text-gray-600 dark:text-gray-300 tracking-tight leading-none">
              {slotsThisWeek > 0 ? (
                <>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[16px] mr-1">
                    {slotsThisWeek}
                  </span>
                  {countLabel}
                </>
              ) : (
                <>Fully booked this week — request a time below</>
              )}
            </p>
          </div>
        )}

        {hasCount && nextSlot && (
          <div className="hidden lg:block w-px h-8 bg-gray-100 dark:bg-white/10" />
        )}

        {/* Section 2: Next slot — real `nextAvailable` */}
        {nextSlot && (
          <div className="flex items-center gap-3 flex-1 justify-center">
            <Clock className="w-4 h-4 text-gray-400" />
            <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-none">
              Next slot:{' '}
              <span className="font-bold text-gray-800 dark:text-gray-100">
                {nextSlot.dayLabel}, {nextSlot.time}
              </span>
            </p>
          </div>
        )}

        <div className="hidden lg:block w-px h-8 bg-gray-100 dark:bg-white/10" />

        {/* Section 3: Refresh — actually refetches */}
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          aria-label="Refresh availability"
          className="flex items-center gap-2.5 flex-1 justify-center lg:justify-end cursor-pointer group select-none bg-transparent border-0 disabled:cursor-wait"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-700 ease-in-out ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'}`}
          />
          <span className="text-[11px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500">
            {refreshLabel}
          </span>
        </button>
      </div>
    </div>
  );
};

export default AvailabilityPulse;
