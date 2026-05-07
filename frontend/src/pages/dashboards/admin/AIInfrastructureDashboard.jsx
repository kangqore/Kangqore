import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  Server, Cpu, Database, Zap, Activity, 
  TrendingUp, Download, Sliders, RefreshCw, Layers
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area, ComposedChart
} from 'recharts';
import { getInfrastructureMetrics } from '../../../services/infrastructureService';

const AIInfrastructureDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInfrastructureMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching infra metrics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout role="admin" title="AI Infrastructure" subtitle="Loading metrics...">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      role="admin" 
      title="AI Infrastructure" 
      subtitle="Operational control tower for compute, storage, and cost efficiency."
    >
      <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* KPI Strip */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* GPU Capacity */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 dark:bg-purple-900/20 rounded-bl-full z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">GPU Capacity</p>
                    <div className="flex items-end gap-2 mt-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.gpu.capacity.used}% Used</h3>
                    <span className="text-xs font-medium text-green-600 mb-1">{metrics.gpu.capacity.available}% Free</span>
                    </div>
                </div>
                <div className="p-2 rounded-lg bg-gray-50 dark:bg-[#050505] text-gray-600 dark:text-gray-400">
                    <Cpu size={20} />
                </div>
                </div>
                <div className="w-full bg-gray-100 dark:bg-[#0a0a0c] rounded-full h-1.5 mb-2">
                <div 
                    className={`h-1.5 rounded-full ${metrics.gpu.capacity.used > 85 ? 'bg-red-500' : 'bg-brand-gradient'}`}
                    style={{ width: `${metrics.gpu.capacity.used}%` }}
                ></div>
                </div>
                 <div className="flex justify-between text-xs text-gray-500">
                     <span>{metrics.gpu.capacity.totalUnits} Units Online</span>
                     <span className="flex items-center gap-1 text-green-600"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Real-time</span>
                 </div>
            </div>
          </div>

          {/* API Credit Burn */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
             <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">API Burn Rate</p>
                    <div className="flex items-end gap-2 mt-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">₹{(metrics.api.burnRate / 100000).toFixed(1)}L / mo</h3>
                    </div>
                </div>
                <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                    <Zap size={20} />
                </div>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Passable Runway: <span className="font-bold text-brand-blue">{metrics.api.runwayMonths} Months</span></p>
                <p className="text-xs text-gray-400">Based on current trajectory</p>
            </div>
          </div>

          {/* Vector DB Storage */}
           <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Vector DB Storage</p>
                <div className="flex items-end gap-2 mt-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.vectorDb.storageUsed} TB</h3>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                <Database size={20} />
              </div>
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <span className="font-semibold text-red-500 flex items-center gap-1">
                 <TrendingUp size={12} /> +{metrics.vectorDb.growthRate}%
              </span> MoM Growth
            </p>
             <p className="text-xs text-gray-400 mt-1">High-dimensional indices</p>
          </div>

           {/* Inference Throughput */}
           <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Inference Throughput</p>
                <div className="flex items-end gap-2 mt-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{(metrics.inference.throughput / 1000).toFixed(1)}k <span className="text-sm text-gray-500 font-normal">req/min</span></h3>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600">
                <Activity size={20} />
              </div>
            </div>
             <p className="text-xs text-gray-500">
                 Peak Load: <span className="font-semibold text-gray-900 dark:text-white">{metrics.inference.peakvsAvg}x</span> Avg
            </p>
             <p className="text-xs text-gray-400 mt-1">Latency: 45ms (p95)</p>
          </div>

        </section>

        {/* Charts Row 1 */}
        <section className="grid lg:grid-cols-2 gap-6">
          {/* Real-time GPU Usage */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg text-white">
            <div className="flex justify-between items-center mb-6">
              <div>
                 <h3 className="font-bold text-white flex items-center gap-2"><Activity size={16} className="text-brand-blue" /> Cluster utilization (Live)</h3>
                 <p className="text-xs text-slate-400">Aggregate load across all A100/H100 nodes</p>
              </div>
              <div className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                 <span className="text-xs text-green-400 uppercase font-bold tracking-wider">Live</span>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.gpu.realTimeUsage}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="usage" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Compute Cost vs Revenue */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Unit Economics (Margin Gap)</h3>
             <p className="text-xs text-gray-500 mb-6">Tracking revenue growth vs infrastructure cost scaling</p>
            <div className="h-64 w-full relative">
               <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.api.costTrend}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="revenue" name="AI Revenue" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="cost" name="Infra Cost" stroke="#64748b" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
             <div className="flex justify-center gap-6 mt-2 text-xs font-medium">
                <span className="text-purple-600 flex items-center gap-1"><div className="w-2 h-2 bg-purple-600 rounded-full"></div> Revenue Scaling</span>
                <span className="text-slate-500 flex items-center gap-1"><div className="w-2 h-2 bg-slate-500 rounded-full"></div> Infra Cost Flatline</span>
             </div>
          </div>
        </section>

        {/* Charts Row 2 */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {/* Cost Per Inference */}
           <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl border border-gray-100 shadow-sm">
             <h3 className="font-bold text-gray-900 dark:text-white mb-6">Cost Efficiency per Request</h3>
             <div className="flex items-end gap-2 mb-4">
               <span className="text-4xl font-bold text-gray-900 dark:text-white">₹{metrics.inference.costPerInference.current}</span>
               <span className="text-sm text-gray-500 mb-2">/ req</span>
             </div>
             <div className="w-full bg-gray-100 dark:bg-[#0a0a0c] rounded-full h-2 mb-2">
               <div 
                 className={`h-2 rounded-full ${metrics.inference.costPerInference.current <= metrics.inference.costPerInference.target ? 'bg-green-500' : 'bg-yellow-500'}`}
                 style={{ width: `${(metrics.inference.costPerInference.current / (metrics.inference.costPerInference.target * 1.5)) * 100}%` }}
               ></div>
             </div>
             <div className="flex justify-between text-xs text-gray-500">
               <span>Actual</span>
               <span className="font-semibold text-gray-900 dark:text-white">Target: ₹{metrics.inference.costPerInference.target}</span>
             </div>
           </div>

           {/* Cost per Model Version */}
           <div className="lg:col-span-2 bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl border border-gray-100 shadow-sm">
             <h3 className="font-bold text-gray-900 dark:text-white mb-6">Cost Reduction by Model Version</h3>
             <div className="h-40 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={metrics.models.versions} layout="vertical">
                   <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                   <XAxis type="number" hide />
                   <YAxis dataKey="version" type="category" axisLine={false} tickLine={false} width={50} tick={{fontSize: 12, fill: '#374151', fontWeight: 600}} />
                   <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                   <Bar dataKey="cost" name="Cost per Token (Norm)" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} label={{ position: 'right', formatter: (val) => `₹${val}`, fill: '#6b7280', fontSize: 12 }} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
           </div>
        </section>

         {/* Advanced Metrics */}
         <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-center">
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Proprietary Data</p>
                <h4 className="text-2xl font-bold text-indigo-900">{metrics.advanced.proprietaryDataRatio}%</h4>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
                <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1">Automation Rate</p>
                <h4 className="text-2xl font-bold text-emerald-900">{metrics.advanced.automationRate}%</h4>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 text-center">
                <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">AI Rev Attribution</p>
                <h4 className="text-2xl font-bold text-blue-900">{metrics.advanced.revenueAttribution}%</h4>
            </div>
             <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 p-4 rounded-xl border border-gray-100 text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Model Iteration</p>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.models.iterationSpeed} days</h4>
            </div>
         </section>

        {/* Actions Bar */}
        <section className="bg-white dark:bg-black dark:border-gray-800 p-4 rounded-xl border border-gray-100 shadow-sm sticky bottom-0 z-10 flex flex-wrap gap-4 items-center justify-between">
           <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-0">
             <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium whitespace-nowrap shadow-lg shadow-slate-200">
               <Layers size={16} /> Scale GPU Cluster
             </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium whitespace-nowrap">
               <Sliders size={16} /> Run Cost Optimization
             </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium whitespace-nowrap">
               <RefreshCw size={16} /> Simulate Spike
             </button>
           </div>
           
           <button className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-900 dark:text-white transition-colors text-sm font-medium whitespace-nowrap ml-auto">
             <Download size={16} /> Download Infra Audit
           </button>
        </section>

      </div>
    </DashboardLayout>
  );
};

export default AIInfrastructureDashboard;
