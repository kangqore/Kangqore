import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  User, Search, Download, AlertTriangle, Gavel, GitCommit, CheckCircle, FileCheck, TrendingUp, XCircle, Building2, Folder, Box, Filter, ExternalLink, Eye
} from 'lucide-react';
import { useAdminAuditLogs } from '../../../hooks/useDashboardData';

const AdminAuditLogs = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');

  // Mock data for demonstration
  const MOCK_AUDIT_LOGS = [
    // Reliance Industries (Mukesh Ambani)
    {
      id: '1',
      userId: 'user-mukesh',
      action: 'RISK_ACCEPTED',
      resource: 'Risk:risk-001',
      createdAt: '2026-01-15T14:30:00Z',
      user: { name: 'Mukesh Ambani', email: 'mukesh@reliance.com', role: 'CLIENT', company: 'Reliance Industries' },
      newValue: { title: 'Data Residency Compliance', status: 'ACCEPTED' }
    },
    {
      id: '2',
      userId: 'user-mukesh',
      action: 'DECISION_APPROVED',
      resource: 'Decision:dec-001',
      createdAt: '2026-01-20T16:15:00Z',
      user: { name: 'Mukesh Ambani', email: 'mukesh@reliance.com', role: 'CLIENT', company: 'Reliance Industries' },
      newValue: { title: 'Build Multi-Region Storage', status: 'APPROVED' }
    },
    {
      id: '3',
      userId: 'user-mukesh',
      action: 'CHANGE_REQUEST_SUBMITTED',
      resource: 'ChangeRequest:cr-001',
      createdAt: '2026-01-25T10:00:00Z',
      user: { name: 'Mukesh Ambani', email: 'mukesh@reliance.com', role: 'CLIENT', company: 'Reliance Industries' },
      newValue: { title: 'Multi-Region Failover Support' }
    },
    {
      id: '4',
      userId: 'user-mukesh',
      action: 'DELIVERABLE_ACCEPTED',
      resource: 'Deliverable:del-001',
      createdAt: '2026-02-05T11:00:00Z',
      user: { name: 'Mukesh Ambani', email: 'mukesh@reliance.com', role: 'CLIENT', company: 'Reliance Industries' },
      newValue: { title: 'GDPR-Compliant Storage System' }
    },

    // Tata Consultancy Services (Ratan Tata)
    {
      id: '5',
      userId: 'user-ratan',
      action: 'RISK_ACCEPTED',
      resource: 'Risk:risk-002',
      createdAt: '2026-01-18T09:00:00Z',
      user: { name: 'Ratan Tata', email: 'ratan@tata.com', role: 'CLIENT', company: 'Tata Consultancy Services' },
      newValue: { title: 'API Security Vulnerabilities', status: 'ACCEPTED' }
    },
    {
      id: '6',
      userId: 'user-ratan',
      action: 'DECISION_APPROVED',
      resource: 'Decision:dec-002',
      createdAt: '2026-01-22T14:30:00Z',
      user: { name: 'Ratan Tata', email: 'ratan@tata.com', role: 'CLIENT', company: 'Tata Consultancy Services' },
      newValue: { title: 'Implement OAuth 2.0 + JWT', status: 'APPROVED' }
    },
    {
      id: '7',
      userId: 'user-ratan',
      action: 'DELIVERABLE_ACCEPTED',
      resource: 'Deliverable:del-002',
      createdAt: '2026-02-01T10:15:00Z',
      user: { name: 'Ratan Tata', email: 'ratan@tata.com', role: 'CLIENT', company: 'Tata Consultancy Services' },
      newValue: { title: 'Secure Authentication System' }
    },

    // Infosys (Narayan Murthy)
    {
      id: '8',
      userId: 'user-murthy',
      action: 'RISK_ACCEPTED',
      resource: 'Risk:risk-003',
      createdAt: '2026-01-12T11:00:00Z',
      user: { name: 'Narayan Murthy', email: 'murthy@infosys.com', role: 'CLIENT', company: 'Infosys Limited' },
      newValue: { title: 'Scalability Concerns for Black Friday', status: 'ACCEPTED' }
    },
    {
      id: '9',
      userId: 'user-murthy',
      action: 'DECISION_APPROVED',
      resource: 'Decision:dec-003',
      createdAt: '2026-01-16T15:00:00Z',
      user: { name: 'Narayan Murthy', email: 'murthy@infosys.com', role: 'CLIENT', company: 'Infosys Limited' },
      newValue: { title: 'Implement Auto-Scaling Infrastructure', status: 'APPROVED' }
    },
    {
      id: '10',
      userId: 'user-murthy',
      action: 'CHANGE_REQUEST_SUBMITTED',
      resource: 'ChangeRequest:cr-002',
      createdAt: '2026-01-28T13:30:00Z',
      user: { name: 'Narayan Murthy', email: 'murthy@infosys.com', role: 'CLIENT', company: 'Infosys Limited' },
      newValue: { title: 'Add CDN for Static Assets' }
    },
    {
      id: '11',
      userId: 'user-murthy',
      action: 'CHANGE_REQUEST_APPROVED',
      resource: 'ChangeRequest:cr-002',
      createdAt: '2026-01-29T10:00:00Z',
      user: { name: 'Narayan Murthy', email: 'murthy@infosys.com', role: 'CLIENT', company: 'Infosys Limited' },
      newValue: { title: 'CDN Approved' }
    },
    {
      id: '12',
      userId: 'user-murthy',
      action: 'DELIVERABLE_ACCEPTED',
      resource: 'Deliverable:del-003',
      createdAt: '2026-02-08T09:00:00Z',
      user: { name: 'Narayan Murthy', email: 'murthy@infosys.com', role: 'CLIENT', company: 'Infosys Limited' },
      newValue: { title: 'Auto-Scaling Cloud Infrastructure' }
    }
  ];

  const data = { logs: MOCK_AUDIT_LOGS };
  const isLoading = false;

  /* Real API call - uncomment when backend is ready
  const { data, isLoading } = useAdminAuditLogs(filter);
  */
  
  const logs = data?.logs || [];

  // Group logs by client
  const groupedByClient = logs.reduce((acc, log) => {
    const clientId = log.userId;
    const clientName = log.user?.company || log.user?.name || 'Unknown Client';
    
    if (!acc[clientId]) {
      acc[clientId] = {
        clientId,
        clientName,
        clientEmail: log.user?.email,
        clientRole: log.user?.role,
        events: []
      };
    }
    acc[clientId].events.push(log);
    return acc;
  }, {});

  let clientCards = Object.values(groupedByClient);

  // Apply filters
  if (searchTerm) {
    clientCards = clientCards.filter(client => 
      client.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (eventTypeFilter !== 'all') {
    clientCards = clientCards.map(client => ({
      ...client,
      events: client.events.filter(event => event.action.includes(eventTypeFilter.toUpperCase()))
    })).filter(client => client.events.length > 0);
  }

  const getActionIcon = (action) => {
    if (action.includes('RISK')) return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    if (action.includes('DECISION')) return <Gavel className="w-4 h-4 text-blue-500" />;
    if (action.includes('CHANGE_REQUEST')) return <TrendingUp className="w-4 h-4 text-purple-500" />;
    if (action.includes('DELIVERABLE')) return <FileCheck className="w-4 h-4 text-green-500" />;
    if (action.includes('APPROVED') || action.includes('ACCEPTED')) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (action.includes('REJECTED')) return <XCircle className="w-4 h-4 text-red-500" />;
    return <GitCommit className="w-4 h-4 text-gray-400" />;
  };

  const getActionBadgeColor = (action) => {
    if (action.includes('APPROVED') || action.includes('ACCEPTED')) return 'bg-green-50 text-green-700 border-green-200';
    if (action.includes('REJECTED')) return 'bg-red-50 text-red-700 border-red-200';
    if (action.includes('SUBMITTED') || action.includes('REQUESTED') || action.includes('CREATED')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (action.includes('RISK')) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const formatAction = (action) => {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleViewClient = (clientId) => {
    navigate(`/dashboard/admin/clients/${clientId}`);
  };

  return (
    <DashboardLayout role="admin" title="Client Audit Logs" subtitle="Governance events across all client engagements">
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* 1. Stats Overview - Redesigned */}
        {clientCards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-xl border border-blue-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Active Clients</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{clientCards.length}</span>
                  <span className="text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded-full">100% active</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-xl border border-green-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600">
                <GitCommit className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Events</p>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{clientCards.reduce((sum, c) => sum + c.events.length, 0)}</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-xl border border-amber-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Risks Logged</p>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{clientCards.reduce((sum, c) => sum + c.events.filter(e => e.action.includes('RISK')).length, 0)}</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-xl border border-purple-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
                <Gavel className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Decisions Made</p>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{clientCards.reduce((sum, c) => sum + c.events.filter(e => e.action.includes('DECISION')).length, 0)}</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. Header with Filters */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-4 justify-between items-center sticky top-0 z-10">
          <div className="flex-1 w-full md:w-auto">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search clients or emails..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all" 
                />
              </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <select 
                  value={eventTypeFilter}
                  onChange={(e) => setEventTypeFilter(e.target.value)}
                  className="pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm bg-white dark:bg-gray-900 dark:border-gray-800 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none appearance-none cursor-pointer hover:bg-gray-50"
                >
                  <option value="all">All Event Types</option>
                  <option value="risk">Risks Only</option>
                  <option value="decision">Decisions Only</option>
                  <option value="change_request">Change Requests</option>
                  <option value="deliverable">Deliverables</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm">
                <Download className="w-4 h-4" /> Export
              </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 p-24 flex justify-center items-center">
             <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-blue"></div>
                <p className="text-gray-500 font-medium animate-pulse">Loading audit logs...</p>
             </div>
          </div>
        ) : clientCards.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 p-20 text-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-[#050505] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No events found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              We couldn't find any governance events matching your current filters. Try adjusting your search term or filters.
            </p>
            <button 
              onClick={() => {setSearchTerm(''); setEventTypeFilter('all');}}
              className="mt-6 px-4 py-2 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          /* Client Cards Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {clientCards.map((client, idx) => (
              <div 
                key={client.clientId || idx} 
                className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-brand-blue/30 transition-all duration-300 group flex flex-col h-full"
                onClick={() => handleViewClient(client.clientId)}
              >
                {/* Client Header */}
                <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white group-hover:from-blue-50/30 group-hover:to-white transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-blue to-blue-700 text-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                        {client.clientName ? (
                           <span className="text-lg font-bold">{client.clientName.charAt(0)}</span>
                        ) : (
                           <Building2 className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors flex items-center gap-2">
                            {client.clientName}
                            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-gray-400 transition-opacity" />
                        </h3>
                        <p className="text-sm text-gray-500">{client.clientEmail}</p>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewClient(client.clientId);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-brand-blue hover:border-brand-blue shadow-sm flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" /> Profile
                    </button>
                  </div>
                  
                  {/* Mini Stats in Header */}
                  <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
                     <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                        <GitCommit className="w-3.5 h-3.5 text-gray-400" />
                        <strong className="text-gray-900 dark:text-white">{client.events.length}</strong> Total Events
                     </span>
                     <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        <strong className="text-gray-900 dark:text-white hover:text-amber-600 transition-colors">{client.events.filter(e => e.action.includes('RISK')).length}</strong> Risks
                     </span>
                  </div>
                </div>

                {/* Events Feed */}
                <div className="flex-1 p-0 bg-gray-50 dark:bg-[#050505]/50">
                   <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 dark:border-gray-700/50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Recent Activity
                   </div>
                   <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                      {client.events.slice(0, 5).map((log, i) => (
                        <div 
                          key={log.id} 
                          onClick={(e) => e.stopPropagation()}
                          className={`flex items-start gap-3 p-4 hover:bg-white dark:bg-gray-900 dark:border-gray-800 transition-colors border-b border-gray-100 last:border-0 ${i % 2 === 0 ? 'bg-white dark:bg-gray-900 dark:border-gray-800/50' : 'bg-transparent'}`}
                        >
                          <div className="flex-shrink-0 mt-0.5 transform transition-transform hover:scale-110">
                            {getActionIcon(log.action)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getActionBadgeColor(log.action).replace('bg-', 'bg-opacity-50 bg-')}`}>
                                {formatAction(log.action)}
                              </span>
                              <span className="text-[10px] text-gray-400 ml-auto">
                                {new Date(log.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate group-hover/item:text-brand-blue">{log.resource || 'System Event'}</p>
                            {log.newValue?.title && (
                              <p className="text-xs text-gray-500 mt-1 truncate">{log.newValue.title}</p>
                            )}
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
                
                {/* Card Footer */}
                {client.events.length > 5 && (
                  <div className="p-3 bg-white dark:bg-gray-900 dark:border-gray-800 border-t border-gray-100 text-center">
                     <button className="text-xs font-bold text-brand-blue hover:text-blue-700 flex items-center justify-center gap-1 transition-colors">
                        View {client.events.length - 5} more events <TrendingUp className="w-3 h-3" />
                     </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminAuditLogs;
