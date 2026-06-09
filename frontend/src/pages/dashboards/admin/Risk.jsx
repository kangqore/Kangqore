import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  AlertOctagon, HelpCircle, AlertTriangle, Link, 
  Search, Filter
} from 'lucide-react';

const Risk = () => {
  const [activeTab, setActiveTab] = useState('Risks');

  const { data: raidData, isLoading } = useQuery({
    queryKey: ['admin-raid', activeTab],
    queryFn: async () => {
      // Filter by type: Risk, Assumption, Issue, Dependency
      const type = activeTab.slice(0, -1); // "Risks" -> "Risk"
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL || ''}/api/admin/raid?type=${type}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return res.data;
    }
  });

  const items = raidData?.items || [];
  const counts = raidData?.counts || {};

  const tabs = [
    { name: 'Risks', count: counts.risks || 0, icon: AlertOctagon, color: 'text-red-500' },
    { name: 'Assumptions', count: counts.assumptions || 0, icon: HelpCircle, color: 'text-blue-500' },
    { name: 'Issues', count: counts.issues || 0, icon: AlertTriangle, color: 'text-amber-500' },
    { name: 'Dependencies', count: counts.dependencies || 0, icon: Link, color: 'text-emerald-500' },
  ];

  if (isLoading) {
       return (
           <DashboardLayout role="admin" title="Risks & Dependencies">
               <div className="flex justify-center items-center h-64">
                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
               </div>
           </DashboardLayout>
       );
  }

  return (
    <DashboardLayout role="admin" title="Risks & Dependencies" subtitle="Active tracking of impediments and external blockers">
      <div className="space-y-6">
        
        {/* Modern Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {tabs.map((tab) => {
             const isActive = activeTab === tab.name;
             return (
               <button
                 key={tab.name}
                 onClick={() => setActiveTab(tab.name)}
                 className={`relative p-5 rounded-2xl border transition-all duration-300 text-left overflow-hidden group ${
                   isActive 
                     ? 'bg-white dark:bg-gray-900 dark:border-gray-800 border-brand-blue shadow-lg ring-1 ring-brand-blue/20 transform scale-[1.02]' 
                     : 'bg-white dark:bg-gray-900 dark:border-gray-800 border-gray-100 hover:border-gray-200 hover:shadow-md'
                 }`}
               >
                 <div className={`absolute -right-4 -top-4 opacity-5 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-10 ${tab.color}`}>
                    <tab.icon className="w-24 h-24" />
                 </div>
                 
                 <div className="relative z-10">
                    <div className="flex justify-between items-start mb-3">
                       <div className={`p-2 rounded-lg ${isActive ? 'bg-brand-blue/10' : 'bg-gray-50 dark:bg-[#050505]'}`}>
                          <tab.icon className={`w-5 h-5 ${tab.color}`} />
                       </div>
                       {isActive && <div className="h-2 w-2 rounded-full bg-brand-blue animate-pulse" />}
                    </div>
                    <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tight block mb-1">{tab.count}</span>
                    <p className={`text-sm font-semibold tracking-wide ${isActive ? 'text-brand-blue' : 'text-gray-500'}`}>
                       {tab.name}
                    </p>
                 </div>
               </button>
             );
          })}
        </div>

        {/* Enhanced Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-900 dark:border-gray-800 p-2 rounded-2xl border border-gray-200 shadow-sm">
           <div className="relative w-full sm:max-w-md flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input 
                type="text" 
                placeholder={`Search ${activeTab.toLowerCase()} by title, ID, or owner...`} 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent rounded-xl text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:bg-gray-900 dark:border-gray-800 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
              />
           </div>
           <div className="flex gap-2 w-full sm:w-auto p-2">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm font-semibold shadow-sm">
                 <Filter className="w-4 h-4" /> Filter
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-brand-gradient text-white rounded-xl hover:shadow-lg transition-all text-sm font-bold active:scale-95">
                 + Add {activeTab.slice(0, -1)}
              </button>
           </div>
        </div>

        {/* Premium Content Table */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 dark:bg-gray-800 dark:border-gray-700/30">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                 <span className={`w-2 h-2 rounded-full ${tabs.find(t => t.name === activeTab).color.replace('text-', 'bg-')}`}></span>
                 Active {activeTab}
              </h3>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                 Showing {items.length} records
              </span>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-b border-gray-100 text-xs font-bold uppercase text-gray-500 tracking-wider">
                       <th className="px-6 py-4">ID & Title</th>
                       <th className="px-6 py-4">Project</th>
                       <th className="px-6 py-4 text-center">Probability</th>
                       <th className="px-6 py-4 text-center">Impact</th>
                       <th className="px-6 py-4">Owner</th>
                       <th className="px-6 py-4">Due Date</th>
                       <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {items.map((item) => (
                       <tr key={item.id} className="group hover:bg-blue-50 dark:bg-blue-900/20/30 transition-colors">
                          <td className="px-6 py-4">
                             <div className="font-bold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">{item.title}</div>
                             <span className="text-[10px] font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 px-1.5 py-0.5 rounded border border-gray-200 mt-1 inline-block">
                                {item.id.substring(0,8).toUpperCase()}
                             </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                             {item.projectTitle || <span className="text-gray-400 italic">General</span>}
                          </td>
                          <td className="px-6 py-4 text-center">
                             <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                item.probability === 'High' ? 'bg-orange-100 text-orange-700' :
                                item.probability === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-50 dark:bg-green-900/20 text-green-700'
                             }`}>
                                {item.probability || 'Low'}
                             </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                             <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                item.impact === 'Critical' ? 'bg-red-100 text-red-700 ring-1 ring-red-200' : 
                                item.impact === 'High' ? 'bg-orange-50 text-orange-700 ring-1 ring-orange-100' :
                                'bg-gray-100 dark:bg-[#0a0a0c] text-gray-600 dark:text-gray-400'
                             }`}>
                                {item.impact || item.priority || 'Normal'}
                             </span>
                          </td>
                          <td className="px-6 py-4">
                             {item.owner ? (
                                <div className="flex items-center gap-2">
                                   <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-400 border border-gray-200">
                                      {item.owner.charAt(0)}
                                   </div>
                                   <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.owner}</span>
                                </div>
                             ) : (
                                <span className="text-sm text-gray-400 italic">Unassigned</span>
                             )}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                              {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : <span className="text-gray-300">-</span>}
                          </td>
                          <td className="px-6 py-4 text-right">
                             <button className="text-xs font-bold text-brand-blue hover:text-blue-700 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                                Manage
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
              
              {items.length === 0 && ( 
                 <div className="py-16 px-6 text-center text-gray-500 bg-gray-50 dark:bg-gray-800 dark:border-gray-700/30 flex flex-col items-center justify-center border-t border-gray-100 border-dashed">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-[#0a0a0c] rounded-full flex items-center justify-center mb-4">
                       <Search className="w-8 h-8 text-gray-300" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No {activeTab.toLowerCase()} found</h4>
                    <p className="text-sm text-gray-500 max-w-xs mx-auto mb-6">
                       There are currently no active {activeTab.toLowerCase()} matches for your criteria.
                    </p>
                    <button className="px-5 py-2 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-300 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 text-sm font-semibold shadow-sm transition-all">
                       Clear Filters
                    </button>
                 </div>
              )}
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Risk;
