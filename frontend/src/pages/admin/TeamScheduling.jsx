import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users, Plus, Trash2, Loader2, X, Check, User,
  Search, Edit2
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import DashboardLayout from '../../components/DashboardLayout';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';
const token = () => localStorage.getItem('token');
const authHeader = () => ({ Authorization: `Bearer ${token()}` });

const STRATEGY_LABELS = {
  ROUND_ROBIN: { label: 'Round-Robin', desc: 'Bookings distributed evenly with load balancing', color: 'bg-blue-100 text-blue-700' },
  COLLECTIVE:  { label: 'Collective',  desc: 'All team members attend — slot shown only when everyone is free', color: 'bg-purple-100 text-purple-700' },
  HOST_PICK:   { label: 'Host Pick',   desc: 'Invitee selects which team member to meet', color: 'bg-green-100 text-green-700' },
};

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ─── Team Event Modal ────────────────────────────────────────────────────────

function TeamEventModal({ initial, onClose, onSaved }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initial || {
    name: '', slug: '', description: '', duration: 30,
    assignmentStrategy: 'ROUND_ROBIN',
    color: '#2564ea', isActive: true, isPublic: true,
    locationType: 'VIDEO', videoProvider: 'JITSI',
    bufferBefore: 0, bufferAfter: 0, minNotice: 60, maxAdvanceDays: 30,
  });
  const isEdit = !!initial?.id;
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, slug: form.slug || slugify(form.name) };
      if (isEdit) {
        await axios.put(`${BACKEND_URL}/api/scheduling/event-types/${form.id}`, payload, { headers: authHeader() });
      } else {
        await axios.post(`${BACKEND_URL}/api/scheduling/event-types`, payload, { headers: authHeader() });
      }
      toast({ title: isEdit ? 'Team event updated' : 'Team event created' });
      onSaved();
    } catch (err) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to save', variant: 'destructive' });
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{isEdit ? 'Edit Team Event' : 'New Team Event'}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Name *</label>
              <input required value={form.name}
                onChange={e => { set('name', e.target.value); if (!isEdit) set('slug', slugify(e.target.value)); }}
                placeholder="Team Strategy Session"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Duration</label>
              <select value={form.duration} onChange={e => set('duration', Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-blue"
              >
                {[15, 30, 45, 60, 90, 120].map(d => <option key={d} value={d}>{d} min</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</label>
            <textarea rows={2} value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Brief description..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-blue resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Assignment Strategy</label>
            <div className="space-y-2">
              {Object.entries(STRATEGY_LABELS).map(([val, { label, desc, color }]) => (
                <button key={val} type="button" onClick={() => set('assignmentStrategy', val)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border text-left transition-all ${
                    form.assignmentStrategy === val ? 'border-brand-blue bg-brand-blue/5 dark:bg-brand-blue/10' : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:border-gray-200'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${form.assignmentStrategy === val ? 'border-brand-blue bg-brand-blue' : 'border-gray-300'}`}>
                    {form.assignmentStrategy === val && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </form>
        <div className="flex items-center justify-end gap-3 px-8 py-6 border-t border-gray-100 dark:border-gray-800">
          <button type="button" onClick={onClose} className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">Cancel</button>
          <button onClick={handleSubmit} disabled={saving}
            className="px-8 py-3 bg-brand-gradient text-white rounded-2xl font-bold shadow-lg shadow-brand-blue/20 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? 'Save Changes' : 'Create Team Event'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Members Panel ───────────────────────────────────────────────────────────

function MembersPanel({ eventType, onClose, onUpdated }) {
  const { toast } = useToast();
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchMembers();
    fetchUsers();
  }, []);

  const fetchMembers = async () => {
    const res = await axios.get(`${BACKEND_URL}/api/scheduling/event-types/${eventType.id}/members`, { headers: authHeader() });
    setMembers(res.data.members || []);
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/users?role=ADMIN,EMPLOYEE&limit=100`, { headers: authHeader() });
      setUsers(res.data.users || []);
    } catch { /* ignore */ }
  };

  const handleAdd = async (userId) => {
    setAdding(true);
    try {
      await axios.post(`${BACKEND_URL}/api/scheduling/event-types/${eventType.id}/members`, { userId }, { headers: authHeader() });
      toast({ title: 'Member added' });
      fetchMembers();
      onUpdated();
    } catch (err) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to add', variant: 'destructive' });
    } finally { setAdding(false); }
  };

  const handleRemove = async (userId) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/scheduling/event-types/${eventType.id}/members/${userId}`, { headers: authHeader() });
      toast({ title: 'Member removed' });
      fetchMembers();
      onUpdated();
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  const memberIds = new Set(members.map(m => m.userId));
  const filtered = users.filter(u =>
    !memberIds.has(u.id) &&
    (u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Team Members</h2>
            <p className="text-sm text-gray-400 mt-0.5">{eventType.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Current members */}
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-brand-blue animate-spin" /></div>
          ) : members.length > 0 && (
            <div className="px-8 py-5 border-b border-gray-100 dark:border-gray-800">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Current Team ({members.length})</p>
              <div className="space-y-2">
                {members.map(m => (
                  <div key={m.userId} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0">
                      {m.user?.avatarUrl
                        ? <img src={m.user.avatarUrl} alt={m.user.name} className="w-9 h-9 rounded-full object-cover" />
                        : <User className="w-4 h-4 text-brand-blue" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{m.user?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{m.user?.email}</p>
                    </div>
                    <button onClick={() => handleRemove(m.userId)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add members */}
          <div className="px-8 py-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Add Members</p>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">{search ? 'No users found' : 'All team members are already added'}</p>
              ) : filtered.map(u => (
                <div key={u.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                    {u.avatarUrl
                      ? <img src={u.avatarUrl} alt={u.name} className="w-9 h-9 rounded-full object-cover" />
                      : <User className="w-4 h-4 text-gray-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{u.name}</p>
                    <p className="text-xs text-gray-400 truncate">{u.email}</p>
                  </div>
                  <button onClick={() => handleAdd(u.id)} disabled={adding}
                    className="px-3 py-1.5 bg-brand-blue/10 text-brand-blue rounded-xl text-xs font-bold hover:bg-brand-blue hover:text-white transition-all disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-8 py-5 border-t border-gray-100 dark:border-gray-800">
          <button onClick={onClose} className="w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Done</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function TeamScheduling() {
  const { toast } = useToast();
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | { mode: 'create'|'edit', data? }
  const [membersPanel, setMembersPanel] = useState(null);

  useEffect(() => { fetchEventTypes(); }, []);

  const fetchEventTypes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/scheduling/event-types`, { headers: authHeader() });
      setEventTypes((res.data.eventTypes || []).filter(et => et.assignmentStrategy !== 'SINGLE_HOST'));
    } catch {
      toast({ title: 'Error', description: 'Failed to load team events', variant: 'destructive' });
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this team event type?')) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/scheduling/event-types/${id}`, { headers: authHeader() });
      toast({ title: 'Deleted' });
      fetchEventTypes();
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6 md:p-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <Users className="w-9 h-9 text-brand-blue" /> Team Scheduling
            </h1>
            <p className="text-gray-500 mt-2">Manage round-robin, collective, and host-pick event pools.</p>
          </div>
          <button onClick={() => setModal({ mode: 'create' })}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gradient text-white rounded-2xl font-bold shadow-lg shadow-brand-blue/20 hover:scale-[1.02] transition-all"
          >
            <Plus className="w-4 h-4" /> New Team Event
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand-blue animate-spin" /></div>
        ) : eventTypes.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[2rem]">
            <Users className="w-14 h-14 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">No Team Events</h3>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto">Create a round-robin or collective event to start distributing bookings across your team.</p>
            <button onClick={() => setModal({ mode: 'create' })}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-brand-gradient text-white rounded-2xl font-bold shadow-lg shadow-brand-blue/20 hover:scale-[1.02] transition-all"
            >
              <Plus className="w-4 h-4" /> Create Team Event
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {eventTypes.map(et => {
              const strategy = STRATEGY_LABELS[et.assignmentStrategy];
              const brandColor = et.color || '#2564ea';
              return (
                <div key={et.id} className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-6 flex items-center gap-6 shadow-sm hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-none transition-all">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${brandColor}20`, color: brandColor }}
                  >
                    <Users className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{et.name}</h3>
                      {strategy && (
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${strategy.color}`}>
                          {strategy.label}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {et.teamMembers?.length || 0} members • {et.duration} min
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setMembersPanel(et)}
                      className="px-4 py-2 text-sm font-bold border border-brand-blue/30 text-brand-blue rounded-xl hover:bg-brand-blue hover:text-white transition-all flex items-center gap-1.5"
                    >
                      <Users className="w-4 h-4" />
                      Members
                    </button>
                    <button onClick={() => setModal({ mode: 'edit', data: et })}
                      className="p-2.5 text-gray-400 hover:text-brand-blue hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(et.id)}
                      className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {modal && (
        <TeamEventModal
          initial={modal.mode === 'edit' ? modal.data : null}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); fetchEventTypes(); }}
        />
      )}

      {membersPanel && (
        <MembersPanel
          eventType={membersPanel}
          onClose={() => setMembersPanel(null)}
          onUpdated={fetchEventTypes}
        />
      )}
    </DashboardLayout>
  );
}
