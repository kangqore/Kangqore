import React, { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  Layers, CheckCircle, Clock, AlertCircle, 
  MoreHorizontal, ArrowRight 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const EngagementDashboard = () => {
  const [stats] = useState({
    active: 14,
    onTrack: 10,
    delayed: 3,
    critical: 1
  });

  const [engagements] = useState([
    { id: 101, name: 'Mobile App Revamp', client: 'RetailCo', phase: 'Development', status: 'On Track', deadline: 'Oct 15', owner: 'Mike R.' },
    { id: 102, name: 'Cloud Infra Setup', client: 'TechStart', phase: 'Planning', status: 'On Track', deadline: 'Nov 01', owner: 'Sarah L.' },
    { id: 103, name: 'ERP Integration', client: 'Mfg Giant', phase: 'Testing', status: 'Delayed', deadline: 'Sep 30', owner: 'James K.' },
    { id: 104, name: 'AI Chatbot V2', client: 'BankOne', phase: 'Deployment', status: 'Critical', deadline: 'Today', owner: 'Anita S.' },
    { id: 105, name: 'Data Pipeline', client: 'MediaHouse', phase: 'Development', status: 'On Track', deadline: 'Dec 12', owner: 'Raj P.' },
  ]);

  const [phaseData] = useState([
    { name: 'Plan', count: 3 },
    { name: 'Design', count: 2 },
    { name: 'Dev', count: 6 },
    { name: 'Test', count: 2 },
    { name: 'Deploy', count: 1 },
  ]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'On Track': return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">On Track</span>;
      case 'Delayed': return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Delayed</span>;
      case 'Critical': return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Critical</span>;
      default: return null;
    }
  };

  return (
    <DashboardLayout role="admin" title="Engagement Delivery" subtitle="Single source of truth for project execution.">
      <div className="space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Engagements</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
              <Layers className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">On Track</p>
              <h3 className="text-2xl font-bold text-green-600">{stats.onTrack}</h3>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Delayed</p>
              <h3 className="text-2xl font-bold text-yellow-600">{stats.delayed}</h3>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Critical Attention</p>
              <h3 className="text-2xl font-bold text-red-600">{stats.critical}</h3>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Table */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 dark:text-white">Active Engagements</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-[#0a0a0c] rounded-md text-gray-600 dark:text-gray-400">All</button>
                <button className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 dark:bg-[#050505] rounded-md">My Projects</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-[#050505] text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3 font-medium">Engagement</th>
                    <th className="px-6 py-3 font-medium">Client</th>
                    <th className="px-6 py-3 font-medium">Phase</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Timeline</th>
                    <th className="px-6 py-3 font-medium">Owner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {engagements.map((eng) => (
                    <tr key={eng.id} className="hover:bg-gray-50 dark:bg-[#050505] cursor-pointer">
                      <td className="px-6 py-4 font-medium text-sm text-gray-900 dark:text-white">{eng.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{eng.client}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{eng.phase}</td>
                      <td className="px-6 py-4">{getStatusBadge(eng.status)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{eng.deadline}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                         <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-[10px] font-bold">
                           {eng.owner.charAt(0)}
                         </div>
                         {eng.owner}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side Chart */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-6">Phase Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={phaseData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={50} tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900 mb-1">Development Heavy</h4>
              <p className="text-xs text-blue-700">42% of active engagements are currently in the execution phase, requiring high resource availability.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EngagementDashboard;
