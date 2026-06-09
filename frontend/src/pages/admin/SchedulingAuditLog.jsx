import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Shield, Clock, User, FileText, Search, ChevronLeft, ChevronRight, RefreshCw, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '../../hooks/use-toast';
import DashboardLayout from '../../components/DashboardLayout';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
const token = () => localStorage.getItem('token');

const ACTION_COLORS = {
  'scheduling.booking.created':     'bg-green-100 text-green-700',
  'scheduling.booking.cancelled':   'bg-red-100 text-red-600',
  'scheduling.booking.rescheduled': 'bg-yellow-100 text-yellow-700',
  'scheduling.booking.no_show':     'bg-orange-100 text-orange-700',
};
const actionColor = (action) => ACTION_COLORS[action] || 'bg-blue-100 text-blue-700';

const ACTION_OPTIONS = [
  { value: '', label: 'All Actions' },
  { value: 'scheduling.booking.created',     label: 'Booking Created' },
  { value: 'scheduling.booking.cancelled',   label: 'Booking Cancelled' },
  { value: 'scheduling.booking.rescheduled', label: 'Booking Rescheduled' },
  { value: 'scheduling.booking.no_show',     label: 'No Show' },
  { value: 'scheduling.event_type',          label: 'Event Type Changes' },
  { value: 'scheduling.availability',        label: 'Availability Changes' },
];

const PAGE_SIZE = 20;

export default function SchedulingAuditLog() {
  const { toast } = useToast();
  const [logs, setLogs]         = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState('');
  const [action, setAction]     = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo]     = useState('');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE });
      if (action)   params.append('action', action);
      if (dateFrom) params.append('from', dateFrom);
      if (dateTo)   params.append('to', dateTo);
      if (search)   params.append('search', search);

      const res = await axios.get(`${BACKEND_URL}/api/scheduling/audit?${params}`, {
        headers: { Authorization: `Bearer ${token()}` }
      });
      if (res.data.success) {
        setLogs(res.data.logs);
        setTotal(res.data.total || res.data.logs.length);
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to fetch audit logs', variant: 'destructive' });
    } finally { setLoading(false); }
  }, [page, action, dateFrom, dateTo, search]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasFilters = search || action || dateFrom || dateTo;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Shield className="w-8 h-8 text-brand-blue" /> Audit Log
            </h1>
            <p className="text-gray-500 mt-1">Chronological record of all scheduling actions.</p>
          </div>
          <button onClick={fetchLogs}
            className="p-2.5 text-gray-400 hover:text-brand-blue rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px] space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Resource ID or user name..."
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>

          <div className="min-w-[200px] space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Action</label>
            <select value={action} onChange={e => { setAction(e.target.value); setPage(1); }}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-blue"
            >
              {ACTION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">From</label>
            <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }}
              className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">To</label>
            <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }}
              className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>

          {hasFilters && (
            <button onClick={() => { setSearch(''); setAction(''); setDateFrom(''); setDateTo(''); setPage(1); }}
              className="px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1.5"
            >
              <Filter className="w-4 h-4" /> Clear
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex justify-center py-20">
              <RefreshCw className="w-7 h-7 animate-spin text-brand-blue" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-20">
              <Shield className="w-12 h-12 mx-auto mb-4 text-gray-200 dark:text-gray-700" />
              <p className="text-gray-400">No audit entries found{hasFilters ? ' matching these filters' : ''}.</p>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    {['Timestamp', 'Action', 'User', 'Resource', 'Details'].map(h => (
                      <th key={h} className="px-5 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  {logs.map(log => (
                    <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-300 shrink-0" />
                          {format(new Date(log.createdAt), 'MMM d, yyyy HH:mm:ss')}
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${actionColor(log.action)}`}>
                          {log.action.replace('scheduling.', '').replace('.', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-300 shrink-0" />
                          {log.user ? log.user.name : <span className="text-gray-400">System</span>}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs font-mono text-gray-400">
                        {log.resource || '—'}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500 max-w-xs">
                        {log.newValue ? (
                          <div className="flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                            <span className="truncate">{log.newValue.id || log.newValue.title || 'See record'}</span>
                          </div>
                        ) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-gray-800">
                <p className="text-sm text-gray-500">{total} total entries</p>
                <div className="flex items-center gap-2">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300 min-w-[80px] text-center">
                    Page {page} of {totalPages}
                  </span>
                  <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
