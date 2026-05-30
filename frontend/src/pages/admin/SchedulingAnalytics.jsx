import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Download, TrendingUp, Calendar, XCircle, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

export default function SchedulingAnalytics() {
  const { toast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/scheduling/analytics?days=30`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) {
        setData(response.data);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch analytics', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/scheduling/export`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast({ title: 'Export Started', description: response.data.message });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to start export', variant: 'destructive' });
    } finally {
      setExporting(false);
    }
  };

  if (loading || !data) return <div className="p-8 text-center text-gray-500">Loading analytics...</div>;

  const { metrics, timeSeries, heatmap, eventTypeBreakdown } = data;

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const maxHeatmapValue = Math.max(...heatmap.flat()) || 1;

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-brand-blue" />
            Scheduling Analytics
          </h1>
          <p className="text-gray-500 mt-2">Insights and metrics for the last 30 days.</p>
        </div>
        <button 
          onClick={handleExport} 
          disabled={exporting}
          className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:border-brand-blue transition-colors flex items-center gap-2 font-bold text-gray-700 dark:text-white disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {exporting ? 'Exporting...' : 'Export to CSV'}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Total Bookings</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.totalBookings}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl flex items-center justify-center">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Cancellation Rate</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.cancellationRate.toFixed(1)}%</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 text-orange-500 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">No-Show Rate</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.noShowRate.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Time Series Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Booking Trend (30 Days)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{fontSize: 12}} tickFormatter={(val) => val.slice(5)} stroke="#9ca3af" />
                <YAxis allowDecimals={false} stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="bookings" stroke="#0052FF" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">By Event Type</h3>
          <div className="space-y-4">
            {eventTypeBreakdown.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No data available.</p>
            ) : (
              eventTypeBreakdown.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold text-gray-700 dark:text-gray-300">{item.name}</span>
                    <span className="text-gray-500">{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-brand-blue h-2 rounded-full" style={{ width: `${(item.value / metrics.totalBookings) * 100}%` }}></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Busiest Times</h3>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="flex">
              <div className="w-16"></div>
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="flex-1 text-center text-xs text-gray-400">{i}h</div>
              ))}
            </div>
            {daysOfWeek.map((day, dIdx) => (
              <div key={day} className="flex items-center mt-1">
                <div className="w-16 text-sm font-bold text-gray-500">{day}</div>
                {heatmap[dIdx].map((val, hIdx) => {
                  const opacity = val === 0 ? 0.05 : 0.2 + (0.8 * (val / maxHeatmapValue));
                  return (
                    <div 
                      key={hIdx} 
                      className="flex-1 aspect-square mx-0.5 rounded-md"
                      style={{ backgroundColor: `rgba(0, 82, 255, ${opacity})` }}
                      title={`${day} ${hIdx}:00 - ${val} bookings`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
