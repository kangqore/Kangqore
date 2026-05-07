import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Briefcase, 
  ArrowUpRight, 
  Video,
  Clock 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Pie, PieChart } from 'recharts';
import axios from 'axios';

const InvestorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

  useEffect(() => {
     fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BACKEND_URL}/api/investor/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
    } catch (error) {
        console.error('Error fetching investor stats:', error);
        setStats({ error: error.message }); // Set error in stats to render
    } finally {
        setLoading(false);
    }
  };

  if (stats?.error) {
      return (
        <DashboardLayout role="investor" title="Overview" subtitle="Performance and Portfolio Insights">
            <div className="p-8 text-center text-red-500">
                Failed to load data: {stats.error}. <br/>
                Please ensure you are logged in as an Investor (e.g., investor@kangqore.com).
            </div>
        </DashboardLayout>
      );
  }


  const StatCard = ({ title, value, subtitle, icon: Icon, trend }) => (
    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-brand-blue/5 rounded-xl">
          <Icon className="w-6 h-6 text-brand-blue" />
        </div>
        {trend && (
           <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-700">
             <ArrowUpRight className="w-3 h-3" />
             {trend}
           </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value || '-'}</h3>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
    </div>
  );

  if (loading) return <DashboardLayout role="investor" title="Overview" subtitle="Loading..."><div className="p-8 text-center">Loading Data...</div></DashboardLayout>;
  
  // Default fallbacks if stats is null (shouldn't happen on success)
  const data = stats || {
      revenue: '$0',
      growthRate: '0%',
      activeClients: 0,
      pipelineValue: '$0',
      growthTrend: [],
      allocation: []
  };

  return (
    <DashboardLayout role="investor" title="Overview" subtitle="Performance and Portfolio Insights">
      
      {/* 1. Top Banner (Upcoming Meeting) */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 md:p-8 text-white mb-8 shadow-lg relative overflow-hidden">
         <div className="absolute inset-0 pointer-events-none overflow-hidden"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-white dark:bg-gray-900 dark:border-gray-800/10 backdrop-blur-sm rounded-full text-xs font-semibold border border-white/10 flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        Upcoming Meeting
                    </span>
                </div>
                <h2 className="text-2xl font-bold mb-2">
                    {data.upcomingMeeting ? data.upcomingMeeting.title : 'No upcoming meetings'}
                </h2>
                <div className="flex items-center gap-4 text-gray-200 text-sm">
                    {data.upcomingMeeting ? (
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(data.upcomingMeeting.startTime).toLocaleString()}</span>
                        </div>
                    ) : (
                        <span>Check calendar for updates</span>
                    )}
                </div>
            </div>
            {data.upcomingMeeting && (
                <div className="flex gap-3">
                   <button className="px-5 py-2.5 bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                      Join Call
                   </button>
                </div>
            )}
         </div>
      </div>

      {/* 2. KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <StatCard 
            title="Revenue (TTM)" 
            value={data.revenue} 
            subtitle="from last quarter" 
            icon={DollarSign} 
            trend="+12%"
         />
         <StatCard 
            title="Growth Rate" 
            value={data.growthRate} 
            subtitle="Year over Year" 
            icon={TrendingUp} 
            trend="+2.4%"
         />
         <StatCard 
            title="Active Clients" 
            value={data.activeClients} 
            subtitle="Across 12 regions" 
            icon={Users} 
            trend="+5"
         />
          <StatCard 
            title="Pipeline Value" 
            value={data.pipelineValue} 
            subtitle="Qualified leads only" 
            icon={Briefcase} 
            trend="+8%"
         />
      </div>

      {/* 3. Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
         {/* Left: Revenue Growth */}
         <div className="lg:col-span-2 bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex items-center justify-between mb-6">
                 <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Revenue Growth</h3>
                    <p className="text-sm text-gray-500">Annual Overview</p>
                 </div>
                 <select className="text-sm bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-none rounded-lg text-gray-600 dark:text-gray-400 focus:ring-0">
                     <option>This Year</option>
                     <option>Last Year</option>
                 </select>
             </div>
             <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.growthTrend || []}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                        <Tooltip 
                            contentStyle={{backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                        />
                        <Area type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                </ResponsiveContainer>
             </div>
         </div>

         {/* Right: Portfolio Allocation */}
         <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="font-bold text-gray-900 dark:text-white mb-6">Portfolio Allocation</h3>
             <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data.allocation || []}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.allocation?.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                        <p className="text-xs text-gray-400">Total</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">100%</p>
                    </div>
                </div>
             </div>
             <div className="space-y-3 mt-4">
                 {data.allocation?.map((item) => (
                     <div key={item.name} className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                             <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                         </div>
                         <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}%</span>
                     </div>
                 ))}
             </div>
         </div>
      </div>

    </DashboardLayout>
  );
};

export default InvestorDashboard;
