import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  CheckCircle,
  Clock,
  ExternalLink,
  Shield,
  Lock,
  MessageSquare,
  AlertOctagon
} from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';
import { toast } from 'sonner';

const ClientDeliverables = ({ isTabContent = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

  // 1. Fetch Deliverables
  const { data: deliverables = [], isLoading } = useQuery({
      queryKey: ['client-deliverables'],
      queryFn: async () => {
          const token = localStorage.getItem('token');
          const res = await axios.get(`${BACKEND_URL}/api/projects`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          // Flatten deliverables
          return (res.data.projects || []).flatMap(p => 
              (p.deliverables || []).map(d => ({ ...d, projectName: p.title, projectId: p.id }))
          );
      }
  });

  // 2. Fetch MY Authority (Pillar 1)
  const { data: myAuthority } = useQuery({
      queryKey: ['my-authority'],
      queryFn: async () => {
          const token = localStorage.getItem('token');
          // We need the client ID. Assuming the first project's client ID or user's client ID.
          // Better: We can decode token data or fetch /api/auth/me to get ID.
          // For now, let's try fetching the profile of the current user.
          const me = await axios.get(`${BACKEND_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
          const clientId = me.data.user.userId; // client ID
          const email = me.data.user.email;

          // Fetch authority matrix for this client
          const profileRes = await axios.get(`${BACKEND_URL}/api/client-profiles/${clientId}/profile`, {
               headers: { Authorization: `Bearer ${token}` }
          });
          
          // Find MY role
          const matrix = profileRes.data.profile.authorityMatrix || [];
          return matrix.find(r => r.email === email);
      },
      retry: false
  });

  // 3. Accept/Reject Mutation (Pillar 4)
  const updateStatus = useMutation({
      mutationFn: async ({ id, status }) => {
          const token = localStorage.getItem('token');
          await axios.post(`${BACKEND_URL}/api/deliverables/${id}/status`, { status }, {
              headers: { Authorization: `Bearer ${token}` }
          });
      },
      onSuccess: (data, variables) => {
          toast.success(`Deliverable ${variables.status === 'ACCEPTED' ? 'Approved' : 'Rejected'}`);
          queryClient.invalidateQueries(['client-deliverables']);
      },
      onError: (err) => {
          toast.error(err.response?.data?.error || "Failed to update status");
      }
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'completed': return 'bg-blue-100 text-blue-700'; // Admin marked complete
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const filteredDeliverables = deliverables.filter(d => 
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const Content = () => (
      <div className="space-y-6">

        {/* Search */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search deliverables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-brand-blue"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 border px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 uppercase tracking-wider font-bold">
             <Shield className="w-3 h-3" /> Read Only View
          </div>
        </div>

        {/* Timeline View */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[600px]">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
            </div>
          ) : filteredDeliverables.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No deliverables found</h3>
              <p className="text-gray-500">Try adjusting your search terms.</p>
            </div>
          ) : (
            <div className="relative border-l-2 border-gray-200 ml-4 md:ml-6 space-y-10 pb-8 pl-8 md:pl-10">
                {filteredDeliverables.map((item, index) => {
                    const status = item.status?.toLowerCase() || 'pending';
                    const isCompleted = status === 'approved' || status === 'completed';
                    
                    return (
                        <div key={item.id} className="relative group">
                            {/* Timeline Dot */}
                            <div className={`absolute -left-[42px] md:-left-[50px] w-5 h-5 md:w-6 md:h-6 rounded-full border-4 border-white shadow-sm z-10 ${
                                isCompleted ? 'bg-green-500 shadow-green-200' : 'bg-blue-600'
                            }`} />

                            {/* Content Card */}
                            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-xl p-5 hover:border-brand-blue transition-colors shadow-sm ml-2">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.title}</h3>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                isCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </div>
                                        
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 max-w-2xl leading-relaxed">
                                            {item.description || `Official artifact for ${item.projectName}. Validated against acceptance criteria.`}
                                        </p>
                                        
                                        <div className="flex items-center gap-6 text-xs font-medium text-gray-500">
                                            <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-400 border border-gray-200">
                                                <Clock className="w-3.5 h-3.5" /> 
                                                Expected Delivery: {new Date(item.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-gray-400">
                                                <Lock className="w-3 h-3" /> Read-only
                                            </span>
                                        </div>
                                    </div>

                                        {/* Acceptance Criteria (Expandable/Visible) */}
                                        <div className="mt-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-lg p-3 border border-gray-100">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Acceptance Criteria</p>
                                            <div className="space-y-2">
                                                {item.acceptance_criteria?.map((criteria) => (
                                                    <div key={criteria.id} className="flex items-center gap-2">
                                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                                                            criteria.status === 'met' ? 'bg-green-50 border-green-200' : 'bg-white dark:bg-gray-900 dark:border-gray-800 border-gray-300'
                                                        }`}>
                                                            {criteria.status === 'met' && <CheckCircle className="w-2.5 h-2.5 text-green-600" />}
                                                        </div>
                                                        <span className={`text-xs ${criteria.status === 'met' ? 'text-gray-700 dark:text-gray-300 font-medium' : 'text-gray-400'}`}>
                                                            {criteria.label}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>


                                    {/* Action & Approval Power */}
                                    <div className="flex-shrink-0 self-start md:self-center flex flex-col gap-3 min-w-[160px]">
                                        <a 
                                            href={item.url || '#'} 
                                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-lg border border-gray-200 hover:bg-gray-50 hover:text-brand-blue transition-all"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            View Artifact
                                        </a>

                                        {/* Client Approval Controls - Pillar 4 & 1 Linked */}
                                        {!isCompleted ? (
                                            <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-right-4">
                                                {/* Authority Check */}
                                                {!myAuthority?.canApproveGoLive ? (
                                                    <div className="bg-orange-50 border border-orange-200 p-2 rounded-lg text-center">
                                                        <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                                                            <Lock className="w-3 h-3" />
                                                            <span className="text-[10px] font-bold uppercase">Restricted</span>
                                                        </div>
                                                        <p className="text-[10px] text-orange-800 leading-tight">
                                                            You lack <strong>Go-Live Authority</strong>.<br/>
                                                            Contact: <strong>{myAuthority?.roleName || 'Admin'}</strong>
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={() => updateStatus.mutate({ id: item.id, status: 'ACCEPTED' })}
                                                            disabled={updateStatus.isPending}
                                                            className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-bold py-2 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1"
                                                        >
                                                            {updateStatus.isPending ? 'Signing...' : <><CheckCircle className="w-3 h-3" /> Approve</>}
                                                        </button>
                                                        <button 
                                                            onClick={() => updateStatus.mutate({ id: item.id, status: 'REJECTED' })}
                                                            disabled={updateStatus.isPending}
                                                            className="flex-1 bg-white dark:bg-gray-900 dark:border-gray-800 hover:bg-red-50 disabled:opacity-50 text-red-600 border border-red-200 text-xs font-bold py-2 rounded-lg transition-colors"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                                
                                                <button className="w-full bg-white dark:bg-gray-900 dark:border-gray-800 hover:bg-gray-50 text-gray-500 border border-gray-200 text-xs font-medium py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1">
                                                    <MessageSquare className="w-3 h-3" /> Request Changes
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 rounded-lg p-2 text-center">
                                                <p className="text-[10px] font-bold text-green-700 uppercase tracking-wider flex items-center justify-center gap-1">
                                                    <CheckCircle className="w-3 h-3" /> 
                                                    {item.approvedByRole ? `Approved as ${item.approvedByRole}` : 'Approved by You'}
                                                </p>
                                                <p className="text-xs text-green-600/80 mt-0.5">
                                                    {item.approvedAt ? new Date(item.approvedAt).toLocaleDateString() : new Date().toLocaleDateString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
          )}
        </div>
      </div>
  );

  if (isTabContent) return <Content />;

  return (
    <DashboardLayout role="client" title="Deliverables" subtitle="Track project artifacts and delivery timeline">
      <Content />
    </DashboardLayout>
  );
};

export default ClientDeliverables;
