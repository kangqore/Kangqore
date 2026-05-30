import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../../hooks/use-toast';
import { Workflow, Plus, Trash2, Loader2, PlayCircle, Clock } from 'lucide-react';

const TRIGGER_OPTIONS = [
  { value: 'ON_BOOKED', label: 'Immediately when booked' },
  { value: 'BEFORE_EVENT', label: 'Before event starts' },
  { value: 'AFTER_EVENT', label: 'After event ends' },
];

const ACTION_OPTIONS = [
  { value: 'SEND_EMAIL', label: 'Send Email' },
  { value: 'CALL_WEBHOOK', label: 'Trigger Webhook' },
];

export default function WorkflowBuilder() {
  const { toast } = useToast();
  const [workflows, setWorkflows] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [eventTypeId, setEventTypeId] = useState('');
  const [trigger, setTrigger] = useState('ON_BOOKED');
  const [offsetValue, setOffsetValue] = useState(24);
  const [offsetUnit, setOffsetUnit] = useState('hours'); // minutes, hours, days
  const [action, setAction] = useState('SEND_EMAIL');

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [wfRes, etRes] = await Promise.all([
        // Assuming we'll add this endpoint to event-types or a separate workflow route
        axios.get(`${BACKEND_URL}/api/scheduling/event-types`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (etRes.data.success) {
        setEventTypes(etRes.data.eventTypes);
        // For simplicity in this UI, we might just list workflows from the event types
        // Or if we created a dedicated GET /api/scheduling/workflows we'd use that.
        // I will implement a dedicated endpoint GET /api/scheduling/workflows
        const wfsRes = await axios.get(`${BACKEND_URL}/api/scheduling/workflows`, { headers: { Authorization: `Bearer ${token}` } });
        if (wfsRes.data.success) setWorkflows(wfsRes.data.workflows);
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to load data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const calculateOffsetMinutes = () => {
    if (trigger === 'ON_BOOKED') return null;
    let multiplier = 1;
    if (offsetUnit === 'hours') multiplier = 60;
    if (offsetUnit === 'days') multiplier = 1440;
    // We store offset as negative for BEFORE and positive for AFTER in DB, but the UI keeps it simple.
    // Wait, the workflowService expects positive/negative if needed, but our implementation:
    // workflowService uses `event.startTime.getTime() + workflow.offsetMinutes * 60000` for BEFORE_EVENT
    // So BEFORE_EVENT offset should be negative.
    let mins = offsetValue * multiplier;
    if (trigger === 'BEFORE_EVENT') mins = -mins;
    return mins;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!eventTypeId) {
      toast({ title: 'Error', description: 'Please select an event type', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${BACKEND_URL}/api/scheduling/workflows`, {
        eventTypeId,
        trigger,
        offsetMinutes: calculateOffsetMinutes(),
        action,
        actionConfig: {}
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        toast({ title: 'Success', description: 'Workflow created' });
        setShowForm(false);
        fetchData();
      }
    } catch (err) {
      toast({ title: 'Error', description: err.response?.data?.error || 'Failed to create workflow', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workflow?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`${BACKEND_URL}/api/scheduling/workflows/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast({ title: 'Success', description: 'Workflow deleted' });
        fetchData();
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete workflow', variant: 'destructive' });
    }
  };

  const formatTrigger = (wf) => {
    if (wf.trigger === 'ON_BOOKED') return 'Immediately when booked';
    if (!wf.offsetMinutes) return wf.trigger;
    const absMins = Math.abs(wf.offsetMinutes);
    let str = `${absMins} minutes`;
    if (absMins % 1440 === 0) str = `${absMins / 1440} days`;
    else if (absMins % 60 === 0) str = `${absMins / 60} hours`;
    
    return wf.trigger === 'BEFORE_EVENT' ? `${str} before event starts` : `${str} after event ends`;
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-blue" /></div>;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Workflow Builder</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Automate actions around your events, like sending follow-up emails or pinging webhooks.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-xl font-bold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> New Workflow
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm mb-8">
          <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Create Automation</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-1 dark:text-gray-300">Apply to Event Type</label>
              <select
                value={eventTypeId}
                onChange={(e) => setEventTypeId(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 dark:text-white"
                required
              >
                <option value="">Select an event type...</option>
                {eventTypes.map(et => (
                  <option key={et.id} value={et.id}>{et.title}</option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">1. When does this happen?</h4>
              <select
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 mb-3 dark:text-white"
              >
                {TRIGGER_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>

              {trigger !== 'ON_BOOKED' && (
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={offsetValue}
                    onChange={(e) => setOffsetValue(Number(e.target.value))}
                    min="1"
                    className="w-24 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 dark:text-white"
                  />
                  <select
                    value={offsetUnit}
                    onChange={(e) => setOffsetUnit(e.target.value)}
                    className="flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 dark:text-white"
                  >
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">2. What action to take?</h4>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 dark:text-white"
              >
                {ACTION_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              {action === 'SEND_EMAIL' && (
                <p className="text-xs text-gray-500 mt-2">Sends the confirmation or generic notification email template to the invitee.</p>
              )}
              {action === 'CALL_WEBHOOK' && (
                <p className="text-xs text-gray-500 mt-2">Dispatches the event to any webhooks configured for this event type.</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-brand-blue text-white py-2 rounded-xl font-bold flex items-center justify-center disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Workflow'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {workflows.length === 0 && !showForm && (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 text-center border border-dashed border-gray-300 dark:border-gray-700">
            <Workflow className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">No Workflows Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">
              Automate your scheduling process by creating your first workflow.
            </p>
          </div>
        )}

        {workflows.map(wf => (
          <div key={wf.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full flex items-center justify-center">
                {wf.trigger === 'ON_BOOKED' ? <PlayCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">
                  {wf.action === 'SEND_EMAIL' ? 'Send Email' : 'Trigger Webhook'}
                </h3>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{wf.eventType?.title}</span>
                  <span>&bull;</span>
                  <span>{formatTrigger(wf)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleDelete(wf.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
              title="Delete Workflow"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
