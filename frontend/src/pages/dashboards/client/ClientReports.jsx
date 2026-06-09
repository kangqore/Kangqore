import React, { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { FileText, Download, BarChart3, Shield, Calendar, Search, Filter, Printer, Loader2, X, ArrowRight, FileBarChart, PieChart, DownloadCloud } from 'lucide-react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const ClientReports = ({ isTabContent = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['client-reports'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      // Mock data for now, or fetch from real endpoint
      return [
        { id: 1, title: 'Monthly Executive Summary - Jan 2024', type: 'Executive', date: '2024-02-01', size: '2.4 MB', url: '#' },
        { id: 2, title: 'Q4 2023 Performance Review', type: 'Performance', date: '2024-01-15', size: '4.1 MB', url: '#' },
        { id: 3, title: 'Security Audit Findings', type: 'Security', date: '2024-01-10', size: '1.2 MB', url: '#' },
        { id: 4, title: 'Sprint Velocity Report - Sprint 12', type: 'Agile', date: '2024-02-05', size: '0.8 MB', url: '#' },
      ];
    }
  });

  const filteredReports = reports.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const Content = () => {
    if (isLoading) {
        return <div className="p-12 text-center animate-pulse text-slate-400">Generatings insights...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                   <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        Reports & <span className="text-brand-blue">Analytics</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 max-w-2xl">
                        Executive summaries, performance audits, and compliance artifacts.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FileBarChart className="w-24 h-24 text-white" />
                     </div>
                     <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mb-4">Latest Insight</p>
                     <p className="text-2xl font-black tracking-tight mb-2 leading-tight">Velocity increased by 15% in Sprint 12</p>
                     <button className="mt-4 text-xs font-bold text-brand-blue uppercase tracking-wider hover:text-white transition-colors flex items-center gap-1">
                        View Analysis <ArrowRight className="w-3 h-3" />
                     </button>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-100/50 dark:shadow-none border border-slate-50 dark:border-slate-800 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                     <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <PieChart className="w-24 h-24 text-brand-blue" />
                     </div>
                     <p className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-widest mb-4">Reports Available</p>
                     <p className="text-5xl font-black text-brand-blue tracking-tight mb-2">{reports.length}</p>
                     <p className="text-xs font-bold text-slate-400 dark:text-slate-500">Across 4 categories</p>
                </div>

                 <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-100/50 dark:shadow-none border border-slate-50 dark:border-slate-800 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                     <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DownloadCloud className="w-24 h-24 text-green-500" />
                     </div>
                     <p className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-widest mb-4">Data Export</p>
                     <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-2">Full Project Archive</p>
                     <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition shadow-lg shadow-slate-200 dark:shadow-none">
                        <Download className="w-3 h-3" /> Download ZIP
                     </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Document Library</h3>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search reports..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-blue/20"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredReports.map((report) => (
                        <div key={report.id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-slate-100/50 dark:hover:shadow-none rounded-[2rem] transition-all duration-300 group">
                            <div className="flex items-center gap-6 w-full md:w-auto">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                    report.type === 'Executive' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                                    report.type === 'Security' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                                    'bg-blue-100 dark:bg-blue-900/30 text-brand-blue'
                                }`}>
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-brand-blue transition-colors">{report.title}</h4>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{report.type}</span>
                                        <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
                                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{report.size}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end mt-4 md:mt-0">
                                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{report.date}</span>
                                <button className="p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl hover:bg-brand-blue hover:text-white transition-all shadow-sm group-hover:shadow-md">
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
  };

  if (isTabContent) return <Content />;

  return (
    <DashboardLayout role="client" title="Reports & Analytics" subtitle="Access generated insights and audit records">
      <Content />
    </DashboardLayout>
  );
};

export default ClientReports;
