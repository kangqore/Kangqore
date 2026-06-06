import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GitBranch, Folder, Github, Activity, Clock, UploadCloud, Play, CheckCircle, AlertTriangle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

export default function DeliveryConnector({ deliverableId, projectContext }) {
  const [resources, setResources] = useState([]);
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    fetchData();
    // Simulate real-time logging by polling
    const interval = setInterval(fetchSignals, 5000);
    return () => clearInterval(interval);
  }, [deliverableId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchResources(), fetchSignals()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchResources = async () => {
    // In a real app, we'd have a specific endpoint or include this in deliverable details
    // For now, let's assume if we had an endpoint we'd call it.
    // Instead, we'll store local state for the demo or use local storage
    // But wait, we added connectResource on backend. We should ideally fetch it.
    // Assuming backend returns resources in deliverable detail or separate endpoint.
    // Current backend impl only "creates" resource. Let's assume we can fetch signals which implies connection.
  };

  const fetchSignals = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${BACKEND_URL}/api/deliverables/${deliverableId}/signals`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      setSignals(res.data.signals || []);
    } catch (e) {
      console.error("Failed to fetch signals");
    }
  };

  const handleConnect = async (type) => {
    const token = localStorage.getItem('token');
    const url = prompt(`Enter ${type} URL/ID:`, type === 'GITHUB_REPO' ? 'https://github.com/org/repo' : 'Jira-123');
    if (!url) return;

    try {
      setConnecting(true);
      await axios.post(`${BACKEND_URL}/api/deliverables/${deliverableId}/connect`, {
        resourceType: type,
        externalId: url
      }, {
          headers: { Authorization: `Bearer ${token}` }
      });
      alert(`Connected to ${type}!`);
      // Update local state to show connected
      setResources(prev => [...prev, { resourceType: type, externalId: url }]);
    } catch (e) {
      alert("Failed to connect");
    } finally {
      setConnecting(false);
    }
  };

  const simulateSignal = async (type) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${BACKEND_URL}/api/deliverables/${deliverableId}/signal`, {
        signalType: type,
        source: 'Mock Simulator',
        payload: {
          user: 'developer@agency.com',
          message: type === 'PR_MERGED' ? 'Merged PR #42: Feature Complete' : 'CI Build Success'
        }
      }, {
          headers: { Authorization: `Bearer ${token}` }
      });
      fetchSignals(); // Refresh immediately
    } catch (e) {
      alert("Failed to simulate signal");
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl p-4 border border-gray-200 mt-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-gray-700 dark:text-gray-300 text-sm flex items-center gap-2">
          <Activity className="w-4 h-4 text-brand-blue" /> Delivery Signals (Live)
        </h4>
        <div className="flex gap-2">
           {/* Mock Actions */}
           <button onClick={() => simulateSignal('PR_OPENED')} className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold hover:bg-blue-200">
             + PR Open
           </button>
           <button onClick={() => simulateSignal('PR_MERGED')} className="text-[10px] bg-purple-100 text-purple-700 px-2 py-1 rounded font-bold hover:bg-purple-200">
             + PR Merge
           </button>
           <button onClick={() => simulateSignal('CI_PASSED')} className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded font-bold hover:bg-green-200">
             + CI Pass
           </button>
        </div>
      </div>

      {resources.length === 0 && (
         <div className="flex gap-2 mb-4">
            <button onClick={() => handleConnect('GITHUB_REPO')} className="flex-1 py-2 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded text-xs font-bold text-gray-600 dark:text-gray-400 hover:border-gray-400 flex justify-center items-center gap-2">
              <Github className="w-3 h-3" /> Connect GitHub
            </button>
            <button onClick={() => handleConnect('JIRA_TICKET')} className="flex-1 py-2 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded text-xs font-bold text-gray-600 dark:text-gray-400 hover:border-gray-400 flex justify-center items-center gap-2">
              <UploadCloud className="w-3 h-3" /> Connect Jira
            </button>
         </div>
      )}

      {/* Signal Log */}
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {signals.length === 0 ? (
          <p className="text-center text-xs text-gray-400 italic py-2">No activity recorded yet.</p>
        ) : (
          signals.map(signal => (
            <div key={signal.id} className="flex gap-3 items-start p-2 bg-white dark:bg-gray-900 dark:border-gray-800 rounded border border-gray-100">
               <div className={`mt-0.5 w-2 h-2 rounded-full ${
                  signal.signalType.includes('PASSED') || signal.signalType.includes('MERGED') ? 'bg-green-500' :
                  signal.signalType.includes('FAILED') ? 'bg-red-500' : 'bg-blue-500'
               }`} />
               <div>
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-50">{signal.signalType.replace('_', ' ')}</p>
                  <p className="text-[10px] text-gray-500">
                    {new Date(signal.timestamp).toLocaleTimeString()} via {signal.source}
                  </p>
                  {signal.payload && (
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                       {JSON.stringify(signal.payload.message || signal.payload).slice(0, 50)}
                    </p>
                  )}
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
