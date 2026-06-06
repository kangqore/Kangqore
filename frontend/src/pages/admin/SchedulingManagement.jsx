import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Calendar, Clock, Settings, Copy, Trash2, Edit2,
  Loader2, Video, Phone, MapPin, X, Check, Zap, Search,
  ChevronLeft, ChevronRight, ExternalLink, RefreshCw, Ban,
  AlertCircle, User, Mail, Building
} from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import DashboardLayout from '../../components/DashboardLayout';
import { useToast } from '../../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const token = () => localStorage.getItem('token');
const authHeader = () => ({ Authorization: `Bearer ${token()}` });

// ─── Constants ──────────────────────────────────────────────────────────────

const VIDEO_PROVIDERS = [
  { value: 'JITSI',       label: 'Jitsi Meet',   desc: 'Free, open-source — no account needed' },
  { value: 'ZOOM',        label: 'Zoom',          desc: 'Requires Zoom connected in Integrations' },
  { value: 'GOOGLE_MEET', label: 'Google Meet',   desc: 'Requires Google Calendar connected in Integrations' },
];
const LOCATION_TYPES = [
  { value: 'VIDEO',     label: 'Video Call', icon: Video },
  { value: 'IN_PERSON', label: 'In Person',  icon: MapPin },
  { value: 'PHONE',     label: 'Phone Call', icon: Phone },
];
const EMPTY_FORM = {
  name: '', slug: '', description: '', duration: 30,
  locationType: 'VIDEO', videoProvider: 'JITSI',
  bufferBefore: 0, bufferAfter: 0, minNotice: 60, maxAdvanceDays: 30,
  maxPerDay: '', color: '#2564ea', isPublic: true, isActive: true,
};
const STATUS_STYLES = {
  ACTIVE:    'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-600',
  COMPLETED: 'bg-gray-100 text-gray-600',
  NO_SHOW:   'bg-orange-100 text-orange-700',
};

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ─── EventTypeModal ──────────────────────────────────────────────────────────

