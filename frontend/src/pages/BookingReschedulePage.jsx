import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { format, parseISO, addDays, startOfDay } from 'date-fns';
import {
  Calendar, Clock, Check, AlertCircle, Loader2, ChevronLeft,
  ChevronRight, Globe, Video, ExternalLink, RefreshCw, X
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

function detectTimezone() {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; }
  catch { return 'UTC'; }
}

function formatTimeInTZ(date, tz) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true, timeZone: tz
    }).format(new Date(date));
  } catch {
    return format(new Date(date), 'h:mm a');
  }
}

export default function BookingReschedulePage() {
  const { token } = useParams();
  const [pageStatus, setPageStatus] = useState('loading'); // loading | ready | submitting | done | error
  const [errorMsg, setErrorMsg] = useState('');
  const [originalEvent, setOriginalEvent] = useState(null);
  const [newBooking, setNewBooking] = useState(null);

  const [timezone] = useState(detectTimezone);
  const [dateMap, setDateMap] = useState({});
  const [dateMapLoading, setDateMapLoading] = useState(false);
  const [calendarOffset, setCalendarOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Load original event
  useEffect(() => {
    axios.get(`${API_URL}/api/scheduling/events/reschedule/${token}`)
      .then(res => {
        setOriginalEvent(res.data.event);
        setPageStatus('ready');
      })
      .catch(err => {
        setErrorMsg(err.response?.data?.message || 'Invalid or expired reschedule link.');
        setPageStatus('error');
      });
  }, [token]);

  // Load date availability map
  const loadDateMap = useCallback(async () => {
    if (!originalEvent?.eventType?.slug) return;
    setDateMapLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/api/scheduling/availability/dates/${originalEvent.eventType.slug}`,
        { params: { timezone, days: originalEvent.eventType.maxAdvanceDays || 30 } }
      );
      const map = {};
      for (const d of res.data.dates || []) map[d.date] = d;
      setDateMap(map);
    } catch {
      setDateMap({});
    } finally {
      setDateMapLoading(false);
    }
  }, [originalEvent, timezone]);

  useEffect(() => { loadDateMap(); }, [loadDateMap]);

  // Load slots when date selected
  useEffect(() => {
    if (!selectedDate || !originalEvent?.eventType?.slug) return;
    setSlotsLoading(true);
    setSelectedSlot(null);
    axios.get(
      `${API_URL}/api/scheduling/availability/slots/${originalEvent.eventType.slug}`,
      { params: { date: selectedDate, timezone } }
    )
      .then(res => setSlots(res.data.slots || []))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [selectedDate, originalEvent, timezone]);

  const handleReschedule = async () => {
    if (!selectedSlot) return;
    setPageStatus('submitting');
    try {
      const res = await axios.post(`${API_URL}/api/scheduling/events/reschedule/${token}`, {
        newStartTime: selectedSlot
      });
      setNewBooking(res.data.event);
      setPageStatus('done');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to reschedule. The slot may have been taken.');
      setPageStatus('error');
    }
  };

  const today = startOfDay(new Date());
  const calendarStartDate = addDays(today, calendarOffset * 7);
  const calendarDays = Array.from({ length: 14 }, (_, i) => format(addDays(calendarStartDate, i), 'yyyy-MM-dd'));
  const maxDate = originalEvent
    ? format(addDays(today, (originalEvent.eventType?.maxAdvanceDays || 30) - 1), 'yyyy-MM-dd')
    : format(addDays(today, 29), 'yyyy-MM-dd');

  if (pageStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading your booking…</span>
        </div>
      </div>
    );
  }

  if (pageStatus === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 text-center border border-gray-100 dark:border-gray-800">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Unable to Reschedule</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{errorMsg}</p>
          <Link to="/" className="inline-block px-6 py-3 bg-brand-gradient text-white font-bold rounded-xl hover:opacity-90 transition text-sm">
            Back to Kangqore
          </Link>
        </div>
      </div>
    );
  }

  if (pageStatus === 'done' && newBooking) {
    const start = new Date(newBooking.startTime);
    const end = new Date(newBooking.endTime);
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 text-center border border-gray-100 dark:border-gray-800">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-brand-cyan rounded-full flex items-center justify-center mx-auto mb-5">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Rescheduled!</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            A new calendar invite has been sent to your email.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-left text-sm space-y-2 mb-6">
            <p className="font-bold text-gray-800 dark:text-white">{newBooking.title}</p>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4 text-brand-blue" />
              {format(start, 'EEEE, MMMM d, yyyy')}
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4 text-brand-blue" />
              {formatTimeInTZ(start, timezone)} – {formatTimeInTZ(end, timezone)}
            </div>
            {newBooking.joinUrl && (
              <a href={newBooking.joinUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-600 font-semibold">
                <Video className="w-4 h-4" /> Join Meeting <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <div className="flex gap-4 justify-center text-sm mb-4">
            {newBooking.rescheduleLink && (
              <a href={newBooking.rescheduleLink} className="text-brand-blue hover:underline flex items-center gap-1">
                <RefreshCw className="w-4 h-4" /> Reschedule again
              </a>
            )}
            {newBooking.cancelLink && (
              <a href={newBooking.cancelLink} className="text-red-500 hover:underline flex items-center gap-1">
                <X className="w-4 h-4" /> Cancel
              </a>
            )}
          </div>
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            Back to Kangqore
          </Link>
        </div>
      </div>
    );
  }

  // ── Reschedule picker UI ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-gradient-to-br from-brand-blue to-brand-cyan rounded-2xl flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Reschedule Your Meeting</h1>
          {originalEvent && (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Currently scheduled:{' '}
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {format(new Date(originalEvent.startTime), 'EEEE, MMMM d')} at{' '}
                {formatTimeInTZ(originalEvent.startTime, timezone)}
              </span>
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Date picker */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-5 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Pick New Date
              </h3>
              <div className="flex gap-1">
                <button type="button" onClick={() => setCalendarOffset(p => Math.max(0, p - 1))}
                  disabled={calendarOffset === 0}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 transition">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => setCalendarOffset(p => p + 1)}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {dateMapLoading ? (
              <div className="flex items-center justify-center py-8 gap-2 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin" /> Loading…
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
                {calendarDays.map(dateStr => {
                  const info = dateMap[dateStr];
                  const hasSlots = info?.availableCount > 0;
                  const isPast = dateStr < format(today, 'yyyy-MM-dd');
                  const isTooFar = dateStr > maxDate;
                  const isDisabled = isPast || isTooFar || !hasSlots;
                  const isSelected = selectedDate === dateStr;
                  const d = parseISO(dateStr);
                  return (
                    <button key={dateStr} type="button" disabled={isDisabled}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border-2 transition-all text-sm ${
                        isSelected
                          ? 'border-brand-blue bg-blue-50 dark:bg-blue-900/20'
                          : isDisabled
                            ? 'border-gray-100 dark:border-gray-800 opacity-40 cursor-not-allowed'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                      }`}>
                      <div className="flex items-center gap-2.5">
                        <div className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center text-[10px] font-bold shrink-0 ${
                          isSelected ? 'bg-brand-gradient text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}>
                          <span className="uppercase">{format(d, 'EEE')}</span>
                          <span className="text-base leading-tight">{format(d, 'd')}</span>
                        </div>
                        <div className="text-left">
                          <p className={`font-semibold text-sm ${isSelected ? 'text-blue-800 dark:text-blue-200' : 'text-gray-800 dark:text-white'}`}>
                            {format(d, 'MMM d')}
                          </p>
                          {!isDisabled && (
                            <p className="text-[11px] text-emerald-500">{info?.availableCount} slot{info?.availableCount !== 1 ? 's' : ''}</p>
                          )}
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-brand-blue shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Slots + confirm */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-5 border border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {selectedDate ? `Times — ${format(parseISO(selectedDate), 'MMM d')}` : 'Select a date first'}
              </h3>

              {!selectedDate && (
                <div className="text-center py-10 text-gray-400">
                  <Calendar className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Pick a date to see available times</p>
                </div>
              )}

              {selectedDate && slotsLoading && (
                <div className="flex items-center justify-center py-10 gap-2 text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin" /> Checking availability…
                </div>
              )}

              {selectedDate && !slotsLoading && slots.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-amber-400" />
                  <p className="text-sm">No open slots — try another date</p>
                </div>
              )}

              {selectedDate && !slotsLoading && slots.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {slots.map((slot, i) => {
                    const isSelected = selectedSlot === slot.startTime;
                    return (
                      <button key={i} type="button" onClick={() => setSelectedSlot(slot.startTime)}
                        className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                          isSelected
                            ? 'border-brand-blue bg-blue-50 dark:bg-blue-900/20 text-brand-blue scale-105 shadow-sm'
                            : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300'
                        }`}>
                        {formatTimeInTZ(slot.startTime, timezone)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {selectedSlot && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm space-y-1.5">
                <p className="font-bold text-gray-800 dark:text-white">New Time</p>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 text-brand-blue" />
                  {selectedDate && format(parseISO(selectedDate), 'EEEE, MMMM d, yyyy')}
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4 text-brand-blue" />
                  {formatTimeInTZ(selectedSlot, timezone)}
                  {originalEvent?.eventType?.duration && ` · ${originalEvent.eventType.duration} min`}
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Globe className="w-4 h-4 text-brand-blue" /> {timezone}
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={!selectedSlot || pageStatus === 'submitting'}
              onClick={handleReschedule}
              className="w-full py-4 bg-brand-gradient text-white font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {pageStatus === 'submitting'
                ? <><Loader2 className="w-5 h-5 animate-spin" /> Rescheduling…</>
                : <><RefreshCw className="w-5 h-5" /> Confirm New Time</>}
            </button>

            <Link to="/" className="block text-center text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              Keep my original time
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
