import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../../hooks/use-toast';
import {
  Workflow, Plus, Trash2, Loader2, PlayCircle, Clock,
  Mail, Webhook, ChevronDown
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const token = () => localStorage.getItem('token');
const authHeader = () => ({ Authorization: `Bearer ${token()}` });

const TRIGGER_OPTIONS = [
  { value: 'ON_BOOKED',    label: 'Immediately when booked' },
  { value: 'BEFORE_EVENT', label: 'Before event starts' },
  { value: 'AFTER_EVENT',  label: 'After event ends' },
];

const ACTION_OPTIONS = [
  { value: 'SEND_EMAIL',    label: 'Send Email',      icon: Mail },
  { value: 'CALL_WEBHOOK',  label: 'Trigger Webhook', icon: Webhook },
];

const EMAIL_RECIPIENTS = [
  { value: 'invitee', label: 'Invitee' },
  { value: 'host',    label: 'Host' },
  { value: 'both',    label: 'Both' },
];

const EMPTY_ACTION_CONFIG = { emailRecipient: 'invitee', emailSubject: '', webhookUrl: '' };

export default function WorkflowBuilder() {
  const { toast } = useToast();
  const [workflows, setWorkflows]   = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [templates, setTemplates]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [saving, setSaving]         = useState(false);
  const [expanded, setExpanded]     = useState(null);

  const [eventTypeId, setEventTypeId] = useState('');
  const [trigger, setTrigger]         = useState('ON_BOOKED');
  const [offsetValue, setOffsetValue] = useState(24);
  const [offsetUnit, setOffsetUnit]   = useState('hours');
  const [action, setAction]           = useState('SEND_EMAIL');
  const [actionConfig, setActionConfig] = useState(EMPTY_ACTION_CONFIG);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [etRes, wfRes, tmplRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/scheduling/event-types`, { headers: authHeader() }),
        axios.get(`${BACKEND_URL}/api/scheduling/workflows`, { headers: authHeader() }),
        axios.get(`${BACKEND_URL}/api/scheduling/email-templates`, { headers: authHeader() }).catch(() => ({ data: { templates: [] } }))
      ]);
      if (etRes.data.success) setEventTypes(etRes.data.eventTypes);
      if (wfRes.data.success) setWorkflows(wfRes.data.workflows);
      setTemplates(tmplRes.data.templates || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load data', variant: 'destructive' });
    } finally { setLoading(false); }
  };

  const calcOffsetMinutes = () => {
    if (trigger === 'ON_BOOKED') return null;
    const multipliers = { minutes: 1, hours: 60, days: 1440 };
    const mins = offsetValue * (multipliers[offsetUnit] || 1);
    return trigger === 'BEFORE_EVENT' ? -mins : mins;
  };

  const buildActionConfig = () => {
    if (action === 'SEND_EMAIL') {
      return {
        recipient: actionConfig.emailRecipient,
        subject: actionConfig.emailSubject || undefined,
        templateId: actionConfig.templateId || undefined,
      };
    }
    if (action === 'CALL_WEBHOOK') {
      return { url: actionConfig.webhookUrl };
    }
    return {};
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!eventTypeId) { toast({ title: 'Select an event type', variant: 'destructive' }); return; }
    if (action === 'CALL_WEBHOOK' && !actionConfig.webhookUrl) {
      toast({ title: 'Webhook URL is required', variant: 'destructive' }); return;
    }
    setSaving(true);
    try {
      await axios.post(`${BACKEND_URL}/api/scheduling/workflows`, {
        eventTypeId,
        trigger,
        offsetMinutes: calcOffsetMinutes(),
        action,
        actionConfig: buildActionConfig()
      }, { headers: authHeader() });
      toast({ title: 'Workflow created' });
      setShowForm(false);
      setEventTypeId(''); setTrigger('ON_BOOKED'); setOffsetValue(24); setOffsetUnit('hours');
      setAction('SEND_EMAIL'); setActionConfig(EMPTY_ACTION_CONFIG);
      fetchData();
    } catch (err) {
      toast({ title: 'Error', description: err.response?.data?.error || 'Failed', variant: 'destructive' });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this workflow?')) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/scheduling/workflows/${id}`, { headers: authHeader() });
      toast({ title: 'Deleted' });
      fetchData();
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  const formatTrigger = (wf) => {
    if (wf.trigger === 'ON_BOOKED') return 'Immediately when booked';
    if (!wf.offsetMinutes) return wf.trigger;
    const abs = Math.abs(wf.offsetMinutes);
    const str = abs % 1440 === 0 ? `${abs / 1440} days` : abs % 60 === 0 ? `${abs / 60} hours` : `${abs} minutes`;
    return wf.trigger === 'BEFORE_EVENT' ? `${str} before event` : `${str} after event`;
  };

  const setConfig = (k, v) => setActionConfig(c => ({ ...c, [k]: v }));

  if (loading) return (
    <DashboardLayout>
      <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-brand-blue" /></div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6 md:p-10">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Workflow Builder</h1>
            <p className="text-gray-500">Automate emails and webhooks around your booking events.</p>
          </div>
          {!showForm && (
            <button onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-brand-gradient text-white px-5 py-2.5 rounded-2xl font-bold shadow-lg shadow-brand-blue/20 hover:scale-[1.02] transition-all"
            >
              <Plus className="w-4 h-4" /> New Workflow
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSave}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[2rem] p-8 shadow-sm mb-8 space-y-6"
          >
            <h3 className="font-bold text-xl text-gray-900 dark:text-white">Create Automation</h3>

            {/* Event type */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Apply to Event Type *</label>
              <select value={eventTypeId} onChange={e => setEventTypeId(e.target.value)} required
                className="w-full bg-gray-50 dark:bg-gray-800 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-blue"
              >
                <option value="">Select an event type...</option>
                {eventTypes.map(et => <option key={et.id} value={et.id}>{et.name}</option>)}
              </select>
            </div>

            {/* Step 1: When */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-blue" /> When does this happen?
              </h4>
              <select value={trigger} onChange={e => setTrigger(e.target.value)}
                className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm mb-3 outline-none focus:ring-2 focus:ring-brand-blue"
              >
                {TRIGGER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              {trigger !== 'ON_BOOKED' && (
                <div className="flex gap-3">
                  <input type="number" value={offsetValue} onChange={e => setOffsetValue(Number(e.target.value))} min="1"
                    className="w-24 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                  <select value={offsetUnit} onChange={e => setOffsetUnit(e.target.value)}
                    className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-blue"
                  >
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                </div>
              )}
            </div>

            {/* Step 2: Action */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 space-y-4">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-brand-blue" /> What action to take?
              </h4>

              {/* Action type */}
              <div className="grid grid-cols-2 gap-3">
                {ACTION_OPTIONS.map(({ value, label, icon: Icon }) => (
                  <button key={value} type="button" onClick={() => setAction(value)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-left transition-all ${
                      action === value
                        ? 'border-brand-blue bg-brand-blue/5 dark:bg-brand-blue/10 text-brand-blue'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-sm font-bold">{label}</span>
                  </button>
                ))}
              </div>

              {/* Email config */}
              {action === 'SEND_EMAIL' && (
                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Send to</label>
                    <select value={actionConfig.emailRecipient} onChange={e => setConfig('emailRecipient', e.target.value)}
                      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-blue"
                    >
                      {EMAIL_RECIPIENTS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </div>

                  {templates.length > 0 && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Template (optional)</label>
                      <select value={actionConfig.templateId || ''} onChange={e => setConfig('templateId', e.target.value)}
                        className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-blue"
                      >
                        <option value="">Use default template</option>
                        {templates.map(t => (
                          <option key={t.id} value={t.id}>{t.type} — {t.subject}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Custom Subject (optional)</label>
                    <input value={actionConfig.emailSubject} onChange={e => setConfig('emailSubject', e.target.value)}
                      placeholder="e.g. Your consultation is confirmed — {{event_name}}"
                      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                </div>
              )}

              {/* Webhook config */}
              {action === 'CALL_WEBHOOK' && (
                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Webhook URL *</label>
                    <input type="url" value={actionConfig.webhookUrl} onChange={e => setConfig('webhookUrl', e.target.value)}
                      placeholder="https://hooks.example.com/my-workflow"
                      required
                      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                    <p className="text-xs text-gray-400">Receives the booking payload as a POST request.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={saving}
                className="flex-1 bg-brand-gradient text-white py-3 rounded-2xl font-bold shadow-lg shadow-brand-blue/20 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Workflow
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Workflow list */}
        <div className="space-y-3">
          {workflows.length === 0 && !showForm ? (
            <div className="text-center py-20 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[2rem]">
              <Workflow className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-500">No workflows yet</h3>
              <p className="text-sm text-gray-400 mt-1">Create your first automation above.</p>
            </div>
          ) : workflows.map(wf => {
            const ActionIcon = wf.action === 'SEND_EMAIL' ? Mail : Webhook;
            const isOpen = expanded === wf.id;
            return (
              <div key={wf.id}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm"
              >
                <div className="p-5 flex items-center gap-4">
                  <div className="w-11 h-11 bg-brand-blue/10 text-brand-blue rounded-2xl flex items-center justify-center shrink-0">
                    {wf.trigger === 'ON_BOOKED' ? <PlayCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <ActionIcon className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="font-bold text-gray-900 dark:text-white text-sm">
                        {wf.action === 'SEND_EMAIL' ? 'Send Email' : 'Trigger Webhook'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      <span className="font-bold text-gray-600 dark:text-gray-400">{wf.eventType?.name}</span>
                      {' · '}{formatTrigger(wf)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {wf.actionConfig && Object.keys(wf.actionConfig).length > 0 && (
                      <button onClick={() => setExpanded(isOpen ? null : wf.id)}
                        className="p-2 text-gray-400 hover:text-brand-blue rounded-xl transition-colors"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                    <button onClick={() => handleDelete(wf.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {isOpen && wf.actionConfig && (
                  <div className="border-t border-gray-100 dark:border-gray-800 px-5 py-4 bg-gray-50 dark:bg-black/20 text-xs font-mono text-gray-500">
                    <pre>{JSON.stringify(wf.actionConfig, null, 2)}</pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
