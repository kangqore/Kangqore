import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  Users, TrendingUp, DollarSign, Activity, 
  Briefcase, BarChart3, AlertTriangle, ArrowUpRight, 
  ArrowDownRight, Download, RefreshCw 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, Legend
} from 'recharts';
import { getCapacityMetrics } from '../../../services/capacityService';

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];

const CapacityDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCapacityMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching capacity metrics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout role="admin" title="Capacity Management" subtitle="Loading metrics...">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      role="admin" 
      title="Capacity Management" 
      subtitle="Strategic oversight of human capital inventory and utilization."
    >
      <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* KPI Strip */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Billable Utilization */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Billable Utilization</p>
                <div className="flex items-end gap-2 mt-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.utilization.current}%</h3>
                  <span className="text-xs font-medium text-gray-400 mb-1">Target: {metrics.utilization.target}%</span>
                </div>
              </div>
              <div className={`p-2 rounded-lg ${metrics.utilization.status === 'Healthy' ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-red-50 dark:bg-red-900/20 text-red-600'}`}>
                {metrics.utilization.status === 'Healthy' ? <TrendingUp size={20} /> : <AlertTriangle size={20} />}
              </div>
            </div>
            <div className="w-full bg-gray-100 dark:bg-[#0a0a0c] rounded-full h-1.5 mb-2">
              <div 
                className={`h-1.5 rounded-full ${metrics.utilization.current >= metrics.utilization.target ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${metrics.utilization.current}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">
              <span className="font-semibold text-red-600 flex items-center gap-1 inline-flex">
                 <ArrowDownRight size={12} /> 2%
              </span> vs last month
            </p>
          </div>

          {/* Bench Strength */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Bench Strength</p>
                <div className="flex items-end gap-2 mt-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.bench.count} Engineers</h3>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                <Users size={20} />
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-gray-500">Cost/Month</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">₹{(metrics.bench.costPerMonth / 100000).toFixed(1)}L</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">% Workforce</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{metrics.bench.percentOfWorkforce}%</p>
              </div>
            </div>
          </div>

          {/* Revenue per Employee */}
           <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Rev / Employee</p>
                <div className="flex items-end gap-2 mt-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">₹{(metrics.financials.revenuePerEmployee.value / 100000).toFixed(0)}L</h3>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600">
                <DollarSign size={20} />
              </div>
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <span className="font-semibold text-green-600 flex items-center gap-1">
                 <ArrowUpRight size={12} /> {metrics.financials.revenuePerEmployee.growth}%
              </span> YoY Growth
            </p>
             <p className="text-xs text-gray-400 mt-1">Annualized based on Q3</p>
          </div>

           {/* Blended Bill Rate */}
           <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Blended Bill Rate</p>
                <div className="flex items-end gap-2 mt-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">₹{metrics.financials.blendedBillRate.value.toLocaleString()}/hr</h3>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                <Activity size={20} />
              </div>
            </div>
             <p className="text-xs text-gray-500 flex items-center gap-1">
              <span className="font-semibold text-green-600 flex items-center gap-1">
                 <ArrowUpRight size={12} /> 4.5%
              </span> vs Last Qtr
            </p>
             <p className="text-xs text-gray-400 mt-1">Optimized for margins</p>
          </div>

        </section>

        {/* Charts Row 1 */}
        <section className="grid lg:grid-cols-3 gap-6">
          {/* Utilization Trend */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white">Historical Utilization Trend</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> Actual</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 border border-gray-400 border-dashed rounded-full"></div> Target</span>
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.utilization.history}>
                  <defs>
                    <linearGradient id="colorUtil" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} domain={[60, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorUtil)" />
                  <Line type="monotone" dataKey="target" stroke="#9ca3af" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Allocation Distribution */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6">Resource Allocation</h3>
            <div className="h-48 w-full relative">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.allocation.distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {metrics.allocation.distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                   <span className="text-2xl font-bold text-gray-900 dark:text-white">100%</span>
                   <p className="text-xs text-gray-500">Total</p>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {metrics.allocation.distribution.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Charts Row 2 */}
        <section className="grid lg:grid-cols-2 gap-6">
           {/* Revenue per Role */}
           <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl border border-gray-100 shadow-sm">
             <h3 className="font-bold text-gray-900 dark:text-white mb-6">Revenue Efficiency per Role</h3>
             <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={metrics.roles} layout="vertical" margin={{ left: 40 }}>
                   <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                   <XAxis type="number" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                   <YAxis dataKey="role" type="category" axisLine={false} tickLine={false} width={100} tick={{fontSize: 12, fill: '#374151', fontWeight: 500}} />
                   <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                   <Bar dataKey="revenue" name="Actual" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                   <Bar dataKey="target" name="Target" fill="#e5e7eb" radius={[0, 4, 4, 0]} barSize={20} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
           </div>

           {/* Hiring Forecast */}
           <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl border border-gray-100 shadow-sm">
             <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-gray-900 dark:text-white">Capacity Forecast vs Demand</h3>
               <span className="px-2 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 text-xs font-bold rounded-md uppercase">Hiring Gap Detected</span>
             </div>
             <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={metrics.hiringForecast}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                   <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                   <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                   <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                   <Legend />
                   <Line type="monotone" dataKey="required" name="Demand (Headcount)" stroke="#ef4444" strokeWidth={2} />
                   <Line type="monotone" dataKey="available" name="Available Capacity" stroke="#10b981" strokeDasharray="5 5" strokeWidth={2} />
                 </LineChart>
               </ResponsiveContainer>
             </div>
           </div>
        </section>

        {/* Actions Bar */}
        <section className="bg-white dark:bg-black dark:border-gray-800 p-4 rounded-xl border border-gray-100 shadow-sm sticky bottom-0 z-10 flex flex-wrap gap-4 items-center justify-between">
           <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-0">
             <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium whitespace-nowrap">
               <Users size={16} /> View Bench Details
             </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap shadow-sm">
               <Briefcase size={16} /> Allocate Resource
             </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium whitespace-nowrap">
               <RefreshCw size={16} /> Simulate Revenue
             </button>
           </div>
           
           <button className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-900 dark:text-white transition-colors text-sm font-medium whitespace-nowrap ml-auto">
             <Download size={16} /> Export Capacity Report
           </button>
        </section>

      </div>
    </DashboardLayout>
  );
};

export default CapacityDashboard;
