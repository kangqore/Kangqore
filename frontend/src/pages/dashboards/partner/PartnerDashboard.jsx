import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  FolderKanban, CheckCircle, Clock, Shield, RefreshCw, BarChart3, TrendingUp 
} from 'lucide-react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PartnerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use environment variable for backend URL
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Fix: Use correct endpoint /api/partner/stats
      const res = await axios.get(`${BACKEND_URL}/api/partner/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching partner stats:', error);
      setStats({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);


  const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = "emerald" }) => (
    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
            <TrendingUp size={12} className="mr-1" />
            {trend}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
          {subtitle && <span className="text-xs text-gray-400">{subtitle}</span>}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <DashboardLayout role="partner" title="Partner Workspace" subtitle="Loading...">
         <div className="flex h-96 items-center justify-center">
            <RefreshCw className="animate-spin text-emerald-600 w-8 h-8" />
         </div>
      </DashboardLayout>
    );
  }

  if (stats?.error) {
     return (
        <DashboardLayout role="partner" title="Partner Workspace" subtitle="Error">
           <div className="p-8 text-center text-red-500">
             Failed to load data: {stats.error}. <br/>
             Please ensure you are logged in as a Partner (e.g., partner@kangqore.com).
           </div>
        </DashboardLayout>
     );
  }

  // Placeholder data for chart if not provided by API
  const chartData = [
    { name: 'Mon', tasks: 4 },
    { name: 'Tue', tasks: 3 },
    { name: 'Wed', tasks: 7 },
    { name: 'Thu', tasks: 5 },
    { name: 'Fri', tasks: 6 },
    { name: 'Sat', tasks: 2 },
    { name: 'Sun', tasks: 4 },
  ];

  return (
    <DashboardLayout 
      role="partner" 
      title="Partner Workspace" 
      subtitle="What am I responsible for and where do I contribute?"
    >
      {/* 1. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Assigned Projects" 
          value={stats?.projects || 0} 
          icon={FolderKanban}
          color="emerald"
        />
        <StatCard 
          title="Active Tasks" 
          value={stats?.active_tasks || 0} 
          icon={CheckCircle}
          color="blue"
        />
        <StatCard 
          title="Pending Deadlines" 
          value={stats?.deadlines || 0} 
          icon={Clock}
          color="amber"
          subtitle="Due Soon"
        />

        {/* Earnings Card (Clickable) */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full hover:border-emerald-200 transition-colors cursor-pointer group" onClick={() => window.location.href = '/dashboard/partner/earnings'}>
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                  <TrendingUp size={24} />
               </div>
               <span className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">View</span>
            </div>
            <div>
               <h3 className="text-gray-500 text-sm font-medium mb-1">Available to Withdraw</h3>
               <div className="flex items-baseline gap-2">
                   <span className="text-2xl font-bold text-gray-900 dark:text-white">$4,250</span>
                   <span className="text-xs text-emerald-600 font-bold">+12%</span>
               </div>
            </div>
        </div>
      </div>

      {/* 2. Completion Chart */}
      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Task Completion Rate</h2>
            <div className="text-sm text-gray-500">Weekly Performance</div>
        </div>
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#10b981' }}
                    />
                    <Area type="monotone" dataKey="tasks" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorTasks)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>

    </DashboardLayout>
  );
};

export default PartnerDashboard;
