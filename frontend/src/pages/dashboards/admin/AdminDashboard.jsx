import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { MessageSquare } from 'lucide-react'; // Import icons used
import DashboardLayout from '../../../components/DashboardLayout';
import { useAuth } from '../../../context/AuthContext';
import StatCard from '../../../components/dashboard/StatCard';
import ActivityTimeline from '../../../components/dashboard/ActivityTimeline';
import GrowthChart from '../../../components/charts/GrowthChart';
import DistributionChart from '../../../components/charts/DistributionChart';
import ConsultationStatusChart from '../../../components/charts/ConsultationStatusChart';
import EmailActivityChart from '../../../components/charts/EmailActivityChart';
import { useAdminDashboard, useAdminUsers, useAdminContent } from '../../../hooks/useDashboardData';
import ObligationsWidget from '../../../components/admin/ObligationsWidget';

// ... imports
import { Users, FileText, BarChart3, LayoutDashboard, Calendar, Mail, Briefcase, ArrowRight, Database, Zap, Home, Activity, ChevronDown } from 'lucide-react';

/**
 * Admin Dashboard - Platform Overview
 * Primary context for the Admin role.
 */
const AdminDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState('30d'); // Default 30 days
  
  // Data Hooks
  const { stats: statsQuery, content: latestContentQuery } = useAdminDashboard({ dateRange });
  // Fetch Consultation Stats
  const { data: consultationStats } = useQuery({
    queryKey: ['admin-consultations-stats'],
    queryFn: async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/consultations/stats`, {
             headers: { Authorization: `Bearer ${token}` }
        });
        return res.data.stats;
    }
  });

  const usersQuery = useAdminUsers();
  
  // Derived Data
  const stats = statsQuery.data;
  const allUsers = usersQuery.data || [];
  const pendingUsers = allUsers.filter(u => u.status === 'INACTIVE' || u.status === 'SUSPENDED');
  const recentSignups = stats?.recent_signups || [];
  const latestContent = latestContentQuery.data || [];
  const loading = statsQuery.isLoading;

  return (
    <DashboardLayout 
      role="admin" 
      title="Platform Overview" 
      subtitle={`Welcome back, ${user?.name || 'Admin'}. Here's what's happening.`}
    >
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
         
         {/* Date Filter & Actions */}
         <div className="flex justify-end mb-2">
            <div className="relative">
               <select 
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 text-gray-700 dark:text-gray-300 py-2 pl-4 pr-10 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-blue/20 hover:border-brand-blue transition-colors font-medium text-sm"
               >
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 3 Months</option>
                  <option value="12m">Last 12 Months</option>
                  <option value="all">All Time</option>
               </select>
               <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
         </div>

         {/* Pending Consultations Widget (Top Priority) */}
         {consultationStats?.pending > 0 && (
             <div className="bg-brand-gradient rounded-2xl p-6 mb-8 flex items-center justify-between shadow-lg relative overflow-hidden animate-in slide-in-from-top-2">
                {/* Background Pattern */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden pointer-events-none"></div>
                
                <div className="flex items-center gap-5 relative z-10">
                    <div className="p-3 bg-white dark:bg-gray-900 dark:border-gray-800/20 backdrop-blur-sm rounded-xl text-white border border-white/20 shadow-inner">
                        <MessageSquare className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">Consultation Requests</h3>
                        <p className="text-blue-100 mt-1">
                           You have <span className="font-bold text-white bg-white dark:bg-black/20 px-2 py-0.5 rounded text-sm">{consultationStats.pending} pending</span> requests awaiting your review.
                        </p>
                    </div>
                </div>
                <a 
                  href="/dashboard/admin/consultations"
                  className="px-6 py-2.5 bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue text-sm font-bold rounded-xl hover:bg-blue-50 transition-all shadow-md flex items-center gap-2 group relative z-10"
                >
                    Review Requests
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
             </div>
         )}

         {/* Stats Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
               title="Total Users" 
               value={stats?.total_users || 0} 
               icon={Users} 
               color="blue"
               trend={stats?.user_growth_rate ? `${stats.user_growth_rate}%` : "0%"} 
               trendUp={stats?.user_growth_rate >= 0}
               loading={statsQuery.isLoading}
            />
            <StatCard 
               title="Total Content" 
               value={stats?.total_content || latestContent?.length || 0} 
               icon={FileText} 
               color="purple"
               trend="5 New" 
               trendUp={true}
               trendLabel="this week"
               loading={latestContentQuery.isLoading}
            />
             <StatCard 
               title="Pending Approvals" 
               value={pendingUsers?.length || 0} 
               icon={Activity} 
               color="amber"
               trendNeutral={pendingUsers?.length === 0}
               trend={pendingUsers?.length > 0 ? "Action Required" : "All Clear"}
               trendUp={pendingUsers?.length === 0}
               trendLabel="users"
               loading={usersQuery.isLoading}
            />
             <StatCard 
               title="System Status" 
               value="Healthy" 
               icon={Zap} 
               color="green"
               trend="99.9%" 
               trendLabel="uptime"
               trendUp={true}
               loading={false}
            />
         </div>

         {/* Charts Section */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
               <GrowthChart 
                  title={`User Growth (${dateRange === 'all' ? 'All Time' : dateRange})`}
                  data={stats?.user_growth || []} 
                  loading={statsQuery.isLoading}
               />
            </div>
            <div>
               <DistributionChart 
                  title="User Distribution" 
                  data={[
                     { name: 'Clients', value: stats?.by_role?.clients || 0 },
                     { name: 'Partners', value: stats?.by_role?.partners || 0 },
                     { name: 'Investors', value: stats?.by_role?.investors || 0 },
                     { name: 'Job Seekers', value: stats?.by_role?.job_seekers || 0 }
                  ]}
                  loading={statsQuery.isLoading}
               />
            </div>
         </div>

         {/* New Infographics Section */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <EmailActivityChart 
               data={stats?.email_stats || []}
               loading={statsQuery.isLoading}
            />
            <ConsultationStatusChart 
               data={stats?.consultation_stats || {}}
               loading={statsQuery.isLoading}
            />
         </div>

         <div className="grid lg:grid-cols-3 gap-6">
            {/* Activity Timeline (2/3 width) */}
            <div className="lg:col-span-2">
               <ActivityTimeline 
                  activities={[
                     ...(recentSignups?.slice(0,5).map(u => ({
                        type: 'user_signup',
                        title: 'New User Registration',
                        description: `${u.name} (${u.role}) joined${u.company ? ` from ${u.company}` : ''}`,
                        time: new Date(u.createdAt).toLocaleDateString(),
                        highlight: u.role
                     })) || []),
                      ...(latestContent?.slice(0,3).map(c => ({
                        type: 'content_publish',
                        title: 'Content Update',
                        description: `"${c.title}" was updated/created`,
                        time: new Date(c.updatedAt || Date.now()).toLocaleDateString(),
                     })) || [])
                  ]}
                  loading={loading}
               />
            </div>

            {/* Quick Actions (1/3 width) */}
            <div className="space-y-6">
               <div className="bg-brand-gradient rounded-2xl p-6 text-white shadow-lg">
                  <h3 className="text-xl font-bold mb-2">Pending Actions</h3>
                  <p className="opacity-90 mb-6 text-sm">You have {pendingUsers?.length || 0} user request(s) waiting for review.</p>
                  <a 
                     href="/dashboard/admin/users"
                     className="block w-full text-center py-2 bg-white dark:bg-gray-900 dark:border-gray-800/20 hover:bg-white dark:bg-gray-900 dark:border-gray-800/30 backdrop-blur-sm rounded-lg font-medium transition-colors border border-white/30"
                  >
                     Review Users
                  </a>
               </div>

               {/* New Accountability Widget */}
               <div className="h-[300px]">
                  <ObligationsWidget />
               </div>

               <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4">Quick Links</h4>
                   <div className="space-y-3">
                      <a href="/dashboard/admin/content" className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors group">
                         <span className="font-medium text-sm">Create Content</span>
                         <FileText className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                      </a>
                      <a href="/dashboard/admin/settings" className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 hover:bg-blue-50 hover:text-brand-blue transition-colors group">
                         <span className="font-medium text-sm">System Settings</span>
                         <Zap className="w-4 h-4 text-gray-400 group-hover:text-brand-blue" />
                      </a>
                      <a href="/dashboard/admin/clients" className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors group">
                         <span className="font-medium text-sm">Manage Clients</span>
                         <Briefcase className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                      </a>
                   </div>
               </div>
            </div>
         </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
