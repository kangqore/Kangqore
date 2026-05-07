import React from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Briefcase, 
  CheckCircle,
  TrendingUp,
  ArrowRight,
  Handshake
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PARTNERS = [
  {
    id: 'PTR-1024',
    name: 'TechFlow Solutions',
    expertise: 'Full Stack Dev',
    status: 'Active',
    rating: 4.9,
    activeProjects: 3,
    earnings: '$85k/yr',
    contact: 'Alex Rivera (Lead)',
    lastActive: '5 mins ago'
  },
  {
    id: 'PTR-2055',
    name: 'Creative Minds Studio',
    expertise: 'UI/UX Design',
    status: 'Active',
    rating: 4.8,
    activeProjects: 2,
    earnings: '$62k/yr',
    contact: 'Sarah Lee (Dir)',
    lastActive: '1 hour ago'
  },
  {
    id: 'PTR-3100',
    name: 'DataStruct Inc.',
    expertise: 'Data Engineering',
    status: 'Onboarding',
    rating: '-',
    activeProjects: 0,
    earnings: '$0',
    contact: 'Mike Chen',
    lastActive: '2 days ago'
  }
];

const AdminPartners = () => {
    
  return (
    <DashboardLayout role="admin" title="Partner Management" subtitle="Overview of authorized delivery partners">
      
      {/* 1. Actions Bar */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                 <input 
                    type="text" 
                    placeholder="Search partners, skills, or IDs..." 
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
                 />
              </div>
              <button className="p-2 border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-lg hover:bg-gray-50 text-gray-600 dark:text-gray-400">
                  <Filter className="w-4 h-4" />
              </button>
          </div>
          <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-emerald-700 transition-all flex items-center gap-2">
              <Handshake className="w-4 h-4" /> Onboard New Partner
          </button>
      </div>

      {/* 2. Partner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {PARTNERS.map(partner => (
              <div key={partner.id} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-200 shadow-sm p-6 relative group hover:border-emerald-500 transition-all">
                  
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md ${
                              partner.name.startsWith('T') ? 'bg-emerald-600' : 
                              partner.name.startsWith('C') ? 'bg-purple-600' : 'bg-blue-600'
                          }`}>
                              <Users className="w-6 h-6" />
                          </div>
                          <div>
                              <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">{partner.name}</h3>
                              <p className="text-xs text-gray-500">{partner.expertise} • {partner.id}</p>
                          </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 dark:text-gray-400 p-1">
                          <MoreVertical className="w-4 h-4" />
                      </button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-50 mb-4">
                      <div>
                          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Earnings</p>
                          <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                              {partner.earnings}
                              <TrendingUp className="w-3 h-3 text-green-500" />
                          </p>
                      </div>
                      <div>
                          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Active Tasks</p>
                          <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                              {partner.activeProjects} <Briefcase className="w-3 h-3 text-gray-400" />
                          </p>
                      </div>
                  </div>

                  {/* Rating & Status */}
                  <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              partner.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                              {partner.status}
                          </span>
                          {partner.rating !== '-' && (
                              <span className="flex items-center gap-1 text-xs font-bold text-gray-700 dark:text-gray-300">
                                  <CheckCircle className="w-3 h-3 text-emerald-500" /> {partner.rating}
                              </span>
                          )}
                      </div>
                      <span className="text-[10px] text-gray-400">Active {partner.lastActive}</span>
                  </div>

                  {/* Actions */}
                  <button 
                    disabled
                    className="w-full py-2.5 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-400 font-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
                    title="Detailed view coming soon"
                  >
                      Manage Partner <ArrowRight className="w-4 h-4" />
                  </button>

              </div>
          ))}
      </div>

    </DashboardLayout>
  );
};

export default AdminPartners;
