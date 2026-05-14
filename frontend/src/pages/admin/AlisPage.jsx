import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  BrainCircuit, TrendingUp, DollarSign, Target, Users, Zap, BarChart3,
  AlertTriangle, Flame, BookOpen, ChevronRight, Clock, Activity,
  ArrowUpRight, ArrowDownRight, RefreshCw, FileText, Crosshair,
  Sparkles, Calendar, ShieldCheck, Lightbulb
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';
const API = `${BACKEND_URL}/api/admin/alis`;

const TABS = [
  { key: 'revenue', label: 'Revenue', icon: DollarSign },
  { key: 'departments', label: 'Departments', icon: BarChart3 },
  { key: 'services', label: 'Services', icon: Target },
  { key: 'intent', label: 'Buyer Intent', icon: Crosshair },
  { key: 'sales', label: 'Sales Perf.', icon: Activity },
  { key: 'content', label: 'Content Gaps', icon: BookOpen },
  { key: 'alerts', label: 'Alerts', icon: AlertTriangle },
];

const RANGES = [
  { key: '30m', label: '30m' },
  { key: '1h', label: '1h' },
  { key: '6h', label: '6h' },
  { key: '12h', label: '12h' },
  { key: 'today', label: 'Today' },
  { key: '7d', label: '7d' },
  { key: '30d', label: '30d' },
  { key: '90d', label: '90d' },
  { key: 'all', label: 'All' },
];

