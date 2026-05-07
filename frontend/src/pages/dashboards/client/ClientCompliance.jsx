import React from 'react';
import { ShieldCheck, Lock, Eye, Globe, Terminal, Download, ArrowUpRight } from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';

const ClientCompliance = ({ isTabContent = false }) => {
    const complianceItems = [
        { area: 'Data Privacy', status: 'COMPLIANT', standard: 'GDPR / CCPA', details: 'Automated data residency validation active.' },
        { area: 'Network Security', status: 'SECURE', standard: 'SOC2 Type II', details: 'Continuous intrusion detection and perimeter monitoring.' },
        { area: 'Access Governance', status: 'VERIFIED', standard: 'ISO 27001', details: 'Quarterly IAM audit completed successfully.' },
        { area: 'AI Ethics & GRC', status: 'PENDING', standard: 'EU AI Act', details: 'Alignment framework currently under review.' }
    ];

    const content = (
            <div className="max-w-7xl mx-auto p-8 space-y-12 animate-in fade-in duration-700">
                 <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-[0.2em] text-[10px]">
                            <ShieldCheck className="w-4 h-4" />
                            Assurance Engine
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            Security & <span className="text-indigo-600">Compliance</span>
                        </h1>
                        <p className="text-xl text-slate-500 max-w-2xl font-medium">
                            Real-time GRC tracking and enterprise-grade security assurance for your product ecosystem.
                        </p>
                    </div>

                    <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 flex items-center gap-8">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Trust Score</p>
                            <p className="text-4xl font-black">98/100</p>
                        </div>
                        <div className="w-12 h-12 bg-white dark:bg-gray-900 dark:border-gray-800/10 rounded-2xl flex items-center justify-center">
                            <Lock className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {complianceItems.map((item, i) => (
                        <div key={i} className="p-8 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:border-indigo-200 transition-all group">
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-widest ${
                                    item.status === 'COMPLIANT' ? 'bg-green-100 text-green-700' :
                                    item.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'
                                }`}>
                                    {item.status}
                                </span>
                            </div>
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">{item.standard}</h3>
                            <p className="text-xl font-black text-slate-900 dark:text-white mb-4">{item.area}</p>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.details}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white space-y-10 relative overflow-hidden">
                        <Globe className="absolute -bottom-10 -right-10 w-64 h-64 opacity-5 text-indigo-400" />
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-black flex items-center gap-3">
                                <Eye className="w-6 h-6 text-indigo-400" />
                                Real-time Threats
                            </h3>
                            <span className="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest">Targeting: Zero</span>
                        </div>
                        
                        <div className="space-y-6">
                            {[
                                { event: 'DDoS Mitigation', time: '14 min ago', origin: 'Frankfurt Node' },
                                { event: 'IAM Access Token Rotation', time: '2 hours ago', origin: 'Global' },
                                { event: 'Endpoint Scan (Production)', time: '6 hours ago', origin: 'US East' }
                            ].map((e, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-white dark:bg-gray-900 dark:border-gray-800/5 rounded-3xl border border-white/10 hover:bg-white dark:bg-gray-900 dark:border-gray-800/10 transition cursor-default">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full" />
                                        <div>
                                            <p className="text-sm font-black">{e.event}</p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase">{e.origin}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-500">{e.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="p-12 bg-indigo-50 rounded-[3.5rem] border border-indigo-100 space-y-8">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Security Documentation</h3>
                            <p className="text-slate-600 dark:text-gray-400 font-medium leading-relaxed">
                                Access our latest security audits, penetration test results, and compliance certificates for your due diligence.
                            </p>
                            <div className="space-y-4">
                                {[
                                    'SOC2 Type II Report 2025',
                                    'Penetration Test Summary - Jan 2026',
                                    'Product Security Architecture'
                                ].map((doc, i) => (
                                    <button key={i} className="w-full p-5 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl flex items-center justify-between group hover:shadow-lg transition-all">
                                        <div className="flex items-center gap-4 text-slate-900 dark:text-white font-black text-sm">
                                            <Download className="w-4 h-4 text-indigo-500" />
                                            {doc}
                                        </div>
                                        <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-6 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                             <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shrink-0">
                                <Terminal className="w-6 h-6 text-white" />
                             </div>
                             <div>
                                <p className="text-xs font-black text-slate-900 dark:text-white uppercase">Audit Trail</p>
                                <p className="text-xs text-slate-500 font-medium tracking-tight">All administrative actions are logged and cryptographically signed.</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
    );

    if (isTabContent) return content;

    return (
        <DashboardLayout role="client" title="Security & Compliance" subtitle="Real-time GRC & enterprise security assurance">
            {content}
        </DashboardLayout>
    );
};

export default ClientCompliance;
