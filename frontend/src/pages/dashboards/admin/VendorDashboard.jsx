import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  ShieldCheck, AlertTriangle, DollarSign, Handshake, 
  ExternalLink, Calendar
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const VendorDashboard = () => {
  // Fetch Vendor Stats (KPIs and Chart)
  const { data: statsData, isLoading: loadingStats } = useQuery({
    queryKey: ['vendor-stats'],
    queryFn: async () => {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050'}/api/admin/vendors/stats`);
      return res.data;
    },
    refetchInterval: 30000
  });

  // Fetch Vendor List
  const { data: vendors, isLoading: loadingVendors } = useQuery({
    queryKey: ['vendors-list'],
    queryFn: async () => {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050'}/api/admin/vendors`);
      return res.data;
    },
    refetchInterval: 30000
  });

  // Fallback / Loading Data
  const vendorSpend = statsData?.chartData || [];
  const kpis = statsData?.stats || [
     { label: 'Annual Spend', value: '...', icon: 'DollarSign', bg: 'bg-blue-50', color: 'text-blue-600' },
     { label: 'Active Vendors', value: '...', icon: 'Handshake', bg: 'bg-emerald-50', color: 'text-emerald-600' },
     { label: 'High Risk', value: '...', icon: 'AlertTriangle', bg: 'bg-red-50', color: 'text-red-600' },
     { label: 'Renewals Due', value: '...', icon: 'Calendar', bg: 'bg-amber-50', color: 'text-amber-600' }
  ];

  const getBadges = (v) => {
      // Tier Badge
      const tierBadge = v.tier === 'Strategic' ? 'bg-purple-50 text-purple-700 border-purple-100' : 
                        v.tier === 'Tactical' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                        'bg-gray-50 text-gray-600 border-gray-200';
      
      // Risk Badge (Dot)
      const riskColor = v.risk === 'HIGH' ? 'bg-red-500' : 
                        v.risk === 'MEDIUM' ? 'bg-yellow-500' : 'bg-emerald-500';

      return { tierBadge, riskColor };
  };

  // Icon Mapping
  const getIcon = (name) => {
      switch(name) {
          case 'DollarSign': return DollarSign;
          case 'Handshake': return Handshake;
          case 'AlertTriangle': return AlertTriangle;
          case 'Calendar': return Calendar;
          default: return DollarSign;
      }
  };

  if (loadingStats && loadingVendors) {
      return (
        <DashboardLayout role="admin" title="Vendor Ecosystem">
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        </DashboardLayout>
      );
  }

  return (
    <DashboardLayout role="admin" title="Vendor Ecosystem" subtitle="Manage partnerships, spend, and supply chain risk.">
      <div className="space-y-6">
        
        {/* Vendor KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => {
             const Icon = getIcon(kpi.icon);
             return (
              <div key={idx} className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                 <div>
                    <p className="text-gray-500 text-sm">{kpi.label}</p>
                    <h3 className={`text-2xl font-bold ${kpi.label === 'High Risk' ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>{kpi.value}</h3>
                    {kpi.sub && <p className="text-xs text-gray-400">{kpi.sub}</p>}
                 </div>
                 <div className={`p-3 rounded-lg ${kpi.bg}`}>
                    <Icon className={`w-5 h-5 ${kpi.color}`} />
                 </div>
              </div>
             );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {/* Spend by Category */}
           <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Spend Distribution</h3>
              <div className="h-64 flex justify-center">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie 
                         data={vendorSpend} 
                         cx="50%" 
                         cy="50%" 
                         innerRadius={60} 
                         outerRadius={80} 
                         paddingAngle={5}
                         dataKey="value"
                       >
                          {vendorSpend.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color || '#cbd5e1'} />
                          ))}
                       </Pie>
                       <Tooltip formatter={(value) => `$${value}k`} />
                       <Legend verticalAlign="middle" align="right" />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Risk Radar / Vendor List */}
           <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                 <h3 className="font-bold text-gray-900 dark:text-white">Critical Vendor Monitor</h3>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-gray-50 dark:bg-[#050505] text-xs uppercase text-gray-500">
                          <th className="px-6 py-3 font-semibold">Vendor</th>
                          <th className="px-6 py-3 font-semibold">Tier</th>
                          <th className="px-6 py-3 font-semibold">Risk Level</th>
                          <th className="px-6 py-3 font-semibold">Renewal</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                       {(vendors || []).map((v, i) => {
                          const { tierBadge, riskColor } = getBadges(v);
                          return (
                           <tr key={i} className="hover:bg-gray-50 dark:bg-[#050505]">
                              <td className="px-6 py-3">
                                 <span className="font-medium text-gray-900 dark:text-white">{v.name}</span>
                                 <span className="block text-xs text-gray-500">{v.category}</span>
                              </td>
                              <td className="px-6 py-3">
                                 <span className={`text-xs px-2 py-1 rounded border ${tierBadge}`}>
                                    {v.tier}
                                 </span>
                              </td>
                              <td className="px-6 py-3">
                                 <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${riskColor}`} />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{v.risk}</span>
                                 </div>
                              </td>
                              <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                                 {v.renewal}
                              </td>
                           </tr>
                          );
                       })}
                       {(!vendors || vendors.length === 0) && (
                           <tr>
                               <td colSpan="4" className="px-6 py-8 text-center text-gray-500 italic">
                                   No active vendors found.
                               </td>
                           </tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default VendorDashboard;