const MetricCard = ({ label, value, icon: Icon, trend, color = 'cyan' }) => (
  <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl backdrop-blur-xl relative overflow-hidden group hover:border-slate-700 transition-colors">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <Icon className={`w-12 h-12 text-${color}-400`} />
    </div>
    <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{label}</div>
    <div className="text-3xl font-bold text-white">{value}</div>
    {trend && (
      <div className={`flex items-center gap-1 mt-2 text-[10px] font-medium ${trend.up ? 'text-emerald-400' : 'text-rose-400'}`}>
        {trend.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {trend.label}
      </div>
    )}
  </div>
);

const AlisPage = () => {
  const [activeTab, setActiveTab] = useState('revenue');
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [tabData, setTabData] = useState(null);

  const fetchOverview = async () => {
    try {
      const res = await axios.get(`${API}/overview?timeRange=${timeRange}`, { withCredentials: true });
      setOverview(res.data);
    } catch (e) { console.error('ALIS overview error:', e); }
  };

  const fetchTabData = async () => {
    setLoading(true);
    try {
      const endpointMap = {
        revenue: 'revenue', departments: 'departments', services: 'services',
        intent: 'buyer-intent', sales: 'sales-performance', content: 'content-gaps', alerts: 'alerts',
      };
      const endpoint = endpointMap[activeTab];
      const res = await axios.get(`${API}/${endpoint}?timeRange=${timeRange}`, { withCredentials: true });
      setTabData(res.data);
    } catch (e) { console.error('ALIS tab error:', e); }
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchOverview(); }, [timeRange]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchTabData(); }, [activeTab, timeRange]);

  // ======================== Revenue Tab ========================
  const RevenueTab = () => {
    if (!tabData) return null;
    const stages = tabData.stageBreakdown || {};
    const topOpps = tabData.topOpportunities || [];
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Total Pipeline" value={`$${(tabData.totalPipeline / 1000).toFixed(1)}k`} icon={DollarSign} color="emerald" />
          <MetricCard label="Weighted Pipeline" value={`$${(tabData.weightedPipeline / 1000).toFixed(1)}k`} icon={TrendingUp} color="cyan" />
          <MetricCard label="Win Rate" value={`${tabData.winRate}%`} icon={ShieldCheck} color="emerald" />
          <MetricCard label="Won / Lost" value={`${tabData.winCount} / ${tabData.lossCount}`} icon={Target} color="amber" />
        </div>

        {/* Stage Breakdown */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-cyan-400" /> Pipeline by Stage</h3>
          {Object.keys(stages).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stages).map(([stage, data]) => (
                <div key={stage} className="flex items-center gap-4">
                  <div className="w-32 text-xs text-slate-400 font-medium uppercase truncate">{stage.replace(/_/g, ' ')}</div>
                  <div className="flex-1 h-6 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full flex items-center px-3"
                      style={{ width: `${Math.max(8, Math.min(100, (data.count / Math.max(1, ...Object.values(stages).map(s => s.count))) * 100))}%` }}>
                      <span className="text-[10px] text-white font-bold">{data.count}</span>
                    </div>
                  </div>
                  <div className="w-20 text-right text-xs text-slate-400 font-mono">${(data.value / 1000).toFixed(1)}k</div>
                </div>
              ))}
            </div>
          ) : <p className="text-slate-500 text-sm">No pipeline stages recorded yet.</p>}
        </div>

        {/* Top Opportunities */}
        {topOpps.length > 0 && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-400" /> Top Opportunities</h3>
            <div className="space-y-3">
              {topOpps.map((opp, i) => (
                <div key={opp.id} className="flex items-center justify-between bg-slate-950/50 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">#{i + 1}</div>
                    <div>
                      <div className="text-sm font-semibold text-white">{opp.lead?.companyName || opp.lead?.email || 'Unknown'}</div>
                      <div className="text-[10px] text-slate-500">{opp.lead?.primaryDepartment || 'Unassigned'} · {opp.stage}</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-emerald-400 font-mono">${Number(opp.estimatedValue || 0).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ======================== Departments Tab ========================
  const DepartmentsTab = () => {
    const depts = tabData?.departments || [];
    return (
      <div className="space-y-6">
        {depts.length > 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Department</th>
                  <th className="px-6 py-4 font-medium text-center">Leads</th>
                  <th className="px-6 py-4 font-medium text-center">Hot</th>
                  <th className="px-6 py-4 font-medium text-center">Booked</th>
                  <th className="px-6 py-4 font-medium text-center">Avg Score</th>
                  <th className="px-6 py-4 font-medium text-right">Revenue</th>
                  <th className="px-6 py-4 font-medium text-center">Conv %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {depts.map((d, i) => (
                  <tr key={d.name} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-8 rounded-full ${i === 0 ? 'bg-cyan-400' : i === 1 ? 'bg-blue-400' : 'bg-slate-600'}`} />
                        <span className="font-semibold text-white">{d.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-white font-mono">{d.leadCount}</td>
                    <td className="px-6 py-4 text-center"><span className="text-rose-400 font-mono">{d.hotCount}</span></td>
                    <td className="px-6 py-4 text-center"><span className="text-emerald-400 font-mono">{d.bookedCount}</span></td>
                    <td className="px-6 py-4 text-center"><span className={`px-2 py-0.5 rounded text-xs font-bold ${d.avgScore >= 75 ? 'bg-amber-400/10 text-amber-400' : d.avgScore >= 50 ? 'bg-emerald-400/10 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>{d.avgScore}</span></td>
                    <td className="px-6 py-4 text-right text-white font-mono">${(d.totalRevenue / 1000).toFixed(1)}k</td>
                    <td className="px-6 py-4 text-center"><span className={`font-bold ${d.conversionRate >= 30 ? 'text-emerald-400' : d.conversionRate >= 15 ? 'text-amber-400' : 'text-slate-500'}`}>{d.conversionRate}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="text-slate-500 text-sm text-center py-12">No department data available for this period.</p>}
      </div>
    );
  };

  // ======================== Services Tab ========================
  const ServicesTab = () => {
    const services = tabData?.services || [];
    return (
      <div className="space-y-4">
        {services.length > 0 ? services.map((s, i) => (
          <div key={s.name} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex items-center justify-between hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-xl flex items-center justify-center text-white text-sm font-bold">{i + 1}</div>
              <div>
                <div className="text-sm font-semibold text-white">{s.name}</div>
                <div className="text-[10px] text-slate-500">{s.mentions} mentions · Avg Fit: {s.avgFitScore}%</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-emerald-400 font-mono">${(s.totalAcv / 1000).toFixed(1)}k</div>
              <div className="text-[9px] text-slate-500 uppercase">Total ACV</div>
            </div>
          </div>
        )) : <p className="text-slate-500 text-sm text-center py-12">No service data available.</p>}
      </div>
    );
  };

  // ======================== Buyer Intent Tab ========================
  const IntentTab = () => {
    if (!tabData) return null;
    const segments = tabData.visitorSegments || [];
    const sources = tabData.topSources || [];
    const urgency = tabData.urgencyBreakdown || {};
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visitor Segments */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-cyan-400" /> Visitor Segments</h3>
            <div className="space-y-3">
              {segments.map(s => (
                <div key={s.type} className="flex items-center justify-between bg-slate-950/50 border border-slate-800 rounded-lg p-3">
                  <span className="text-sm text-slate-300 font-medium">{s.type}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-500">Score: {s.avgScore}</span>
                    <span className="text-white font-bold font-mono">{s.count}</span>
                  </div>
                </div>
              ))}
              {segments.length === 0 && <p className="text-slate-500 text-sm">No segment data.</p>}
            </div>
          </div>

          {/* Urgency */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-4 flex items-center gap-2"><Flame className="w-4 h-4 text-rose-400" /> Urgency Distribution</h3>
            <div className="space-y-3">
              {Object.entries(urgency).map(([level, count]) => (
                <div key={level} className="flex items-center justify-between bg-slate-950/50 border border-slate-800 rounded-lg p-3">
                  <span className={`text-sm font-medium ${level === 'High' || level === 'Critical' ? 'text-rose-400' : level === 'Medium' ? 'text-amber-400' : 'text-slate-400'}`}>{level}</span>
                  <span className="text-white font-bold font-mono">{count}</span>
                </div>
              ))}
              {Object.keys(urgency).length === 0 && <p className="text-slate-500 text-sm">No urgency data.</p>}
            </div>
          </div>
        </div>

        {/* Top Sources */}
        {sources.length > 0 && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-4 flex items-center gap-2"><Crosshair className="w-4 h-4 text-blue-400" /> Top Source Pages</h3>
            <div className="space-y-2">
              {sources.map(s => (
                <div key={s.page} className="flex items-center justify-between py-2 border-b border-slate-800/50 last:border-0">
                  <span className="text-sm text-slate-300 font-mono truncate max-w-md">{s.page}</span>
                  <span className="text-white font-bold">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ======================== Sales Tab ========================
  const SalesTab = () => {
    if (!tabData) return null;
    const activities = tabData.activityBreakdown || {};
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Open Tasks" value={tabData.openTasks} icon={Clock} color="blue" />
          <MetricCard label="Overdue Tasks" value={tabData.overdueTasks} icon={AlertTriangle} color="rose" />
          <MetricCard label="Total Activities" value={tabData.totalActivities} icon={Activity} color="emerald" />
          <MetricCard label="Activity Types" value={Object.keys(activities).length} icon={BarChart3} color="amber" />
        </div>
        {Object.keys(activities).length > 0 && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-4">Activity Breakdown</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(activities).map(([type, count]) => (
                <div key={type} className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">{count}</div>
                  <div className="text-[10px] text-slate-500 uppercase mt-1">{type.replace(/_/g, ' ')}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ======================== Content Gaps Tab ========================
  const ContentTab = () => {
    const gaps = tabData?.gaps || [];
    return (
      <div className="space-y-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Unanswered Questions</div>
          <div className="text-3xl font-bold text-white">{tabData?.totalUnanswered || 0}</div>
        </div>
        {gaps.length > 0 ? (
          <div className="space-y-3">
            {gaps.map((g, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white mb-1">"{g.question}"</div>
                    <div className="text-[10px] text-slate-500">Asked {g.frequency}x · Departments: {g.departments.join(', ') || 'N/A'}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap ${g.recommendation.includes('blog') ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : g.recommendation.includes('FAQ') ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                    {g.recommendation}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : <p className="text-slate-500 text-sm text-center py-12">No content gaps detected.</p>}
      </div>
    );
  };

  // ======================== Alerts Tab ========================
  const AlertsTab = () => {
    const alerts = tabData?.alerts || [];
    const severityColor = (s) => {
      if (s === 'CRITICAL') return 'bg-red-500/10 border-red-500/30 text-red-400';
      if (s === 'HIGH') return 'bg-orange-500/10 border-orange-500/30 text-orange-400';
      if (s === 'MEDIUM') return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      return 'bg-slate-800 border-slate-700 text-slate-400';
    };
    return (
      <div className="space-y-3">
        {alerts.length > 0 ? alerts.map((a, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex items-start gap-4 hover:border-slate-700 transition-colors">
            <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase border shrink-0 ${severityColor(a.severity)}`}>{a.severity}</span>
            <div className="flex-1">
              <div className="text-sm text-white font-medium">{a.message}</div>
              <div className="text-[10px] text-slate-500 mt-1 uppercase">{a.type.replace(/_/g, ' ')}</div>
            </div>
          </div>
        )) : (
          <div className="text-center py-16">
            <ShieldCheck className="w-12 h-12 text-emerald-500/30 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">All clear — no executive alerts at this time.</p>
          </div>
        )}
      </div>
    );
  };

  const tabContent = {
    revenue: <RevenueTab />, departments: <DepartmentsTab />, services: <ServicesTab />,
    intent: <IntentTab />, sales: <SalesTab />, content: <ContentTab />, alerts: <AlertsTab />,
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 pt-24 font-sans text-slate-300 selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <BrainCircuit className="w-8 h-8 text-cyan-400" />
              Kangqore ALIS
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              Advanced Lead Intelligence System — Executive Revenue Command
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Time Range Selector */}
            <div className="flex bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex-wrap">
              {RANGES.map(r => (
                <button key={r.key} onClick={() => setTimeRange(r.key)}
                  className={`px-3 py-1.5 text-xs font-semibold transition-colors ${timeRange === r.key ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>
                  {r.label}
                </button>
              ))}
            </div>
            <button onClick={() => { fetchOverview(); fetchTabData(); }} className="p-2 bg-slate-900 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors">
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Executive Summary Strip */}
        {overview && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <MetricCard label="Total Pipeline" value={`$${(overview.totalPipeline / 1000).toFixed(1)}k`} icon={DollarSign} color="emerald" />
            <MetricCard label="Weighted Pipeline" value={`$${(overview.weightedPipeline / 1000).toFixed(1)}k`} icon={TrendingUp} color="cyan" />
            <MetricCard label="Active Leads" value={overview.totalLeads} icon={Users} color="blue" />
            <MetricCard label="Booking Rate" value={`${overview.bookingRate}%`} icon={Calendar} color="amber" />
            <MetricCard label="Avg Lead Score" value={overview.avgScore} icon={Zap} color="rose" />
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-1 border-b border-slate-800 overflow-x-auto pb-px">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === tab.key ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {loading && !tabData ? (
          <div className="py-20 text-center text-slate-500 animate-pulse">Loading ALIS Intelligence...</div>
        ) : (
          <div className="mt-2">{tabContent[activeTab]}</div>
        )}

        {/* Growth Recommendations - always at bottom */}
        <GrowthRecs timeRange={timeRange} />
      </div>
    </div>
  );
};

// ======================== Growth Recommendations ========================
const GrowthRecs = ({ timeRange }) => {
  const [recs, setRecs] = useState([]);
  useEffect(() => {
    axios.get(`${API}/growth-recs?timeRange=${timeRange}`, { withCredentials: true })
      .then(r => setRecs(r.data.recommendations || []))
      .catch(() => {});
  }, [timeRange]);

  if (recs.length === 0) return null;

  const priorityColor = (p) => p === 'HIGH' ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-slate-800 bg-slate-900/30';

  return (
    <div className="bg-gradient-to-br from-slate-900 to-cyan-950/20 border border-cyan-500/30 rounded-xl p-6 shadow-lg shadow-cyan-500/5">
      <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-widest flex items-center gap-2 mb-4">
        <Lightbulb className="w-4 h-4 text-amber-400" /> Strategic Growth Recommendations
      </h3>
      <div className="space-y-3">
        {recs.map((r, i) => (
          <div key={i} className={`border rounded-xl p-4 ${priorityColor(r.priority)}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold text-white">{r.title}</span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 uppercase">{r.category}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{r.reasoning}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlisPage;
