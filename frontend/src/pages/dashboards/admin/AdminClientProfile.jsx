import React, { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  Building2, MapPin, Globe, Shield, Scale, Users, CheckCircle, Plus, Trash2, Save, 
  AlertTriangle, Gavel, GitCommit, FileCheck, TrendingUp, XCircle, Calendar, Filter, 
  Download, Briefcase, ArrowRight, ExternalLink
} from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import TrustScorecard from '../../../components/admin/TrustScorecard';
import ClientFeedbackList from '../../../components/admin/ClientFeedbackList';
import LatestFeedbackBanner from '../../../components/admin/LatestFeedbackBanner';
import ClientEngagementDashboard from '../../../components/admin/ClientEngagementDashboard';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

const AdminClientProfile = () => {
    const { clientId } = useParams();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [isAddingAuth, setIsAddingAuth] = useState(false);
    const [activeTab, setActiveTab] = useState('all'); // all, risks, decisions, changes, deliverables
    
    // Mock governance data for this client (replace with real API)
    const MOCK_CLIENT_EVENTS = {
      'user-mukesh': [
        {
          id: '1', action: 'RISK_ACCEPTED', resource: 'Risk:risk-001',
          createdAt: '2026-01-15T14:30:00Z',
          newValue: { title: 'Data Residency Compliance', status: 'ACCEPTED' }
        },
        {
          id: '2', action: 'DECISION_APPROVED', resource: 'Decision:dec-001',
          createdAt: '2026-01-20T16:15:00Z',
          newValue: { title: 'Build Multi-Region Storage', status: 'APPROVED' }
        },
        {
          id: '3', action: 'CHANGE_REQUEST_SUBMITTED', resource: 'ChangeRequest:cr-001',
          createdAt: '2026-01-25T10:00:00Z',
          newValue: { title: 'Multi-Region Failover Support' }
        },
        {
          id: '4', action: 'DELIVERABLE_ACCEPTED', resource: 'Deliverable:del-001',
          createdAt: '2026-02-05T11:00:00Z',
          newValue: { title: 'GDPR-Compliant Storage System' }
        }
      ],
      'user-ratan': [
        {
          id: '5', action: 'RISK_ACCEPTED', resource: 'Risk:risk-002',
          createdAt: '2026-01-18T09:00:00Z',
          newValue: { title: 'API Security Vulnerabilities', status: 'ACCEPTED' }
        },
        {
          id: '6', action: 'DECISION_APPROVED', resource: 'Decision:dec-002',
          createdAt: '2026-01-22T14:30:00Z',
          newValue: { title: 'Implement OAuth 2.0 + JWT', status: 'APPROVED' }
        },
        {
          id: '7', action: 'DELIVERABLE_ACCEPTED', resource: 'Deliverable:del-002',
          createdAt: '2026-02-01T10:15:00Z',
          newValue: { title: 'Secure Authentication System' }
        }
      ],
      'user-murthy': [
        {
          id: '8', action: 'RISK_ACCEPTED', resource: 'Risk:risk-003',
          createdAt: '2026-01-12T11:00:00Z',
          newValue: { title: 'Scalability Concerns for Black Friday', status: 'ACCEPTED' }
        },
        {
          id: '9', action: 'DECISION_APPROVED', resource: 'Decision:dec-003',
          createdAt: '2026-01-16T15:00:00Z',
          newValue: { title: 'Implement Auto-Scaling Infrastructure', status: 'APPROVED' }
        },
        {
          id: '10', action: 'CHANGE_REQUEST_SUBMITTED', resource: 'ChangeRequest:cr-002',
          createdAt: '2026-01-28T13:30:00Z',
          newValue: { title: 'Add CDN for Static Assets' }
        },
        {
          id: '11', action: 'DELIVERABLE_ACCEPTED', resource: 'Deliverable:del-003',
          createdAt: '2026-02-08T09:00:00Z',
          newValue: { title: 'Auto-Scaling Cloud Infrastructure' }
        }
      ]
    };

    const clientEvents = MOCK_CLIENT_EVENTS[clientId] || [];
    
    // Fetch Profile
    const { data: profile, isLoading, isError } = useQuery({
        queryKey: ['client-profile', clientId],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${BACKEND_URL}/api/client-profiles/${clientId}/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data.profile;
        },
        retry: false,
        onError: (error) => {
            console.warn('Profile API error (showing component anyway):', error);
        }
    });

    // Fetch Client User (for Projects)
    const { data: clientUser } = useQuery({
        queryKey: ['admin', 'users', clientId],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${BACKEND_URL}/api/admin/users/${clientId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data.user;
        },
        enabled: !!clientId
    });

    // Update Profile Mutation
    const updateProfile = useMutation({
        mutationFn: async (data) => {
            const token = localStorage.getItem('token');
            await axios.put(`${BACKEND_URL}/api/client-profiles/${clientId}/profile`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['client-profile', clientId]);
            setIsEditing(false);
        }
    });

    // Add Authority Role Mutation
    const addAuthority = useMutation({
        mutationFn: async (data) => {
            const token = localStorage.getItem('token');
            await axios.post(`${BACKEND_URL}/api/client-profiles/${clientId}/authority`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => queryClient.invalidateQueries(['client-profile', clientId])
    });

    // Filter events by type
    const filteredEvents = clientEvents.filter(event => {
      if (activeTab === 'all') return true;
      if (activeTab === 'risks') return event.action.includes('RISK');
      if (activeTab === 'decisions') return event.action.includes('DECISION');
      if (activeTab === 'changes') return event.action.includes('CHANGE_REQUEST');
      if (activeTab === 'deliverables') return event.action.includes('DELIVERABLE');
      return true;
    });

    const getActionIcon = (action) => {
      if (action.includes('RISK')) return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      if (action.includes('DECISION')) return <Gavel className="w-4 h-4 text-blue-500" />;
      if (action.includes('CHANGE_REQUEST')) return <TrendingUp className="w-4 h-4 text-purple-500" />;
      if (action.includes('DELIVERABLE')) return <FileCheck className="w-4 h-4 text-green-500" />;
      return <GitCommit className="w-4 h-4 text-gray-400" />;
    };

    const getActionBadgeColor = (action) => {
      if (action.includes('APPROVED') || action.includes('ACCEPTED')) return 'bg-green-50 text-green-700 border-green-200';
      if (action.includes('REJECTED')) return 'bg-red-50 text-red-700 border-red-200';
      if (action.includes('SUBMITTED') || action.includes('CREATED')) return 'bg-blue-50 text-blue-700 border-blue-200';
      if (action.includes('RISK')) return 'bg-amber-50 text-amber-700 border-amber-200';
      return 'bg-gray-50 text-gray-700 border-gray-200';
    };

    const formatAction = (action) => {
      return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    if (isLoading && !isError) return <div className="p-10 text-center">Loading Client Profile...</div>;

    return (
        <DashboardLayout role="admin" title="Client Profile & Governance" subtitle="Identity, Authority & Audit Trail">
            
            <div className="flex gap-6 mb-6">
                <Link to="/dashboard/admin/clients" className="text-sm text-gray-500 hover:text-brand-blue">
                   &larr; Back to Clients
                </Link>
            </div>

            {/* LATEST FEEDBACK BANNER */}
            <LatestFeedbackBanner clientId={clientId} />

            {/* FULL ENGAGEMENT DASHBOARD (Projects, Stats, Financials) */}
            <div className="mb-8">
                <ClientEngagementDashboard clientId={clientId} />
            </div>

            <div className="space-y-8">
                
                {/* GOVERNANCE AUDIT */}
                <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-1">
                            <GitCommit className="w-5 h-5 text-indigo-600" />
                            Governance Audit Trail
                            </h3>
                            <p className="text-sm text-gray-500">Complete history of governance events for this client</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-lg transition-colors">
                                <Filter className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-lg transition-colors">
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                  </div>

                  {/* Modern Tabs */}
                  <div className="px-6 pt-4 pb-0 bg-white dark:bg-gray-900 dark:border-gray-800 border-b border-gray-200 overflow-x-auto">
                    <div className="flex gap-6">
                        {[
                            { id: 'all', label: 'All Events', icon: GitCommit, color: 'text-gray-500', activeColor: 'text-indigo-600 border-indigo-600' },
                            { id: 'risks', label: 'Risks', icon: AlertTriangle, color: 'text-amber-500', activeColor: 'text-amber-600 border-amber-600' },
                            { id: 'decisions', label: 'Decisions', icon: Gavel, color: 'text-blue-500', activeColor: 'text-blue-600 border-blue-600' },
                            { id: 'changes', label: 'Changes', icon: TrendingUp, color: 'text-purple-500', activeColor: 'text-purple-600 border-purple-600' },
                            { id: 'deliverables', label: 'Deliverables', icon: FileCheck, color: 'text-green-500', activeColor: 'text-green-600 border-green-600' }
                        ].map(tab => {
                            const count = tab.id === 'all' 
                                ? clientEvents.length 
                                : clientEvents.filter(e => {
                                    if (tab.id === 'changes') return e.action.includes('CHANGE_REQUEST');
                                    return e.action.includes(tab.id.toUpperCase().slice(0, -1)); // simple heuristic
                                }).length;
                            
                            const isActive = activeTab === tab.id;
                            const TabIcon = tab.icon;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`pb-4 text-sm font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                                        isActive 
                                            ? tab.activeColor 
                                            : 'text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-300 hover:border-gray-200'
                                    }`}
                                >
                                    <TabIcon className={`w-4 h-4 ${isActive ? 'scale-110' : 'opacity-70'} transition-transform`} />
                                    {tab.label}
                                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-gray-100 dark:bg-[#0a0a0c] text-gray-900 dark:text-white' : 'bg-gray-50 dark:bg-[#050505] text-gray-500'}`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                  </div>

                  {/* Events List */}
                  <div className="bg-gray-50 dark:bg-[#050505]/30 min-h-[300px]">
                    {filteredEvents.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-[#050505] rounded-full flex items-center justify-center mb-4">
                            <GitCommit className="w-8 h-8 text-gray-300" />
                        </div>
                        <h4 className="text-gray-900 dark:text-white font-medium mb-1">No {activeTab !== 'all' ? activeTab : 'governance'} events found</h4>
                        <p className="text-sm text-gray-500 max-w-xs mx-auto">
                            Events will appear here as the client takes governance actions actions on the platform.
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {filteredEvents.map((event, idx) => (
                          <div 
                            key={event.id} 
                            className="group p-5 bg-white dark:bg-black hover:bg-gray-50 transition-colors flex items-start gap-4"
                          >
                            {/* Icon Column */}
                            <div className="flex-shrink-0 pt-1">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-white dark:bg-gray-900 dark:border-gray-800 group-hover:shadow-sm border border-transparent group-hover:border-gray-100 transition-all`}>
                                    {getActionIcon(event.action)}
                                </div>
                            </div>

                            {/* Content Column */}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getActionBadgeColor(event.action).replace('bg-', 'bg-opacity-40 bg-')}`}>
                                        {formatAction(event.action)}
                                    </span>
                                    <span className="text-xs text-gray-400 font-medium">
                                        #{event.id}
                                    </span>
                                </div>
                                <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 px-2 py-1 rounded-md border border-gray-100">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(event.createdAt).toLocaleString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </span>
                              </div>
                              
                              <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1 group-hover:text-brand-blue transition-colors">
                                {event.newValue?.title || event.resource}
                              </h4>
                              
                              {event.newValue?.status && (
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="text-xs text-gray-500">Status:</div>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                        event.newValue.status === 'APPROVED' || event.newValue.status === 'ACCEPTED' 
                                        ? 'bg-green-50 text-green-700' 
                                        : 'bg-gray-100 dark:bg-[#0a0a0c] text-gray-700 dark:text-gray-300'
                                    }`}>
                                        {event.newValue.status}
                                    </span>
                                </div>
                              )}
                              
                              {/* Hidden Details Link (appears on hover) */}
                              <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-4 text-xs font-medium">
                                  <button className="text-brand-blue hover:underline">View full details</button>
                                  <button className="text-gray-500 hover:text-gray-700 dark:text-gray-300">Download report</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <TrustScorecard clientId={clientId} />
                <ClientFeedbackList clientId={clientId} />
            </div>
        </DashboardLayout>
    );
};

export default AdminClientProfile;
