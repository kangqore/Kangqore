import React, { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  FileSignature, ShieldCheck, AlertOctagon, Calendar, 
  Search, Eye, MoreHorizontal 
} from 'lucide-react';

const ContractsDashboard = () => {
  const [contracts] = useState([
    { id: 'CTR-001', client: 'Acme Corp', type: 'MSA', value: '$250k/yr', start: 'Jan 2024', end: 'Jan 2026', status: 'Active', risks: 0 },
    { id: 'CTR-002', client: 'Globex Inc', type: 'SOW', value: '$50k', start: 'Feb 2024', end: 'May 2024', status: 'Active', risks: 1 },
    { id: 'CTR-003', client: 'Stark Ind', type: 'NDA', value: '-', start: 'Permanent', end: '-', status: 'Active', risks: 0 },
    { id: 'CTR-004', client: 'Umbrella Corp', type: 'MSA', value: '$1.2M/yr', start: 'Jun 2023', end: 'Jun 2025', status: 'Review', risks: 2 },
  ]);

  return (
    <DashboardLayout role="admin" title="Contracts Repository" subtitle="Commercial risk containment & structured storage.">
      <div className="space-y-6">
        
        {/* Quick Filters */}
        <div className="flex gap-4 overflow-x-auto pb-2">
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 px-6 py-4 rounded-xl border border-gray-100 shadow-sm flex-1 min-w-[200px]">
                <p className="text-gray-500 text-xs uppercase">Active MSAs</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">12</h3>
            </div>
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 px-6 py-4 rounded-xl border border-gray-100 shadow-sm flex-1 min-w-[200px]">
                <p className="text-gray-500 text-xs uppercase">Expiring &lt; 90 Days</p>
                <h3 className="text-2xl font-bold text-yellow-600 mt-1">3</h3>
            </div>
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 px-6 py-4 rounded-xl border border-gray-100 shadow-sm flex-1 min-w-[200px]">
                <p className="text-gray-500 text-xs uppercase">High Risk Clauses</p>
                <h3 className="text-2xl font-bold text-red-600 mt-1">5</h3>
            </div>
        </div>

        {/* Contracts Table */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Contract Repository</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search client or type..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full md:w-64" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-[#050505] text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3 font-medium">Contract ID</th>
                    <th className="px-6 py-3 font-medium">Client</th>
                    <th className="px-6 py-3 font-medium">Type</th>
                    <th className="px-6 py-3 font-medium">Value</th>
                    <th className="px-6 py-3 font-medium">Term</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Compliance</th>
                    <th className="px-6 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {contracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-gray-50 dark:bg-[#050505]">
                      <td className="px-6 py-4 font-mono text-xs text-blue-600">{contract.id}</td>
                      <td className="px-6 py-4 font-medium text-sm text-gray-900 dark:text-white">{contract.client}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400"><span className="px-2 py-1 bg-gray-100 dark:bg-[#0a0a0c] rounded text-xs">{contract.type}</span></td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{contract.value}</td>
                      <td className="px-6 py-4 text-xs text-gray-500">{contract.start} - {contract.end}</td>
                      <td className="px-6 py-4">
                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                           contract.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                         }`}>
                           {contract.status}
                         </span>
                      </td>
                      <td className="px-6 py-4">
                        {contract.risks > 0 ? (
                          <div className="flex items-center text-red-600 text-xs">
                            <AlertOctagon className="w-4 h-4 mr-1" /> {contract.risks} Risks
                          </div>
                        ) : (
                          <div className="flex items-center text-green-600 text-xs">
                            <ShieldCheck className="w-4 h-4 mr-1" /> Compliant
                          </div>
                         )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-full text-gray-400">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ContractsDashboard;
