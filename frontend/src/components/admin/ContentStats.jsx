import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Eye, Clock, BookOpen, FileText, 
  Calendar, Newspaper, Download, FolderOpen, RefreshCw, Plus,
  ArrowUpRight, Share2, Smartphone, Monitor, Tablet,
  Globe, Users, Briefcase, MapPin
} from 'lucide-react';
import axios from 'axios';

/**
 * Content Stats Component - Instagram-style Professional Dashboard
 * Shows insights and analytics for all content types
 */

const CONTENT_TYPES = [
  { key: 'BLOG', label: 'Blogs', icon: BookOpen, color: 'blue' },
  { key: 'CASE_STUDY', label: 'Case Studies', icon: FolderOpen, color: 'emerald' },
  { key: 'WHITE_PAPER', label: 'White Papers', icon: FileText, color: 'purple' },
  { key: 'NEWS', label: 'News', icon: Newspaper, color: 'amber' },
  { key: 'EVENT', label: 'Events', icon: Calendar, color: 'pink' },
  { key: 'BROCHURE', label: 'Brochures', icon: Download, color: 'cyan' }
];

const SHARE_PLATFORMS = [
  { key: 'linkedin', label: 'LinkedIn', color: '#0077B5' },
  { key: 'twitter', label: 'Twitter', color: '#1DA1F2' },
  { key: 'facebook', label: 'Facebook', color: '#4267B2' },
  { key: 'whatsapp', label: 'WhatsApp', color: '#25D366' },
  { key: 'email', label: 'Email', color: '#EA4335' },
  { key: 'copy', label: 'Copy Link', color: '#6B7280' }
];

