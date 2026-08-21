import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShieldCheck, AlertTriangle, Zap, Activity, 
  Clock, CheckCircle2, ChevronRight, BrainCircuit 
} from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
const API_BASE_URL = `${BACKEND_URL}/api`;

const renderBoldText = (text) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const AssuranceIntelligencePanel = ({ leadId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!leadId) return;
    fetchAssuranceData();
  }, [leadId]);

  const fetchAssuranceData = async () => {
    setLoading(true);
    try {
      const adminSecret = 'eqore-local-dev-admin-secret'; // Using dev secret for local validation
      const res = await axios.get(`${API_BASE_URL}/admin/eqore/leads/${leadId}/assurance`, {
        headers: { Authorization: `Bearer ${adminSecret}` }
      });
      setEvents(res.data.assuranceEvents || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch assurance intelligence:', err);
      setError('Failed to load assurance intelligence');
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (level) => {
    switch (level) {
      case 'CRISIS': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'URGENT': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'NORMAL': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-3 animate-pulse">
          <div className="w-8 h-8 rounded-full bg-slate-800"></div>
          <div className="h-4 w-48 bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-950/80 border border-red-900/30 rounded-xl p-6">
        <div className="text-red-400 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-6">
        <h4 className="text-sm font-semibold bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase tracking-wider flex items-center gap-2 mb-4">
          <ShieldCheck className="w-4 h-4" />
          Client Assurance Intelligence
        </h4>
        <p className="text-slate-500 text-sm">No assurance events detected for this lead.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-6 shadow-lg shadow-blue-900/10 overflow-hidden relative">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] -z-10 rounded-full"></div>
      
      <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
        <h4 className="text-sm font-semibold bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" />
          Client Assurance Intelligence
        </h4>
        <span className="text-[10px] text-slate-500 font-mono px-2 py-1 rounded bg-slate-900/50 border border-slate-800">
          PROD_READY_BANK: 100_SCENARIOS
        </span>
      </div>

      <div className="space-y-6">
        {events.map((event, idx) => (
          <div key={idx} className="group border-b border-slate-800/50 last:border-0 pb-6 last:pb-0">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${getUrgencyColor(event.metadata.urgencyLevel)}`}>
                    {event.metadata.urgencyLevel}
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {event.metadata.assuranceCategory}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3" />
                  {new Date(event.timestamp).toLocaleString()}
                  <span className="mx-1">•</span>
                  <Zap className="w-3 h-3" />
                  Match Score: {event.metadata.matchedScenarioScore}%
                </div>
              </div>
              <div className="text-[10px] text-slate-600 font-mono">
                ID: {event.metadata.matchedScenarioId?.slice(0, 12)}...
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-900/40 rounded-lg p-3 border border-slate-800/50">
                <div className="text-[9px] uppercase tracking-wider text-slate-500 mb-2 font-bold">Recommended Departments</div>
                <div className="flex flex-wrap gap-1">
                  {event.metadata.recommendedDepartments?.map((dept, i) => (
                    <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                      {dept}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-slate-900/40 rounded-lg p-3 border border-slate-800/50">
                <div className="text-[9px] uppercase tracking-wider text-slate-500 mb-2 font-bold">Priority Services</div>
                <div className="flex flex-wrap gap-1">
                  {event.metadata.recommendedServices?.map((svc, i) => (
                    <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent border border-cyan-500/20">
                      {svc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {event.metadata.matchedScenarioTags?.map((tag, i) => (
                <span key={i} className="text-[8px] px-1.5 py-0.5 rounded-md bg-slate-800/50 text-slate-400 border border-slate-700/50 flex items-center gap-1">
                  <Activity className="w-2 h-2" /> {tag}
                </span>
              ))}
            </div>

            {/* Synthesized Response Toggle/Preview */}
            <div className="bg-blue-600/5 border border-blue-500/20 rounded-lg p-4">
              <div className="text-[10px] text-blue-400 font-bold mb-2 uppercase tracking-widest flex items-center gap-2">
                <BrainCircuit className="w-3 h-3" /> 
                Executive Synthesis (Kangqore Style)
              </div>
              <div className="text-xs text-slate-300 leading-relaxed italic">
                "{renderBoldText(event.response.substring(0, 300))}..."
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssuranceIntelligencePanel;
