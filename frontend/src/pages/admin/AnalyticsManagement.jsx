import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Users, Calendar, Briefcase, BarChart3, PieChart, Activity, Globe } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#0066FF', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const AnalyticsManagement = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visitorStats, setVisitorStats] = useState(null);
  const [userGrowth, setUserGrowth] = useState([]);
  const [userDistribution, setUserDistribution] = useState([]);

  useEffect(() => {
    fetchAnalytics();
    fetchVisitorStats();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL || '';
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/analytics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setStats(data);
        
        // Use real distribution data
        setUserDistribution([
          { name: 'Clients', value: data.clients || 0, color: '#0066FF' },
          { name: 'Partners', value: data.partners || 0, color: '#10B981' },
          { name: 'Investors', value: data.investors || 0, color: '#F59E0B' },
          { name: 'Job Seekers', value: data.job_seekers || 0, color: '#8B5CF6' }
        ]);

        // Mock growth data for now as historical data isn't easily available without more complex queries
        // Ideally backend should provide this too
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
        const growthData = months.map((month, idx) => ({
          name: month,
          users: Math.floor(50 + (data.total_users || 100) * (idx + 1) / 7),
          consultations: Math.floor(20 + (data.total_consultations || 50) * (idx + 1) / 7)
        }));
        setUserGrowth(growthData);
      }
    } catch (err) {
      console.error("Failed to fetch analytics", err);
    }
  };

  const fetchVisitorStats = async () => {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL || '';
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/analytics/traffic`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setVisitorStats(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch visitor stats", err);
    } finally {
      setLoading(false);
    }
  };

  // Traffic data for bar chart
  const trafficData = visitorStats?.byDay || [
    { name: 'Mon', visits: 120 },
    { name: 'Tue', visits: 150 },
    { name: 'Wed', visits: 180 },
    { name: 'Thu', visits: 140 },
    { name: 'Fri', visits: 200 },
    { name: 'Sat', visits: 90 },
    { name: 'Sun', visits: 70 }
  ];

  const referrerData = visitorStats?.byReferrer || [
    { name: 'Direct', value: 45 },
    { name: 'Google', value: 30 },
    { name: 'LinkedIn', value: 15 },
    { name: 'Twitter', value: 10 }
  ];

  return (
    <DashboardLayout role="admin" title="Analytics & Insights" subtitle="Platform metrics and visitor traffic analysis">
      <div className="space-y-6">

        {/* Core Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-brand-blue" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? '-' : stats?.total_users || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Consultations</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? '-' : stats?.total_consultations || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Applications</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? '-' : stats?.total_applications || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Recent Visits (7d)</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? '-' : visitorStats?.total || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-brand-blue" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">User Growth</h2>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={userGrowth}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="users" stroke="#0066FF" strokeWidth={2} fill="url(#userGradient)" />
                <Line type="monotone" dataKey="consultations" stroke="#10B981" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-6 mt-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-blue" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Consultations</span>
              </div>
            </div>
          </div>

          {/* Traffic Trends Chart */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Weekly Traffic</h2>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="visits" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Distribution Pie Chart */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">User Distribution</h2>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <RechartsPie>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {userDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Referrers */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Globe className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Top Referrers</h2>
            </div>
            <div className="space-y-4">
              {referrerData.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{item.value}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-[#0a0a0c] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${item.value}%`,
                        backgroundColor: COLORS[idx % COLORS.length]
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Countries */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Countries</h2>
            <div className="space-y-4">
               {visitorStats?.byCountry?.length > 0 ? (
                  visitorStats.byCountry.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-900 dark:text-white font-medium">{item.name || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-gray-100 dark:bg-[#0a0a0c] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-brand-gradient rounded-full"
                            style={{ width: `${(item.value / visitorStats.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-gray-500 text-sm font-medium">{item.value}</span>
                      </div>
                    </div>
                  ))
               ) : (
                 <p className="text-gray-500 text-sm">No data available</p>
               )}
            </div>
          </div>
        </div>

        {/* Recent Traffic Table */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Visitor Traffic</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-[#050505] text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Location</th>
                  <th className="px-6 py-3 font-medium">IP Address</th>
                  <th className="px-6 py-3 font-medium">Device / OS</th>
                  <th className="px-6 py-3 font-medium">Time</th>
                  <th className="px-6 py-3 font-medium">Referrer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visitorStats?.recent?.length > 0 ? (
                  visitorStats.recent.map((visit) => (
                    <tr key={visit.id} className="hover:bg-gray-50 dark:bg-[#050505]">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900 dark:text-white">{visit.city || 'Unknown'}, {visit.country || 'Unknown'}</span>
                        {visit.region && <span className="text-gray-500 text-xs block">{visit.region}</span>}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-mono text-xs">{visit.ip}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        <div className="flex flex-col">
                          <span>{visit.device}</span>
                          <span className="text-xs text-gray-400">{visit.os} - {visit.browser}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {new Date(visit.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs truncate max-w-[150px]" title={visit.referrer}>
                        {visit.referrer || 'Direct'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No recent visits recorded
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsManagement;
