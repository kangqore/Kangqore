import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, Flame, Search, ArrowRight, ShieldCheck, 
  BrainCircuit, Activity, Clock, Zap, Target, AlertTriangle,
  LayoutGrid, Briefcase, Sparkles, Calendar, Video,
  TrendingUp, DollarSign, BarChart3, CheckCircle2, ArrowUpRight, Mail, Linkedin, FileText,
  Crosshair, UserPlus, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
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

const EqoreLeadsPage = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [leadDetail, setLeadDetail] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/eqore/leads`, { withCredentials: true });
      let fetchedLeads = res.data.leads || [];
      
      // Sort logic: leadScore DESC, leadConfidence DESC, createdAt DESC
      fetchedLeads.sort((a, b) => {
        if (b.leadScore !== a.leadScore) return b.leadScore - a.leadScore;
        if (b.leadConfidence !== a.leadConfidence) return b.leadConfidence - a.leadConfidence;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setLeads(fetchedLeads);
    } catch (err) {
      console.error('Failed to fetch eQORE leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeadDetail = async (id) => {
    try {
      setSelectedLead(id);
      const res = await axios.get(`${API_BASE_URL}/admin/eqore/leads/${id}`, { withCredentials: true });
      setLeadDetail(res.data.lead);
    } catch (err) {
      console.error('Failed to fetch lead detail:', err);
    }
  };

  const updateLeadStatus = async (id, status) => {
    try {
      await axios.patch(`${API_BASE_URL}/admin/eqore/leads/${id}/status`, { status }, { withCredentials: true });
      fetchLeads();
      if (selectedLead === id) fetchLeadDetail(id);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const calculateMetrics = () => {
    const totalPipeline = leads.reduce((acc, lead) => acc + (lead.projectedValue || 0), 0);
    const weightedPipeline = leads.reduce((acc, lead) => acc + ((lead.projectedValue || 0) * (lead.pipelineWeight || 0)), 0);
    const bookedLeads = leads.filter(l => l.schedulingStatus === 'BOOKED').length;
    const bookingRate = leads.length > 0 ? (bookedLeads / leads.length) * 100 : 0;
    const avgQuality = leads.length > 0 ? leads.reduce((acc, lead) => acc + lead.leadScore, 0) / leads.length : 0;

    return {
      totalPipeline,
      weightedPipeline,
      bookingRate,
      avgQuality
    };
  };

  const metrics = calculateMetrics();

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    if (score >= 75) return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
    if (score >= 44) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    return 'text-slate-400 bg-slate-800/50 border-slate-700/50';
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-cyan-400" />
            eQORE Lead Intelligence
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            Autonomous revenue tracking and visitor scoring engine.
          </p>
        </div>
      </div>
      {/* ROI & Pipeline Header Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign className="w-12 h-12 text-emerald-400" />
          </div>
          <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Pipeline (ACV)</div>
          <div className="text-3xl font-bold text-white">${(metrics.totalPipeline / 1000).toFixed(1)}k</div>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-400 font-medium">
            <TrendingUp className="w-3 h-3" /> Potential Revenue
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <BarChart3 className="w-12 h-12 text-cyan-400" />
          </div>
          <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Weighted Pipeline</div>
          <div className="text-3xl font-bold text-white">${(metrics.weightedPipeline / 1000).toFixed(1)}k</div>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-cyan-400 font-medium">
            <Target className="w-3 h-3" /> Probabilistic Forecast
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Calendar className="w-12 h-12 text-amber-400" />
          </div>
          <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Booking Rate</div>
          <div className="text-3xl font-bold text-white">{metrics.bookingRate.toFixed(1)}%</div>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-amber-400 font-medium">
            <CheckCircle2 className="w-3 h-3" /> Consultation Velocity
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-12 h-12 text-rose-400" />
          </div>
          <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Avg Lead Quality</div>
          <div className="text-3xl font-bold text-white">{metrics.avgQuality.toFixed(0)}</div>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-rose-400 font-medium">
            <Flame className="w-3 h-3" /> Intelligence Score
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Lead Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                Active Sessions
              </h2>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search leads..." 
                  className="bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-cyan-500 w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-950/50 border-b border-slate-800 text-slate-400 text-sm">
                  <tr>
                    <th className="px-6 py-4 font-medium">Visitor</th>
                    <th className="px-6 py-4 font-medium">Type & Source</th>
                    <th className="px-6 py-4 font-medium">Score / Conf</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-slate-500">Loading intelligence data...</td>
                    </tr>
                  ) : leads.map((lead) => (
                    <tr 
                      key={lead.id} 
                      className={`hover:bg-slate-800/30 transition-colors cursor-pointer ${selectedLead === lead.id ? 'bg-slate-800/50' : ''}`}
                      onClick={() => fetchLeadDetail(lead.id)}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{lead.email || lead.sessionId.slice(0, 12) + '...'}</div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(lead.createdAt).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-300 font-medium">{lead.visitorType || 'Unknown'}</div>
                        {lead.sourcePage && <div className="text-xs text-slate-500 mt-1">Source: {lead.sourcePage}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`px-3 py-1 w-fit rounded-full text-xs font-medium border ${getScoreColor(lead.leadScore)}`}>
                            Score: {lead.leadScore}
                          </span>
                          <span className="text-xs text-slate-400 ml-1">Conf: {lead.leadConfidence}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700">
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!loading && leads.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-slate-500">No active leads found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Lead Detail */}
        <div className="space-y-6">
          {leadDetail ? (
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-xl flex flex-col h-[calc(100vh-12rem)]">
              <div className="p-6 border-b border-slate-800 bg-slate-950/50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {leadDetail.email || 'Anonymous Session'}
                    </h3>
                    <p className="text-sm text-cyan-400 mt-1">{leadDetail.visitorType}</p>
                  </div>
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${leadDetail.leadScore >= 75 ? 'border-rose-500 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'border-emerald-500 text-emerald-500'}`}>
                    <span className="text-xl font-bold">{leadDetail.leadScore}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => updateLeadStatus(leadDetail.id, 'HOT')}
                    className="flex-1 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-sm font-medium rounded-lg border border-rose-500/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <Flame className="w-4 h-4" />
                    Mark Hot
                  </button>
                  <button 
                    onClick={() => updateLeadStatus(leadDetail.id, 'DISCARDED')}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Discard
                  </button>
                </div>
              </div>

              {/* Main Detail Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                
                {/* Score Explanation Card (Phase 2 Hardened) */}
                {leadDetail?.events?.find(e => e.eventType === 'SCORE_UPDATED') && (
                  <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/20 rounded-xl p-5 shadow-lg shadow-cyan-500/5">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        Score Intelligence
                      </h4>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white leading-none">
                          {leadDetail.leadScore}
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Lead Score</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-tighter">Value Delta</div>
                        <div className="flex items-baseline gap-2">
                          <span className={`text-lg font-bold ${leadDetail.events.find(e => e.eventType === 'SCORE_UPDATED')?.eventData?.scoreDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {leadDetail.events.find(e => e.eventType === 'SCORE_UPDATED')?.eventData?.scoreDelta > 0 ? '+' : ''}
                            {leadDetail.events.find(e => e.eventType === 'SCORE_UPDATED')?.eventData?.scoreDelta}
                          </span>
                          <span className="text-xs text-slate-400">vs previous</span>
                        </div>
                        <div className="mt-2 space-y-1">
                          {leadDetail.events.find(e => e.eventType === 'SCORE_UPDATED')?.eventData?.scoreReasons?.slice(0, 3).map((r, i) => (
                            <div key={i} className="text-[11px] text-slate-300 flex items-center gap-1">
                              <ArrowRight className="w-2 h-2 text-cyan-500" /> {r}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="border-l border-slate-800 pl-6">
                        <div className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-tighter">Confidence Delta</div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-cyan-400">
                            +{leadDetail.events.find(e => e.eventType === 'SCORE_UPDATED')?.eventData?.confidenceDelta}
                          </span>
                          <span className="text-xs text-slate-400">evidence added</span>
                        </div>
                        <div className="mt-2 space-y-1">
                          {leadDetail.events.find(e => e.eventType === 'SCORE_UPDATED')?.eventData?.confidenceReasons?.slice(0, 2).map((r, i) => (
                            <div key={i} className="text-[11px] text-slate-400 italic">{r}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Service Intelligence Panel (Phase 3 Hardened) */}
                <div className="bg-gradient-to-br from-slate-900 to-indigo-950/30 border border-indigo-500/30 rounded-xl p-5 shadow-lg shadow-indigo-500/5">
                  <div className="flex justify-between items-center mb-4 border-b border-indigo-500/20 pb-2">
                    <h4 className="text-sm font-semibold text-indigo-300 uppercase tracking-widest flex items-center gap-2">
                      <LayoutGrid className="w-4 h-4" />
                      Service Intelligence
                    </h4>
                    <span className="text-[10px] text-indigo-400 font-mono">Taxonomy v1</span>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="col-span-2">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Primary Department Assignment</div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                          <Briefcase className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white leading-tight">
                            {leadDetail.primaryDepartment || 'Awaiting Analysis...'}
                          </div>
                          {leadDetail.primaryDepartment && (
                            <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                              <Zap className="w-2 h-2" /> Strategic Alignment Confirmed
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Service Confidence</div>
                      <div className="text-2xl font-bold text-indigo-400">
                        {leadDetail.matchedServices?.[0]?.fitScore || 0}%
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Matched Services List */}
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Matched Service Portfolio</div>
                      <div className="space-y-2">
                        {leadDetail.matchedServices?.map((s, i) => (
                          <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-lg p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="text-sm font-semibold text-slate-200">{s.service}</div>
                                <div className="text-[11px] text-slate-400 mt-0.5">{s.reason}</div>
                              </div>
                              <div className="w-16">
                                <div className="flex justify-between text-[9px] text-slate-500 mb-1">
                                  <span>FIT</span>
                                  <span>{s.fitScore}%</span>
                                </div>
                                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-indigo-500" 
                                    style={{ width: `${s.fitScore}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {(!leadDetail.matchedServices || leadDetail.matchedServices.length === 0) && (
                          <div className="text-sm text-slate-500 italic py-2">No specific services matched yet.</div>
                        )}
                      </div>
                    </div>

                    {/* Strategic Package */}
                    {leadDetail.recommendedSolutionPackage && (
                      <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4">
                        <div className="text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1">Recommended Solution Package</div>
                        <div className="text-sm text-white font-semibold flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          {leadDetail.recommendedSolutionPackage}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Consultation & Scheduling Panel (Phase 4) */}
                <div className="bg-gradient-to-br from-slate-900 to-emerald-950/30 border border-emerald-500/30 rounded-xl p-5 shadow-lg shadow-emerald-500/5">
                  <div className="flex justify-between items-center mb-4 border-b border-emerald-500/20 pb-2">
                    <h4 className="text-sm font-semibold text-emerald-300 uppercase tracking-widest flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Consultation Intel
                    </h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      leadDetail.schedulingStatus === 'BOOKED' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' :
                      leadDetail.schedulingStatus === 'NONE' ? 'bg-slate-800 border-slate-700 text-slate-500' :
                      'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    }`}>
                      {leadDetail.schedulingStatus}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-500 uppercase mb-1">Preferred Time</div>
                        <div className="text-sm font-medium text-white truncate">
                          {leadDetail.preferredConsultationTime || 'Not mentioned'}
                        </div>
                      </div>
                      <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-500 uppercase mb-1">Timezone</div>
                        <div className="text-sm font-medium text-white">
                          {leadDetail.consultationTimezone}
                        </div>
                      </div>
                    </div>

                    {/* Final Selected Slot */}
                    {leadDetail.selectedSlot && (
                      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                        <div className="text-[10px] text-emerald-300 uppercase tracking-widest font-bold mb-2">Confirmed Appointment</div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-500/20 rounded-lg">
                            <Video className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <div className="text-sm text-white font-bold">
                              {leadDetail.selectedSlot?.label}
                            </div>
                            <div className="text-[11px] text-emerald-400/70">Google Meet invite sent</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Offered Slots Preview */}
                    {!leadDetail.selectedSlot && leadDetail.offeredSlots && (
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Offered Slots Portfolio</div>
                        <div className="flex flex-wrap gap-2">
                          {(leadDetail.offeredSlots || []).map((slot, i) => (
                            <div key={i} className="px-2 py-1 bg-slate-800/50 border border-slate-700 rounded text-[10px] text-slate-300">
                              {slot.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!leadDetail.preferredConsultationTime && leadDetail.schedulingStatus === 'NONE' && (
                      <div className="text-xs text-slate-500 italic py-2">
                        Lead has not expressed scheduling intent yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* ROI Intelligence Panel (Phase 5) */}
                <div className="bg-gradient-to-br from-slate-900 to-emerald-950/20 border border-emerald-500/30 rounded-xl p-5 shadow-lg shadow-emerald-500/5">
                  <div className="flex justify-between items-center mb-4 border-b border-emerald-500/10 pb-2">
                    <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      ROI Strategic Overview
                    </h4>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold uppercase">
                      {leadDetail.valueTier || 'Awaiting ROI Analysis'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Projected ACV</div>
                      <div className="text-2xl font-bold text-white">
                        {leadDetail.projectedValue ? `$${(leadDetail.projectedValue / 1000).toFixed(1)}k` : 'TBD'}
                      </div>
                    </div>
                    <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Win Probability</div>
                      <div className="text-2xl font-bold text-emerald-400">
                        {leadDetail.pipelineWeight ? `${(leadDetail.pipelineWeight * 100).toFixed(0)}%` : 'TBD'}
                      </div>
                    </div>
                  </div>

                  {leadDetail.valueReasoning && (
                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3 text-xs text-slate-300 italic leading-relaxed">
                      "{leadDetail.valueReasoning}"
                    </div>
                  )}
                </div>

                {/* Nurture Intelligence Panel (Phase 5) */}
                {(leadDetail.nurtureBrief || leadDetail.nurtureActions) && (
                  <div className="bg-gradient-to-br from-slate-900 to-cyan-950/20 border border-cyan-500/30 rounded-xl overflow-hidden shadow-lg shadow-cyan-500/5">
                    <div className="p-5 border-b border-cyan-500/10 flex justify-between items-center bg-cyan-500/5">
                      <h4 className="text-sm font-semibold text-cyan-300 uppercase tracking-widest flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        Autonomous Nurture Intel
                      </h4>
                    </div>

                    <div className="p-5 space-y-6">
                      {/* Strategic Brief */}
                      {leadDetail.nurtureBrief && (
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-3 flex items-center gap-2">
                            <FileText className="w-3 h-3" /> Strategic Consultation Brief
                          </div>
                          <div className="bg-slate-950/50 border border-slate-800/50 rounded-xl p-4 prose prose-invert prose-sm max-w-none">
                            <div className="text-slate-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                              {renderBoldText(leadDetail.nurtureBrief)}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Next Best Actions */}
                      {leadDetail.nurtureActions && (
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-3 flex items-center gap-2">
                            <Zap className="w-3 h-3 text-cyan-400" /> Nurture Queue
                          </div>
                          <div className="space-y-3">
                            {(leadDetail.nurtureActions || []).map((action, i) => (
                              <div key={i} className="group flex items-start gap-4 bg-slate-900/50 border border-slate-800 hover:border-cyan-500/30 rounded-xl p-4 transition-all">
                                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-cyan-400">
                                  {action.type?.toLowerCase().includes('email') ? <Mail className="w-4 h-4" /> : 
                                   action.type?.toLowerCase().includes('linkedin') ? <Linkedin className="w-4 h-4" /> : 
                                   <ArrowUpRight className="w-4 h-4" />}
                                </div>
                                <div className="flex-1">
                                  <div className="text-xs font-bold text-slate-200 uppercase tracking-tighter mb-1">{action.type}</div>
                                  <div className="text-xs text-slate-400 leading-relaxed">{action.description}</div>
                                </div>
                                <button 
                                  onClick={() => toast.success(`Nurture action initiated: ${action.type}`)}
                                  className="mt-1 px-3 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[10px] font-bold rounded-lg border border-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  EXECUTE
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ============================================================ */}
                {/* Sales Pipeline Intelligence (Phase 9) */}
                {/* ============================================================ */}
                
                {leadDetail.opportunity ? (
                  <div className="bg-gradient-to-br from-slate-900 to-blue-950/20 border border-blue-500/30 rounded-xl p-5 shadow-lg shadow-blue-500/5">
                    <div className="flex justify-between items-center mb-4 border-b border-blue-500/10 pb-2">
                      <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                        <Crosshair className="w-4 h-4" />
                        Sales Pipeline Active
                      </h4>
                      <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-bold uppercase">
                        {leadDetail.salesPriority || 'MEDIUM'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-500 uppercase mb-1">Stage</div>
                        <div className="text-sm font-medium text-white">{leadDetail.salesStage || leadDetail.opportunity.stage}</div>
                      </div>
                      <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-500 uppercase mb-1">Assigned Owner</div>
                        <div className="text-sm font-medium text-white flex items-center gap-2">
                          <UserPlus className="w-3 h-3 text-slate-400" />
                          {leadDetail.assignedOwnerName?.replace('Owner', '') || 'Unassigned'}
                        </div>
                      </div>
                    </div>

                    {leadDetail.salesTasks && leadDetail.salesTasks.length > 0 && (
                      <div className="mb-4">
                        <div className="text-[10px] text-slate-500 uppercase mb-2 font-bold tracking-widest flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-blue-400" /> Open Action Items ({leadDetail.salesTasks.length})
                        </div>
                        <div className="space-y-2">
                          {leadDetail.salesTasks.slice(0, 2).map(task => (
                            <div key={task.id} className="bg-slate-900/50 border border-slate-800 rounded p-2 text-xs flex justify-between items-center">
                              <span className="text-slate-300 font-medium truncate max-w-[200px]">{task.title}</span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded bg-slate-800 ${task.priority === 'CRISIS' ? 'text-red-400' : 'text-slate-400'}`}>
                                Due {new Date(task.dueAt).toLocaleDateString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button 
                        onClick={() => navigate('/admin/eqore-sales')}
                        className="flex-1 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-xs font-semibold rounded-lg border border-blue-600/20 transition-colors flex items-center justify-center gap-2"
                      >
                        Open Command Center <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900/30 border border-slate-800 border-dashed rounded-xl p-5 flex items-center justify-between opacity-70">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-800 rounded-lg">
                        <Crosshair className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-300">Not in Sales Pipeline</div>
                        <div className="text-xs text-slate-500">Lead does not meet routing criteria yet.</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ============================================================ */}
                {/* Graph Intelligence Panels (Phase 5: Big Brain Knowledge Graph) */}
                {/* ============================================================ */}

                {/* Graph Context Panel */}
                <div className="bg-gradient-to-br from-slate-900 to-violet-950/20 border border-violet-500/30 rounded-xl p-5 shadow-lg shadow-violet-500/5">
                  <div className="flex justify-between items-center mb-4 border-b border-violet-500/10 pb-2">
                    <h4 className="text-sm font-semibold text-violet-400 uppercase tracking-widest flex items-center gap-2">
                      <BrainCircuit className="w-4 h-4" />
                      Graph Intelligence
                    </h4>
                    <span className="text-[10px] bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded border border-violet-500/20 font-bold uppercase">
                      {leadDetail.graphContextVersion || 'Not Enriched'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase mb-1">Primary Department</div>
                      <div className="text-sm font-medium text-white">{leadDetail.primaryDepartment || 'Unknown'}</div>
                    </div>
                    <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase mb-1">Enriched At</div>
                      <div className="text-sm font-medium text-white">
                        {leadDetail.graphEnrichedAt ? new Date(leadDetail.graphEnrichedAt).toLocaleString() : 'Pending'}
                      </div>
                    </div>
                  </div>

                  {!leadDetail.graphEnrichedAt && (
                    <button
                      onClick={async () => {
                        try {
                          await axios.post(`${API_BASE_URL}/admin/eqore/graph/leads/${leadDetail.id}/enrich`, {}, { withCredentials: true });
                          toast.success('Graph enrichment completed');
                          fetchLeadDetail(leadDetail.id);
                        } catch (e) { toast.error('Graph enrichment failed'); }
                      }}
                      className="w-full py-2 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 text-xs font-bold rounded-lg border border-violet-500/20 transition-all"
                    >
                      ⚡ ENRICH WITH GRAPH INTELLIGENCE
                    </button>
                  )}
                </div>

                {/* Cross-Sell Opportunities Panel */}
                {leadDetail.recommendedCrossSells && (leadDetail.recommendedCrossSells).length > 0 && (
                  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                    <h4 className="text-sm font-semibold text-amber-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                      <Target className="w-4 h-4" />
                      Cross-Sell Opportunities
                    </h4>
                    <div className="space-y-3">
                      {(leadDetail.recommendedCrossSells || []).map((cs, i) => (
                        <div key={i} className="flex items-center justify-between bg-slate-950/50 border border-slate-800 rounded-lg p-3 hover:border-amber-500/30 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-amber-500/10 rounded-md">
                              <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-200">{cs.label || cs.slug}</div>
                              <div className="text-[10px] text-slate-500">{cs.relationshipType} • {cs.reason}</div>
                            </div>
                          </div>
                          <div className="text-[10px] font-bold text-amber-400/70">{(cs.weight * 100).toFixed(0)}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Relevant Case Studies Panel */}
                {leadDetail.recommendedCaseStudies && (leadDetail.recommendedCaseStudies).length > 0 && (
                  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                    <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                      <FileText className="w-4 h-4" />
                      Relevant Case Studies
                    </h4>
                    <div className="space-y-3">
                      {(leadDetail.recommendedCaseStudies || []).map((cs, i) => (
                        <div key={i} className="bg-slate-950/50 border border-slate-800 rounded-xl p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="text-sm font-bold text-white">{cs.title}</div>
                            <span className="text-[9px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/20 font-bold uppercase whitespace-nowrap ml-2">
                              {cs.proofStatus}
                            </span>
                          </div>
                          {cs.industry && (
                            <div className="text-[10px] text-slate-500 mb-3">Industry: {cs.industry}</div>
                          )}
                          {cs.outcomeMetrics && (
                            <div className="grid grid-cols-3 gap-2">
                              {(cs.outcomeMetrics || []).map((m, j) => (
                                <div key={j} className="bg-slate-900/50 border border-slate-800/50 rounded-lg p-2 text-center">
                                  <div className="text-lg font-bold text-cyan-400">{m.value}</div>
                                  <div className="text-[9px] text-slate-500 uppercase">{m.metric}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Consultant Panel */}
                {leadDetail.recommendedConsultant && (
                  <div className="bg-gradient-to-br from-slate-900 to-indigo-950/20 border border-indigo-500/30 rounded-xl p-5 shadow-lg shadow-indigo-500/5">
                    <h4 className="text-sm font-semibold text-indigo-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                      <Users className="w-4 h-4" />
                      Recommended Consultant
                    </h4>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                        {leadDetail.recommendedConsultant.name?.charAt(0) || '?'}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-white">{leadDetail.recommendedConsultant.name}</div>
                        <div className="text-[11px] text-slate-400 mb-2">{leadDetail.recommendedConsultant.title}</div>
                        <div className="flex flex-wrap gap-1.5">
                          {(leadDetail.recommendedConsultant.expertiseTags || []).map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 text-[9px] rounded border border-indigo-500/20 font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-2xl font-bold text-indigo-400">{leadDetail.recommendedConsultant.matchScore}</div>
                        <div className="text-[9px] text-slate-500 uppercase">Match Score</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Agent Orchestration Timeline Panel (Phase 7) */}
                <AgentTimelinePanel leadId={leadDetail.id} />

                {/* Shadow Intelligence Panel (Phase 2) */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 shadow-lg shadow-cyan-900/10">
                  <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                    <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                      <BrainCircuit className="w-4 h-4" />
                      Shadow Intelligence
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        leadDetail.shadowAnalysisStatus === 'COMPLETED' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                        leadDetail.shadowAnalysisStatus === 'RUNNING' || leadDetail.shadowAnalysisStatus === 'QUEUED' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse' :
                        'bg-slate-800 border-slate-700 text-slate-400'
                      }`}>
                        {leadDetail.shadowAnalysisStatus || 'IDLE'}
                      </span>
                    </div>
                  </div>
                  
                  {leadDetail.conversationSummary && (
                    <div className="mb-4">
                      <p className="text-sm text-slate-300 italic leading-relaxed">"{leadDetail.conversationSummary}"</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-900 rounded-lg p-3 border border-slate-800">
                      <div className="text-xs text-slate-500 mb-1">Buying Stage</div>
                      <div className="text-sm font-medium text-white">{leadDetail.buyingStage || 'Unknown'}</div>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-3 border border-slate-800">
                      <div className="text-xs text-slate-500 mb-1">Primary Intent</div>
                      <div className="text-sm font-medium text-white">{leadDetail.primaryIntent || 'Unknown'}</div>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-3 border border-slate-800">
                      <div className="text-xs text-slate-500 mb-1">Urgency</div>
                      <div className="text-sm font-medium text-white">{leadDetail.urgency || 'Unknown'}</div>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-3 border border-slate-800">
                      <div className="text-xs text-slate-500 mb-1">Authority & Budget</div>
                      <div className="text-sm font-medium text-white line-clamp-1">
                        {leadDetail.authoritySignal || 'Unknown'} • {leadDetail.budgetSignal || 'Unknown'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Scoring Signal Badges */}
                    <div className="flex flex-wrap gap-2 py-2 border-y border-slate-800/50">
                      {leadDetail.scoringSignals && Object.entries(leadDetail.scoringSignals).map(([key, val]) => val && (
                        <span key={key} className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/5 border border-cyan-500/20 text-cyan-300 uppercase tracking-tight">
                          {key.replace('has', '').replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      ))}
                    </div>

                    {leadDetail.problemStatement && (
                      <div>
                        <div className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1 uppercase tracking-tighter">
                          <Target className="w-3 h-3" /> Core Problem
                        </div>
                        <div className="text-sm text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800/50">{leadDetail.problemStatement}</div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      {leadDetail.buyingSignals && leadDetail.buyingSignals.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-emerald-500 mb-1 flex items-center gap-1 uppercase tracking-tighter">
                            <Zap className="w-3 h-3" /> Buying Signals
                          </div>
                          <div className="space-y-1">
                            {leadDetail.buyingSignals.map((sig, i) => (
                              <div key={i} className="text-[11px] text-slate-300 p-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded flex items-center gap-2">
                                <span className={`w-1 h-1 rounded-full ${sig.strength === 'High' ? 'bg-emerald-400' : sig.strength === 'Medium' ? 'bg-emerald-500' : 'bg-emerald-600'}`} />
                                {sig.signal}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {leadDetail.negativeSignals && leadDetail.negativeSignals.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-rose-500 mb-1 flex items-center gap-1 uppercase tracking-tighter">
                            <AlertTriangle className="w-3 h-3" /> Negatives
                          </div>
                          <div className="space-y-1">
                            {leadDetail.negativeSignals.map((sig, i) => (
                              <div key={i} className="text-[11px] text-slate-300 p-1.5 bg-rose-500/5 border border-rose-500/10 rounded flex items-center gap-2">
                                <span className={`w-1 h-1 rounded-full ${sig.severity === 'High' ? 'bg-rose-400' : sig.severity === 'Medium' ? 'bg-rose-500' : 'bg-rose-600'}`} />
                                {sig.signal}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {leadDetail.nextBestQuestion && (
                      <div className="mt-4 bg-cyan-950/30 border border-cyan-900/50 rounded-xl p-4">
                        <div className="text-xs font-semibold text-cyan-400 mb-1 uppercase tracking-widest">Next Best Action</div>
                        <div className="text-sm text-white font-medium mb-1">"{leadDetail.nextBestQuestion}"</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1">
                          <ArrowRight className="w-3 h-3" /> {leadDetail.recommendedAction}
                        </div>
                      </div>
                    )}

                    <div className="text-[10px] text-slate-600 flex justify-between pt-2 border-t border-slate-800">
                      <span>Analysis v1 (Claude 3.5 Sonnet)</span>
                      <span>Confidence: {leadDetail.shadowExtractionConfidence}%</span>
                    </div>
                  </div>
                </div>

                {/* Events Timeline */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Intelligence Events
                  </h4>
                  <div className="space-y-4">
                    {leadDetail.events?.map(event => (
                      <div key={event.id} className="flex gap-3 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 shrink-0"></div>
                        <div>
                          <div className="text-white">{event.reason}</div>
                          <div className="text-slate-500 text-xs mt-1">
                            {new Date(event.createdAt).toLocaleTimeString()}
                            {event.newScore && ` • Score: ${event.previousScore} → ${event.newScore}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat Transcript */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 border-t border-slate-800 pt-6">
                    Live Transcript
                  </h4>
                  <div className="space-y-4">
                    {leadDetail.conversation?.messages?.map(msg => (
                      <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-lg p-3 text-sm ${
                          msg.role === 'user' 
                            ? 'bg-blue-600/20 text-blue-100 border border-blue-500/30' 
                            : 'bg-slate-800/50 text-slate-300 border border-slate-700/50'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl h-64 flex flex-col items-center justify-center text-slate-500">
              <BrainCircuit className="w-12 h-12 mb-4 opacity-20" />
              <p>Select a lead to view intelligence details</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// ─── Agent Orchestration Timeline Panel (Phase 7) ───
const AgentTimelinePanel = ({ leadId }) => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!leadId) return;
    setLoading(true);
    axios.get(`${API_BASE_URL}/admin/eqore/leads/${leadId}/timeline`, { withCredentials: true })
      .then(res => setTimeline(res.data.timeline || []))
      .catch(() => setTimeline([]))
      .finally(() => setLoading(false));
  }, [leadId]);

  const intentColors = {
    GREETING_OR_CHITCHAT: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    SERVICE_INQUIRY: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    PRICING_OR_PROPOSAL: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    SCHEDULING: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    CAREERS_OR_JOB_SEEKER: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    PARTNERSHIP: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    SUPPORT_OR_COMPLAINT: 'text-red-400 bg-red-500/10 border-red-500/30',
    PROMPT_INJECTION_OR_ABUSE: 'text-red-500 bg-red-600/10 border-red-600/30',
    UNKNOWN: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
  };

  const sourceColors = {
    DETERMINISTIC: 'text-emerald-400',
    LLM_CLASSIFIER: 'text-cyan-400',
    CACHE: 'text-blue-400',
    FALLBACK: 'text-amber-400',
  };

  if (loading) {
    return (
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="text-slate-500 text-xs animate-pulse">Loading Agent Timeline...</div>
      </div>
    );
  }

  if (timeline.length === 0) {
    return (
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 shadow-lg">
        <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4" />
          Agent Timeline
        </h4>
        <div className="text-slate-500 text-xs text-center py-4">No orchestration data yet</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 shadow-lg shadow-cyan-900/10">
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
        <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Agent Orchestration Timeline
        </h4>
        <span className="text-[10px] text-slate-500">{timeline.length} events</span>
      </div>

      <div className="space-y-3 max-h-[360px] overflow-y-auto">
        {timeline.map((entry, idx) => (
          <div key={entry.id || idx} className="relative pl-6 border-l-2 border-slate-700/60 pb-3">
            {/* Timeline dot */}
            <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-cyan-500 ring-2 ring-slate-900" />

            <div className="flex flex-wrap items-center gap-2 mb-1">
              {/* Intent Badge */}
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${intentColors[entry.detectedIntent] || intentColors.UNKNOWN}`}>
                {entry.detectedIntent || 'UNKNOWN'}
              </span>

              {/* Source Badge */}
              <span className={`text-[10px] font-mono ${sourceColors[entry.routerSource] || 'text-slate-500'}`}>
                via {entry.routerSource}
              </span>

              {/* Confidence */}
              {entry.routingConfidence != null && (
                <span className="text-[10px] text-slate-500">
                  ({Math.round(entry.routingConfidence * 100)}%)
                </span>
              )}

              {/* Latency */}
              {entry.totalLatencyMs != null && (
                <span className="text-[10px] text-slate-600 ml-auto flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {entry.totalLatencyMs}ms
                </span>
              )}
            </div>

            {/* Selected Agents */}
            {entry.selectedAgents && entry.selectedAgents.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {entry.selectedAgents.map((agent, i) => (
                  <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    ✓ {agent}
                  </span>
                ))}
              </div>
            )}

            {/* Skipped Agents */}
            {entry.skippedAgents && entry.skippedAgents.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {entry.skippedAgents.map((agent, i) => (
                  <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-700/40 text-slate-500 border border-slate-600/20">
                    ⊘ {agent}
                  </span>
                ))}
              </div>
            )}

            {/* Status & Guardrail */}
            {entry.status && entry.status !== 'COMPLETED' && (
              <div className="mt-1 text-[10px] text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {entry.status}
              </div>
            )}

            {/* Reason */}
            {entry.reason && (
              <div className="text-[10px] text-slate-500 mt-1 italic truncate max-w-md" title={entry.reason}>
                {entry.reason}
              </div>
            )}

            {/* Timestamp */}
            <div className="text-[9px] text-slate-600 mt-1">
              {new Date(entry.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EqoreLeadsPage;
