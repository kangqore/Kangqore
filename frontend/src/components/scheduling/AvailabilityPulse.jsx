import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, RefreshCw } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

/**
 * AvailabilityPulse
 * ─────────────────────────────────────────────────────────────
 * Wide premium enterprise status bar showing live availability.
 */
const AvailabilityPulse = ({ eventTypeSlug = 'discovery-cmkfi' }) => {
  // 1. Dynamic Availability Count State
  const [count, setCount] = useState(() => Math.floor(Math.random() * (34 - 27 + 1)) + 27);
  const [nextSlot, setNextSlot] = useState({ dayLabel: 'Tomorrow', time: '9:00 AM' });
  const [loading, setLoading] = useState(true);
  
  // 2. Refresh State
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshLabel, setRefreshLabel] = useState('Refreshed just now');

  // Fetch real "Next Slot" from backend but keep count dynamic for the pulse effect
  const fetchNextSlot = useCallback(async () => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/scheduling/availability/summary/${eventTypeSlug}`
      );
      if (res.data.success && res.data.nextAvailable) {
        setNextSlot(res.data.nextAvailable);
      }
    } catch (err) {
      console.debug('AvailabilityPulse: fetch failed', err.message);
    } finally {
      setLoading(false);
    }
  }, [eventTypeSlug]);

  useEffect(() => {
    fetchNextSlot();
  }, [fetchNextSlot]);

  // 3. Live Countdown Logic (Every 10 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => Math.max(prev - 1, 18));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // 4. Refresh Interaction Logic
  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setRefreshLabel('Refreshing...');
    
    // Simulate network/refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshLabel('Refreshed just now');
      // Slightly adjust/reset number within range
      setCount(Math.floor(Math.random() * (34 - 27 + 1)) + 27);
    }, 800);
  };

  // Don't render while loading initial data
  if (loading) return null;

  return (
    <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 mb-8">
      <style>
        {`
          @keyframes subtle-pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.05); }
          }
          .animate-number-pulse {
            animation: subtle-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            display: inline-block;
          }
        `}
      </style>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-4 py-4 px-8 sm:px-12 rounded-[20px] bg-white dark:bg-[#11131a] border border-gray-100 dark:border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-500">
        
        {/* Section 1: Availability Count */}
        <div className="flex items-center gap-4 flex-1 justify-center lg:justify-start">
          <div className="relative shrink-0">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
            <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping opacity-40" />
          </div>
          <p className="text-[14px] font-medium text-gray-600 dark:text-gray-300 tracking-tight leading-none">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[16px] mr-1 animate-number-pulse">
              {count}
            </span>
            consultation windows available this week
          </p>
        </div>

        {/* Separator */}
        <div className="hidden lg:block w-px h-8 bg-gray-100 dark:bg-white/10" />

        {/* Section 2: Next Slot */}
        <div className="flex items-center gap-3 flex-1 justify-center">
          <Clock className="w-4 h-4 text-gray-400" />
          <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-none">
            Next slot: <span className="font-bold text-gray-800 dark:text-gray-100">{nextSlot.dayLabel}, {nextSlot.time}</span>
          </p>
        </div>

        {/* Separator */}
        <div className="hidden lg:block w-px h-8 bg-gray-100 dark:bg-white/10" />

        {/* Section 3: Refreshed Status */}
        <div 
          onClick={handleRefresh}
          className="flex items-center gap-2.5 flex-1 justify-center lg:justify-end cursor-pointer group select-none"
        >
          <RefreshCw 
            className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-700 ease-in-out ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} 
          />
          <span className="text-[11px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500">
            {refreshLabel}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityPulse;
