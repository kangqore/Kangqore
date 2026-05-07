import React, { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  AlertTriangle, CheckCircle, Clock, 
  ArrowUpRight, Users, MessageSquare 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const EscalationsDashboard = () => {
  const [filter, setFilter] = useState('All');

  // Key Metrics
  const metrics = [
    { label: 'Active Escalations', value: 12, trend: '+2 this week', color: 'red', icon: AlertTriangle },
    { label: 'Avg Resolution Time', value: '3.2 Days', trend: '-0.5 days vs avg', color: 'blue', icon: Clock },
    { label: 'Critical Blockers', value: 4, trend: 'Requires Exec. Action', color: 'amber', icon: AlertTriangle },
    { label: 'Resolved (Last 30d)', value: 28, trend: '95% Success Rate', color: 'emerald', icon: CheckCircle },
  ];

  // Escalation List
  const escalations = [
    { id: 'ESC-204', title: 'API Integration Failure', project: 'Global ERP', owner: 'Sarah J.', severity: 'High', status: 'Open', age: '2 days', assignedTo: 'Tech Lead', description: 'Middleware failing to sync with legacy payroll system.' },
    { id: 'ESC-205', title: 'Resource Shortage', project: 'AI Agent', owner: 'Mike R.', severity: 'Critical', status: 'In Review', age: '4 days', assignedTo: 'HR Director', description: 'Lead Data Scientist unexpectedly resigned. Need immediate backfill.' },
    { id: 'ESC-206', title: 'Budget Variance', project: 'Cloud Mig.', owner: 'Jessica P.', severity: 'Medium', status: 'Investigating', age: '1 day', assignedTo: 'Finance', description: 'AWS costs projected to exceed monthly cap by 15%.' },
    { id: 'ESC-207', title: 'Scope Creep', project: 'Cyber Uplift', owner: 'Katrina B.', severity: 'Low', status: 'Resolved', age: '0 days', assignedTo: 'PMO', description: 'Client requesting additional audit module outside SOW.' },
  ];

  // Severity Distribution Chart Data
  const severityData = [
    { name: 'Critical', value: 4, fill: '#ef4444' },
    { name: 'High', value: 8, fill: '#f97316' },
    { name: 'Medium', value: 15, fill: '#eab308' },
    { name: 'Low', value: 10, fill: '#3b82f6' },
  ];

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <DashboardLayout role="admin" title="Escalations Management" subtitle="Track and resolve critical project blockers.">
      <div className="space-y-6">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{m.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{m.value}</h3>
                <p className="text-xs text-gray-500 mt-1">{m.trend}</p>
              </div>
              <div className={`p-3 rounded-full bg-${m.color}-50 text-${m.color}-600`}>
                <m.icon className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main List */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-white">Active Escalations</h3>
              <div className="flex gap-2">
                {['All', 'Open', 'Critical'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 dark:bg-[#0a0a0c] text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {escalations.map((esc) => (
                <div key={esc.id} className="p-4 hover:bg-gray-50 dark:bg-[#050505] transition-colors group cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getSeverityColor(esc.severity)}`}>
                        {esc.severity}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{esc.title}</span>
                      <span className="text-xs text-gray-400">#{esc.id}</span>
                    </div>
                    <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {esc.age}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 pl-1">{esc.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 pl-1">
                    <span className="flex items-center gap-1">
                       <Users className="w-3 h-3" /> Assigned: <span className="text-gray-900 dark:text-white font-medium">{esc.assignedTo}</span>
                    </span>
                    <span className="flex items-center gap-1">
                       <MessageSquare className="w-3 h-3" /> Project: {esc.project}
                    </span>
                    <button className="ml-auto text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      Take Action <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Analytics */}
          <div className="space-y-6">
             <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
               <h3 className="font-bold text-gray-900 dark:text-white mb-4">Severity Spread</h3>
               <div className="h-48">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={severityData} layout="vertical" margin={{ left: 20 }}>
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" tick={{fontSize: 12}} width={60} />
                     <Tooltip />
                     <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
             </div>

             <div className="bg-blue-900 p-6 rounded-xl shadow-sm text-white relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="font-bold text-lg mb-2">Need Rapid Response?</h3>
                 <p className="text-blue-100 text-sm mb-4">Trigger an emergency SWAT team for critical delivery blockers.</p>
                 <button className="w-full py-2 bg-white dark:bg-black text-blue-900 font-bold rounded-lg hover:bg-blue-50 transition-colors">
                   Initiate SWAT Protocol
                 </button>
               </div>
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <AlertTriangle className="w-32 h-32" />
               </div>
             </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default EscalationsDashboard;
