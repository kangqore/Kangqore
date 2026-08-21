import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { format, parseISO, addDays, startOfDay } from 'date-fns';
import {
  Calendar as CalendarIcon, Clock, User, Mail, Building, Phone,
  MessageSquare, Check, ChevronLeft, ChevronRight, Globe,
  Video, AlertCircle, Loader2, ExternalLink, RefreshCw, X
} from 'lucide-react';
import ServiceSelector from './common/ServiceSelector';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useToast } from '../hooks/use-toast';

const API_URL = import.meta.env.VITE_BACKEND_URL || '';

// Common timezones for the selector
const COMMON_TIMEZONES = [
  'Asia/Kolkata', 'UTC', 'America/New_York', 'America/Chicago',
  'America/Denver', 'America/Los_Angeles', 'Europe/London',
  'Europe/Paris', 'Europe/Berlin', 'Asia/Dubai', 'Asia/Singapore',
  'Asia/Tokyo', 'Australia/Sydney', 'Pacific/Auckland'
];

function detectTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
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

export default function ScheduleConsultation() {
  const [sectionRef, sectionVisible] = useScrollAnimation({ once: true, threshold: 0.1 });
  const { toast } = useToast();

  // ── State ──────────────────────────────────────────────────────────────────
  const [timezone, setTimezone] = useState(detectTimezone);
  const [showTzPicker, setShowTzPicker] = useState(false);

  // Event types / duration selection
  const [eventTypes, setEventTypes] = useState([]);
  const [selectedEventType, setSelectedEventType] = useState(null);

  // Date availability map: { 'YYYY-MM-DD': { availableCount, isWeekend } }
  const [dateMap, setDateMap] = useState({});
  const [dateMapLoading, setDateMapLoading] = useState(false);
  const [calendarOffset, setCalendarOffset] = useState(0); // weeks offset from today

  // Selected date + slots
  const [selectedDate, setSelectedDate] = useState(null); // 'YYYY-MM-DD'
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null); // ISO string

  // Form
  const [formData, setFormData] = useState({
    name: '', email: '', company: '', phone: '', topic: '', services: [], message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Post-booking confirmation
  const [booking, setBooking] = useState(null);

  // ── Load event types on mount ──────────────────────────────────────────────
  useEffect(() => {
    axios.get(`${API_URL}/api/scheduling/event-types/public`)
      .then(res => {
        if (res.data.eventTypes?.length) {
          setEventTypes(res.data.eventTypes);
          setSelectedEventType(res.data.eventTypes.find(e => e.duration === 30) || res.data.eventTypes[0]);
        }
      })
      .catch(() => {
        // Fallback: static event type so the UI still works
        const fallback = { id: null, slug: 'discovery-cmkfi', name: '30-min Discovery Call', duration: 30, minNotice: 60, maxAdvanceDays: 30 };
        setEventTypes([fallback]);
        setSelectedEventType(fallback);
      });
  }, []);

  // ── Load date availability map when event type or timezone changes ──────────
  const loadDateMap = useCallback(async () => {
    if (!selectedEventType?.slug) return;
    setDateMapLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/api/scheduling/availability/dates/${selectedEventType.slug}`,
        { params: { timezone, days: selectedEventType.maxAdvanceDays || 30 } }
      );
      const map = {};
      for (const d of res.data.dates || []) {
        map[d.date] = d;
      }
      setDateMap(map);
    } catch {
      setDateMap({});
    } finally {
      setDateMapLoading(false);
    }
  }, [selectedEventType, timezone]);

  useEffect(() => {
    loadDateMap();
    setSelectedDate(null);
    setSlots([]);
    setSelectedSlot(null);
  }, [loadDateMap]);

  // ── Load time slots when a date is selected ───────────────────────────────
  useEffect(() => {
    if (!selectedDate || !selectedEventType?.slug) return;
    setSlotsLoading(true);
    setSelectedSlot(null);
    axios.get(
      `${API_URL}/api/scheduling/availability/slots/${selectedEventType.slug}`,
      { params: { date: selectedDate, timezone } }
    )
      .then(res => setSlots(res.data.slots || []))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [selectedDate, selectedEventType, timezone]);

  // ── Calendar grid helpers ─────────────────────────────────────────────────
  const today = startOfDay(new Date());
  const calendarStartDate = addDays(today, calendarOffset * 7);

  const calendarDays = Array.from({ length: 14 }, (_, i) => {
    const d = addDays(calendarStartDate, i);
    return format(d, 'yyyy-MM-dd');
  });

  const maxDate = format(addDays(today, (selectedEventType?.maxAdvanceDays || 30) - 1), 'yyyy-MM-dd');

  // ── Form handlers ─────────────────────────────────────────────────────────
  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!selectedSlot) {
      toast({ title: 'Select a time slot', variant: 'destructive' });
      return;
    }
    if (!selectedEventType?.id) {
      toast({ title: 'No event type configured', description: 'Please contact support.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(`${API_URL}/api/scheduling/events`, {
        eventTypeId: selectedEventType.id,
        startTime: selectedSlot,
        invitee: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          timezone,
          responses: {
            topic: formData.topic,
            services: formData.services,
            message: formData.message
          }
        }
      });

      setBooking(res.data.event);
      toast({ title: 'Consultation Booked!', description: 'Check your email for the calendar invite.' });
    } catch (err) {
      toast({
        title: 'Booking Failed',
        description: err.response?.data?.message || 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Post-booking confirmation view ────────────────────────────────────────
  if (booking) {
    const startDt = new Date(booking.startTime);
    const endDt = new Date(booking.endTime);
    return (
      <section className="py-28 md:py-36 bg-gray-50 dark:bg-black">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 text-center border border-gray-100 dark:border-gray-800">
            <div className="w-20 h-20 bg-gradient-to-br from-brand-blue to-brand-cyan rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">You're Confirmed!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">A calendar invite with all the details has been sent to your email.</p>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 text-left mb-6 space-y-3">
              <p className="font-bold text-gray-900 dark:text-white">{booking.title}</p>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                <CalendarIcon className="w-4 h-4 text-brand-blue shrink-0" />
                {format(startDt, 'EEEE, MMMM d, yyyy')}
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                <Clock className="w-4 h-4 text-brand-blue shrink-0" />
                {formatTimeInTZ(startDt, timezone)} – {formatTimeInTZ(endDt, timezone)}
                <span className="text-gray-400 text-xs">({timezone})</span>
              </div>
              {booking.joinUrl && (
                <div className="flex items-center gap-2 text-sm">
                  <Video className="w-4 h-4 text-emerald-500 shrink-0" />
                  <a href={booking.joinUrl} target="_blank" rel="noopener noreferrer"
                    className="text-emerald-600 font-semibold underline underline-offset-2 flex items-center gap-1">
                    Join Meeting <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {booking.joinUrl && (
              <a href={booking.joinUrl} target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-brand-gradient text-white font-bold rounded-xl hover:opacity-90 transition mb-4">
                <Video className="w-5 h-5" /> Join Meeting
              </a>
            )}

            <div className="flex gap-4 justify-center text-sm">
              {booking.rescheduleLink && (
                <a href={booking.rescheduleLink} className="text-brand-blue hover:underline flex items-center gap-1">
                  <RefreshCw className="w-4 h-4" /> Reschedule
                </a>
              )}
              {booking.cancelLink && (
                <a href={booking.cancelLink} className="text-red-500 hover:underline flex items-center gap-1">
                  <X className="w-4 h-4" /> Cancel
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Main booking UI ───────────────────────────────────────────────────────
  return (
    <section className="py-28 md:py-36 lg:py-44 bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div
          ref={sectionRef}
          className={`transition-all duration-1000 ${sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
        >
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-gradient rounded-2xl mb-6">
              <CalendarIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
              Schedule Your{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">Consultation</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A focused conversation with Kangqore's senior leaders to assess risks, opportunities, and next steps.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT PANEL — Duration + Date + Timezone */}
            <div className="space-y-5">

              {/* Duration Selector */}
              {eventTypes.length > 1 && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-5 border border-gray-100 dark:border-gray-800">
                  <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Duration</h3>
                  <div className="flex gap-2 flex-wrap">
                    {eventTypes.map(et => (
                      <button
                        key={et.id || et.slug}
                        type="button"
                        onClick={() => { setSelectedEventType(et); setSelectedDate(null); setSlots([]); setSelectedSlot(null); }}
                        className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                          selectedEventType?.slug === et.slug
                            ? 'border-brand-blue bg-blue-50 dark:bg-blue-900/30 text-brand-blue'
                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-300'
                        }`}
                      >
                        {et.duration} min
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Timezone Selector */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-5 border border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Timezone
                </h3>
                <button
                  type="button"
                  onClick={() => setShowTzPicker(p => !p)}
                  className="w-full flex items-center justify-between px-3 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:border-blue-300 transition"
                >
                  <span className="truncate">{timezone}</span>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${showTzPicker ? 'rotate-90' : ''}`} />
                </button>
                {showTzPicker && (
                  <div className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    {COMMON_TIMEZONES.map(tz => (
                      <button
                        key={tz}
                        type="button"
                        onClick={() => { setTimezone(tz); setShowTzPicker(false); }}
                        className={`w-full text-left px-4 py-2 text-sm transition hover:bg-blue-50 dark:hover:bg-blue-900/20 ${
                          tz === timezone ? 'font-bold text-brand-blue' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {tz}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Picker */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-5 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" /> Select Date
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
                  <div className="space-y-1.5">
                    {calendarDays.map(dateStr => {
                      const info = dateMap[dateStr];
                      const hasSlots = info?.availableCount > 0;
                      const isPast = dateStr < format(today, 'yyyy-MM-dd');
                      const isTooFar = dateStr > maxDate;
                      const isDisabled = isPast || isTooFar || !hasSlots;
                      const isSelected = selectedDate === dateStr;
                      const d = parseISO(dateStr);

                      return (
                        <button
                          key={dateStr}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => setSelectedDate(dateStr)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-sm ${
                            isSelected
                              ? 'border-brand-blue bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/20 shadow-md'
                              : isDisabled
                                ? 'border-gray-100 dark:border-gray-800 opacity-40 cursor-not-allowed'
                                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 text-xs font-bold ${
                              isSelected ? 'bg-brand-gradient text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                            }`}>
                              <span className="uppercase text-[10px]">{format(d, 'EEE')}</span>
                              <span className="text-lg leading-tight">{format(d, 'd')}</span>
                            </div>
                            <div className="text-left">
                              <p className={`font-semibold ${isSelected ? 'text-blue-900 dark:text-blue-200' : 'text-gray-800 dark:text-white'}`}>
                                {format(d, 'MMM d')}
                              </p>
                              {!isDisabled && (
                                <p className="text-[11px] text-emerald-500 font-medium">
                                  {info?.availableCount} slot{info?.availableCount !== 1 ? 's' : ''} open
                                </p>
                              )}
                              {isDisabled && !isPast && !isTooFar && (
                                <p className="text-[11px] text-gray-400">Unavailable</p>
                              )}
                            </div>
                          </div>
                          {isSelected && <Check className="w-5 h-5 text-brand-blue shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT PANEL — Time slots + Form */}
            <div className="lg:col-span-2 space-y-6">

              {/* Time Slots */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-brand-blue" />
                  {selectedDate
                    ? `Available Times — ${format(parseISO(selectedDate), 'EEEE, MMMM d')}`
                    : 'Select a date to see available times'}
                </h3>

                {!selectedDate && (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">Choose a date from the left panel</p>
                  </div>
                )}

                {selectedDate && slotsLoading && (
                  <div className="flex items-center justify-center py-12 gap-2 text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin" /> Checking real-time availability…
                  </div>
                )}

                {selectedDate && !slotsLoading && slots.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No slots available on this day</p>
                    <p className="text-sm text-gray-400 mt-1">Try a different date</p>
                  </div>
                )}

                {selectedDate && !slotsLoading && slots.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {slots.map((slot, i) => {
                      const isSelected = selectedSlot === slot.startTime;
                      const displayTime = formatTimeInTZ(slot.startTime, timezone);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedSlot(slot.startTime)}
                          className={`py-3 px-2 rounded-xl border-2 text-sm font-semibold text-center transition-all ${
                            isSelected
                              ? 'border-brand-blue bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/20 text-brand-blue shadow-md scale-105'
                              : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 hover:shadow-sm'
                          }`}
                        >
                          {displayTime}
                          {selectedEventType && (
                            <span className="block text-[10px] text-gray-400 font-normal mt-0.5">
                              {selectedEventType.duration} min
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Contact Form */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                  <User className="w-5 h-5 text-brand-blue" /> Your Information
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input type="text" id="name" name="name" required value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue outline-none transition text-sm"
                          placeholder="C.O.D.E." />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input type="email" id="email" name="email" required value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue outline-none transition text-sm"
                          placeholder="you@company.com" />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="company" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Company
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input type="text" id="company" name="company" value={formData.company}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue outline-none transition text-sm"
                          placeholder="Your Company" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input type="tel" id="phone" name="phone" value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue outline-none transition text-sm"
                          placeholder="+91 98765 43210" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="topic" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Topic / Subject
                    </label>
                    <input type="text" id="topic" name="topic" value={formData.topic}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue outline-none transition text-sm"
                      placeholder="e.g. AI Integration, Strategic Partnership" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Services of Interest
                    </label>
                    <ServiceSelector
                      selectedServices={formData.services || []}
                      onChange={services => setFormData(p => ({ ...p, services }))}
                      label=""
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      What would you like to discuss?
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <textarea id="message" name="message" rows={4} value={formData.message}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue outline-none transition resize-none text-sm"
                        placeholder="Describe your business challenge or project requirements..." />
                    </div>
                  </div>

                  {/* Summary */}
                  {selectedSlot && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Your Booking Summary</p>
                      <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-brand-blue" />
                          {selectedDate && format(parseISO(selectedDate), 'EEEE, MMMM d, yyyy')}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-brand-blue" />
                          {formatTimeInTZ(selectedSlot, timezone)}
                          {selectedEventType && ` · ${selectedEventType.duration} min`}
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-brand-blue" />
                          {timezone}
                        </div>
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-emerald-500" />
                          Video call link will be sent via email
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedSlot}
                    className="w-full px-8 py-4 bg-brand-gradient text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting
                      ? <><Loader2 className="w-5 h-5 animate-spin" /> Booking…</>
                      : 'Request Executive Consultation'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Benefits strip */}
          <div className="mt-16 grid md:grid-cols-4 gap-5">
            {[
              { icon: Check, label: 'Free Consultation', desc: 'No cost, no obligation', color: 'bg-blue-100 text-brand-blue' },
              { icon: Video, label: 'Video Meeting Link', desc: 'Auto-generated, sent by email', color: 'bg-emerald-100 text-emerald-600' },
              { icon: RefreshCw, label: 'Easy Reschedule', desc: 'Reschedule or cancel anytime', color: 'bg-cyan-100 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
              { icon: Globe, label: 'Any Timezone', desc: 'Auto-detects your local time', color: 'bg-violet-100 text-violet-600' }
            ].map(({ icon: Icon, label, desc, color }) => (
              <div key={label} className="text-center p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-800">
                <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1 text-sm">{label}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
