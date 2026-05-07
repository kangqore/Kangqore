import React from 'react';
import { Bell, ArrowRight, FileText, CheckCircle, Receipt, AlertTriangle } from 'lucide-react';

const ClientDeltas = () => {
    // Mock Data - In real app, fetch from /api/client/deltas
    const deltas = [
        { id: 1, type: 'deliverable', message: 'New deliverable uploaded: "Q1 Security Audit Report"', time: '2h ago', icon: FileText, color: 'text-blue-500 bg-blue-50' },
        { id: 2, type: 'status', message: 'Project "Mobile App MVP" moved to QA Phase', time: '5h ago', icon: CheckCircle, color: 'text-green-500 bg-green-50' },
        { id: 3, type: 'invoice', message: 'Invoice INV-2026-003 is ready for review', time: '1d ago', icon: Receipt, color: 'text-purple-500 bg-purple-50' },
        { id: 4, type: 'action', message: 'Approval required for "Scope Change #4"', time: '1d ago', icon: AlertTriangle, color: 'text-amber-500 bg-amber-50' },
    ];

    return (
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-brand-gradient text-white rounded-lg shadow-sm">
                       <Bell className="w-5 h-5" />
                   </div>
                   <div>
                       <h3 className="font-bold text-gray-900 dark:text-white">Since You Last Logged In</h3>
                       <p className="text-xs text-gray-500">Highlights from the last 7 days</p>
                   </div>
                </div>
                <span className="text-xs font-bold text-brand-blue bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">+4 New</span>
            </div>

            <div className="flex-1 space-y-4">
                {deltas.map(delta => {
                    const Icon = delta.icon;
                    return (
                        <div key={delta.id} className="flex gap-3 group cursor-pointer hover:bg-gray-50 dark:bg-[#050505] p-2 rounded-lg transition-colors -mx-2">
                             <div className={`mt-1 p-1.5 rounded-full h-fit flex-shrink-0 ${delta.color}`}>
                                 <Icon className="w-4 h-4" />
                             </div>
                             <div className="flex-1">
                                 <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors leading-snug">
                                     {delta.message}
                                 </p>
                                 <p className="text-xs text-gray-400 mt-1">{delta.time}</p>
                             </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
                <button className="text-xs font-bold text-gray-500 hover:text-brand-blue flex items-center gap-1 transition-colors">
                    View All Activity <ArrowRight className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
};

export default ClientDeltas;
