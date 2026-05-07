import React from 'react';
import { Users, Gavel, Calendar, FileCheck, Shield, ChevronRight } from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';

const ClientSteering = ({ isTabContent = false }) => {
    const committeeMeetings = [
        { title: 'Executive Steering Committee Q1', date: 'Feb 15, 2026', status: 'SCHEDULED', attendees: ['CEO', 'CTO', 'Kangqore Lead'] },
        { title: 'Technical Advisory Board', date: 'Jan 12, 2026', status: 'COMPLETED', attendees: ['Architects', 'PMs'] },
        { title: 'Commercial Review', date: 'Dec 20, 2025', status: 'COMPLETED', attendees: ['CFO', 'Legal'] }
    ];

    const content = (
            <div className="max-w-6xl mx-auto p-8 space-y-12 animate-in fade-in duration-700">
                <div className="flex justify-between items-start">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            Steering <span className="text-brand-blue">Governance</span>
                        </h1>
                        <p className="text-slate-500 font-medium max-w-2xl">
                            High-level executive oversight and strategic decision-making framework for your engagement.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-slate-800 transition flex items-center gap-2 uppercase tracking-widest">
                            <Gavel className="w-4 h-4" />
                            Executive Dashboard
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[3rem] p-10 shadow-xl shadow-slate-100/50 border border-slate-50 space-y-8">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                    <Calendar className="w-6 h-6 text-brand-blue" />
                                    Committee Schedule
                                </h3>
                                <button className="text-brand-blue font-black text-xs uppercase tracking-widest hover:underline">Request Meeting</button>
                            </div>
                            
                            <div className="space-y-4">
                                {committeeMeetings.map((m, i) => (
                                    <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] hover:bg-white dark:bg-gray-900 dark:border-gray-800 hover:shadow-lg transition-all border border-transparent hover:border-slate-100 group">
                                        <div className="flex items-center gap-6">
                                            <div className={`p-4 rounded-2xl ${m.status === 'SCHEDULED' ? 'bg-brand-blue text-white' : 'bg-slate-200 text-slate-400'}`}>
                                                <Calendar className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 dark:text-white">{m.title}</p>
                                                <p className="text-xs font-bold text-slate-400 uppercase mt-1">{m.date} • {m.attendees.join(', ')}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest ${
                                            m.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                            {m.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-900 text-white rounded-[3rem] p-12 relative overflow-hidden group">
                            <Shield className="absolute -bottom-8 -right-8 w-48 h-48 opacity-5 text-brand-blue group-hover:scale-110 transition-transform duration-700" />
                            <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                                <FileCheck className="w-6 h-6 text-brand-blue" />
                                Policy Alignment
                            </h3>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Framework</p>
                                    <p className="text-lg font-black italic">"Shared Accountability Model 2.0"</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Audit Status</p>
                                    <p className="text-lg font-black text-green-400">Continuous Validation</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="p-10 bg-brand-blue/5 rounded-[3rem] border border-brand-blue/10 space-y-8">
                            <Users className="w-12 h-12 text-brand-blue" />
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">Stakeholder Matrix</h3>
                            <div className="space-y-6">
                                {[
                                    { name: 'Dr. Sarah Chen', role: 'Executive Sponsor', initial: 'SC' },
                                    { name: 'Marcus Thorne', role: 'Strategic Advisor', initial: 'MT' },
                                    { name: 'Elena Rossi', role: 'Operations Lead', initial: 'ER' }
                                ].map((s, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm flex items-center justify-center font-black text-brand-blue text-xs border border-brand-blue/10">
                                            {s.initial}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 dark:text-white">{s.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">{s.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 bg-white dark:bg-gray-900 dark:border-gray-800 border border-slate-100 rounded-[2.5rem] shadow-sm group cursor-pointer hover:border-brand-blue transition-all">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resolution Time</p>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-blue transition" />
                            </div>
                            <p className="text-3xl font-black text-slate-900 dark:text-white">4.2 Days</p>
                            <p className="text-[10px] font-bold text-green-500 mt-1">Average for strategic decisions</p>
                        </div>
                    </div>
                </div>
            </div>
    );

    if (isTabContent) return content;

    return (
        <DashboardLayout role="client" title="Steering Governance" subtitle="Stakeholder oversight & strategic committees">
            {content}
        </DashboardLayout>
    );
};

export default ClientSteering;
