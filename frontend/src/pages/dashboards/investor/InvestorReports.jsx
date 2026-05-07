import React, { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { FileText, Download, TrendingUp, BarChart2, PieChart, ArrowUpRight } from 'lucide-react';

const InvestorReports = () => {
  // Mock data - replace with API fetch
  const [reports] = useState([
    {
      id: 1,
      title: 'Q4 2025 Financial Performance Summary',
      type: 'Quarterly Report',
      date: '2026-01-15',
      size: '2.4 MB',
      icon: TrendingUp,
      color: 'blue'
    },
    {
      id: 2,
      title: 'Annual Growth & KPI Analysis 2025',
      type: 'Annual Report',
      date: '2026-01-10',
      size: '5.1 MB',
      icon: BarChart2,
      color: 'green'
    },
    {
      id: 3,
      title: 'Market Expansion Strategy Deck',
      type: 'Strategy Deck',
      date: '2025-12-20',
      size: '3.8 MB',
      icon: PieChart,
      color: 'purple'
    },
    {
      id: 4,
      title: 'December 2025 Board Report',
      type: 'Board Report',
      date: '2025-12-05',
      size: '1.9 MB',
      icon: FileText,
      color: 'amber'
    }
  ]);

  return (
    <DashboardLayout role="investor" title="Reports" subtitle="Curated intelligence and financial summaries">
      <div className="space-y-6">
        
        {/* Key Metrics Summary (Mock) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Annual RR</h3>
              <span className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">$4.2M</span>
              <span className="text-sm text-green-600 font-medium flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                12%
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
             <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Burn Rate</h3>
              <span className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg">
                <TrendingUp className="w-4 h-4 transform rotate-180" />
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">$180k</span>
              <span className="text-sm text-green-600 font-medium flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                -5%
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
             <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Runway</h3>
              <span className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                <BarChart2 className="w-4 h-4" />
              </span>
            </div>
             <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">18 Months</span>
              <span className="text-sm text-gray-400 font-medium">
                Stable
              </span>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 dark:text-white">Available Reports</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {reports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-gray-50 dark:bg-[#050505] transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${
                    report.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' :
                    report.color === 'green' ? 'bg-green-50 dark:bg-green-900/20 text-green-600' :
                    report.color === 'purple' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    <report.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">
                      {report.title}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <span>{report.type}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span>{report.date}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-white dark:bg-gray-900 dark:border-gray-800 hover:border-brand-blue hover:text-brand-blue transition-all">
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">Download PDF</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InvestorReports;
