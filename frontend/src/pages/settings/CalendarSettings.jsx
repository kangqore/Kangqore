import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Calendar, Trash2, Plus, RefreshCw, Link as LinkIcon, Info,
  Video, Users, Check, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/use-toast';
import DashboardLayout from '../../components/DashboardLayout';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

function StatusBadge({ status }) {
  const colour = status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600';
  return (
    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${colour}`}>
      {status}
    </span>
  );
}

function IntegrationCard({ logo, name, description, connected, accountId, status, onConnect, onDisconnect }) {
  return (
    <div className={`border rounded-2xl p-6 flex flex-col transition-all ${
      connected
        ? 'border-green-200 dark:border-green-900/40 bg-green-50/50 dark:bg-green-900/10'
        : 'border-gray-200 dark:border-gray-800 hover:border-brand-blue'
    }`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          {typeof logo === 'string'
            ? <img src={logo} alt={name} className="w-10 h-10 object-contain" />
            : <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">{logo}</div>
          }
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {name}
              {connected && <StatusBadge status={status || 'ACTIVE'} />}
            </h3>
            {connected && accountId && (
              <p className="text-xs text-gray-500 mt-0.5">{accountId}</p>
            )}
          </div>
        </div>
        {connected && (
          <button
            onClick={onDisconnect}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors shrink-0"
            title="Disconnect"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-1">{description}</p>
      {connected ? (
        <div className="flex items-center gap-2 text-sm font-bold text-green-600 dark:text-green-400">
          <Check className="w-4 h-4" /> Connected
        </div>
      ) : (
        <button
          onClick={onConnect}
          className="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity text-sm"
        >
          <Plus className="w-4 h-4" /> Connect
        </button>
      )}
    </div>
  );
}

export default function CalendarSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [calIntegrations, setCalIntegrations] = useState([]);
  const [zoomStatus, setZoomStatus] = useState(null);
  const [crmStatus, setCrmStatus] = useState({});
  const [loading, setLoading] = useState(true);

  const token = () => localStorage.getItem('token');

  useEffect(() => {
    fetchAll();
    // Handle OAuth return params
    const params = new URLSearchParams(window.location.search);
    const connected = params.get('connected');
    const error = params.get('error');
    if (connected) {
      toast({ title: 'Connected', description: `${connected} connected successfully.` });
      window.history.replaceState({}, '', window.location.pathname);
    }
    if (error) {
      toast({ title: 'Connection failed', description: decodeURIComponent(error), variant: 'destructive' });
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [calRes, zoomRes, crmRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/scheduling/calendar-integrations`, { headers: { Authorization: `Bearer ${token()}` } }),
        axios.get(`${BACKEND_URL}/api/scheduling/zoom/status`, { headers: { Authorization: `Bearer ${token()}` } }),
        axios.get(`${BACKEND_URL}/api/scheduling/crm/status`, { headers: { Authorization: `Bearer ${token()}` } }),
      ]);
      setCalIntegrations(calRes.data.integrations || []);
      setZoomStatus(zoomRes.data);
      setCrmStatus(crmRes.data.integrations || {});
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to load integrations.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const connect = (url) => { window.location.href = url; };

  const disconnectCal = async (id) => {
    if (!window.confirm('Disconnect this calendar?')) return;
    await axios.delete(`${BACKEND_URL}/api/scheduling/calendar-integrations/${id}`, { headers: { Authorization: `Bearer ${token()}` } });
    toast({ title: 'Disconnected' });
    fetchAll();
  };

  const disconnectZoom = async () => {
    if (!window.confirm('Disconnect Zoom?')) return;
    await axios.delete(`${BACKEND_URL}/api/scheduling/zoom/disconnect`, { headers: { Authorization: `Bearer ${token()}` } });
    toast({ title: 'Zoom disconnected' });
    fetchAll();
  };

  const disconnectCrm = async (provider) => {
    if (!window.confirm(`Disconnect ${provider}?`)) return;
    await axios.delete(`${BACKEND_URL}/api/scheduling/crm/${provider}/disconnect`, { headers: { Authorization: `Bearer ${token()}` } });
    toast({ title: 'Disconnected' });
    fetchAll();
  };

  const googleCal = calIntegrations.find(i => i.provider === 'google');
  const outlookCal = calIntegrations.find(i => i.provider === 'outlook');

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-brand-blue" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-12">

        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Integrations</h1>
          <p className="text-gray-500">Connect calendars, video platforms, and CRMs to your scheduling system.</p>
        </div>

        {/* ── Calendar Sync ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-5 h-5 text-brand-blue" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Calendar Sync</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <IntegrationCard
              logo="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg"
              name="Google Calendar"
              description="Two-way sync. Blocks busy slots from your Google calendar and exports new bookings."
              connected={!!googleCal}
              accountId={googleCal?.accountId}
              status={googleCal?.syncStatus}
              onConnect={() => connect(`${BACKEND_URL}/api/scheduling/calendar-integrations/connect/google`)}
              onDisconnect={() => disconnectCal(googleCal.id)}
            />
            <IntegrationCard
              logo="https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg"
              name="Outlook / MS 365"
              description="Two-way sync via Microsoft Graph. Keeps your work calendar perfectly aligned."
              connected={!!outlookCal}
              accountId={outlookCal?.accountId}
              status={outlookCal?.syncStatus}
              onConnect={() => connect(`${BACKEND_URL}/api/scheduling/calendar-integrations/connect/outlook`)}
              onDisconnect={() => disconnectCal(outlookCal.id)}
            />
          </div>
        </section>

        {/* ── Video Conferencing ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Video className="w-5 h-5 text-brand-blue" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Video Conferencing</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <IntegrationCard
              logo={<Video className="w-5 h-5 text-blue-600" />}
              name="Zoom"
              description="Auto-create Zoom meetings when a booking is made. Select Zoom as the video provider on any event type."
              connected={zoomStatus?.connected}
              accountId={zoomStatus?.integration?.accountId}
              status={zoomStatus?.integration?.syncStatus}
              onConnect={() => connect(`${BACKEND_URL}/api/scheduling/zoom/connect`)}
              onDisconnect={disconnectZoom}
            />
            <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Video className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Google Meet</h3>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4 flex-1">
                Auto-creates Google Meet links via Google Calendar. Connect Google Calendar above and select "Google Meet" as the provider on your event type.
              </p>
              <div className={`flex items-center gap-2 text-sm font-bold ${googleCal ? 'text-green-600' : 'text-gray-400'}`}>
                {googleCal ? <><Check className="w-4 h-4" /> Available via Google Calendar</> : <><AlertCircle className="w-4 h-4" /> Connect Google Calendar first</>}
              </div>
            </div>
          </div>
        </section>

        {/* ── CRM Integrations ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-5 h-5 text-brand-blue" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">CRM Integrations</h2>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            On every booking, the invitee is automatically created or updated as a contact, and a meeting activity is logged.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <IntegrationCard
              logo={<span className="text-orange-500 font-black text-lg">HS</span>}
              name="HubSpot"
              description="Creates/updates contacts and logs each booking as a note activity in your HubSpot CRM."
              connected={crmStatus.hubspot?.syncStatus === 'ACTIVE'}
              accountId={crmStatus.hubspot?.accountId ? `Portal ${crmStatus.hubspot.accountId}` : null}
              status={crmStatus.hubspot?.syncStatus}
              onConnect={() => connect(`${BACKEND_URL}/api/scheduling/crm/hubspot/connect`)}
              onDisconnect={() => disconnectCrm('hubspot')}
            />
            <IntegrationCard
              logo={<span className="text-blue-600 font-black text-lg">SF</span>}
              name="Salesforce"
              description="Creates/updates Contact records and logs an Event activity on every booking."
              connected={crmStatus.salesforce?.syncStatus === 'ACTIVE'}
              accountId={crmStatus.salesforce?.accountId ? `Org: ${crmStatus.salesforce.accountId}` : null}
              status={crmStatus.salesforce?.syncStatus}
              onConnect={() => connect(`${BACKEND_URL}/api/scheduling/crm/salesforce/connect`)}
              onDisconnect={() => disconnectCrm('salesforce')}
            />
          </div>
        </section>

        {/* ── iCal Feed ── */}
        {user && (
          <section>
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <Info className="w-6 h-6 text-brand-blue shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">iCal Subscription Feed</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Subscribe to your Kangqore bookings from Apple Calendar, Notion, or any app that supports iCal feeds.
                  </p>
                  <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                    <LinkIcon className="w-4 h-4 text-gray-400 shrink-0" />
                    <code className="text-xs text-gray-600 dark:text-gray-400 flex-1 truncate">
                      {BACKEND_URL}/api/scheduling/feed/{user.id}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${BACKEND_URL}/api/scheduling/feed/${user.id}`);
                        toast({ title: 'Copied to clipboard' });
                      }}
                      className="text-xs font-bold text-brand-blue uppercase hover:underline shrink-0"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

      </div>
    </DashboardLayout>
  );
}
