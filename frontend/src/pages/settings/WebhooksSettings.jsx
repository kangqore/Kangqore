import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../../hooks/use-toast';
import {
  Webhook, Plus, Trash2, Loader2, Activity, ShieldAlert,
  Play, ToggleLeft, ToggleRight, RefreshCw, Check, X
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
const token = () => localStorage.getItem('token');
const authHeader = () => ({ Authorization: `Bearer ${token()}` });

export default function WebhooksSettings() {
  const { toast } = useToast();
  const [webhooks, setWebhooks]             = useState([]);
  const [eventTypes, setEventTypes]         = useState([]);
  const [loading, setLoading]               = useState(true);
  const [saving, setSaving]                 = useState(false);
  const [showForm, setShowForm]             = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState(null);
  const [deliveries, setDeliveries]         = useState([]);
  const [loadingDeliveries, setLoadingDeliveries] = useState(false);
  const [testing, setTesting]               = useState(null);
  const [toggling, setToggling]             = useState(null);

  const [url, setUrl]               = useState('');
  const [secret, setSecret]         = useState('');
  const [eventTypeId, setEventTypeId] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [whRes, etRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/scheduling/webhooks`, { headers: authHeader() }),
        axios.get(`${BACKEND_URL}/api/scheduling/event-types`, { headers: authHeader() })
      ]);
      if (whRes.data.success) setWebhooks(whRes.data.webhooks);
      if (etRes.data.success) setEventTypes(etRes.data.eventTypes);
    } catch {
      toast({ title: 'Error', description: 'Failed to load webhooks', variant: 'destructive' });
    } finally { setLoading(false); }
  };

  const fetchDeliveries = async (webhookId) => {
    setLoadingDeliveries(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/scheduling/webhooks/${webhookId}/deliveries`, { headers: authHeader() });
      if (res.data.success) setDeliveries(res.data.deliveries);
    } catch {
      toast({ title: 'Error', description: 'Failed to load deliveries', variant: 'destructive' });
    } finally { setLoadingDeliveries(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!url) { toast({ title: 'URL is required', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      await axios.post(`${BACKEND_URL}/api/scheduling/webhooks`, { eventTypeId: eventTypeId || null, url, secret }, { headers: authHeader() });
      toast({ title: 'Webhook created' });
      setShowForm(false); setUrl(''); setSecret(''); setEventTypeId('');
      fetchData();
    } catch (err) {
      toast({ title: 'Error', description: err.response?.data?.error || 'Failed to create', variant: 'destructive' });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this webhook?')) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/scheduling/webhooks/${id}`, { headers: authHeader() });
      toast({ title: 'Deleted' });
      if (selectedWebhook?.id === id) setSelectedWebhook(null);
      fetchData();
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  const handleToggle = async (wh) => {
    setToggling(wh.id);
    try {
      const res = await axios.patch(`${BACKEND_URL}/api/scheduling/webhooks/${wh.id}`, {}, { headers: authHeader() });
      setWebhooks(prev => prev.map(w => w.id === wh.id ? { ...w, isActive: res.data.webhook.isActive } : w));
      if (selectedWebhook?.id === wh.id) setSelectedWebhook(s => ({ ...s, isActive: res.data.webhook.isActive }));
      toast({ title: res.data.webhook.isActive ? 'Webhook enabled' : 'Webhook disabled' });
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    } finally { setToggling(null); }
  };

  const handleTest = async (wh) => {
    setTesting(wh.id);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/scheduling/webhooks/${wh.id}/test`, {}, { headers: authHeader() });
      toast({
        title: res.data.success ? 'Test delivered' : 'Test failed',
        description: res.data.message,
        variant: res.data.success ? 'default' : 'destructive'
      });
      if (selectedWebhook?.id === wh.id) fetchDeliveries(wh.id);
    } catch {
      toast({ title: 'Test failed', variant: 'destructive' });
    } finally { setTesting(null); }
  };

  if (loading) return (
    <DashboardLayout>
      <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-brand-blue" /></div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6 md:p-10">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Outbound Webhooks</h1>
            <p className="text-gray-500">Send real-time HTTP POST requests when bookings are created, cancelled, or rescheduled.</p>
          </div>
          {!showForm && (
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-brand-gradient text-white px-5 py-2.5 rounded-2xl font-bold shadow-lg shadow-brand-blue/20 hover:scale-[1.02] transition-all"
            >
              <Plus className="w-4 h-4" /> New Webhook
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: list + create form */}
          <div className="lg:col-span-1 space-y-4">
            {showForm && (
              <form onSubmit={handleSave}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm"
              >
                <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Create Webhook</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Payload URL *</label>
                    <input type="url" value={url} onChange={e => setUrl(e.target.value)} required
                      placeholder="https://api.example.com/hooks"
                      className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Event Type</label>
                    <select value={eventTypeId} onChange={e => setEventTypeId(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-blue"
                    >
                      <option value="">All Event Types (Global)</option>
                      {eventTypes.map(et => <option key={et.id} value={et.id}>{et.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                      Secret <ShieldAlert className="w-3.5 h-3.5 text-gray-400" />
                    </label>
                    <input type="password" value={secret} onChange={e => setSecret(e.target.value)}
                      placeholder="Optional HMAC-SHA256 secret"
                      className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                    <p className="text-xs text-gray-400 mt-1">Generates X-Kangqore-Signature header for verification.</p>
                  </div>
                </div>
                <div className="mt-5 flex gap-3">
                  <button type="submit" disabled={saving}
                    className="flex-1 bg-brand-gradient text-white py-2.5 rounded-xl font-bold flex items-center justify-center disabled:opacity-50 shadow-lg shadow-brand-blue/20"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)}
                    className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
              Configured ({webhooks.length})
            </p>

            {webhooks.length === 0 ? (
              <div className="text-sm text-gray-400 px-1">No webhooks configured yet.</div>
            ) : webhooks.map(wh => (
              <div key={wh.id}
                onClick={() => { setSelectedWebhook(wh); fetchDeliveries(wh.id); }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedWebhook?.id === wh.id
                    ? 'border-brand-blue bg-brand-blue/5 dark:bg-brand-blue/10'
                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700'
                } ${!wh.isActive ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Webhook className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="font-bold text-sm text-gray-900 dark:text-white truncate">{wh.url}</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {wh.eventType ? wh.eventType.name : 'Global'}
                      {!wh.isActive && <span className="ml-2 text-orange-500 font-bold">• Disabled</span>}
                    </p>
                  </div>
                  {/* Action buttons — stop propagation so clicks don't select the webhook */}
                  <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                    <button onClick={() => handleTest(wh)} disabled={toggling === wh.id || testing === wh.id}
                      title="Send test payload"
                      className="p-1.5 text-gray-400 hover:text-brand-blue hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      {testing === wh.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleToggle(wh)} disabled={toggling === wh.id}
                      title={wh.isActive ? 'Disable webhook' : 'Enable webhook'}
                      className="p-1.5 text-gray-400 hover:text-brand-blue hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      {toggling === wh.id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : wh.isActive ? <ToggleRight className="w-4 h-4 text-brand-blue" /> : <ToggleLeft className="w-4 h-4" />
                      }
                    </button>
                    <button onClick={() => handleDelete(wh.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: delivery log */}
          <div className="lg:col-span-2">
            {selectedWebhook ? (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm flex flex-col" style={{ height: 600 }}>
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/20 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-brand-blue" /> Delivery Log
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5 truncate max-w-sm">{selectedWebhook.url}</p>
                  </div>
                  <button onClick={() => fetchDeliveries(selectedWebhook.id)}
                    className="p-2 text-gray-400 hover:text-brand-blue rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {loadingDeliveries ? (
                    <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
                  ) : deliveries.length === 0 ? (
                    <div className="text-center p-8 text-gray-400">No deliveries recorded yet.</div>
                  ) : deliveries.map(d => (
                    <div key={d.id} className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                      <div className="bg-gray-50 dark:bg-black/20 px-4 py-3 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${d.status === 'SUCCESS' ? 'bg-green-100' : 'bg-red-100'}`}>
                            {d.status === 'SUCCESS'
                              ? <Check className="w-3.5 h-3.5 text-green-600" />
                              : <X className="w-3.5 h-3.5 text-red-500" />
                            }
                          </span>
                          <span className="font-mono text-gray-700 dark:text-gray-300 font-bold">
                            HTTP {d.statusCode || '—'}
                          </span>
                          <span className="text-gray-500">{d.payload?.event || 'event'}</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-400 text-xs">
                          {d.responseTime && <span>{d.responseTime}ms</span>}
                          <span>{new Date(d.requestTime).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="p-4 text-xs font-mono bg-white dark:bg-gray-900 overflow-x-auto">
                        <p className="text-gray-400 font-sans font-bold mb-2">Payload</p>
                        <pre className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-3">
                          {JSON.stringify(d.payload, null, 2)}
                        </pre>
                        {d.responseBody && (
                          <>
                            <p className="text-gray-400 font-sans font-bold mb-2">Response</p>
                            <pre className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{d.responseBody}</pre>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl h-full min-h-[400px] flex items-center justify-center flex-col text-center p-8">
                <Activity className="w-12 h-12 text-gray-200 dark:text-gray-700 mb-4" />
                <h3 className="text-lg font-bold text-gray-400 mb-2">Select a webhook</h3>
                <p className="text-sm text-gray-400 max-w-xs">Click a webhook on the left to view its delivery log and test it.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
