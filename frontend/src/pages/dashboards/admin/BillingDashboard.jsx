import React, { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  Receipt, DollarSign, Clock, AlertCircle, 
  Download, Send 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line 
} from 'recharts';

const BillingDashboard = () => {
  const [invoices] = useState([
    { id: 'INV-2024-001', client: 'Acme Corp', amount: '$45,000', date: '2024-02-01', status: 'Sent', due: '2024-02-15' },
    { id: 'INV-2024-002', client: 'Globex Inc', amount: '$12,500', date: '2024-01-28', status: 'Paid', due: '2024-02-11' },
    { id: 'INV-2024-003', client: 'Soylent', amount: '$8,200', date: '2024-01-15', status: 'Overdue', due: '2024-01-29' },
    { id: 'INV-2024-004', client: 'Stark Ind', amount: '$150,000', date: '2024-02-02', status: 'Draft', due: '2024-02-16' },
  ]);

  const cashFlowData = [
    { month: 'Oct', revenue: 120, collected: 110 },
    { month: 'Nov', revenue: 140, collected: 130 },
    { month: 'Dec', revenue: 160, collected: 155 },
    { month: 'Jan', revenue: 150, collected: 140 },
    { month: 'Feb', revenue: 180, collected: 90 }, // Current month lag
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Paid': return 'bg-green-100 text-green-700';
      case 'Overdue': return 'bg-red-100 text-red-700';
      case 'Sent': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <DashboardLayout role="admin" title="Billing & Invoices" subtitle="Revenue realization & cash flow control.">
      <div className="space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Amount Outstanding</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">$245k</h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg"><Clock className="w-6 h-6" /></div>
          </div>
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
             <div>
              <p className="text-gray-500 text-sm">Overdue > 30 Days</p>
              <h3 className="text-2xl font-bold text-red-600">$8.2k</h3>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg"><AlertCircle className="w-6 h-6" /></div>
          </div>
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
             <div>
              <p className="text-gray-500 text-sm">Collected (This Mo)</p>
              <h3 className="text-2xl font-bold text-green-600">$90k</h3>
            </div>
             <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg"><DollarSign className="w-6 h-6" /></div>
          </div>
           <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
             <div>
              <p className="text-gray-500 text-sm">DSO (Days Outstanding)</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">42 Days</h3>
            </div>
             <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg"><Receipt className="w-6 h-6" /></div>
          </div>
        </div>

        {/* Chart & Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-6">Cash Flow: Invoiced vs Collected</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#e5e7eb" name="Invoiced" radius={[4,4,0,0]} />
                  <Bar dataKey="collected" fill="#10b981" name="Collected" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
           </div>
           
           <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 flex flex-col">
             <div className="p-6 border-b border-gray-100">
               <h3 className="font-semibold text-gray-900 dark:text-white">Recent Invoices</h3>
             </div>
             <div className="flex-1 overflow-auto p-2">
               {invoices.map((inv) => (
                 <div key={inv.id} className="p-3 hover:bg-gray-50 rounded-lg mb-2 border border-gray-100 flex justify-between items-center bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm">
                   <div>
                     <div className="flex items-center gap-2">
                       <span className="text-sm font-bold text-gray-900 dark:text-white">{inv.amount}</span>
                       <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${getStatusBadge(inv.status)}`}>{inv.status}</span>
                     </div>
                     <p className="text-xs text-gray-500 mt-0.5">{inv.client} • {inv.id}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-xs text-gray-400">Due {inv.due}</p>
                   </div>
                 </div>
               ))}
             </div>
              <div className="p-4 border-t border-gray-100">
               <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
                 <Send className="w-4 h-4" /> Generate Invoice
               </button>
             </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BillingDashboard;
