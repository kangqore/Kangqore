import React, { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  Briefcase, TrendingUp, AlertTriangle, CheckCircle, 
  MoreVertical, PieChart as PieChartIcon, DollarSign 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, Legend 
} from 'recharts';

const ProgramsDashboard = () => {
  // Mock Data
  const [metrics] = useState({
    totalTCV: '$12.4M',
    avgMargin: '34%',
    activePrograms: 8,
    clientHappiness: '4.8/5'
  });

  const [programs] = useState([
    { id: 1, name: 'AI Transformation - FinTech', client: 'Acme Corp', tcv: '$4.2M', margin: '38%', health: 'Healthy', progress: 65, manager: 'Sarah J.' },
    { id: 2, name: 'Cloud Migration', client: 'Globex Inc', tcv: '$2.1M', margin: '28%', health: 'At Risk', progress: 40, manager: 'Mike T.' },
    { id: 3, name: 'GenAI Pilot', client: 'Soylent Corp', tcv: '$850k', margin: '45%', health: 'Healthy', progress: 90, manager: 'Priya R.' },
    { id: 4, name: 'Data Lake Modernization', client: 'Umbrella Corp', tcv: '$1.5M', margin: '32%', health: 'Critical', progress: 25, manager: 'John D.' },
    { id: 5, name: 'Cybersecurity Overhaul', client: 'Stark Ind', tcv: '$3.8M', margin: '35%', health: 'Healthy', progress: 15, manager: 'Tony S.' },
  ]);

  const [revenueData] = useState([
    { name: 'FinTech', value: 4200 },
    { name: 'Health', value: 2100 },
    { name: 'Retail', value: 1500 },
    { name: 'Energy', value: 3800 },
    { name: 'Mfg', value: 850 },
  ]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Healthy': return 'bg-green-100 text-green-700';
      case 'At Risk': return 'bg-yellow-100 text-yellow-700';
      case 'Critical': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <DashboardLayout role="admin" title="Programs Portfolio" subtitle="Executive oversight of strategic accounts.">
      <div className="space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Portfolio Value</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{metrics.totalTCV}</h3>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> +12% YoY
              </p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Program Margin</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{metrics.avgMargin}</h3>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> +2.5% vs Target
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <PieChartIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Programs</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{metrics.activePrograms}</h3>
              <p className="text-xs text-gray-500 mt-1">
                across 5 industries
              </p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Briefcase className="w-6 h-6 text-purple-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Client Health</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{metrics.clientHappiness}</h3>
              <p className="text-xs text-yellow-600 mt-1">
                1 client requiring attention
              </p>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Charts & Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Mix */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-1">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Portfolio Revenue Mix</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {revenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Program List */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 lg:col-span-2 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 dark:text-white">Active Programs</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-[#050505] text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-3 font-medium">Program Name</th>
                    <th className="px-6 py-3 font-medium">Client</th>
                    <th className="px-6 py-3 font-medium">TCV</th>
                    <th className="px-6 py-3 font-medium">Margin</th>
                    <th className="px-6 py-3 font-medium">Health</th>
                    <th className="px-6 py-3 font-medium">Lead</th>
                    <th className="px-6 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {programs.map((prog) => (
                    <tr key={prog.id} className="hover:bg-gray-50 dark:bg-[#050505] transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{prog.name}</p>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${prog.progress}%` }}></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{prog.client}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{prog.tcv}</td>
                      <td className={`px-6 py-4 text-sm font-medium ${
                        parseInt(prog.margin) > 30 ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {prog.margin}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prog.health)}`}>
                          {prog.health}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{prog.manager}</td>
                      <td className="px-6 py-4">
                        <button className="text-gray-400 hover:text-gray-600 dark:text-gray-400">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProgramsDashboard;
