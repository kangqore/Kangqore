import React from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
  FileText, Download, Shield, GitCommit, CheckCircle, 
  MapPin, Calendar, Clock, TrendingUp, Loader2
} from 'lucide-react';

const ClientExecutiveReport = () => {
    const [isDownloading, setIsDownloading] = React.useState(false);

    const { data: reportData, isLoading } = useQuery({
        queryKey: ['client-weekly-report'],
        queryFn: async () => {
             const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/client/reports/weekly`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            return res.data.report;
        }
    });

    const REPORT_DATA = reportData || {
        date: new Date().toLocaleDateString('en-GB'),
        period: "Current Week",
        health: { status: 'Loading...', score: 0, trend: '-' },
        summary: "Loading report data...",
        accomplishments: [],
        decisions: [],
        risks: [],
        next_week: []
    };

    const handleDownload = () => {
        setIsDownloading(true);
        // Mock download delay
        setTimeout(() => setIsDownloading(false), 1500);
    };

    return (
        <DashboardLayout role="client" title="Executive Reports" subtitle="Weekly strategic summaries for stakeholders">
            <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Header Controls */}
                <div className="flex justify-between items-center bg-white dark:bg-gray-900 dark:border-gray-800 p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-brand-blue">
                             <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-900 dark:text-white">Weekly Status Report</h2>
                            <p className="text-xs text-gray-500">{REPORT_DATA.period} • Generated Automatically</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleDownload}
                        disabled={isDownloading || isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200 disabled:opacity-50"
                    >
                        {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} 
                        {isDownloading ? 'Downloading...' : 'Download PDF'}
                    </button>
                </div>

                {/* The Report "Paper" */}
                <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-none shadow-2xl border border-gray-200 min-h-[1000px] p-12 md:p-16 relative mx-auto print:shadow-none print:border-none w-full max-w-[210mm] aspect-[1/1.414]">
                    {isLoading && (
                        <div className="absolute inset-0 bg-white dark:bg-black/80 z-20 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
                                <span className="text-sm font-medium text-gray-500">Generating Report...</span>
                            </div>
                        </div>
                    )}
                    
                    {/* Watermark */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none rotate-[-45deg]">
                         <h1 className="text-[120px] font-black uppercase text-gray-900 dark:text-white whitespace-nowrap">Kangqore</h1>
                    </div>

                    {/* Report Header */}
                    <div className="flex justify-between items-start mb-12 border-b-2 border-brand-blue pb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white uppercase tracking-tight mb-2">Executive Status Report</h1>
                            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">{REPORT_DATA.date}</p>
                        </div>
                        <div className="text-right">
                             <h3 className="text-xl font-bold text-brand-blue">Kangqore</h3>
                             <p className="text-xs text-gray-400">Mutual Accountability Platform</p>
                        </div>
                    </div>

                    {/* 1. Executive Summary */}
                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-brand-blue" />
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">Executive Summary</h3>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 p-6 rounded-lg border-l-4 border-brand-blue text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            {REPORT_DATA.summary}
                        </div>
                    </div>

                    {/* 2. Health & Metrics */}
                    <div className="grid grid-cols-3 gap-6 mb-10">
                        <div className="p-4 rounded-lg border border-gray-200 text-center bg-green-50 dark:bg-green-900/20/50">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Engagement Health</p>
                            <span className="text-2xl font-bold text-green-600 block mb-1">Stable</span>
                            <span className="text-[10px] text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-bold">Score: 98/100</span>
                        </div>
                        <div className="p-4 rounded-lg border border-gray-200 text-center">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Budget Utilized</p>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white block mb-1">12%</span>
                            <span className="text-[10px] text-gray-500">On Track</span>
                        </div>
                        <div className="p-4 rounded-lg border border-gray-200 text-center">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Schedule Variance</p>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white block mb-1">0 days</span>
                            <span className="text-[10px] text-gray-500">On Time</span>
                        </div>
                    </div>

                    {/* 3. Key Accomplishments */}
                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle className="w-5 h-5 text-brand-blue" />
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">This Week's Accomplishments</h3>
                        </div>
                        <ul className="space-y-3">
                            {REPORT_DATA.accomplishments.map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 p-3 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded shadow-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 4. Strategic Governance */}
                    <div className="grid grid-cols-2 gap-8 mb-10">
                        <div>
                             <div className="flex items-center gap-2 mb-4">
                                <GitCommit className="w-5 h-5 text-brand-blue" />
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">Decisions Logged</h3>
                            </div>
                            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded text-sm">
                                {REPORT_DATA.decisions.map((d, i) => (
                                    <div key={i} className="p-3 border-b border-gray-100 last:border-0 flex justify-between items-center">
                                        <span className="font-medium text-gray-800 dark:text-gray-50">{d.title}</span>
                                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                            d.status === 'Approved' ? 'bg-green-50 dark:bg-green-900/20 text-green-700' : 'bg-amber-50 text-amber-700'
                                        }`}>{d.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                             <div className="flex items-center gap-2 mb-4">
                                <Shield className="w-5 h-5 text-brand-blue" />
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">Risk Attention</h3>
                            </div>
                            {REPORT_DATA.risks.length > 0 ? (
                                <div className="space-y-2">
                                    {/* Risk items would go here */}
                                </div>
                            ) : (
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 rounded p-4 text-center">
                                    <p className="text-sm font-bold text-green-800">No active risks.</p>
                                    <p className="text-xs text-green-600">Engagement checks passed.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="absolute bottom-12 left-16 right-16 pt-6 border-t border-gray-200 flex justify-between items-center text-xs text-gray-400">
                        <div className="flex items-center gap-4">
                            <span>Confidential & Proprietary</span>
                            <span>•</span>
                            <span>Generated via Kangqore Admin</span>
                        </div>
                        <div className="font-mono">Page 1 of 1</div>
                    </div>

                </div>

            </div>
        </DashboardLayout>
    );
};

export default ClientExecutiveReport;
