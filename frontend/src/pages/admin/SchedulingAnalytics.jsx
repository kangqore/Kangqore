import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Download, TrendingUp, Calendar, XCircle, Clock, RefreshCw } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import DashboardLayout from '../../components/DashboardLayout';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
const token = () => localStorage.getItem('token');

const RANGES = [
  { label: '7 days',  days: 7  },
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function SchedulingAnalytics() {
  const { toast } = useToast();
  const [data, setData]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [exporting, setExporting]   = useState(false);
  const [days, setDays]             = useState(30);
  const [eventTypeId, setEventTypeId] = useState('');
  const [eventTypes, setEventTypes] = useState([]);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/scheduling/event-types`, { headers: { Authorization: `Bearer ${token()}` } })
      .then(res => { if (res.data.success) setEventTypes(res.data.eventTypes); })
      .catch(() => {});
  }, []);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ days });
      if (eventTypeId) params.append('eventTypeId', eventTypeId);
      const res = await axios.get(`${BACKEND_URL}/api/scheduling/analytics?${params}`, {
        headers: { Authorization: `Bearer ${token()}` }
      });
      if (res.data.success) setData(res.data);
    } catch {
      toast({ title: 'Error', description: 'Failed to fetch analytics', variant: 'destructive' });
    } finally { setLoading(false); }
  }, [days, eventTypeId]);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/scheduling/export`, {}, {
        headers: { Authorization: `Bearer ${token()}` }
      });
      toast({ title: 'Export started', description: res.data.message });
    } catch {
      toast({ title: 'Error', description: 'Failed to start export', variant: 'destructive' });
    } finally { setExporting(false); }
  };

  const { metrics, timeSeries, heatmap, eventTypeBreakdown } = data || {};
  const maxHeatmap = heatmap ? Math.max(...heatmap.flat()) || 1 : 1;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-brand-blue" /> Scheduling Analytics
            </h1>
            <p className="text-gray-500 mt-1">Booking trends, no-show rates, and peak times.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={fetchAnalytics}
              className="p-2.5 text-gray-400 hover:text-brand-blue rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={handleExport} disabled={exporting}
              className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:border-brand-blue transition-colors flex items-center gap-2 font-bold text-sm text-gray-700 dark:text-white disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {exporting ? 'Exporting...' : 'Export CSV'}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Date range */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 gap-1">
            {RANGES.map(r => (
              <button key={r.days} onClick={() => setDays(r.days)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  days === r.days ? 'bg-white dark:bg-gray-700 shadow text-brand-blue' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Event type filter */}
          <select value={eventTypeId} onChange={e => setEventTypeId(e.target.value)}
            className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-blue"
          >
            <option value="">All Event Types</option>
            {eventTypes.map(et => <option key={et.id} value={et.id}>{et.name}</option>)}
          </select>
        </div>

        {loading || !data ? (
          <div className="flex justify-center py-24">
            <RefreshCw className="w-8 h-8 animate-spin text-brand-blue" />
          </div>
        ) : (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Calendar, label: 'Total Bookings',     value: metrics.totalBookings,              color: 'text-brand-blue',  bg: 'bg-blue-50 dark:bg-blue-900/20' },
                { icon: XCircle,  label: 'Cancellation Rate',  value: `${metrics.cancellationRate.toFixed(1)}%`, color: 'text-red-500',   bg: 'bg-red-50 dark:bg-red-900/20' },
                { icon: Clock,    label: 'No-Show Rate',       value: `${metrics.noShowRate.toFixed(1)}%`,       color: 'text-orange-500',bg: 'bg-orange-50 dark:bg-orange-900/20' },
              ].map(({ icon: Icon, label, value, color, bg }) => (
                <div key={label} className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                  <div className={`w-14 h-14 ${bg} ${color} rounded-2xl flex items-center justify-center shrink-0`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
                    <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trend + breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                  Booking Trend — last {days} days
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeSeries}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={v => v.slice(5)} stroke="#9ca3af" />
                      <YAxis allowDecimals={false} stroke="#9ca3af" />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0/0.1)' }} />
                      <Line type="monotone" dataKey="bookings" stroke="#2564ea" strokeWidth={3} dot={{ r: 3, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">By Event Type</h3>
                {eventTypeBreakdown.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No data available.</p>
                ) : (
                  <div className="space-y-4">
                    {eventTypeBreakdown.map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-bold text-gray-700 dark:text-gray-300 truncate">{item.name}</span>
                          <span className="text-gray-500 ml-2 shrink-0">{item.value}</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                          <div className="bg-brand-blue h-2 rounded-full transition-all"
                            style={{ width: `${metrics.totalBookings ? (item.value / metrics.totalBookings) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Heatmap */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Busiest Times</h3>
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  <div className="flex">
                    <div className="w-14" />
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} className="flex-1 text-center text-xs text-gray-400">{i}h</div>
                    ))}
                  </div>
                  {DAYS_OF_WEEK.map((day, dIdx) => (
                    <div key={day} className="flex items-center mt-1">
                      <div className="w-14 text-sm font-bold text-gray-400">{day}</div>
                      {(heatmap[dIdx] || Array(24).fill(0)).map((val, hIdx) => (
                        <div key={hIdx}
                          className="flex-1 aspect-square mx-0.5 rounded-md"
                          style={{ backgroundColor: `rgba(37,100,234,${val === 0 ? 0.04 : 0.15 + 0.85 * (val / maxHeatmap)})` }}
                          title={`${day} ${hIdx}:00 — ${val} bookings`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