function EventTypeModal({ initial, onClose, onSaved }) {
  const { toast } = useToast();
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const isEdit = !!initial?.id;
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form, slug: form.slug || slugify(form.name),
        maxPerDay: form.maxPerDay === '' ? null : Number(form.maxPerDay),
        duration: Number(form.duration), bufferBefore: Number(form.bufferBefore),
        bufferAfter: Number(form.bufferAfter), minNotice: Number(form.minNotice),
        maxAdvanceDays: Number(form.maxAdvanceDays),
      };
      if (isEdit) {
        await axios.put(`${BACKEND_URL}/api/scheduling/event-types/${form.id}`, payload, { headers: authHeader() });
      } else {
        await axios.post(`${BACKEND_URL}/api/scheduling/event-types`, payload, { headers: authHeader() });
      }
      toast({ title: isEdit ? 'Event type updated' : 'Event type created' });
      onSaved();
    } catch (err) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Save failed', variant: 'destructive' });
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{isEdit ? 'Edit Event Type' : 'New Event Type'}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Name *</label>
              <input required value={form.name}
                onChange={e => { set('name', e.target.value); if (!isEdit) set('slug', slugify(e.target.value)); }}
                placeholder="30-Minute Consultation"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Slug *</label>
              <input required value={form.slug} onChange={e => set('slug', slugify(e.target.value))} placeholder="30-min-consultation"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</label>
            <textarea rows={2} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief description shown to invitees..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-blue resize-none"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Duration (minutes)</label>
              <select value={form.duration} onChange={e => set('duration', Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-blue"
              >
                {[15, 20, 30, 45, 60, 90, 120].map(d => <option key={d} value={d}>{d} minutes</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Color</label>
              <input type="color" value={form.color} onChange={e => set('color', e.target.value)}
                className="w-full h-[46px] rounded-2xl border-none cursor-pointer bg-gray-50 dark:bg-gray-800 p-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Location</label>
            <div className="grid grid-cols-3 gap-2">
              {LOCATION_TYPES.map(lt => (
                <button key={lt.value} type="button" onClick={() => set('locationType', lt.value)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold border transition-all ${
                    form.locationType === lt.value ? 'bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/20' : 'bg-gray-50 dark:bg-gray-800 text-gray-500 border-transparent hover:border-gray-200'
                  }`}
                >
                  <lt.icon className="w-4 h-4" />{lt.label}
                </button>
              ))}
            </div>
          </div>
          {form.locationType === 'VIDEO' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Zap className="w-3 h-3" /> Video Platform</label>
              <div className="space-y-2">
                {VIDEO_PROVIDERS.map(vp => (
                  <button key={vp.value} type="button" onClick={() => set('videoProvider', vp.value)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border text-left transition-all ${
                      form.videoProvider === vp.value ? 'border-brand-blue bg-brand-blue/5 dark:bg-brand-blue/10' : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:border-gray-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${form.videoProvider === vp.value ? 'border-brand-blue bg-brand-blue' : 'border-gray-300'}`}>
                      {form.videoProvider === vp.value && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{vp.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{vp.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            {[['bufferBefore','Buffer Before (min)'],['bufferAfter','Buffer After (min)'],['minNotice','Min Notice (min)'],['maxAdvanceDays','Max Advance (days)'],['maxPerDay','Max Per Day']].map(([key, label]) => (
              <div key={key} className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</label>
                <input type="number" min={0} value={form[key]} placeholder={key === 'maxPerDay' ? 'Unlimited' : undefined}
                  onChange={e => set(key, e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-6">
            {[['isActive','Active'],['isPublic','Public']].map(([key, label]) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => set(key, !form[key])}
                  className={`w-11 h-6 rounded-full transition-all relative cursor-pointer ${form[key] ? 'bg-brand-blue' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form[key] ? 'left-6' : 'left-1'}`} />
                </div>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{label}</span>
              </label>
            ))}
          </div>
        </form>
        <div className="flex items-center justify-end gap-3 px-8 py-6 border-t border-gray-100 dark:border-gray-800">
          <button type="button" onClick={onClose} className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">Cancel</button>
          <button onClick={handleSubmit} disabled={saving}
            className="px-8 py-3 bg-brand-gradient text-white rounded-2xl font-bold shadow-lg shadow-brand-blue/20 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? 'Save Changes' : 'Create Event Type'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── BookingsTab ─────────────────────────────────────────────────────────────

function BookingsTab() {
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const PAGE_SIZE = 15;

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: PAGE_SIZE });
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (search) params.append('search', search);
      const res = await axios.get(`${BACKEND_URL}/api/scheduling/events?${params}`, { headers: authHeader() });
      setEvents(res.data.events || []);
      setTotal(res.data.total || 0);
    } catch {
      toast({ title: 'Error', description: 'Failed to load bookings', variant: 'destructive' });
    } finally { setLoading(false); }
  }, [page, statusFilter, search]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const handleCancel = async (eventId) => {
    if (!window.confirm('Cancel this booking? The invitee will be notified.')) return;
    setCancelling(true);
    try {
      await axios.post(`${BACKEND_URL}/api/scheduling/events/${eventId}/cancel`, { reason: 'Cancelled by admin' }, { headers: authHeader() });
      toast({ title: 'Booking cancelled' });
      setSelected(null);
      fetchEvents();
    } catch {
      toast({ title: 'Error', description: 'Failed to cancel booking', variant: 'destructive' });
    } finally { setCancelling(false); }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email..."
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-brand-blue"
          />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-blue"
        >
          {['ALL','ACTIVE','CANCELLED','COMPLETED','NO_SHOW'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={fetchEvents} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-500 hover:text-brand-blue transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand-blue animate-spin" /></div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[2rem]">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="font-bold text-gray-500">No bookings found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                {['Invitee','Event Type','Date & Time','Status',''].map(h => (
                  <th key={h} className="px-5 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {events.map(ev => (
                <tr key={ev.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{ev.invitees?.[0]?.name || '—'}</p>
                    <p className="text-xs text-gray-400">{ev.invitees?.[0]?.email}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{ev.eventType?.name || '—'}</td>
                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {format(new Date(ev.startTime), 'MMM d, yyyy')}<br />
                    <span className="text-xs text-gray-400">{format(new Date(ev.startTime), 'h:mm a')}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[ev.status] || STATUS_STYLES.ACTIVE}`}>
                      {ev.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => setSelected(ev)} className="text-xs font-bold text-brand-blue hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-gray-800">
              <p className="text-sm text-gray-500">{total} total</p>
              <div className="flex items-center gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detail side panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Booking Details</h2>
              <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="px-8 py-6 space-y-5">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Event</p>
                <p className="font-bold text-gray-900 dark:text-white">{selected.title}</p>
                <p className="text-sm text-gray-500">{format(new Date(selected.startTime), 'EEEE, MMMM d yyyy')} at {format(new Date(selected.startTime), 'h:mm a')}</p>
              </div>
              {selected.invitees?.[0] && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Invitee</p>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 space-y-2">
                    {[
                      [User, selected.invitees[0].name],
                      [Mail, selected.invitees[0].email],
                      selected.invitees[0].company && [Building, selected.invitees[0].company],
                    ].filter(Boolean).map(([Icon, val]) => (
                      <div key={val} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                        <Icon className="w-4 h-4 text-gray-400 shrink-0" />{val}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selected.joinUrl && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Meeting Link</p>
                  <a href={selected.joinUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-brand-blue text-sm font-bold hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" /> Join Meeting
                  </a>
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${STATUS_STYLES[selected.status] || STATUS_STYLES.ACTIVE}`}>
                  {selected.status}
                </span>
              </div>
            </div>
            <div className="px-8 pb-8 flex gap-3">
              {selected.status === 'ACTIVE' && (
                <>
                  <a href={`/booking/reschedule/${selected.rescheduleToken}`} target="_blank" rel="noopener noreferrer"
                    className="flex-1 py-3 text-center border border-brand-blue text-brand-blue rounded-2xl font-bold text-sm hover:bg-brand-blue hover:text-white transition-all"
                  >
                    Reschedule
                  </a>
                  <button onClick={() => handleCancel(selected.id)} disabled={cancelling}
                    className="flex-1 py-3 border border-red-300 text-red-500 rounded-2xl font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
                    Cancel
                  </button>
                </>
              )}
              {selected.status !== 'ACTIVE' && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <AlertCircle className="w-4 h-4" />
                  This booking is {selected.status.toLowerCase()} and cannot be modified.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── AvailabilityTab ─────────────────────────────────────────────────────────

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DEFAULT_RULES = [1,2,3,4,5].map(d => ({ day: d, startTime: '09:00', endTime: '17:00' }));

function AvailabilityTab() {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [rules, setRules] = useState(DEFAULT_RULES);
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');

  useEffect(() => { fetchSchedules(); }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/scheduling/availability`, { headers: authHeader() });
      const list = res.data.schedules || [];
      setSchedules(list);
      if (list.length > 0 && !selected) {
        const s = list[0];
        setSelected(s);
        setRules(s.rules || DEFAULT_RULES);
        setTimezone(s.timezone || 'UTC');
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load schedules', variant: 'destructive' });
    } finally { setLoading(false); }
  };

  const toggleDay = (day) => {
    if (rules.find(r => r.day === day)) {
      setRules(rules.filter(r => r.day !== day));
    } else {
      setRules([...rules, { day, startTime: '09:00', endTime: '17:00' }].sort((a,b) => a.day - b.day));
    }
  };

  const updateRule = (day, field, val) => {
    setRules(rules.map(r => r.day === day ? { ...r, [field]: val } : r));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { rules, timezone, isDefault: true, name: selected?.name || 'Default Schedule' };
      if (selected?.id) {
        await axios.put(`${BACKEND_URL}/api/scheduling/availability/${selected.id}`, payload, { headers: authHeader() });
      } else {
        await axios.post(`${BACKEND_URL}/api/scheduling/availability`, payload, { headers: authHeader() });
      }
      toast({ title: 'Availability saved' });
      fetchSchedules();
    } catch {
      toast({ title: 'Error', description: 'Failed to save', variant: 'destructive' });
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand-blue animate-spin" /></div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 dark:text-white">Weekly Hours</h3>
          <div className="flex items-center gap-3">
            <select value={timezone} onChange={e => setTimezone(e.target.value)}
              className="text-sm px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue"
            >
              {['UTC','Asia/Kolkata','America/New_York','America/Chicago','America/Los_Angeles','Europe/London','Europe/Paris','Asia/Tokyo','Australia/Sydney'].map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {DAYS.map((day, idx) => {
            const rule = rules.find(r => r.day === idx);
            return (
              <div key={day} className="px-6 py-4 flex items-center gap-4">
                <div onClick={() => toggleDay(idx)}
                  className={`w-11 h-6 rounded-full transition-all relative cursor-pointer shrink-0 ${rule ? 'bg-brand-blue' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${rule ? 'left-6' : 'left-1'}`} />
                </div>
                <span className={`w-10 text-sm font-bold ${rule ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>{day}</span>
                {rule ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input type="time" value={rule.startTime} onChange={e => updateRule(idx, 'startTime', e.target.value)}
                      className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                    <span className="text-gray-400 text-sm">—</span>
                    <input type="time" value={rule.endTime} onChange={e => updateRule(idx, 'endTime', e.target.value)}
                      className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                ) : (
                  <span className="text-sm text-gray-400 flex-1">Unavailable</span>
                )}
              </div>
            );
          })}
        </div>
        <div className="px-6 py-5 border-t border-gray-100 dark:border-gray-800">
          <button onClick={handleSave} disabled={saving}
            className="px-8 py-3 bg-brand-gradient text-white rounded-2xl font-bold shadow-lg shadow-brand-blue/20 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

const SchedulingManagement = () => {
  const { toast } = useToast();
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('event-types');
  const [modalState, setModalState] = useState(null);

  useEffect(() => { fetchEventTypes(); }, []);

  const fetchEventTypes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/scheduling/event-types`, { headers: authHeader() });
      setEventTypes(response.data.eventTypes);
    } catch {
      toast({ title: 'Error', description: 'Failed to load event types', variant: 'destructive' });
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event type?')) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/scheduling/event-types/${id}`, { headers: authHeader() });
      toast({ title: 'Deleted' });
      fetchEventTypes();
    } catch {
      toast({ title: 'Error', description: 'Delete failed', variant: 'destructive' });
    }
  };

  const copyLink = (slug) => {
    navigator.clipboard.writeText(`${window.location.origin}/schedule/${slug}`);
    toast({ title: 'Link Copied' });
  };

  const providerLabel = (et) => {
    if (et.locationType !== 'VIDEO') return et.locationType;
    return { ZOOM: 'Zoom', GOOGLE_MEET: 'Google Meet', JITSI: 'Jitsi' }[et.videoProvider] || 'Video';
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Scheduling <span className="bg-brand-gradient bg-clip-text text-transparent">Ecosystem</span>
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Manage event types, bookings, and availability.</p>
          </div>
          {activeTab === 'event-types' && (
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gradient text-white rounded-2xl font-bold shadow-lg shadow-brand-blue/20 hover:scale-[1.02] transition-all"
              onClick={() => setModalState({ mode: 'create' })}
            >
              <Plus className="w-5 h-5" /> New Event Type
            </button>
          )}
        </div>

        <div className="flex gap-4 mb-8 border-b border-gray-100 dark:border-gray-800 pb-px">
          {[
            { id: 'event-types',      label: 'Event Types', icon: Calendar },
            { id: 'scheduled-events', label: 'Bookings',    icon: Clock },
            { id: 'availability',     label: 'Availability',icon: Settings },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all relative ${activeTab === tab.id ? 'text-brand-blue' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <tab.icon className="w-4 h-4" />{tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-blue rounded-t-full" />}
            </button>
          ))}
        </div>

        {activeTab === 'event-types' && (
          loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="w-10 h-10 text-brand-blue animate-spin mb-4" />
              <p className="text-gray-400 font-medium">Loading event types...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventTypes.map(type => (
                <div key={type.id}
                  className="group relative bg-white dark:bg-gray-900 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none transition-all duration-500"
                >
                  <div className="absolute top-6 right-6">
                    <div className={`w-2 h-2 rounded-full ${type.isActive ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                  </div>
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${type.color}20`, color: type.color }}>
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">{type.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{type.duration} mins • {providerLabel(type)}</p>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">{type.description || 'No description provided.'}</p>
                    <div className="pt-4 flex items-center gap-2 border-t border-gray-50 dark:border-gray-800">
                      <button onClick={() => copyLink(type.slug)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-bold hover:bg-brand-blue hover:text-white transition-all"
                      >
                        <Copy className="w-3.5 h-3.5" /> Copy Link
                      </button>
                      <button onClick={() => setModalState({ mode: 'edit', data: type })} className="p-2 text-gray-400 hover:text-brand-blue transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(type.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => setModalState({ mode: 'create' })}
                className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[2rem] p-6 flex flex-col items-center justify-center text-gray-400 hover:border-brand-blue hover:text-brand-blue transition-all group min-h-[250px]"
              >
                <div className="w-14 h-14 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6" />
                </div>
                <p className="font-bold">Create Event Type</p>
              </button>
            </div>
          )
        )}

        {activeTab === 'scheduled-events' && <BookingsTab />}
        {activeTab === 'availability' && <AvailabilityTab />}
      </div>

      {modalState && (
        <EventTypeModal
          initial={modalState.mode === 'edit' ? modalState.data : null}
          onClose={() => setModalState(null)}
          onSaved={() => { setModalState(null); fetchEventTypes(); }}
        />
      )}
    </DashboardLayout>
  );
};

export default SchedulingManagement;
