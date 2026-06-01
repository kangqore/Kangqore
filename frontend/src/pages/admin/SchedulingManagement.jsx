import React, { useState, useEffect } from 'react';
import {
  Plus, Calendar, Clock, Settings, Copy, Trash2, Edit2,
  Search, Loader2, Video, Phone, MapPin, X, Check, Zap
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import { useToast } from '../../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

const VIDEO_PROVIDERS = [
  { value: 'JITSI',       label: 'Jitsi Meet',    desc: 'Free, open-source — no account needed' },
  { value: 'ZOOM',        label: 'Zoom',           desc: 'Requires Zoom account connected in Calendar Settings' },
  { value: 'GOOGLE_MEET', label: 'Google Meet',    desc: 'Requires Google Calendar connected in Calendar Settings' },
];

const LOCATION_TYPES = [
  { value: 'VIDEO',      label: 'Video Call',  icon: Video },
  { value: 'IN_PERSON',  label: 'In Person',   icon: MapPin },
  { value: 'PHONE',      label: 'Phone Call',  icon: Phone },
];

const EMPTY_FORM = {
  name: '', slug: '', description: '', duration: 30,
  locationType: 'VIDEO', videoProvider: 'JITSI',
  bufferBefore: 0, bufferAfter: 0,
  minNotice: 60, maxAdvanceDays: 30, maxPerDay: '',
  color: '#2564ea', isPublic: true, isActive: true,
};

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function EventTypeModal({ initial, onClose, onSaved }) {
  const { toast } = useToast();
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const isEdit = !!initial?.id;

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...form,
        slug: form.slug || slugify(form.name),
        maxPerDay: form.maxPerDay === '' ? null : Number(form.maxPerDay),
        duration: Number(form.duration),
        bufferBefore: Number(form.bufferBefore),
        bufferAfter: Number(form.bufferAfter),
        minNotice: Number(form.minNotice),
        maxAdvanceDays: Number(form.maxAdvanceDays),
      };

      if (isEdit) {
        await axios.put(`${BACKEND_URL}/api/scheduling/event-types/${form.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${BACKEND_URL}/api/scheduling/event-types`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      toast({ title: isEdit ? 'Event type updated' : 'Event type created' });
      onSaved();
    } catch (err) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Save failed', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEdit ? 'Edit Event Type' : 'New Event Type'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

          {/* Name + slug */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Name *</label>
              <input
                required value={form.name}
                onChange={e => { set('name', e.target.value); if (!isEdit) set('slug', slugify(e.target.value)); }}
                placeholder="30-Minute Consultation"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Slug *</label>
              <input
                required value={form.slug}
                onChange={e => set('slug', slugify(e.target.value))}
                placeholder="30-min-consultation"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</label>
            <textarea
              rows={2} value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Brief description shown to invitees..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-blue resize-none"
            />
          </div>

          {/* Duration + color */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Duration (minutes)</label>
              <select
                value={form.duration} onChange={e => set('duration', Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-blue"
              >
                {[15, 20, 30, 45, 60, 90, 120].map(d => (
                  <option key={d} value={d}>{d} minutes</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Color</label>
              <input
                type="color" value={form.color}
                onChange={e => set('color', e.target.value)}
                className="w-full h-[46px] rounded-2xl border-none cursor-pointer bg-gray-50 dark:bg-gray-800 p-1"
              />
            </div>
          </div>

          {/* Location type */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Location</label>
            <div className="grid grid-cols-3 gap-2">
              {LOCATION_TYPES.map(lt => (
                <button
                  key={lt.value} type="button"
                  onClick={() => set('locationType', lt.value)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold border transition-all ${
                    form.locationType === lt.value
                      ? 'bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/20'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-500 border-transparent hover:border-gray-200'
                  }`}
                >
                  <lt.icon className="w-4 h-4" />
                  {lt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Video provider (only when VIDEO) */}
          {form.locationType === 'VIDEO' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-3 h-3" /> Video Platform
              </label>
              <div className="space-y-2">
                {VIDEO_PROVIDERS.map(vp => (
                  <button
                    key={vp.value} type="button"
                    onClick={() => set('videoProvider', vp.value)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border text-left transition-all ${
                      form.videoProvider === vp.value
                        ? 'border-brand-blue bg-brand-blue/5 dark:bg-brand-blue/10'
                        : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:border-gray-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      form.videoProvider === vp.value ? 'border-brand-blue bg-brand-blue' : 'border-gray-300'
                    }`}>
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

          {/* Buffers + limits */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Buffer Before (min)</label>
              <input
                type="number" min={0} max={120} value={form.bufferBefore}
                onChange={e => set('bufferBefore', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Buffer After (min)</label>
              <input
                type="number" min={0} max={120} value={form.bufferAfter}
                onChange={e => set('bufferAfter', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Min Notice (min)</label>
              <input
                type="number" min={0} value={form.minNotice}
                onChange={e => set('minNotice', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Max Advance (days)</label>
              <input
                type="number" min={1} value={form.maxAdvanceDays}
                onChange={e => set('maxAdvanceDays', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Max Per Day</label>
              <input
                type="number" min={1} value={form.maxPerDay}
                placeholder="Unlimited"
                onChange={e => set('maxPerDay', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            {[['isActive', 'Active'], ['isPublic', 'Public']].map(([key, label]) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => set(key, !form[key])}
                  className={`w-11 h-6 rounded-full transition-all relative cursor-pointer ${form[key] ? 'bg-brand-blue' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form[key] ? 'left-6' : 'left-1'}`} />
                </div>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{label}</span>
              </label>
            ))}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-8 py-6 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button" onClick={onClose}
            className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit} disabled={saving}
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

const SchedulingManagement = () => {
  const { toast } = useToast();
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('event-types');
  const [modalState, setModalState] = useState(null); // null | { mode: 'create' | 'edit', data?: {} }

  useEffect(() => { fetchEventTypes(); }, []);

  const fetchEventTypes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_URL}/api/scheduling/event-types`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEventTypes(response.data.eventTypes);
    } catch {
      toast({ title: 'Error', description: 'Failed to load event types', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event type?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BACKEND_URL}/api/scheduling/event-types/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({ title: 'Deleted' });
      fetchEventTypes();
    } catch {
      toast({ title: 'Error', description: 'Delete failed', variant: 'destructive' });
    }
  };

  const copyLink = (slug) => {
    navigator.clipboard.writeText(`${window.location.origin}/schedule/${slug}`);
    toast({ title: 'Link Copied', description: 'Booking link copied to clipboard' });
  };

  const providerLabel = (et) => {
    if (et.locationType !== 'VIDEO') return et.locationType;
    const p = { ZOOM: 'Zoom', GOOGLE_MEET: 'Google Meet', JITSI: 'Jitsi' };
    return p[et.videoProvider] || 'Video';
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Scheduling <span className="bg-brand-gradient bg-clip-text text-transparent">Ecosystem</span>
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Manage your event types, availability, and bookings.</p>
          </div>
          <button
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gradient text-white rounded-2xl font-bold shadow-lg shadow-brand-blue/20 hover:scale-[1.02] transition-all"
            onClick={() => setModalState({ mode: 'create' })}
          >
            <Plus className="w-5 h-5" />
            New Event Type
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-100 dark:border-gray-800 pb-px">
          {[
            { id: 'event-types', label: 'Event Types', icon: Calendar },
            { id: 'scheduled-events', label: 'Bookings', icon: Clock },
            { id: 'availability', label: 'Availability', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all relative ${
                activeTab === tab.id ? 'text-brand-blue' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-blue rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-10 h-10 text-brand-blue animate-spin mb-4" />
            <p className="text-gray-400 font-medium">Loading event types...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventTypes.map(type => (
              <div
                key={type.id}
                className="group relative bg-white dark:bg-gray-900 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none transition-all duration-500"
              >
                <div className="absolute top-6 right-6">
                  <div className={`w-2 h-2 rounded-full ${type.isActive ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                </div>

                <div className="space-y-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${type.color}20`, color: type.color }}
                  >
                    <Clock className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">
                      {type.name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">{type.duration} mins • {providerLabel(type)}</p>
                  </div>

                  <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">
                    {type.description || 'No description provided.'}
                  </p>

                  <div className="pt-4 flex items-center gap-2 border-t border-gray-50 dark:border-gray-800">
                    <button
                      onClick={() => copyLink(type.slug)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-bold hover:bg-brand-blue hover:text-white transition-all"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy Link
                    </button>
                    <button
                      onClick={() => setModalState({ mode: 'edit', data: type })}
                      className="p-2 text-gray-400 hover:text-brand-blue transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(type.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add card */}
            <button
              onClick={() => setModalState({ mode: 'create' })}
              className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[2rem] p-6 flex flex-col items-center justify-center text-gray-400 hover:border-brand-blue hover:text-brand-blue transition-all group min-h-[250px]"
            >
              <div className="w-14 h-14 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6" />
              </div>
              <p className="font-bold">Create Event Type</p>
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
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
