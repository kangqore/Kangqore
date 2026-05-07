import React, { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  Activity, AlertOctagon, UserX, Clock 
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer 
} from 'recharts';

const DeliveryHealthDashboard = () => {
  const [healthScore] = useState(88);
  const [risks] = useState([
    { id: 1, type: 'Budget', severity: 'High', desc: 'Project Alpha is 15% over budget due to scope creep.', project: 'Alpha' },
    { id: 2, type: 'Timeline', severity: 'Medium', desc: 'Beta launch delayed by 1 week due to API integration issues.', project: 'Beta' },
    { id: 3, type: 'Attrition', severity: 'Low', desc: 'Key frontend dev rolling off next month.', project: 'Gamma' },
  ]);

  const radarData = [
    { subject: 'Schedule', A: 120, fullMark: 150 },
    { subject: 'Budget', A: 98, fullMark: 150 },
    { subject: 'Quality', A: 86, fullMark: 150 },
    { subject: 'Team', A: 99, fullMark: 150 },
    { subject: 'Client', A: 85, fullMark: 150 },
    { subject: 'Tech', A: 65, fullMark: 150 },
  ];

  return (
    <DashboardLayout role="admin" title="Delivery Health" subtitle="Real-time execution risk radar.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Health Score & Radar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500 font-medium mb-2">Overall Delivery Health</p>
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="60" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                <circle cx="64" cy="64" r="60" stroke="#10b981" strokeWidth="8" fill="none" strokeDasharray={377} strokeDashoffset={377 - (377 * healthScore) / 100} />
              </svg>
              <span className="absolute text-3xl font-bold text-gray-900 dark:text-white">{healthScore}</span>
            </div>
            <p className="text-sm text-green-600 font-medium mt-2">Stable Condition</p>
          </div>

          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Risk Dimensions</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} hide />
                  <Radar name="Portfolio" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Risk Register */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mock Alerts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 flex items-start gap-3">
              <AlertOctagon className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 text-sm">Critical Budget Variance</h4>
                <p className="text-xs text-red-700 mt-1">2 projects exceeded 15% variance threshold.</p>
              </div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 flex items-start gap-3">
              <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-900 text-sm">Schedule Slippage</h4>
                <p className="text-xs text-yellow-700 mt-1">Average delay increased by 2 days this sprint.</p>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
              <UserX className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 text-sm">Resource Gaps</h4>
                <p className="text-xs text-blue-700 mt-1">3 open roles impacting 'Project Gamma'.</p>
              </div>
            </div>
          </div>

          {/* Early Warning Signals Table */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 dark:text-white">Active Risks & Issues</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {risks.map((risk) => (
                <div key={risk.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:bg-[#050505]">
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 w-2 h-2 rounded-full ${
                      risk.severity === 'High' ? 'bg-red-500' : 
                      risk.severity === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{risk.type} Risk - {risk.project}</h4>
                      <p className="text-xs text-gray-500 mt-1">{risk.desc}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                    risk.severity === 'High' ? 'bg-red-100 text-red-700' : 
                    risk.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {risk.severity}
                  </span>
                </div>
              ))}
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-center border-t border-gray-100">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View Complete Risk Register</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DeliveryHealthDashboard;