const ContentStats = ({ onCreateNew }) => {
  const [stats, setStats] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [demographics, setDemographics] = useState(null);
  const [recentContent, setRecentContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchStats(),
      fetchAnalytics(),
      fetchDemographics(),
      fetchRecentContent()
    ]);
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_URL}/api/admin/content/stats/overview`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching content stats:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_URL}/api/admin/content/analytics/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchDemographics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_URL}/api/admin/content/analytics/demographics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDemographics(response.data);
    } catch (error) {
      console.error('Error fetching demographics:', error);
    }
  };

  const fetchRecentContent = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_URL}/api/admin/content?limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecentContent(response.data.items || []);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: 'bg-blue-50', text: 'text-brand-blue', border: 'border-blue-200' },
      emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
      amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
      pink: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
      cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' }
    };
    return colors[color] || colors.blue;
  };

  const getContentIcon = (type) => {
    const found = CONTENT_TYPES.find(t => t.key === type);
    return found ? found.icon : FileText;
  };

  const getDeviceIcon = (device) => {
    if (device === 'mobile') return Smartphone;
    if (device === 'tablet') return Tablet;
    return Monitor;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          

        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-brand-gradient text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:brightness-110 transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Content
          </button>
          <button
            onClick={fetchAllData}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-brand-gradient rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white dark:bg-gray-900 dark:border-gray-800/20 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-sm bg-white dark:bg-black/20 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" /> All Time
            </span>
          </div>
          <p className="text-3xl font-bold">{stats?.total || 0}</p>
          <p className="text-blue-100">Total Content</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white dark:bg-gray-900 dark:border-gray-800/20 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-sm bg-white dark:bg-black/20 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> Views
            </span>
          </div>
          <p className="text-3xl font-bold">{analyticsData?.totalViews || 0}</p>
          <p className="text-emerald-100">Total Views</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white dark:bg-gray-900 dark:border-gray-800/20 rounded-xl flex items-center justify-center">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-sm bg-white dark:bg-black/20 px-2 py-1 rounded-full">
              Shares
            </span>
          </div>
          <p className="text-3xl font-bold">{analyticsData?.totalShares || 0}</p>
          <p className="text-purple-100">Total Shares</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white dark:bg-gray-900 dark:border-gray-800/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-sm bg-white dark:bg-black/20 px-2 py-1 rounded-full">
              Audience
            </span>
          </div>
          <p className="text-3xl font-bold">{demographics?.totalViewers || 0}</p>
          <p className="text-amber-100">Total Viewers</p>
        </div>
      </div>

      {/* Top Performers Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Viewed */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-green-600" />
            Most Viewed Content
          </h3>
          {analyticsData?.topViewed?.length > 0 ? (
            <div className="space-y-3">
              {analyticsData.topViewed.slice(0, 5).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#050505] rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{item.title || 'Untitled'}</p>
                      <p className="text-xs text-gray-500">{item.contentType}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-600">{item.views} views</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No view data yet</p>
          )}
        </div>

        {/* Most Shared */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-purple-600" />
            Most Shared Content
          </h3>
          {analyticsData?.topShared?.length > 0 ? (
            <div className="space-y-3">
              {analyticsData.topShared.slice(0, 5).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#050505] rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{item.title || 'Untitled'}</p>
                      <p className="text-xs text-gray-500">{item.contentType}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-purple-600">{item.shares} shares</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No share data yet</p>
          )}
        </div>
      </div>

      {/* Device & Platform Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-brand-blue" />
            Views by Device
          </h3>
          <div className="space-y-4">
            {Object.entries(analyticsData?.byDevice || {}).map(([device, count]) => {
              const Icon = getDeviceIcon(device);
              const total = Object.values(analyticsData?.byDevice || {}).reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={device} className="flex items-center gap-4">
                  <Icon className="w-5 h-5 text-gray-500" />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium capitalize">{device}</span>
                      <span className="text-sm text-gray-500">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-[#0a0a0c] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-gradient rounded-full transition-all" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            {Object.keys(analyticsData?.byDevice || {}).length === 0 && (
              <p className="text-gray-500 text-center py-4">No device data yet</p>
            )}
          </div>
        </div>

        {/* Share Platform Breakdown */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-purple-600" />
            Shares by Platform
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {SHARE_PLATFORMS.map(platform => {
              const count = analyticsData?.byPlatform?.[platform.key] || 0;
              return (
                <div 
                  key={platform.key}
                  className="p-4 rounded-xl border border-gray-100 text-center"
                  style={{ backgroundColor: `${platform.color}10` }}
                >
                  <p className="text-2xl font-bold" style={{ color: platform.color }}>{count}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{platform.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Demographics Section */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Audience Demographics
        </h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800/10 rounded-xl p-4">
            <p className="text-3xl font-bold">{demographics?.registeredViewers || 0}</p>
            <p className="text-gray-300 text-sm">Registered Users</p>
          </div>
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800/10 rounded-xl p-4">
            <p className="text-3xl font-bold">{demographics?.anonymousViewers || 0}</p>
            <p className="text-gray-300 text-sm">Visitors</p>
          </div>
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800/10 rounded-xl p-4">
            <p className="text-3xl font-bold">{Object.keys(demographics?.byRole || {}).length}</p>
            <p className="text-gray-300 text-sm">User Types</p>
          </div>
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800/10 rounded-xl p-4">
            <p className="text-3xl font-bold">{Object.keys(demographics?.byProfession || {}).length}</p>
            <p className="text-gray-300 text-sm">Professions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* By Role */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800/5 rounded-xl p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> By Role
            </h4>
            <div className="space-y-2">
              {Object.entries(demographics?.byRole || {}).map(([role, count]) => (
                <div key={role} className="flex justify-between items-center">
                  <span className="text-sm">{role === 'VISITOR' ? 'Visitors' : role}</span>
                  <span className="text-sm font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* By Gender */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800/5 rounded-xl p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" /> By Gender
            </h4>
            <div className="space-y-2">
              {Object.entries(demographics?.byGender || {}).map(([gender, count]) => (
                <div key={gender} className="flex justify-between items-center">
                  <span className="text-sm capitalize">{gender}</span>
                  <span className="text-sm font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* By Age Group */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800/5 rounded-xl p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> By Age Group
            </h4>
            <div className="space-y-2">
              {Object.entries(demographics?.byAgeGroup || {}).map(([age, count]) => (
                <div key={age} className="flex justify-between items-center">
                  <span className="text-sm">{age}</span>
                  <span className="text-sm font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Type Breakdown */}
      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Content by Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CONTENT_TYPES.map((type) => {
            const count = stats?.byType?.[type.key] || 0;
            const colors = getColorClasses(type.color);
            const Icon = type.icon;
            return (
              <button
                key={type.key}
                onClick={() => setSelectedType(type.key)}
                className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                  selectedType === type.key 
                    ? `${colors.border} ${colors.bg}` 
                    : 'border-transparent bg-gray-50 dark:bg-gray-800 dark:border-gray-700 hover:border-gray-200'
                }`}
              >
                <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
                <p className="text-sm text-gray-500">{type.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Health */}
      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Content Health
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Published Content</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-100 dark:bg-[#0a0a0c] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: `${Math.round(((stats?.byStatus?.PUBLISHED || 0) / (stats?.total || 1)) * 100)}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                {stats?.byStatus?.PUBLISHED || 0}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Draft Content</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-100 dark:bg-[#0a0a0c] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full" 
                  style={{ width: `${Math.round(((stats?.byStatus?.DRAFT || 0) / (stats?.total || 1)) * 100)}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                {stats?.byStatus?.DRAFT || 0}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Archived</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-100 dark:bg-[#0a0a0c] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gray-400 rounded-full" 
                  style={{ width: `${Math.round(((stats?.byStatus?.ARCHIVED || 0) / (stats?.total || 1)) * 100)}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                {stats?.byStatus?.ARCHIVED || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* All Content Listing */}
      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-blue" />
            All Content ({recentContent.filter(c => selectedType === 'all' || c.contentType === selectedType).length})
          </h3>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">All Types</option>
            {CONTENT_TYPES.map(t => (
              <option key={t.key} value={t.key}>{t.label}</option>
            ))}
          </select>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        ) : recentContent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-[#0a0a0c] rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Content Yet</h4>
            <p className="text-gray-500">Go to Content Management to create content</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#050505]">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-500 text-sm">Title</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-500 text-sm">Type</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-500 text-sm">Status</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-500 text-sm">Created</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-500 text-sm">Author</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentContent
                  .filter(item => selectedType === 'all' || item.contentType === selectedType)
                  .map((item) => {
                    const Icon = getContentIcon(item.contentType);
                    const typeConfig = CONTENT_TYPES.find(t => t.key === item.contentType);
                    const colors = typeConfig ? getColorClasses(typeConfig.color) : getColorClasses('blue');
                    
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 dark:bg-[#050505] transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
                              <Icon className={`w-5 h-5 ${colors.text}`} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{item.title}</p>
                              <p className="text-xs text-gray-500">/{item.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${colors.bg} ${colors.text} text-xs font-medium rounded-full`}>
                            {typeConfig?.label || item.contentType}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${
                            item.status === 'PUBLISHED' 
                              ? 'bg-green-100 text-green-700' 
                              : item.status === 'ARCHIVED'
                              ? 'bg-gray-100 dark:bg-[#0a0a0c] text-gray-600 dark:text-gray-400'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">
                          {item.author?.name || 'Unknown'}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentStats;
