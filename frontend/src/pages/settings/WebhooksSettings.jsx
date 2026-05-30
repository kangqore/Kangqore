import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../../hooks/use-toast';
import { Webhook, Plus, Trash2, Loader2, Activity, ShieldAlert } from 'lucide-react';

export default function WebhooksSettings() {
  const { toast } = useToast();
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [showForm, setShowForm] = useState(false);
  const [eventTypeId, setEventTypeId] = useState('');
  const [url, setUrl] = useState('');
  const [secret, setSecret] = useState('');

  const [eventTypes, setEventTypes] = useState([]);
  const [selectedWebhook, setSelectedWebhook] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [loadingDeliveries, setLoadingDeliveries] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [whRes, etRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/scheduling/webhooks`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BACKEND_URL}/api/scheduling/event-types`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (whRes.data.success) setWebhooks(whRes.data.webhooks);
      if (etRes.data.success) setEventTypes(etRes.data.eventTypes);
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to load webhooks', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveries = async (webhookId) => {
    setLoadingDeliveries(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BACKEND_URL}/api/scheduling/webhooks/${webhookId}/deliveries`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setDeliveries(res.data.deliveries);
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to load deliveries', variant: 'destructive' });
    } finally {
      setLoadingDeliveries(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!url) {
      toast({ title: 'Error', description: 'URL is required', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${BACKEND_URL}/api/scheduling/webhooks`, {
        eventTypeId: eventTypeId || null,
        url,
        secret
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast({ title: 'Success', description: 'Webhook created successfully' });
        setShowForm(false);
        setUrl('');
        setSecret('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: err.response?.data?.error || 'Failed to create webhook', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this webhook?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`${BACKEND_URL}/api/scheduling/webhooks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast({ title: 'Success', description: 'Webhook deleted' });
        if (selectedWebhook?.id === id) setSelectedWebhook(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to delete webhook', variant: 'destructive' });
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-blue" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Outbound Webhooks</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Send real-time HTTP POST requests to your servers when bookings are created, cancelled, or rescheduled.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-xl font-bold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> New Webhook
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          {showForm && (
            <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm mb-6">
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Create Webhook</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 dark:text-gray-300">Payload URL</label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://api.example.com/webhook"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 dark:text-gray-300">Event Type</label>
                  <select
                    value={eventTypeId}
                    onChange={(e) => setEventTypeId(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 dark:text-white"
                  >
                    <option value="">All Event Types (Global)</option>
                    {eventTypes.map(et => (
                      <option key={et.id} value={et.id}>{et.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 flex items-center gap-2 dark:text-gray-300">
                    Secret <ShieldAlert className="w-4 h-4 text-gray-400" />
                  </label>
                  <input
                    type="password"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    placeholder="Optional HMAC secret"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">Used to generate X-Kangqore-Signature header.</p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-brand-blue text-white py-2 rounded-xl font-bold flex items-center justify-center disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create'}
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

          <h3 className="font-bold text-gray-900 dark:text-white mb-2">Configured Webhooks</h3>
          {webhooks.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400 text-sm">No webhooks configured.</div>
          ) : (
            webhooks.map(wh => (
              <div 
                key={wh.id}
                onClick={() => {
                  setSelectedWebhook(wh);
                  fetchDeliveries(wh.id);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                  selectedWebhook?.id === wh.id 
                    ? 'border-brand-blue bg-blue-50/50 dark:bg-brand-blue/10 dark:border-brand-blue/50' 
                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-2 mb-1">
                      <Webhook className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold text-gray-900 dark:text-white truncate">
                        {wh.url}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {wh.eventType ? wh.eventType.title : 'Global (All Events)'}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(wh.id);
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ml-2 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedWebhook ? (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm flex flex-col h-[600px]">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-brand-blue" />
                    Delivery Logs
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 truncate max-w-md">{selectedWebhook.url}</p>
                </div>
                <button
                  onClick={() => fetchDeliveries(selectedWebhook.id)}
                  className="text-sm font-semibold text-brand-blue hover:underline"
                >
                  Refresh
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loadingDeliveries ? (
                  <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
                ) : deliveries.length === 0 ? (
                  <div className="text-center p-8 text-gray-500 dark:text-gray-400">No deliveries recorded yet.</div>
                ) : (
                  deliveries.map(delivery => (
                    <div key={delivery.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                      <div className="bg-gray-50 dark:bg-gray-900/50 p-3 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            delivery.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {delivery.statusCode || delivery.status}
                          </span>
                          <span className="font-mono text-gray-600 dark:text-gray-300">
                            {delivery.payload?.event || 'Unknown Event'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-500 text-xs">
                          <span>{delivery.responseTime ? `${delivery.responseTime}ms` : ''}</span>
                          <span>{new Date(delivery.requestTime).toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="p-4 text-xs font-mono bg-white dark:bg-gray-800 overflow-x-auto">
                        <div className="mb-2 text-gray-500 font-sans font-semibold">Payload</div>
                        <pre className="text-gray-800 dark:text-gray-300 mb-4 whitespace-pre-wrap">
                          {JSON.stringify(delivery.payload, null, 2)}
                        </pre>
                        
                        {delivery.responseBody && (
                          <>
                            <div className="mb-2 text-gray-500 font-sans font-semibold">Response</div>
                            <pre className="text-gray-800 dark:text-gray-300 whitespace-pre-wrap">
                              {delivery.responseBody}
                            </pre>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl h-full min-h-[400px] flex items-center justify-center flex-col text-center p-8">
              <Activity className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Select a Webhook</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
                Click on a webhook from the left panel to view its delivery logs and debug payloads.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
