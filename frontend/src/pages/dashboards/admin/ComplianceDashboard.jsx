import React, { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  ShieldCheck, AlertTriangle, FileText, CheckCircle, 
  Lock, RefreshCw 
} from 'lucide-react';

const ComplianceDashboard = () => {
  const [frameworks] = useState([
    { name: 'ISO 27001', status: 'Certified', validUntil: 'Dec 2025', progress: 100 },
    { name: 'SOC 2 Type II', status: 'In Audit', validUntil: '-', progress: 65 },
    { name: 'GDPR CoC', status: 'Compliant', validUntil: 'Annual', progress: 95 },
    { name: 'AI Safety (ISO 42001)', status: 'Gap Analysis', validUntil: '-', progress: 30 },
  ]);

  return (
    <DashboardLayout role="admin" title="Compliance & GRC" subtitle="Regulatory status & AI governance.">
      <div className="space-y-6">
        
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-emerald-100 flex items-center gap-4">
             <div className="p-4 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-full shadow-sm text-green-600">
               <ShieldCheck className="w-8 h-8" />
             </div>
             <div>
               <h3 className="text-2xl font-bold text-green-900">92%</h3>
               <p className="text-sm text-green-700">Overall Compliance Score</p>
             </div>
           </div>
           
           <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl border border-gray-100 shadow-sm">
             <div className="flex justify-between items-center mb-2">
                <h4 className="text-gray-500 font-medium text-sm">Open Risks</h4>
                <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">High Priority</span>
             </div>
             <div className="text-3xl font-bold text-gray-900 dark:text-white">4</div>
             <p className="text-xs text-gray-500 mt-2">2 related to Access Control</p>
           </div>

           <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl border border-gray-100 shadow-sm">
             <div className="flex justify-between items-center mb-2">
                <h4 className="text-gray-500 font-medium text-sm">Next Audit</h4>
                <RefreshCw className="w-4 h-4 text-gray-400" />
             </div>
             <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">Oct 15, 2026</div>
             <p className="text-xs text-blue-600 font-medium">SOC 2 Type II Surveillance</p>
           </div>
        </div>

        {/* Framework Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {frameworks.map((fw, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 dark:bg-[#050505] rounded-lg"><FileText className="w-6 h-6 text-gray-700 dark:text-gray-300" /></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{fw.name}</h3>
                    <p className="text-xs text-gray-500">{fw.status}</p>
                  </div>
                </div>
                 <span className="text-lg font-bold text-gray-900 dark:text-white">{fw.progress}%</span>
              </div>
              
              <div className="w-full bg-gray-100 dark:bg-[#0a0a0c] rounded-full h-2 mb-4">
                <div 
                  className={`h-2 rounded-full ${
                    fw.progress === 100 ? 'bg-green-500' : 
                    fw.progress > 50 ? 'bg-blue-500' : 'bg-yellow-500'
                  }`} 
                  style={{ width: `${fw.progress}%` }}
                ></div>
              </div>
              
               <div className="flex justify-between text-xs text-gray-500">
                 <span>Valid Until: {fw.validUntil}</span>
                 <button className="text-blue-600 hover:underline">View Evidence</button>
               </div>
            </div>
          ))}
        </div>
        
        {/* Banner */}
        <div className="bg-blue-900 rounded-xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Lock className="w-5 h-5" /> Trust Center Enabled</h3>
            <p className="opacity-80 max-w-xl">Your public trust center is live. Clients can now request access to your SOC 2 and ISO reports directly without manual NDA signing.</p>
            <button className="mt-4 px-4 py-2 bg-white dark:bg-black text-blue-900 rounded-lg text-sm font-semibold hover:bg-gray-100">Manage Trust Center</button>
          </div>
          <ShieldCheck className="absolute -right-6 -bottom-6 w-48 h-48 text-white opacity-10" />
        </div>

      </div>
    </DashboardLayout>
  );
};

export default ComplianceDashboard;
