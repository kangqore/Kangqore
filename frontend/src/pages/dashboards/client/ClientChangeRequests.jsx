import React, { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  GitPullRequest, Plus, Search, Filter, Clock, 
  CheckCircle, XCircle, AlertTriangle, FileText, ArrowRight,
  DollarSign, Calendar, ChevronRight, BarChart3, Wallet, Mail, MessageSquare, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import CreateChangeRequestModal from '../../../components/modals/CreateChangeRequestModal';
import TabNavigation from '../../../components/ui/TabNavigation';
import SmartProgressBar from '../../../components/ui/SmartProgressBar';

const ClientChangeRequests = ({ isTabContent = false }) => {
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 1. API Helpers
  const fetchChangeRequests = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/change-requests`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return res.data.changeRequests;
  };

  const createChangeRequest = async (data) => {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/change-requests`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return res.data;
  };

  const updateChangeRequestStatus = async ({ id, status }) => {
    const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/change-requests/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return res.data;
  };

  const fetchProjects = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/projects`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return res.data.projects;
  };

  // 2. Data Fetching
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['change-requests'],
    queryFn: fetchChangeRequests
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects
  });

  // 3. Mutations
  const createMutation = useMutation({
    mutationFn: createChangeRequest,
    onSuccess: () => {
      queryClient.invalidateQueries(['change-requests']);
      setIsModalOpen(false);
      setIsSubmitting(false);
    },
    onError: (error) => {
      console.error("Error creating request:", error);
      setIsSubmitting(false);
      alert("Failed to create request. Please try again.");
    }
  });

  const statusMutation = useMutation({
    mutationFn: updateChangeRequestStatus,
    onMutate: async ({ id, status }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['change-requests'] });

      // Snapshot the previous value
      const previousRequests = queryClient.getQueryData(['change-requests']);

      // Optimistically update to the new value
      queryClient.setQueryData(['change-requests'], (old) => 
        old.map(req => req.id === id ? { ...req, status } : req)
      );

      // Return a context object with the snapshotted value
      return { previousRequests };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(['change-requests'], context.previousRequests);
      console.error("Error updating status:", err);
      // alert("Failed to update status. Rolled back changes.");
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we're in sync with the server
      queryClient.invalidateQueries({ queryKey: ['change-requests'] });
    },
  });

  const getStatusInfo = (status) => {
    switch (status) {
      case 'APPROVED': return { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle className="w-3.5 h-3.5" /> };
      case 'REJECTED': return { color: 'bg-red-50 text-red-700 border-red-200', icon: <XCircle className="w-3.5 h-3.5" /> };
      case 'REVIEW': return { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: <Clock className="w-3.5 h-3.5" />, label: 'Under Review' };
      case 'ACTION_REQUIRED': return { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Zap className="w-3.5 h-3.5 fill-current" />, label: 'Action Required' };
      default: return { color: 'bg-gray-50 text-gray-600 border-gray-200', icon: <FileText className="w-3.5 h-3.5" />, label: 'Draft' };
    }
  };

  // 4. Handlers
  const handleCreateSubmit = async (formData) => {
      setIsSubmitting(true);
      createMutation.mutate({
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          // Use requests[0].projectId if available, otherwise default to the first available project or 'proj_01'
          projectId: (requests && requests.length > 0 && requests[0].projectId) 
            ? requests[0].projectId 
            : (projects && projects.length > 0 ? projects[0].id : 'proj_01'),
          // In a real app, projectId should come from context or selection
          decisionType: formData.type === 'Strategic' ? 'Strategic' : 'Operational',
          costImpact: null, // Initial request usually doesn't have cost confirmed
          timeImpact: null,
          category: formData.type,
          // Ensure clientId is present if creating as Admin/Test
          clientId: requests[0]?.clientId || (projects[0]?.clientId) || 'cli_123'
      });
  };

  const handleApprove = (id) => {
    statusMutation.mutate({ id, status: 'APPROVED' });
  };

  const handleReject = (id) => {
    statusMutation.mutate({ id, status: 'REJECTED' });
  };

  // 5. Stats Calculation
  const stats = {
      total: requests.length,
      pending: requests.filter(r => r.status === 'REVIEW' || r.status === 'PROPOSED').length,
      actionRequired: requests.filter(r => r.status === 'ACTION_REQUIRED').length, // Backend likely needs to set this based on role
      approved: requests.filter(r => r.status === 'APPROVED').length,
      totalCost: requests
          .filter(r => r.status === 'APPROVED')
          .reduce((acc, curr) => acc + (Number(curr.costImpact) || 0), 0)
  };

  const content = (
      <div className="max-w-6xl mx-auto space-y-8">
        <SmartProgressBar isProcessing={isSubmitting} label="Generating Proposal..." />
        
        {/* 1. Stats Overview Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400">
                    <GitPullRequest className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Requests</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-xl border border-amber-100 shadow-sm flex items-center gap-4 bg-gradient-to-br from-amber-50/50 to-white hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-100 rounded-bl-full -mr-8 -mt-8 opacity-50"></div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 z-10">
                    <Zap className="w-6 h-6 fill-current" />
                </div>
                <div className="z-10">
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Action Needed</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.actionRequired}</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                    <Clock className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">In Review</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 bg-gradient-to-br from-white to-gray-50 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <DollarSign className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Approved Budget</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">${stats.totalCost.toLocaleString()}</p>
                </div>
            </div>
        </div>

        {/* 2. Controls & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Modern Glassmorphic Filter Tabs */}
            <div className="flex-1 overflow-x-auto scrollbar-hide">
                <TabNavigation 
                    activeTab={filter.toLowerCase()}
                    onChange={(id) => setFilter(id.toUpperCase())}
                    layoutId="change-request-tabs"
                    tabs={[
                        { id: 'all', label: 'All' },
                        { 
                            id: 'action_required', 
                            label: 'Action Required', 
                            activeColor: 'bg-amber-100 border border-amber-200',
                            activeTextColor: 'text-amber-700'
                        },
                        { 
                            id: 'review', 
                            label: 'Under Review', 
                            activeColor: 'bg-blue-100 border border-blue-200',
                            activeTextColor: 'text-blue-700'
                        },
                        { 
                            id: 'approved', 
                            label: 'Approved', 
                            activeColor: 'bg-emerald-100 border border-emerald-200',
                            activeTextColor: 'text-emerald-700'
                        },
                        { 
                            id: 'rejected', 
                            label: 'Rejected', 
                            activeColor: 'bg-red-100 border border-red-200',
                            activeTextColor: 'text-red-700'
                        }
                    ]}
                />
            </div>

            <button 
                onClick={() => setIsModalOpen(true)}
                className="relative overflow-hidden flex items-center gap-2 bg-brand-gradient text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 group border border-white/20"
            >
               <span className="absolute inset-0 bg-white dark:bg-black/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
               <Plus className="w-5 h-5 relative z-10 group-hover:rotate-90 transition-transform duration-300" /> 
               <span className="relative z-10 text-sm tracking-wide">New Change Request</span>
            </button>
        </div>

        {/* 3. Requests Grid */}
        <div className="grid gap-6">
            {requests.filter(r => filter === 'all' || r.status === filter).map(req => {
                const statusInfo = getStatusInfo(req.status);
                
                // Dynamic Styles based on status for the "3D" pop
                const getCardStyles = (status) => {
                    switch(status) {
                        case 'ACTION_REQUIRED': return 'border-l-4 border-l-amber-500 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 hover:border-amber-500';
                        case 'APPROVED': return 'border-l-4 border-l-emerald-500 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:border-emerald-500';
                        case 'REJECTED': return 'border-l-4 border-l-red-500 shadow-lg shadow-red-500/10 hover:shadow-red-500/20 hover:border-red-500';
                        default: return 'border-l-4 border-l-blue-500 shadow-lg hover:border-blue-500';
                    }
                };

                const cardStyle = getCardStyles(req.status);

                return (
                <div key={req.id} className={`bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl border border-gray-100 transition-all duration-300 ease-out transform hover:-translate-y-1 ${cardStyle} overflow-hidden group flex flex-col md:flex-row`}>
                    
                    {/* Left: Main Content */}
                    <div className="flex-1 p-8 flex flex-col relative">
                        {/* Background Deco */}
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            {statusInfo.icon}
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <span className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${statusInfo.color} shadow-sm`}>
                                    {statusInfo.icon} {statusInfo.label || req.status}
                                </span>
                                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-[10px] font-bold text-gray-400 border border-gray-100 uppercase tracking-widest">
                                    {req.category}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium bg-gray-50 dark:bg-[#050505] px-3 py-1 rounded-full">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(req.createdAt).toLocaleDateString()}
                            </div>
                        </div>

                        <div className="mb-6 z-10">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-700 group-hover:to-indigo-600 transition-all leading-tight">
                                {req.title}
                            </h3>
                            <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-2xl font-medium">
                                {req.description}
                            </p>
                            
                            {req.adminNote && (
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100 p-5 rounded-xl flex gap-4 shadow-sm relative overflow-hidden">
                                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400 rounded-l-xl"></div>
                                    <div className="p-2 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm h-fit">
                                        <MessageSquare className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-xs font-bold block mb-1 text-blue-900 uppercase tracking-wide">Admin Analysis</span>
                                        <p className="text-sm text-blue-800 leading-relaxed">{req.adminNote}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-100/50">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-400 shadow-inner">
                                    {(req.requestedBy || 'M').charAt(0)}
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Requested By</p>
                                    <p className="text-xs font-bold text-gray-900 dark:text-white">{req.requestedBy || 'Mukesh Ambani'}</p>
                                </div>
                            </div>
                            <div className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-300 shadow-sm">
                                <span className="font-mono text-[11px] font-black text-blue-700 group-hover:text-white transition-colors">
                                    #{req.id}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Impact Analysis Panel & Actions */}
                    <div className="w-full md:w-80 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-l border-gray-200 p-8 flex flex-col relative">
                        {/* 3D Depth Top Highlight */}
                        <div className="absolute top-0 left-0 w-full h-px bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm"></div>

                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-gray-300" /> Impact Analysis
                        </h4>

                        <div className="space-y-4 mb-auto">
                            {/* Cost */}
                            <div className="group/metric p-4 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 relative overflow-hidden">
                                <div className="absolute right-0 top-0 p-3 opacity-0 group-hover/metric:opacity-10 transition-opacity transform translate-x-2 -translate-y-2">
                                    <DollarSign className="w-12 h-12 text-emerald-600" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Budget Impact</span>
                                <div className="flex items-center gap-2">
                                     <div className={`w-2 h-2 rounded-full ${req.costImpact ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                                     <span className={`text-lg font-black ${req.costImpact ? 'text-gray-900 dark:text-white' : 'text-gray-400 italic'}`}>
                                        {req.costImpact ? `$${req.costImpact.toLocaleString()}` : 'Pending'}
                                     </span>
                                </div>
                            </div>

                            {/* Time */}
                            <div className="group/metric p-4 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 relative overflow-hidden">
                                <div className="absolute right-0 top-0 p-3 opacity-0 group-hover/metric:opacity-10 transition-opacity transform translate-x-2 -translate-y-2">
                                    <Clock className="w-12 h-12 text-blue-600" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Timeline Impact</span>
                                <div className="flex items-center gap-2">
                                     <div className={`w-2 h-2 rounded-full ${req.timeImpact ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                     <span className={`text-lg font-black ${req.timeImpact ? 'text-gray-900 dark:text-white' : 'text-gray-400 italic'}`}>
                                        {req.timeImpact ? `+${req.timeImpact}` : 'Pending'}
                                     </span>
                                </div>
                            </div>
                        
                            {/* Rejection Warning */}
                            {req.rejectionImpact && (
                                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 rounded-xl shadow-inner">
                                    <div className="flex gap-3">
                                        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                        <div>
                                            <p className="text-[10px] font-bold text-red-800 uppercase mb-1">Risk of Rejection</p>
                                            <p className="text-xs text-red-700 leading-snug">{req.rejectionImpact}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                         {/* Dynamic Action Buttons */}
                         <div className="mt-6 pt-6 border-t border-gray-200">
                            {req.status === 'ACTION_REQUIRED' ? (
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => handleApprove(req.id)}
                                        className="relative w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 overflow-hidden group/btn"
                                    >
                                        <div className="absolute inset-0 bg-white dark:bg-black/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                                        <CheckCircle className="w-4 h-4 relative z-10" /> 
                                        <span className="relative z-10">Accept & Proceed</span>
                                    </button>
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => handleReject(req.id)}
                                            className="flex-1 py-3 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
                                        >
                                            Reject
                                        </button>
                                        <button 
                                            onClick={() => alert('Opening mail client...')}
                                            className="flex-1 py-3 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center gap-2"
                                        >
                                            <Mail className="w-3.5 h-3.5" /> Discuss
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button className="w-full py-3 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 text-gray-600 dark:text-gray-400 text-xs font-bold rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center justify-center gap-2 group/btn shadow-sm">
                                    View Full Analysis <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                                </button>
                            )}
                         </div>

                    </div>
                </div>
                )
            })}
        </div>
        
        {/* Create Request Modal */}
        <CreateChangeRequestModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCreateSubmit}
            isLoading={isSubmitting}
        />

      </div>
  );

  if (isTabContent) return content;

  return (
    <DashboardLayout role="client" title="Change Requests" subtitle="Manage scope, budget impact, and strategic pivots">
      {content}
    </DashboardLayout>
  );
};

export default ClientChangeRequests;
