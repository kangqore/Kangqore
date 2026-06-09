import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  FolderKanban, AlertTriangle, TrendingUp, CheckCircle, 
  Clock, DollarSign, Target, ArrowRight 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const PMODashboard = () => {
  const [timelinePeriod, setTimelinePeriod] = useState('Quarter');

  // Fetch Portfolio Stats
  const { data: statsData, isLoading: loadingStats } = useQuery({
    queryKey: ['pmo-stats'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL || ''}/api/admin/pmo/stats`);
      return res.data;
    }
  });

  // Fetch Projects List
  const { data: projects, isLoading: loadingProjects } = useQuery({
    queryKey: ['pmo-projects'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL || ''}/api/admin/pmo/projects`);
      return res.data;
    }
  });

  const portfolioStats = statsData?.stats || [
    { label: 'Total Portfolio Value', value: '...', change: '', icon: DollarSign, color: 'text-gray-400', bg: 'bg-gray-50' },
    { label: 'Active Programs', value: '...', change: '', icon: FolderKanban, color: 'text-gray-400', bg: 'bg-gray-50' },
    { label: 'Avg Portfolio Health', value: '...', change: '', icon: TrendingUp, color: 'text-gray-400', bg: 'bg-gray-50' },
    { label: 'Critical Escalations', value: '...', change: '', icon: AlertTriangle, color: 'text-gray-400', bg: 'bg-gray-50' },
  ];

  const investmentMix = statsData?.investmentMix || [];
  
  // Icon Mapping Helper
  const getIcon = (iconName) => {
      switch(iconName) {
          case 'FolderKanban': return FolderKanban;
          case 'DollarSign': return DollarSign;
          case 'ActivityIcon': return TrendingUp;
          case 'AlertTriangle': return AlertTriangle;
          default: return FolderKanban;
      }
  };

  if (loadingStats || loadingProjects) {
      return (
          <DashboardLayout role="admin" title="Program Portfolio">
              <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
          </DashboardLayout>
      );
  }

  const healthTrend = statsData?.healthTrend || [];


  return (
    <DashboardLayout role="admin" title="Program Portfolio" subtitle="Enterprise portfolio oversight and governance.">
      <div className="space-y-6">
        
        {/* KPI Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {portfolioStats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</h3>
                <span className={`text-xs font-semibold ${stat.change.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} vs last month
                </span>
              </div>
              <div className={`p-3 rounded-full ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Investment Mix (Strategy) */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Investment Mix</h3>
            <div className="h-64 flex items-center justify-center">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={investmentMix}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {investmentMix.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                 </PieChart>
               </ResponsiveContainer>
            </div>
            <p className="text-center text-xs text-gray-500 mt-2">Allocated by Strategic Pillar</p>
          </div>

          {/* Portfolio Health Trend */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-bold text-gray-900 dark:text-white">Portfolio Health Trend</h3>
               <select className="text-sm border-gray-200 rounded-lg">
                 <option>Last 6 Months</option>
                 <option>Year to Date</option>
               </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={healthTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} domain={[60, 100]} />
                  <Tooltip 
                     contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="health" stroke="#10b981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} name="Delivery Health" />
                  <Line type="monotone" dataKey="budget" stroke="#6366f1" strokeWidth={3} dot={{r: 4}} name="Budget Adherence" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Major Programs Table */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Strategic Programs</h3>
            <button className="text-sm text-brand-blue font-medium hover:text-blue-700">View Full Register</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#050505]/50 text-xs text-gray-500 uppercase">
                  <th className="px-6 py-4 font-semibold">Program Name</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Progress</th>
                  <th className="px-6 py-4 font-semibold">Budget (M)</th>
                  <th className="px-6 py-4 font-semibold">Program Lead</th>
                  <th className="px-6 py-4 font-semibold">Next Gate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(projects || []).map((prog) => (
                  <tr key={prog.id} className="hover:bg-gray-50 dark:bg-[#050505] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 dark:text-white">{prog.name}</div>
                      <div className="text-xs text-gray-500">ID: {prog.id.substring(0,8).toUpperCase()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        prog.status === 'On Track' ? 'bg-emerald-50 text-emerald-700' :
                        prog.status === 'At Risk' ? 'bg-amber-50 text-amber-700' :
                        'bg-red-50 dark:bg-red-900/20 text-red-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                           prog.status === 'On Track' ? 'bg-emerald-500' :
                           prog.status === 'At Risk' ? 'bg-amber-500' : 'bg-red-500'
                        }`} />
                        {prog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{prog.progress}%</span>
                        <div className="w-24 h-1.5 bg-gray-100 dark:bg-[#0a0a0c] rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${prog.progress}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white font-medium">${(prog.spend/1000000).toFixed(1)}M <span className="text-gray-400">/ ${(prog.budget/1000000).toFixed(1)}M</span></div>
                      <div className="text-xs text-gray-500">{prog.budget > 0 ? Math.round((prog.spend/prog.budget)*100) : 0}% utilized</div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-400">
                            {prog.lead?.charAt(0) || '?'}
                         </div>
                         <span className="text-sm text-gray-700 dark:text-gray-300">{prog.lead || 'Unassigned'}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Target className="w-4 h-4 text-gray-400" />
                        {prog.nextGate}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default PMODashboard;
