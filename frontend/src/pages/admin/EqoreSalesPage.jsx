import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TrendingUp, Target, Clock, AlertTriangle, ChevronRight, 
  UserPlus, Calendar, ShieldCheck, Activity, Search, RefreshCw, BarChart3, Crosshair
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
const API_BASE_URL = `${BACKEND_URL}/api`;

const EqoreSalesPage = () => {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('PIPELINE'); // PIPELINE, TASKS

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // In production, we'd use proper auth context. For local dev, using withCredentials or token
      const [oppsRes, tasksRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/eqore/sales/opportunities`, { withCredentials: true }),
        axios.get(`${API_BASE_URL}/admin/eqore/sales/tasks`, { withCredentials: true })
      ]);
      
      setOpportunities(oppsRes.data.opportunities || []);
      setTasks(tasksRes.data.tasks || []);
    } catch (err) {
      console.error('Failed to fetch sales data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRISIS': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'MEDIUM': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStageColor = (stage) => {
    if (stage === 'WON') return 'text-emerald-400';
    if (stage === 'LOST') return 'text-red-400';
    if (stage.includes('CONSULTATION')) return 'text-cyan-400';
    return 'text-blue-400';
  };

  const renderPipeline = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {opportunities.map(opp => (
        <div key={opp.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-white font-semibold flex items-center gap-2">
                {opp.lead?.companyName || 'Unknown Company'}
                {opp.priority === 'CRISIS' && <AlertTriangle className="w-4 h-4 text-red-400" />}
              </div>
              <div className="text-xs text-slate-400">{opp.lead?.email}</div>
            </div>
            <span className={`text-[10px] px-2 py-1 rounded border font-bold ${getPriorityColor(opp.priority)}`}>
              {opp.priority}
            </span>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center text-sm border-b border-slate-800/50 pb-2">
              <span className="text-slate-500 flex items-center gap-1.5"><Target className="w-4 h-4"/> Stage</span>
              <span className={`font-semibold ${getStageColor(opp.stage)}`}>{opp.stage.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-slate-800/50 pb-2">
              <span className="text-slate-500 flex items-center gap-1.5"><UserPlus className="w-4 h-4"/> Owner</span>
              <span className="text-slate-300">{opp.ownerId?.replace('USR_', '').replace('_OWNER', '') || 'Unassigned'}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 flex items-center gap-1.5"><TrendingUp className="w-4 h-4"/> Value</span>
              <span className="text-white font-mono">${Number(opp.estimatedValue || 0).toLocaleString()}</span>
            </div>
          </div>

          <button 
            onClick={() => navigate(`/admin/eqore-leads/${opp.leadId}`)}
            className="w-full py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-xs font-semibold rounded-lg border border-blue-600/20 transition-colors flex items-center justify-center gap-2"
          >
            View Lead Intelligence <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );

  const renderTasks = () => (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
      <table className="w-full text-left text-sm text-slate-400">
        <thead className="bg-slate-950 text-slate-300 font-semibold border-b border-slate-800">
          <tr>
            <th className="px-6 py-4">Task</th>
            <th className="px-6 py-4">Lead / Company</th>
            <th className="px-6 py-4">Type</th>
            <th className="px-6 py-4">Due Date</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {tasks.map(task => (
            <tr key={task.id} className="hover:bg-slate-800/20 transition-colors group">
              <td className="px-6 py-4">
                <div className="font-medium text-white flex items-center gap-2">
                  {task.title}
                  {task.priority === 'CRISIS' && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                </div>
                <div className="text-xs text-slate-500 truncate max-w-xs">{task.description}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-slate-300">{task.lead?.companyName || 'Unknown'}</div>
                <div className="text-xs text-slate-500">{task.lead?.email}</div>
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-mono text-slate-300">
                  {task.taskType}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className={`flex items-center gap-1.5 ${new Date(task.dueAt) < new Date() ? 'text-red-400' : 'text-slate-400'}`}>
                  <Clock className="w-4 h-4" />
                  {new Date(task.dueAt).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <button 
                  onClick={() => navigate(`/admin/eqore-leads/${task.leadId}`)}
                  className="text-blue-400 hover:text-blue-300 text-xs font-semibold px-3 py-1.5 bg-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Resolve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 p-8 pt-24 font-sans text-slate-300 selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Crosshair className="w-8 h-8 text-cyan-400" />
              Sales Command Center
            </h1>
            <p className="text-sm text-slate-400 mt-2 flex items-center gap-2">
              Phase 9 CRM & Sales Pipeline Automation <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold">OPERATIONAL</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={fetchData} className="p-2 bg-slate-900 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors">
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
            <div className="text-slate-500 text-xs font-bold uppercase mb-2 flex items-center gap-2"><Target className="w-4 h-4"/> Open Opportunities</div>
            <div className="text-3xl font-bold text-white">{opportunities.filter(o => !['WON', 'LOST', 'DISQUALIFIED'].includes(o.stage)).length}</div>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
            <div className="text-slate-500 text-xs font-bold uppercase mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4"/> Pipeline Value</div>
            <div className="text-3xl font-bold text-emerald-400">
              ${(opportunities.reduce((acc, curr) => acc + Number(curr.estimatedValue || 0), 0) / 1000).toFixed(1)}k
            </div>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
            <div className="text-slate-500 text-xs font-bold uppercase mb-2 flex items-center gap-2"><Clock className="w-4 h-4"/> Open Tasks</div>
            <div className="text-3xl font-bold text-white">{tasks.length}</div>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
            <div className="text-slate-500 text-xs font-bold uppercase mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> Crisis / High Priority</div>
            <div className="text-3xl font-bold text-red-400">
              {opportunities.filter(o => o.priority === 'CRISIS' || o.priority === 'HIGH').length}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-slate-800">
          <button 
            onClick={() => setActiveTab('PIPELINE')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-colors ${activeTab === 'PIPELINE' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <BarChart3 className="w-4 h-4" /> Active Pipeline
          </button>
          <button 
            onClick={() => setActiveTab('TASKS')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-colors ${activeTab === 'TASKS' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Clock className="w-4 h-4" /> Actionable Tasks
            {tasks.length > 0 && <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px]">{tasks.length}</span>}
          </button>
        </div>

        {/* Content */}
        {loading && opportunities.length === 0 ? (
          <div className="py-20 text-center text-slate-500 animate-pulse">Loading Sales Intelligence...</div>
        ) : (
          <div className="mt-6">
            {activeTab === 'PIPELINE' ? renderPipeline() : renderTasks()}
          </div>
        )}

      </div>
    </div>
  );
};

export default EqoreSalesPage;
