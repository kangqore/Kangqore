import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  Users, Target, Trophy, TrendingUp, Filter, Download
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const PracticeDashboard = () => {
  const { practiceId } = useParams();
  const practiceName = practiceId 
    ? practiceId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') 
    : 'AI & Autonomous Systems';

  // Mock data tailored for a generic practice
  const benchData = [
    { role: 'Data Scientist', total: 12, bench: 2 },
    { role: 'ML Engineer', total: 18, bench: 1 },
    { role: 'Solution Architect', total: 8, bench: 0 },
    { role: 'Frontend Dev', total: 15, bench: 4 }, // High bench
  ];

  const pipelineGrowth = [
    { month: 'W1', value: 2.5 },
    { month: 'W2', value: 2.8 },
    { month: 'W3', value: 3.2 },
    { month: 'W4', value: 3.0 },
    { month: 'W5', value: 3.5 },
  ];

  return (
    <DashboardLayout role="admin" title={practiceName} subtitle="Service Line Deep Dive">
      <div className="space-y-6">
        
        {/* Practice Header Metrics */}
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Trophy className="w-64 h-64 text-white" />
           </div>
           
           <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
              <div>
                 <h2 className="text-3xl font-bold mb-2">{practiceName}</h2>
                 <p className="text-blue-200">Practice Lead: Dr. Robert Ford</p>
                 <div className="mt-6 flex gap-4">
                    <button className="bg-white dark:bg-black text-blue-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors">
                       View Resources
                    </button>
                    <button className="bg-blue-800/50 border border-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-800 transition-colors">
                       Pipeline Report
                    </button>
                 </div>
              </div>

              <div className="flex gap-8 text-center">
                 <div>
                    <p className="text-blue-300 text-sm font-medium uppercase tracking-wider">Revenue QTD</p>
                    <p className="text-4xl font-bold mt-1">$12.4M</p>
                    <p className="text-emerald-400 text-sm font-semibold mt-1">▲ 14% vs target</p>
                 </div>
                 <div>
                    <p className="text-blue-300 text-sm font-medium uppercase tracking-wider">Win Rate</p>
                    <p className="text-4xl font-bold mt-1">68%</p>
                    <p className="text-emerald-400 text-sm font-semibold mt-1">▲ 5% vs avg</p>
                 </div>
                 <div>
                    <p className="text-blue-300 text-sm font-medium uppercase tracking-wider">NPS</p>
                    <p className="text-4xl font-bold mt-1">72</p>
                    <p className="text-emerald-400 text-sm font-semibold mt-1">World Class</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Bench / Resource Status */}
           <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-gray-900 dark:text-white">Resource Bench</h3>
                 <span className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 px-2.5 py-1 rounded-full text-xs font-bold">12% Bench</span>
              </div>
              <div className="space-y-4">
                 {benchData.map((role, i) => (
                    <div key={i}>
                       <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700 dark:text-gray-300">{role.role}</span>
                          <span className="text-gray-500">{role.bench} / {role.total} available</span>
                       </div>
                       <div className="w-full bg-gray-100 dark:bg-[#0a0a0c] h-2 rounded-full overflow-hidden">
                          <div 
                             className={`h-full rounded-full ${
                                (role.bench / role.total) > 0.2 ? 'bg-red-500' : 'bg-emerald-500'
                             }`} 
                             style={{ width: `${(role.bench / role.total) * 100}%` }}
                          />
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Pipeline Trend */}
           <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-gray-900 dark:text-white">Pipeline Velocity ($M)</h3>
              </div>
              <div className="h-48">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={pipelineGrowth}>
                       <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <XAxis dataKey="month" hide />
                       <YAxis hide />
                       <Tooltip />
                       <Area type="monotone" dataKey="value" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-between items-center text-sm">
                 <span className="text-gray-500">Current Pipeline</span>
                 <span className="text-xl font-bold text-gray-900 dark:text-white">$3.5M <span className="text-emerald-500 text-sm font-normal">(+12%)</span></span>
              </div>
           </div>
        </div>

        {/* Top Projects Table */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-white">Flagship Engagements</h3>
              <div className="flex gap-2">
                 <button className="p-2 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-lg text-gray-500">
                    <Filter className="w-4 h-4" />
                 </button>
                 <button className="p-2 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-lg text-gray-500">
                    <Download className="w-4 h-4" />
                 </button>
              </div>
           </div>
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-b border-gray-100 text-xs uppercase text-gray-500">
                    <th className="px-6 py-4 font-semibold">Client</th>
                    <th className="px-6 py-4 font-semibold">Project</th>
                    <th className="px-6 py-4 font-semibold">Value</th>
                    <th className="px-6 py-4 font-semibold">Timeline</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                 {[1, 2, 3].map((row) => (
                    <tr key={row} className="hover:bg-gray-50 dark:bg-[#050505]">
                       <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">Global Tech Corp</td>
                       <td className="px-6 py-4 text-gray-600 dark:text-gray-400">Autonomous Agent Deployment</td>
                       <td className="px-6 py-4 text-gray-600 dark:text-gray-400">$4.2M TCV</td>
                       <td className="px-6 py-4 text-gray-600 dark:text-gray-400">Q1 - Q4 2024</td>
                       <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-semibold">
                             On Track
                          </span>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default PracticeDashboard;
