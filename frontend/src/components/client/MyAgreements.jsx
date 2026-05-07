import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CheckCircle, XCircle, AlertTriangle, FileText, Shield } from 'lucide-react';

const MyAgreements = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['clientAccountability'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const res = await axios.get(`${backendUrl}/api/client/accountability`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 border border-gray-200">
        <p className="text-gray-500">Loading your agreements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 border border-gray-200">
        <p className="text-red-500">Error loading accountability log</p>
      </div>
    );
  }

  const { log } = data || {};

  const getIcon = (type) => {
    if (type.includes('APPROVED') || type.includes('ACCEPTED') || type.includes('SIGNED')) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    if (type.includes('ESCALATED')) {
      return <AlertTriangle className="w-5 h-5 text-amber-600" />;
    }
    if (type.includes('REJECTED')) {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }
    return <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
  };

  const getBadgeColor = (category) => {
    if (category === 'COMMITMENT') return 'bg-green-100 text-green-700 border-green-200';
    if (category === 'ESCALATION') return 'bg-amber-100 text-amber-700 border-amber-200';
    if (category === 'WITHDRAWAL') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getActionLabel = (type) => {
    if (type.includes('DECISION_APPROVED')) return 'Decision Approved';
    if (type.includes('DECISION_REJECTED')) return 'Decision Declined';
    if (type.includes('RISK_ACCEPTED')) return 'Risk Acceptance';
    if (type.includes('RISK_ESCALATED')) return 'Risk Escalation';
    if (type.includes('CHANGE_AUTHORIZED')) return 'Change Authorized';
    if (type.includes('CHANGE_REJECTED')) return 'Change Declined';
    if (type.includes('DELIVERABLE_SIGNED')) return 'Deliverable Approved';
    if (type.includes('DELIVERABLE_REJECTED')) return 'Deliverable Rejected';
    return 'Agreement';
  };

  return (
    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        <Shield className="w-6 h-6 text-blue-600" />
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">My Agreements</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Complete record of your commitments and decisions
          </p>
        </div>
      </div>

      {/* Timeline */}
      {log && log.length > 0 ? (
        <div className="space-y-4">
          {log.map((event, index) => (
            <div
              key={event.id}
              className="relative pl-8 pb-6 border-l-2 border-gray-200 last:pb-0"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[11px] top-0 bg-white dark:bg-gray-900 dark:border-gray-800 border-4 border-gray-200 rounded-full w-5 h-5"></div>

              {/* Event Card */}
              <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-shadow">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getIcon(event.type)}
                    <span className="font-bold text-gray-900 dark:text-white text-sm">
                      {getActionLabel(event.type)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                {/* Subject */}
                <p className="text-sm text-gray-800 dark:text-gray-50 font-semibold mb-2">
                  {event.subject}
                </p>

                {/* Category Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs px-2 py-1 rounded border ${getBadgeColor(event.category)}`}>
                    {event.category}
                  </span>
                  {event.impact && (
                    <span className="text-xs px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-700 border border-blue-200">
                      {event.impact}
                    </span>
                  )}
                </div>

                {/* Action & User */}
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  <span className="font-semibold">{event.action}</span> by{' '}
                  <span className="font-semibold">{event.user}</span>
                </p>

                {/* Note */}
                {event.note && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs italic text-gray-600 dark:text-gray-400">
                      "{event.note}"
                    </p>
                  </div>
                )}

                {/* Project Info if Available */}
                {event.project && (
                  <p className="text-xs text-gray-500 mt-2">
                    Project: {event.project}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Shield className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-600 dark:text-gray-400 font-semibold mb-2">No Agreements Yet</p>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Your formal commitments, approvals, and agreements will appear here. This
            creates an immutable record of all your business decisions.
          </p>
        </div>
      )}

      {/* Footer Note */}
      {log && log.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
          <p className="text-xs text-blue-800 flex items-start gap-2">
            <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              <strong>Audit Trail:</strong> All records are immutable and include
              timestamps, IP addresses, and impact summaries for compliance.
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default MyAgreements;
