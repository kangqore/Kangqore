import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  Building2, Users, DollarSign, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Briefcase 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, Line
} from 'recharts';

const ServicePerformanceDashboard = () => {
  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050'}/api/admin/services`);
      return res.data;
    },
    refetchInterval: 60000 // Refresh every minute
  });

  // Calculate Aggregates
  const totalRevenue = services?.reduce((sum, s) => sum + s.revenue, 0) || 0;
  const avgMargin = services?.length ? services.reduce((sum, s) => sum + s.margin, 0) / services.length : 0;
  
  const kpis = [
    { title: 'Global Revenue (YTD)', value: `$${(totalRevenue / 1000000).toFixed(1)}M`, change: '+18.2%', trend: 'up', icon: DollarSign, color: 'blue' },
    { title: 'Blended Gross Margin', value: `${avgMargin.toFixed(1)}%`, change: '+1.5%', trend: 'up', icon: TrendingUp, color: 'emerald' },
    { title: 'Global Utilization', value: '87.5%', change: '-2.1%', trend: 'down', icon: Users, color: 'amber' }, 
    { title: 'Pipeline Value', value: '$85.2M', change: '+12.4%', trend: 'up', icon: Briefcase, color: 'purple' },
  ];

  const revenueByPractice = services || [];

  const monthlyRevenue = [
    { month: 'Jan', actual: 18, target: 16 },
    { month: 'Feb', actual: 21, target: 18 },
    { month: 'Mar', actual: 19, target: 19 },
    { month: 'Apr', actual: 24, target: 20 },
    { month: 'May', actual: 28, target: 22 },
    { month: 'Jun', actual: 32, target: 24 }, 
  ];

  if (isLoading) {
    return (
      <DashboardLayout role="admin" title="Service Lines Performance">
        <div className="flex items-center justify-center h-96">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin" title="Service Lines Performance" subtitle="P&L and Practice Operations Overview.">
      <div className="space-y-6">
        
        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, index) => (
             <div key={index} className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                   <div>
                      <p className="text-sm font-medium text-gray-500">{kpi.title}</p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{kpi.value}</h3>
                   </div>
                   <div className={`p-3 rounded-xl bg-${kpi.color}-50 text-${kpi.color}-600`}>
                      <kpi.icon className="w-5 h-5" />
                   </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                   {kpi.trend === 'up' ? (
                     <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                   ) : (
                     <ArrowDownRight className="w-4 h-4 text-red-500" />
                   )}
                   <span className={`text-sm font-semibold ${kpi.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                     {kpi.change}
                   </span>
                   <span className="text-xs text-gray-400">vs last quarter</span>
                </div>
             </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue vs Margin by Practice */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Service Line Contributions</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByPractice} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" orientation="left" stroke="#6b7280" tick={{fontSize: 12}} />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" tick={{fontSize: 12}} unit="%" />
                  <Tooltip 
                    cursor={{fill: '#f9fafb'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                  <Bar yAxisId="right" dataKey="margin" name="Gross Margin (%)" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Growth Trend */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Revenue Growth (Actual vs Target)</h3>
             <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={monthlyRevenue}>
                      <defs>
                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="month" tick={{fontSize: 12}} />
                      <YAxis tick={{fontSize: 12}} />
                      <Tooltip />
                      <Area type="monotone" dataKey="actual" stroke="#3b82f6" fillOpacity={1} fill="url(#colorActual)" strokeWidth={3} name="Actual Revenue" />
                      <Line type="monotone" dataKey="target" stroke="#9ca3af" strokeDasharray="5 5" strokeWidth={2} name="Target" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* Practice Performance Table */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white">Practice Health Card</h3>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-gray-50 dark:bg-[#050505]/50 text-xs text-gray-500 uppercase">
                      <th className="px-6 py-4 font-semibold">Service Line</th>
                      <th className="px-6 py-4 font-semibold">Headcount</th>
                      <th className="px-6 py-4 font-semibold">Utilization</th>
                      <th className="px-6 py-4 font-semibold">Avg. Bill Rate</th>
                      <th className="px-6 py-4 font-semibold">Quality Score</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                   {revenueByPractice.map((practice, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:bg-[#050505] transition-colors">
                         <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{practice.name}</td>
                         <td className="px-6 py-4 text-gray-600 dark:text-gray-400 space-x-2">
                            <span>{practice.headcount}</span>
                            <span className="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-1.5 rounded">+4</span>
                         </td>
                         <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-md text-sm font-semibold ${
                               practice.utilization > 90 ? 'bg-red-50 dark:bg-red-900/20 text-red-700' : 
                               practice.utilization < 75 ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700' : 'bg-green-50 dark:bg-green-900/20 text-green-700'
                            }`}>
                               {practice.utilization}%
                            </span>
                         </td>
                         <td className="px-6 py-4 text-gray-600 dark:text-gray-400">${120 + i * 15}/hr</td>
                         <td className="px-6 py-4">
                            <div className="flex text-yellow-400">
                               {'★'.repeat(4)}{i % 2 === 0 ? '★' : '☆'}
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 dark:bg-green-900/20 text-green-700">
                               Healthy
                            </span>
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

export default ServicePerformanceDashboard;
