import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  TrendingUp, ArrowRight, CheckCircle, XCircle 
} from 'lucide-react';

const ChangeControlDashboard = () => {
  const requests = [
    { id: 'CR-501', title: 'Increase Cloud Storage Limit', requestor: 'DevOps Lead', cost: '$5,000/mo', impact: 'Medium', status: 'Pending Approval' },
    { id: 'CR-502', title: 'Add Data Encryption Module', requestor: 'Security Architect', cost: '$12,000 one-time', impact: 'High', status: 'Approved' },
    { id: 'CR-503', title: 'Change Payment Gateway Provider', requestor: 'Product Manager', cost: '$0', impact: 'Critical', status: 'Rejected' },
  ];

  return (
    <DashboardLayout role="admin" title="Change Control Board" subtitle="Proposed changes requiring approval.">
      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
           <h3 className="font-bold text-gray-900 dark:text-white">Change Requests Queue</h3>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-gray-50 dark:bg-[#050505] text-xs uppercase text-gray-500">
                    <th className="px-6 py-4 font-semibold">CR ID</th>
                    <th className="px-6 py-4 font-semibold">Title</th>
                    <th className="px-6 py-4 font-semibold">Requestor</th>
                    <th className="px-6 py-4 font-semibold">Financial Impact</th>
                    <th className="px-6 py-4 font-semibold">Risk Impact</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                 {requests.length === 0 && !isLoading && (
                    <tr>
                       <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                          No change requests found.
                       </td>
                    </tr>
                 )}
                 {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50 dark:bg-[#050505]">
                       <td className="px-6 py-4 text-sm font-mono text-gray-500">{req.id.substring(0,8).toUpperCase()}</td>
                       <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{req.title}</td>
                       <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{req.requestedBy || req.client?.name || 'Unknown'}</td>
                       <td className="px-6 py-4 text-sm font-medium">
                          {req.costImpact ? `$${req.costImpact}` : '-'}
                          {req.invoice ? ` (Inv: $${req.invoice.amount})` : ''}
                       </td>
                       <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                             req.priority === 'HIGH' || req.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                             req.priority === 'MEDIUM' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                             {req.priority}
                          </span>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                             {req.status === 'APPROVED' && <CheckCircle className="w-4 h-4 text-green-500" />}
                             {req.status === 'REJECTED' && <XCircle className="w-4 h-4 text-red-500" />}
                             {req.status === 'PROPOSED' && <TrendingUp className="w-4 h-4 text-blue-500" />}
                             <span className="text-sm">{req.status}</span>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <button className="text-brand-blue hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                             Review <ArrowRight className="w-3 h-3" />
                          </button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChangeControlDashboard;
