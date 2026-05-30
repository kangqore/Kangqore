import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Trash2, Plus, RefreshCw, Link as LinkIcon, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/use-toast';

export default function CalendarSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BACKEND_URL}/api/scheduling/calendar-integrations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setIntegrations(res.data.integrations);
      }
    } catch (error) {
      console.error('Failed to fetch integrations', error);
      toast({
        title: 'Error',
        description: 'Failed to load calendar integrations.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (id) => {
    if (!window.confirm('Are you sure you want to disconnect this calendar?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BACKEND_URL}/api/scheduling/calendar-integrations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({ title: 'Success', description: 'Calendar disconnected.' });
      fetchIntegrations();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to disconnect calendar.',
        variant: 'destructive',
      });
    }
  };

  const handleConnect = (provider) => {
    // In a real app, this redirects to the backend OAuth URL
    // e.g. window.location.href = `${BACKEND_URL}/api/scheduling/calendar-integrations/connect/${provider}?token=${localStorage.getItem('token')}`;
    toast({
      title: 'OAuth Simulation',
      description: `Redirecting to ${provider} OAuth consent screen... (Simulated)`,
    });
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><RefreshCw className="w-8 h-8 animate-spin text-brand-blue" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <div className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Calendar Integrations</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Connect your Google or Microsoft calendars to automatically block busy slots and sync new bookings.
        </p>
      </div>

      <div className="grid gap-6 mb-12">
        {integrations.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 text-center border border-dashed border-gray-300 dark:border-gray-700">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">No Calendars Connected</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">
              Connect a calendar to prevent double-booking and automatically add new meetings to your schedule.
            </p>
          </div>
        ) : (
          integrations.map(integration => (
            <div key={integration.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    {integration.provider === 'google' ? 'Google Calendar' : 'Outlook Calendar'}
                    <span className="text-[10px] uppercase tracking-wider font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      {integration.syncStatus}
                    </span>
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{integration.accountId}</p>
                </div>
              </div>
              <button
                onClick={() => handleDisconnect(integration.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                title="Disconnect"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>

      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Available Connections</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Google Calendar */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col items-center text-center hover:border-brand-blue transition-colors">
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" alt="Google Calendar" className="w-16 h-16 mb-4" />
          <h3 className="font-bold text-lg mb-2">Google Calendar</h3>
          <p className="text-sm text-gray-500 mb-6 flex-1">Two-way sync with your Google account. We'll check for conflicts and add new bookings directly.</p>
          <button
            onClick={() => handleConnect('google')}
            className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" /> Connect Google
          </button>
        </div>

        {/* Outlook Calendar */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col items-center text-center hover:border-brand-blue transition-colors">
          <img src="https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg" alt="Outlook Calendar" className="w-16 h-16 mb-4" />
          <h3 className="font-bold text-lg mb-2">Outlook / MS 365</h3>
          <p className="text-sm text-gray-500 mb-6 flex-1">Two-way sync with Microsoft Graph. Keeps your work schedule perfectly aligned.</p>
          <button
            onClick={() => handleConnect('outlook')}
            className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" /> Connect Outlook
          </button>
        </div>
      </div>

      {user && (
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-brand-blue shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Calendar Subscription (iCal Feed)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                You can subscribe to your Kangqore bookings from any calendar app (Apple Calendar, Google, etc.) using this read-only feed URL.
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
                  className="text-xs font-bold text-brand-blue uppercase hover:underline"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
