import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Clock, User, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '../../hooks/use-toast';

export default function SchedulingAuditLog() {
  const { toast } = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/scheduling/audit?limit=100`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) {
        setLogs(response.data.logs);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch audit logs', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading audit trail...</div>;

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Shield className="w-8 h-8 text-brand-blue" />
          Scheduling Audit Log
        </h1>
        <p className="text-gray-500 mt-2">A chronological record of scheduling actions.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
        {logs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No recent scheduling activity found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {format(new Date(log.createdAt), 'MMM d, yyyy HH:mm:ss')}
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        {log.user ? log.user.name : 'System / Invitee'}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-500 max-w-xs truncate">
                      {log.newValue ? (
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          {log.resource}: {log.newValue.id || 'N/A'}
                        </div>
                      ) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
