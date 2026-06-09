import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  Lightbulb, Box, GitBranch, Star, 
  ArrowUpRight, Download, Share2, Loader2 
} from 'lucide-react';

const IPDashboard = () => {
  const [filterType, setFilterType] = useState('All');

  const { data: assetsData, isLoading } = useQuery({
    queryKey: ['admin-ip', filterType],
    queryFn: async () => {
      const typeParam = filterType !== 'All' ? `?type=${filterType.toUpperCase()}` : '';
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL || ''}/api/admin/ip${typeParam}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return res.data;
    }
  });

  const assets = assetsData?.assets || [];

  return (
    <DashboardLayout role="admin" title="IP & Accelerators" subtitle="Asset monetization engine.">
      <div className="space-y-6">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-xl p-8 text-white flex justify-between items-center shadow-lg">
          <div>
             <h2 className="text-2xl font-bold mb-2">Intellectual Property Catalog</h2>
             <p className="opacity-80 max-w-xl">Leverage internal assets to accelerate delivery and increase margins. View usage stats and monetization impact.</p>
          </div>
          <div className="hidden md:block p-4 bg-white dark:bg-gray-900 dark:border-gray-800/10 rounded-lg backdrop-blur-sm border border-white/20">
             <div className="text-center">
               <p className="text-xs uppercase tracking-wider opacity-70">Reusable Assets</p>
               <h3 className="text-3xl font-bold">53</h3>
             </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
           {['All', 'AI Model', 'Framework', 'Component', 'Template', 'Dataset'].map((type) => (
             <button
               key={type}
               onClick={() => setFilterType(type)}
               className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                 filterType === type 
                   ? 'bg-gray-900 text-white' 
                   : 'bg-white dark:bg-black text-gray-600 dark:text-gray-400 hover:bg-gray-50'
               }`}
             >
               {type === 'All' ? 'All Assets' : type + 's'}
             </button>
           ))}
        </div>

        {/* Asset Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && (
            <div className="col-span-full py-12 flex justify-center text-blue-500">
               <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          )}
          
          {!isLoading && assets.length === 0 && (
             <div className="col-span-full py-12 text-center text-gray-500 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl border border-dashed border-gray-200">
               <p>No IP assets found in catalog.</p>
             </div>
          )}

          {assets.map((asset) => (
            <div key={asset.id} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-lg ${
                    asset.type === 'AI_MODEL' ? 'bg-purple-50 text-purple-600' :
                    asset.type === 'PLATFORM' ? 'bg-blue-50 text-blue-600' :
                    'bg-gray-50 dark:bg-[#050505] text-gray-600 dark:text-gray-400'
                  }`}>
                    {asset.type === 'AI_MODEL' ? <Star className="w-6 h-6" /> : <Box className="w-6 h-6" />}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="p-1.5 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded text-gray-400"><Share2 className="w-4 h-4" /></button>
                     <button className="p-1.5 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded text-gray-400"><Download className="w-4 h-4" /></button>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{asset.title}</h3>
                <p className="text-xs text-gray-500 flex items-center gap-2 mb-4">
                  <GitBranch className="w-3 h-3" /> {asset.version}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 h-10">{asset.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                   <div>
                     <p className="text-[10px] text-gray-400 uppercase tracking-wider">Downloads</p>
                     <p className="font-semibold text-gray-900 dark:text-white">{asset.downloads}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-[10px] text-gray-400 uppercase tracking-wider">Status</p>
                     <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        asset.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 dark:bg-[#0a0a0c] text-gray-600 dark:text-gray-400'
                     }`}>
                        {asset.status}
                     </span>
                   </div>
                </div>
              </div>
            </div>
          ))}

          {/* New Asset Card */}
          <button className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors min-h-[200px]">
            <div className="p-3 bg-gray-50 dark:bg-[#050505] rounded-full mb-3 group-hover:bg-blue-50">
              <Lightbulb className="w-6 h-6" />
            </div>
            <span className="font-medium text-sm">Register New IP Asset</span>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IPDashboard;
