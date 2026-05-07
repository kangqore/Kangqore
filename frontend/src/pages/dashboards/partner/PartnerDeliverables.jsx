import React, { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  Package, 
  Upload, 
  CheckCircle, 
  Clock, 
  XCircle, 
  FileText, 
  ExternalLink,
  MessageSquare,
  Filter
} from 'lucide-react';
import { usePartnerDashboard } from '../../../hooks/useDashboardData';

const DELIVERABLES = [
  {
    id: 'DEL-001',
    title: 'Mobile App - MVP Build (v1.0)',
    project: 'E-Commerce Mobile App',
    dueDate: '2026-02-15',
    submittedDate: null,
    status: 'Pending', // Pending, Submitted, Approved, Rejected
    description: 'Final build .ipa and .apk files ready for TestFlight/Beta distribution.',
    files: []
  },
  {
    id: 'DEL-002',
    title: 'API Documentation (Swagger)',
    project: 'FinTech Platform Modernization',
    dueDate: '2026-01-20',
    submittedDate: '2026-01-19',
    status: 'Approved',
    description: 'Complete OpenAPI 3.0 spec for the User Service module.',
    files: ['openapi-swgger.json', 'redoc-static.html'],
    feedback: 'Excellent detail on the error schemas. Approved.'
  },
  {
    id: 'DEL-003',
    title: 'Landing Page High-Fidelity Mocks',
    project: 'FinTech Platform Modernization',
    dueDate: '2026-01-10',
    submittedDate: '2026-01-09',
    status: 'Rejected',
    description: 'Figma prototypes for the new marketing funnel.',
    files: ['figma-export.pdf'],
    feedback: 'Brand colors do not match the new guidelines. Please revise.'
  }
];

const PartnerDeliverables = () => {
  const [filter, setFilter] = useState('All');

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'Submitted': return 'bg-blue-100 text-blue-700 border-blue-200 animate-pulse';
      case 'Pending': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Approved': return <CheckCircle className="w-5 h-5" />;
      case 'Rejected': return <XCircle className="w-5 h-5" />;
      case 'Submitted': return <Clock className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  return (
    <DashboardLayout role="partner" title="Deliverables" subtitle="Manage your official submissions and quality gates">
      
      {/* Overview Cards (Optional - can skip for MVP) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
               <div>
                   <p className="text-xs font-bold text-gray-400 uppercase">Approval Rate</p>
                   <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">94%</h3>
               </div>
               <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center text-green-600">
                   <CheckCircle className="w-5 h-5" />
               </div>
           </div>
           {/* ... maybe more stats ... */}
      </div>

      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
           {/* Toolbar */}
           <div className="p-4 border-b border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div>
                   <h3 className="font-bold text-gray-900 dark:text-white">Submission History</h3>
               </div>
               <div className="flex gap-2 text-sm overflow-x-auto">
                   {['All', 'Pending', 'Submitted', 'Approved', 'Rejected'].map(s => (
                       <button
                           key={s}
                           onClick={() => setFilter(s)}
                           className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                               filter === s ? 'bg-white dark:bg-gray-900 dark:border-gray-800 shadow text-brand-blue' : 'text-gray-500 hover:text-gray-700 dark:text-gray-300'
                           }`}
                       >
                           {s}
                       </button>
                   ))}
               </div>
           </div>

           {/* List */}
           <div className="divide-y divide-gray-50">
               {DELIVERABLES.filter(d => filter === 'All' || d.status === filter).map(item => (
                   <div key={item.id} className="p-6 hover:bg-gray-50 dark:bg-[#050505] transition-colors group">
                       <div className="flex flex-col md:flex-row gap-6">
                           
                           {/* Icon/Status Column */}
                           <div className="flex-shrink-0">
                               <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${
                                   item.status === 'Approved' ? 'bg-green-50 border-green-100 text-green-600' :
                                   item.status === 'Rejected' ? 'bg-red-50 border-red-100 text-red-600' :
                                   item.status === 'Submitted' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                                   'bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-gray-100 text-gray-400'
                               }`}>
                                   {getStatusIcon(item.status)}
                               </div>
                           </div>

                           {/* Content Column */}
                           <div className="flex-1 min-w-0">
                               <div className="flex flex-wrap items-center gap-3 mb-1">
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">{item.title}</h4>
                                    <span className={`px-2 py-0.5 border rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5 ${getStatusBadge(item.status)}`}>
                                        {item.status.toUpperCase()}
                                    </span>
                               </div>
                               <p className="text-sm font-medium text-brand-blue mb-2">{item.project}</p>
                               <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{item.description}</p>
                               
                               {/* Files Row */}
                               {item.files.length > 0 ? (
                                   <div className="flex flex-wrap gap-2">
                                       {item.files.map((file, i) => (
                                           <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300">
                                               <FileText className="w-3.5 h-3.5 text-gray-400" />
                                               {file}
                                               <ExternalLink className="w-3 h-3 text-gray-300" />
                                           </div>
                                       ))}
                                   </div>
                               ) : item.status === 'Pending' ? (
                                   // Upload Area for Pending
                                   <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-brand-blue hover:bg-blue-50 dark:bg-blue-900/20/30 transition-all cursor-pointer group/upload">
                                       <Upload className="w-8 h-8 mx-auto text-gray-300 group-hover/upload:text-brand-blue mb-2 transition-colors" />
                                       <p className="text-sm font-bold text-gray-900 dark:text-white">Drag & drop files here</p>
                                       <p className="text-xs text-gray-500">or click to browse</p>
                                   </div>
                               ) : null}

                               {/* Feedback Box (if Rejected/Approved with comment) */}
                               {item.feedback && (
                                   <div className={`mt-4 p-4 rounded-xl border flex gap-3 ${
                                       item.status === 'Rejected' ? 'bg-red-50 dark:bg-red-900/20 border-red-100' : 'bg-green-50 dark:bg-green-900/20 border-green-100'
                                   }`}>
                                       <MessageSquare className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                                           item.status === 'Rejected' ? 'text-red-700' : 'text-green-700'
                                       }`} />
                                       <div>
                                           <p className={`text-xs font-bold mb-1 ${
                                               item.status === 'Rejected' ? 'text-red-800' : 'text-green-800'
                                           }`}>Reviewer Feedback:</p>
                                           <p className={`text-sm ${
                                               item.status === 'Rejected' ? 'text-red-700' : 'text-green-700'
                                           }`}>"{item.feedback}"</p>
                                       </div>
                                   </div>
                               )}
                           </div>

                           {/* Metadata Column */}
                           <div className="w-full md:w-48 flex flex-col gap-2 text-right md:border-l md:border-gray-50 md:pl-6">
                               <div>
                                   <p className="text-[10px] text-gray-400 uppercase font-bold">Due Date</p>
                                   <p className={`text-sm font-bold ${
                                       item.status === 'Pending' && new Date(item.dueDate) < new Date() ? 'text-red-600' : 'text-gray-900 dark:text-white'
                                   }`}>{item.dueDate}</p>
                               </div>
                               {item.submittedDate && (
                                   <div>
                                       <p className="text-[10px] text-gray-400 uppercase font-bold">Submitted On</p>
                                       <p className="text-sm text-gray-600 dark:text-gray-400">{item.submittedDate}</p>
                                   </div>
                               )}
                           </div>

                       </div>
                   </div>
               ))}
           </div>
      </div>
    </DashboardLayout>
  );
};

export default PartnerDeliverables;
