import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  Target,
  MessageSquare,
  Hash,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const API_URL = import.meta.env.VITE_BACKEND_URL || '';
const COLORS = ['#2564ea', '#4ab6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

const StatCard = ({ icon: Icon, label, value, sublabel }) => (
  <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d0d10] p-4">
    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest font-bold">
      <Icon className="w-3.5 h-3.5" /> {label}
    </div>
    <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</div>
    {sublabel && (
      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{sublabel}</div>
    )}
  </div>
);

const ConciergeAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(30);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/concierge/analytics?days=${days}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    load();
  }, [days]);

  const intentChart = useMemo(() => data?.intents || [], [data]);
  const guardrailChart = useMemo(() => data?.guardrailTrips || [], [data]);
  const tokensChart = useMemo(() => data?.tokensByDay || [], [data]);
  const dropoffChart = useMemo(() => data?.dropoffByTurn || [], [data]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link
              to="/dashboard/admin"
              className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-3 h-3" /> Back to Admin
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent" /> eQORE Concierge Analytics
            </h1>
            {data && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {data.conversations} conversations, {data.totalTurns} turns over the last {data.windowDays} days.
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value, 10))}
              className="text-xs bg-white dark:bg-[#0d0d10] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="text-xs bg-brand-blue text-white px-3 py-2 rounded-lg flex items-center gap-1 disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <Link
              to="/dashboard/admin/concierge/knowledge"
              className="text-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-2 rounded-lg"
            >
              Knowledge base →
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5 p-3 text-sm text-red-700 dark:text-red-300">
            Failed to load analytics: {error}
          </div>
        )}

        {data && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <StatCard
                icon={MessageSquare}
                label="Conversations"
                value={data.conversations}
                sublabel={`${data.totalTurns} turns`}
              />
              <StatCard
                icon={Target}
                label="Leads captured"
                value={data.leadsCaptured}
                sublabel={`${(data.conversionRate * 100).toFixed(1)}% conversion`}
              />
              <StatCard
                icon={Hash}
                label="Citation coverage"
                value={`${(data.citationCoverage * 100).toFixed(0)}%`}
                sublabel="of assistant turns cited a chunk"
              />
              <StatCard
                icon={TrendingUp}
                label="Output tokens"
                value={data.tokens.output.toLocaleString()}
                sublabel={`${data.tokens.cacheRead.toLocaleString()} cached`}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d0d10] p-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Intent distribution
                </h3>
                {intentChart.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <RechartsPie>
                      <Pie
                        data={intentChart}
                        dataKey="count"
                        nameKey="intent"
                        innerRadius={50}
                        outerRadius={90}
                        paddingAngle={2}
                      >
                        {intentChart.map((entry, idx) => (
                          <Cell key={entry.intent} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPie>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-500">No data yet.</p>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d0d10] p-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  <ShieldAlert className="inline w-4 h-4 mr-1 text-amber-500" />
                  Guardrail trips
                </h3>
                {guardrailChart.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={guardrailChart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.2)" />
                      <XAxis dataKey="rule" stroke="#94a3b8" fontSize={10} />
                      <YAxis stroke="#94a3b8" fontSize={10} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-500">No guardrail trips in this window.</p>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d0d10] p-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Tokens per day
                </h3>
                {tokensChart.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={tokensChart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.2)" />
                      <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
                      <YAxis stroke="#94a3b8" fontSize={10} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="input" stroke="#2564ea" name="Input" />
                      <Line type="monotone" dataKey="output" stroke="#4ab6d4" name="Output" />
                      <Line type="monotone" dataKey="cacheRead" stroke="#10b981" name="Cached" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-500">No token usage recorded.</p>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d0d10] p-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Drop-off by turn
                </h3>
                {dropoffChart.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={dropoffChart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.2)" />
                      <XAxis dataKey="turn" stroke="#94a3b8" fontSize={10} />
                      <YAxis stroke="#94a3b8" fontSize={10} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#2564ea" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-500">No conversations yet.</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
              <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d0d10] p-4 lg:col-span-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Top questions
                </h3>
                {data.topQuestions.length === 0 ? (
                  <p className="text-xs text-slate-400 dark:text-slate-500">No user questions captured yet.</p>
                ) : (
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">
                        <th className="text-left font-bold px-2 py-1 w-12">#</th>
                        <th className="text-left font-bold px-2 py-1">Question</th>
                        <th className="text-right font-bold px-2 py-1 w-16">Asked</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topQuestions.map((q, i) => (
                        <tr key={i} className="border-t border-slate-100 dark:border-white/5">
                          <td className="px-2 py-2 text-slate-400">{i + 1}</td>
                          <td className="px-2 py-2 text-slate-700 dark:text-slate-200">{q.sample}</td>
                          <td className="px-2 py-2 text-right font-semibold text-slate-900 dark:text-white">
                            {q.count}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d0d10] p-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Feedback</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-emerald-50 dark:bg-emerald-500/5 p-3 text-center">
                    <ThumbsUp className="w-4 h-4 mx-auto text-emerald-600 dark:text-emerald-400" />
                    <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">
                      {data.feedback.up}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-emerald-600/80 dark:text-emerald-400/80 font-bold">
                      Helpful
                    </div>
                  </div>
                  <div className="rounded-lg bg-rose-50 dark:bg-rose-500/5 p-3 text-center">
                    <ThumbsDown className="w-4 h-4 mx-auto text-rose-600 dark:text-rose-400" />
                    <div className="text-xl font-bold text-rose-700 dark:text-rose-300 mt-1">
                      {data.feedback.down}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-rose-600/80 dark:text-rose-400/80 font-bold">
                      Not helpful
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-[10px] text-slate-500 dark:text-slate-400">
                  Index: {data.retrievalIndex.chunks} chunks
                  {data.retrievalIndex.embeddingsConfigured ? ' (Voyage embeddings active)' : ' (in-prompt fallback — VOYAGE_API_KEY not set)'}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConciergeAnalytics;
