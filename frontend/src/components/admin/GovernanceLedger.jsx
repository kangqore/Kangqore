import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CheckCircle, AlertTriangle, XCircle, FileText, Filter, X, Download, ShieldCheck, Link as LinkIcon } from 'lucide-react';

const GovernanceLedger = ({ projectId }) => {
  // Filters state
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all'); // all, 7days, 30days, 90days
  const { data, isLoading, error } = useQuery({
    queryKey: ['accountability', projectId],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/admin/accountability/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    enabled: !!projectId
  });

  // Extract unique users for filter dropdown
  const uniqueUsers = useMemo(() => {
    if (!data?.ledger) return [];
    const users = [...new Set(data.ledger.map(e => e.user))];
    return users;
  }, [data?.ledger]);

  // Apply filters
  const filteredLedger = useMemo(() => {
    if (!data?.ledger) return [];
    
    return data.ledger.filter(event => {
      // Event type filter
      if (eventTypeFilter !== 'all') {
        const category = event.category.toLowerCase();
        if (eventTypeFilter !== category) return false;
      }
      
      // User filter
      if (userFilter !== 'all' && event.user !== userFilter) return false;
      
      // Date filter
      if (dateFilter !== 'all') {
        const eventDate = new Date(event.timestamp);
        const now = new Date();
        const daysDiff = (now - eventDate) / (1000 * 60 * 60 * 24);
        
        if (dateFilter === '7days' && daysDiff > 7) return false;
        if (dateFilter === '30days' && daysDiff > 30) return false;
        if (dateFilter === '90days' && daysDiff > 90) return false;
      }
      
      return true;
    });
  }, [data?.ledger, eventTypeFilter, userFilter, dateFilter]);

  if (isLoading) return <div className="text-gray-500">Loading governance ledger...</div>;
  if (error) return <div className="text-red-500">Error loading accountability data</div>;
  if (!data) return null;

  const { ledger, metrics } = data;

  const hasActiveFilters = eventTypeFilter !== 'all' || userFilter !== 'all' || dateFilter !== 'all';

  const clearFilters = () => {
    setEventTypeFilter('all');
    setUserFilter('all');
    setDateFilter('all');
  };

  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/admin/accountability/project/${projectId}/export`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `accountability-ledger-${projectId}-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export CSV. Please try again.');
    }
  };

  const getIcon = (type) => {
    if (type.includes('APPROVED') || type.includes('ACCEPTED')) {
      return <CheckCircle className="w-5 h-5" style={{ color: '#10b981' }} />;
    }
    if (type.includes('ESCALATED')) {
      return <AlertTriangle className="w-5 h-5" style={{ color: '#f59e0b' }} />;
    }
    if (type.includes('REJECTED')) {
      return <XCircle className="w-5 h-5" style={{ color: '#ef4444' }} />;
    }
    return <FileText className="w-5 h-5" style={{ color: '#6b7280' }} />;
  };

  const getEventColor = (type) => {
    if (type.includes('APPROVED') || type.includes('ACCEPTED')) return 'border-green-200 bg-green-50';
    if (type.includes('ESCALATED')) return 'border-amber-200 bg-amber-50';
    if (type.includes('REJECTED')) return 'border-red-200 bg-red-50';
    return 'border-gray-200 bg-white';
  };

  return (
    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Governance & Agreements</h3>
          <div className="flex gap-4 text-sm mt-2">
            <span className="flex items-center gap-1" style={{ color: '#10b981' }}>
              <CheckCircle className="w-4 h-4" /> {metrics.totalCommitments} Commitments
            </span>
            <span className="flex items-center gap-1" style={{ color: '#f59e0b' }}>
              <AlertTriangle className="w-4 h-4" /> {metrics.totalEscalations} Escalations
            </span>
            {metrics.totalWithdrawals > 0 && (
              <span className="flex items-center gap-1" style={{ color: '#ef4444' }}>
                <XCircle className="w-4 h-4" /> {metrics.totalWithdrawals} Withdrawals
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-semibold"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Health Score */}
      <div className={`mb-6 p-4 rounded-lg border ${
        metrics.healthScore === 'HEALTHY' ? 'bg-green-50 dark:bg-green-900/20 border-green-200' :
        metrics.healthScore === 'CAUTION' ? 'bg-amber-50 border-amber-200' :
        'bg-red-50 dark:bg-red-900/20 border-red-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              Accountability Health: <span className={
                metrics.healthScore === 'HEALTHY' ? 'text-green-700' :
                metrics.healthScore === 'CAUTION' ? 'text-amber-700' :
                'text-red-700'
              }>{metrics.healthScore}</span>
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Withdrawal Rate: {metrics.withdrawalRate}%
              {metrics.healthScore === 'RISK' && ' (High risk of commitment instability)'}
            </p>
          </div>
          {metrics.healthScore === 'HEALTHY' && (
            <CheckCircle className="w-8 h-8 text-green-600" />
          )}
          {metrics.healthScore === 'CAUTION' && (
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          )}
          {metrics.healthScore === 'RISK' && (
            <XCircle className="w-8 h-8 text-red-600" />
          )}
        </div>
      </div>

      {/* Delay Attribution (Phase 5: Admin View) */}
      <div className="mb-6 p-4 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <h4 className="text-sm font-bold text-blue-900 mb-3">Delay Attribution (Cumulative)</h4>
          <div className="flex items-center gap-4">
              <div className="flex-1">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Client Caused</span>
                      <span className="text-gray-900 dark:text-white">{metrics.clientDelayDays} Days</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${(metrics.clientDelayDays / ((metrics.clientDelayDays + metrics.adminDelayDays) || 1)) * 100}%` }}
                      ></div>
                  </div>
              </div>
              <div className="flex-1">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Vendor/Internal</span>
                      <span className="text-gray-900 dark:text-white">{metrics.adminDelayDays} Days</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full" 
                        style={{ width: `${(metrics.adminDelayDays / ((metrics.clientDelayDays + metrics.adminDelayDays) || 1)) * 100}%` }}
                      ></div>
                  </div>
              </div>
          </div>
          <p className="text-xs text-blue-700 mt-3">
              Total Recorded Delay: <span className="font-bold">{metrics.clientDelayDays + metrics.adminDelayDays} Days</span>
          </p>
      </div>

      {/* Filters */}
      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <h5 className="text-sm font-bold text-gray-700 dark:text-gray-300">Filters</h5>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Clear All
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Event Type Filter */}
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Event Type</label>
            <select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="commitment">Commitments</option>
              <option value="escalation">Escalations</option>
             <option value="withdrawal">Withdrawals</option>
            </select>
          </div>

          {/* User Filter */}
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">User</label>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Users</option>
              {uniqueUsers.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">Date Range</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timeline */}
      {filteredLedger && filteredLedger.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Commitment Timeline</h4>
            <span className="text-xs text-gray-500">
              Showing {filteredLedger.length} of {ledger.length} events
            </span>
          </div>
          {filteredLedger.map((event) => (
            <div
              key={event.id}
              className={`flex items-start gap-3 p-4 border rounded-lg hover:shadow-sm transition-shadow ${getEventColor(event.type)}`}
            >
              <div className="mt-1">{getIcon(event.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                    {event.summary || `${event.subject} - ${event.action}`}
                  </p>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2 font-mono">
                    {new Date(event.timestamp).toLocaleString('en-US', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
                
                {/* Gap Closure: Explicit Mutual Confirmation (Signature) */}
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1 bg-white dark:bg-gray-900 dark:border-gray-800/50 px-2 py-0.5 rounded border border-gray-200">
                        <ShieldCheck className="w-3 h-3 text-brand-blue" />
                        Signed by: {event.user} ({event.role || 'Client'})
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono tracking-tighter">
                        ID: {event.id.toUpperCase().slice(0, 8)}...
                    </span>
                </div>

                {/* Legacy Impact String */}
                {event.impact && !event.impacts?.length && (
                  <div className="mt-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded inline-block">
                      Impact: {event.impact}
                    </span>
                  </div>
                )}

                {/* Canonical Quantified Impacts */}
                {event.impacts && event.impacts.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {event.impacts.map((imp, idx) => (
                      <span key={idx} className={`text-xs px-2 py-1 rounded inline-flex items-center gap-1 font-medium ${
                        imp.impactType === 'DELAY_DAYS' ? 'bg-red-100 text-red-700' :
                        imp.impactType === 'COST_INCREASE' ? 'bg-amber-100 text-amber-700' :
                        imp.impactType === 'RISK_SCORE' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                         {imp.impactType === 'DELAY_DAYS' && '⏱️'}
                         {imp.impactType === 'COST_INCREASE' && '💰'}
                         {imp.impactType === 'RISK_SCORE' && '⚠️'}
                         {imp.appliedTo}: {imp.impactValue} {imp.impactUnit}
                      </span>
                    ))}
                  </div>
                )}

                {event.note && (
                  <p className="text-xs italic text-gray-500 mt-2 border-l-2 border-gray-300 pl-2">
                    "{event.note}"
                  </p>
                )}
                {event.entityLink && (
                  <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                    <LinkIcon className="w-3 h-3" /> Linked to {event.entityLink.type}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">No accountability events recorded yet</p>
          <p className="text-xs mt-1">Events will appear when decisions are approved, risks are accepted, or changes are authorized</p>
        </div>
      )}
    </div>
  );
};

export default GovernanceLedger;
