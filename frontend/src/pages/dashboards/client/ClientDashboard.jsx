import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  FolderKanban, CheckCircle, Clock, AlertTriangle, FileText, 
  MessageSquare, Download, ArrowRight, RefreshCw, ExternalLink, Calendar, Video, Mail, Phone,
  Receipt, Shield, Activity
} from 'lucide-react';
import StatCard from '../../../components/dashboard/StatCard';
// import PerformanceBarChart from '../../../components/charts/PerformanceBarChart';
// import DistributionChart from '../../../components/charts/DistributionChart';
import ThreeDPieChart from '../../../components/charts/3d/ThreeDPieChart';
import ThreeDActivityLand from '../../../components/charts/3d/ThreeDActivityLand';
/*
- [ ] Client Dashboard: UI Refresh [/]
    - [x] Redesign Client Dashboard UI for premium look (No data changes) <!-- id: 10 -->
- [x] Implement 3D Infographics (Three.js) <!-- id: 11 -->
    - [x] Create ThreeDPieChart component
    - [x] Create ThreeDActivityLand component
    - [x] Integrate 3D charts into ClientDashboard.jsx [/]
        - [x] KPI Cards
        - [x] Alignment Pulse
        - [x] Active Engagements List
        - [x] Typography & Spacing adjustments
*/
import { useClientDashboard } from '../../../hooks/useDashboardData';
import ClientDeltas from '../../../components/dashboard/ClientDeltas';
import ClientRoadmap from '../../../components/dashboard/ClientRoadmap';

import ClientActionLedger from '../../../components/dashboard/ClientActionLedger';
import HealthScorecard from '../../../components/dashboard/HealthScorecard';
import ROIWidget from '../../../components/dashboard/ROIWidget';
import VelocityChart from '../../../components/dashboard/VelocityChart';
import ClientGovernance from '../../../components/dashboard/ClientGovernance';
import ImpactAnalyticsChart from '../../../components/charts/ImpactAnalyticsChart';
import MyAgreements from '../../../components/client/MyAgreements';
import ObligationsActionItems from '../../../components/client/ObligationsActionItems';
import ClientStrategicHub from '../../../components/dashboard/ClientStrategicHub';
import ClientFeedbackWidget from '../../../components/dashboard/ClientFeedbackWidget';
import ClientAuditWidget from '../../../components/dashboard/ClientAuditWidget';
import VisualTimeline from '../../../components/dashboard/VisualTimeline';
import DashboardSkeleton from '../../../components/dashboard/DashboardSkeleton';

import { useClientProfile } from '../../../hooks/useDashboardData';

const ClientDashboard = () => {
  const queryClient = useQueryClient();
  const { 
    stats: statsQuery, 
    projects: projectsQuery, 
    updates: updatesQuery, 
    deliverables: deliverablesQuery, 
    documents: documentsQuery, 
    tickets: ticketsQuery,
    settings: settingsQuery,
    summary: summaryQuery
  } = useClientDashboard();

  // Fetch upcoming meeting specifically for this dashboard widget
  // Ideally this should be in useClientDashboard, but fetching here for now or assuming it's part of 'stats' or new endpoint
  // For MVP, using a placeholder or future implementation integration
  const upcomingMeeting = null; // Replace with data from API

  // Data
  const stats = statsQuery.data;
  const projects = projectsQuery.data || [];
  const updates = updatesQuery.data || [];
  const deliverables = deliverablesQuery.data || [];
  const documents = documentsQuery.data || [];
  const tickets = ticketsQuery.data || [];

  // Get User from localStorage or Context (Assuming it's there based on auth flow)
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const { data: profile } = useClientProfile(storedUser?.id);
  
  // Loading State
  const loading = statsQuery.isLoading || projectsQuery.isLoading;

  const handleRefresh = () => {
    queryClient.invalidateQueries(['dashboard', 'client']);
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      pending: 'bg-amber-100 text-amber-700',
      open: 'bg-red-100 text-red-700',
      in_progress: 'bg-purple-100 text-purple-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <DashboardLayout 
      role="client" 
      title="Client Dashboard" 
      subtitle="Real-time visibility into your engagement with Kangqore"
    >
      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Action Items (Obligations) - High Priority */}
          <ObligationsActionItems />

          {/* Client Action Ledger (Responsibility Mirror) */}
          <ClientActionLedger />

          {/* New Strategic & Tactical Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
                <ClientRoadmap />
            </div>
            <div>
                <ClientDeltas />
            </div>
          </div>
      {/* Refresh Button */}
      <div className="flex justify-end mb-4">
        <button 
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-lg transition-colors"
          data-testid="refresh-dashboard-btn"
        >
          <RefreshCw className={`w-4 h-4 ${statsQuery.isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Enterprise Status & Alignment Pulse (Phase 7) */}
      <div className="bg-brand-gradient rounded-2xl p-8 mb-10 text-white shadow-2xl relative overflow-hidden group">
          {/* Background Decor - Premium Abstract Shapes */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white dark:bg-black/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none mix-blend-overlay"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-400/10 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
          

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
              {/* Left: Engagement Status */}
              <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-white/10 pb-8 lg:pb-0 lg:pr-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${stats?.engagement_status === 'On Track' ? 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.6)]' : 'bg-amber-400'} animate-pulse`} />
                    <h3 className="text-xl font-bold text-white tracking-tight">Engagement Health</h3>
                </div>
                <p className="text-blue-200 text-sm mb-4">
                    Current phase is <strong className="text-white">{stats?.current_phase || 'Execution'}</strong>. 
                    Next milestone due on <span className="text-white font-mono">{stats?.next_milestone_date}</span>.
                </p>
                <div className="flex gap-2">
                    <span className="px-2 py-1 rounded bg-white dark:bg-gray-900 dark:border-gray-800/10 border border-white/20 text-xs font-bold text-blue-100">
                        {stats?.engagement_status || 'Active'}
                    </span>
                    <span className="px-2 py-1 rounded bg-white dark:bg-gray-900 dark:border-gray-800/10 border border-white/20 text-xs font-bold text-blue-100">
                        {stats?.active_projects || 0} Streams
                    </span>
                </div>
              </div>

              {/* Middle: Alignment Pulse Widget (The "Silent Misalignment" Detector) */}
              <div className="lg:col-span-2 flex flex-col justify-between relative z-10">
                 <div className="flex justify-between items-start mb-6">
                     <div>
                        <h4 className="text-xs font-bold text-blue-200 uppercase tracking-widest flex items-center gap-2 mb-1">
                            <Activity className="w-4 h-4 text-blue-400" /> Alignment Pulse
                        </h4>
                        <p className="text-sm text-blue-100/80 font-medium">Real-time convergence of Client Clarity vs. Internal Confidence.</p>
                     </div>
                     <div className="text-right hidden sm:block">
                        {projects[0]?.adminConfidenceScore && projects[0]?.clientSentimentScore && Math.abs(projects[0].adminConfidenceScore - projects[0].clientSentimentScore) > 20 ? (
                            <span className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-200 text-xs font-bold rounded-full animate-pulse backdrop-blur-sm shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                ⚠️ Misalignment Detected
                            </span>
                        ) : (
                            <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs font-bold rounded-full backdrop-blur-sm shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                ✓ Strong Alignment
                            </span>
                        )}
                     </div>
                 </div>

                 {/* Visualization Bars */}
                 <div className="space-y-8">
                     {projects[0] ? (
                        <>
                            {/* Client Sentiment (Interactive) */}
                            <div className="relative group">
                                <div className="flex justify-between text-xs font-bold mb-2">
                                    <span className="text-white tracking-wide">Your Clarity Score</span>
                                    <span className="text-blue-300 font-mono">{projects[0].clientSentimentScore || 50}%</span>
                                </div>
                                <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden cursor-pointer relative shadow-inner">
                                    <div 
                                        className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 rounded-full transition-all duration-500 relative" 
                                        style={{ width: `${projects[0].clientSentimentScore || 50}%` }} 
                                    >
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] opacity-100 ring-4 ring-blue-500/30"></div>
                                    </div>
                                    {/* Interaction Hit Area */}
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                        title="Adjust your clarity score"
                                        onChange={(e) => {
                                            const newScore = parseInt(e.target.value);
                                            // Simulated API Call
                                            const token = localStorage.getItem('token');
                                            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/projects/${projects[0].id}/pulse/client`, {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                                                body: JSON.stringify({ score: newScore })
                                            }).then(() => handleRefresh());
                                        }}
                                    />
                                </div>
                                <p className="text-[10px] text-blue-300/60 mt-2 opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-5 w-full text-center tracking-wider">DRAG TO ADJUST SENTIMENT</p>
                            </div>

                            {/* Admin Confidence */}
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-2">
                                    <span className="text-blue-200/60 tracking-wide">Kangqore Internal Confidence</span>
                                    <span className="text-blue-200/60 font-mono">{projects[0].adminConfidenceScore || 90}%</span>
                                </div>
                                <div className="w-full bg-black/10 h-1.5 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            (projects[0].adminConfidenceScore || 90) < 70 ? 'bg-amber-500/50' : 'bg-gray-400/30'
                                        }`} 
                                        style={{ width: `${projects[0].adminConfidenceScore || 90}%` }} 
                                    />
                                </div>
                            </div>
                        </>
                     ) : (
                         <div className="text-sm text-gray-400 italic">No active engagement data for alignment check.</div>
                     )}
                 </div>
              </div>
          </div>
      </div>

      {/* Strategic Hub (Company Details + Analytics Radar) */}
      <div className="mb-8">
          <ClientStrategicHub 
            profile={profile} 
            clientUser={storedUser} 
            clientId={storedUser?.id}
          />
      </div>

      {/* Gap 31: Engagement Health Hero (The Translation Layer) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="md:col-span-2 space-y-6">
             <HealthScorecard />
             <ClientFeedbackWidget />
         </div>
         <div className="flex flex-col gap-6">
             <ROIWidget />
             <VelocityChart />
         </div>
      </div>

      {/* Assurance Statement (NEW) */}
      <div className="mb-8 px-4 py-3 bg-blue-50 dark:bg-blue-900/20/50 border border-blue-100 rounded-lg flex items-start gap-3">
         <div className="mt-1">
            <CheckCircle className="w-4 h-4 text-blue-600" />
         </div>
         <div>
            <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-0.5">Delivery Assurance</h4>
            <p className="text-sm text-blue-900/80 leading-relaxed">
               This engagement is governed under <span className="font-semibold text-blue-900">Kangqore’s Enterprise Delivery Framework</span> with defined SLAs, escalation paths, and quality gates.
               <button onClick={() => alert("Opening Framework Documentation...")} className="ml-2 text-xs font-medium underline text-blue-600 hover:text-blue-800 bg-transparent border-0 p-0 inline">View Framework</button>
            </p>
         </div>
      </div>

      {/* Mid Row: Health & ROI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <HealthScorecard 
              data={summaryQuery.data?.health} 
              isLoading={summaryQuery.isLoading} 
          />
          <ROIWidget />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Stakeholders Card */}
            {/* Stakeholders Card -> Replaced by Unified Governance Widget */}
            <ClientGovernance />
            <div>
               <MyAgreements />
            </div>
            {/* Compliance & Trust Center */}
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 dark:bg-green-900/20 rounded-bl-full -mr-16 -mt-16 z-0"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                             Engagement Trust Center
                        </h2>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-700 rounded-lg">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Compliance Confirmed</h4>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                    This engagement strictly adheres to <span className="font-semibold text-gray-700 dark:text-gray-300">ISO 27001</span> and <span className="font-semibold text-gray-700 dark:text-gray-300">GDPR</span> standards. All data processing is confined to the <span className="font-semibold text-gray-700 dark:text-gray-300">Mumbai (ap-south-1)</span> region as per the Master Services Agreement (MSA).
                                </p>
                            </div>
                        </div>

                         <div className="grid grid-cols-2 gap-4 mt-2">
                            <div className="p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-lg border border-gray-100">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Data Classification</p>
                                <p className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span> Confidential
                                </p>
                            </div>
                             <div className="p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-lg border border-gray-100">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Access Control</p>
                                <p className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span> Role-Based (RBAC)
                                </p>
                            </div>
                        </div>
                         
                         <div className="pt-2">
                             <button onClick={() => alert("Opening Compliance Report... (Simulated)")} className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1 bg-transparent border-0 p-0">
                                View Compliance Report <ArrowRight className="w-3 h-3" />
                             </button>
                         </div>
                    </div>
            </div>
      </div>

      {/* Upcoming Meeting Widget (Top Importance) */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl shadow-slate-900/10 mb-10 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden" data-testid="upcoming-meeting-widget">

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white dark:bg-gray-900 dark:border-gray-800/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">Scheduled Governance Meetings</h3>
            <p className="text-blue-50 text-sm">
              {upcomingMeeting ? upcomingMeeting.title : "No meetings scheduled at this time"}
            </p>
            {upcomingMeeting && (
              <div className="flex items-center gap-3 mt-2 text-xs font-medium bg-black/20 px-3 py-1 rounded-full w-fit">
                <Clock className="w-3 h-3" />
                {new Date(upcomingMeeting.startTime).toLocaleString()}
              </div>
            )}
            {!upcomingMeeting && (
                 <p className="text-xs text-blue-200 mt-1">Book a slot with your account manager.</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           {upcomingMeeting?.joinLink ? (
             <a 
               href={upcomingMeeting.joinLink} 
               target="_blank" 
               rel="noopener noreferrer"
               className="px-4 py-2 bg-white dark:bg-gray-900 dark:border-gray-800 text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-sm"
             >
               <Video className="w-4 h-4" />
               Join Call
             </a>
           ) : (
             <Link 
               to="/dashboard/client/meetings"
               className="px-4 py-2 bg-white dark:bg-gray-900 dark:border-gray-800 text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-sm"
             >
                 <Calendar className="w-4 h-4" /> Schedule Now
             </Link>
           )}
           <Link 
             to="/dashboard/client/meetings" 
             className="px-4 py-2 bg-blue-700/50 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors border border-blue-500/30"
           >
             View All
           </Link>
        </div>
      </div>

      {/* Enterprise KPI Cards - VISUALLY ENHANCED */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
         {/* 1. Active Projects - Blue Gradient */}
         <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white dark:bg-black/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-white dark:bg-black/20 transition-colors"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
               <div>
                  <p className="text-[11px] font-bold text-blue-100 uppercase tracking-widest">Active Engagements</p>
                  <h3 className="text-4xl font-extrabold text-white mt-2 tracking-tight">{stats?.active_projects || 0}</h3>
               </div>
               <div className="p-3 bg-white dark:bg-gray-900 dark:border-gray-800/20 text-white rounded-xl backdrop-blur-sm">
                  <FolderKanban className="w-5 h-5" />
               </div>
            </div>
            <div className="flex items-center gap-2 relative z-10">
               <span className="text-xs font-bold text-blue-50 bg-white dark:bg-gray-900 dark:border-gray-800/10 px-2.5 py-1 rounded-md border border-white/20 flex items-center gap-1.5 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> Stable
               </span>
            </div>
         </div>

         {/* 2. Overall Progress - Purple Gradient */}
         <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-2xl shadow-lg shadow-purple-500/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white dark:bg-black/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-white dark:bg-black/20 transition-colors"></div>
            <div className="flex justify-between items-start mb-2 relative z-10">
               <div>
                  <p className="text-[11px] font-bold text-purple-100 uppercase tracking-widest">Overall Progress</p>
                  <h3 className="text-4xl font-extrabold text-white mt-2 tracking-tight">62%</h3>
               </div>
               <div className="p-3 bg-white dark:bg-gray-900 dark:border-gray-800/20 text-white rounded-xl backdrop-blur-sm">
                  <Clock className="w-5 h-5" />
               </div>
            </div>
            <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden mb-3 mt-2 border border-white/10">
               <div className="h-full bg-white dark:bg-gray-900 dark:border-gray-800 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ width: '62%' }} />
            </div>
            <p className="text-xs text-purple-100 font-medium opacity-80">Weighted average</p>
         </div>

         {/* 3. SLA Status - Emerald Gradient */}
         <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group text-white">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white dark:bg-black/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-white dark:bg-black/20 transition-colors"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
               <div>
                  <p className="text-[11px] font-bold text-emerald-100 uppercase tracking-widest">SLA Status</p>
                  <h3 className="text-3xl font-extrabold text-white mt-2 tracking-tight flex items-center gap-2">
                     {stats?.sla_status || 99.9}% 
                  </h3>
               </div>
               <div className="p-3 bg-white dark:bg-gray-900 dark:border-gray-800/20 text-white rounded-xl backdrop-blur-sm">
                  <CheckCircle className="w-5 h-5" />
               </div>
            </div>
             <p className="text-xs text-emerald-50 font-medium bg-emerald-700/30 inline-block px-2 py-1 rounded backdrop-blur-md">
               <span className="font-bold text-white">{stats?.missed_slas || 0} misses</span> in 30 days
             </p>
         </div>

         {/* 4. Commercial Health - Slate Gradient (High Contrast) */}
         <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group text-white border border-slate-700">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-500/20 transition-colors"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
               <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Budget Used</p>
                  <h3 className="text-3xl font-extrabold text-white mt-2 tracking-tight">{stats?.budget_used || 0}%</h3>
               </div>
               <div className="p-3 bg-white dark:bg-gray-900 dark:border-gray-800/10 text-blue-300 rounded-xl backdrop-blur-sm">
                  <Receipt className="w-5 h-5" />
               </div>
            </div>
            
             <div className="space-y-3 relative z-10">
                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.6)]" style={{ width: `${stats?.budget_used || 0}%` }}></div>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Next Inv</p>
                    <p className="text-xs font-bold text-white">₹{stats?.next_invoice_amount || '0'}</p>
                </div>
             </div>
         </div>
         
         {/* 5. Pending Actions - Amber Gradient */}
         <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-2xl shadow-lg shadow-amber-500/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white dark:bg-black/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-white dark:bg-black/20 transition-colors"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
               <div>
                  <p className="text-[11px] font-bold text-amber-100 uppercase tracking-widest">Pending Decisions</p>
                  <h3 className="text-4xl font-extrabold text-white mt-2 tracking-tight">{stats?.pending_actions || 0}</h3>
               </div>
               <div className="p-3 bg-white dark:bg-gray-900 dark:border-gray-800/20 text-white rounded-xl backdrop-blur-sm">
                  <AlertTriangle className="w-5 h-5" />
               </div>
            </div>
            <div className="flex items-center gap-2 relative z-10">
               <Link to="/dashboard/client/documents" className="text-xs font-bold text-white bg-white dark:bg-gray-900 dark:border-gray-800/20 hover:bg-white dark:bg-gray-900 dark:border-gray-800/30 px-3 py-1.5 rounded-lg flex items-center gap-1 backdrop-blur-sm transition-colors shadow-sm">
                 Review Items <ArrowRight className="w-3 h-3" />
               </Link>
            </div>
         </div>
      </div>

      {/* Charts Section (3D Infographics) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
         <div className="lg:col-span-2 bg-slate-900 rounded-2xl shadow-xl border border-gray-800 p-1 relative overflow-hidden">
            <ThreeDActivityLand 
               title="Project Activity Landscape" 
               data={[
                  { name: 'Frontend', value: 85, color: '#3b82f6' },
                  { name: 'Backend', value: 65, color: '#8b5cf6' },
                  { name: 'DevOps', value: 45, color: '#10b981' },
                  { name: 'QA', value: 30, color: '#f59e0b' },
                  { name: 'Design', value: 70, color: '#ec4899' }
               ]} 
            />
         </div>
         <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-100 p-1 relative overflow-hidden">
            <ThreeDPieChart 
                title="Risk Distribution"
                data={[
                    { label: 'Low', value: 60, color: '#10b981' },
                    { label: 'Medium', value: 30, color: '#f59e0b' },
                    { label: 'High', value: 10, color: '#ef4444' }
                ]}
            />
         </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Engagements (New Outcome Cards) */}
        <div className="lg:col-span-2 space-y-6" data-testid="project-status-section">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Engagements</h2>
            <button className="text-brand-blue hover:text-blue-700 text-sm font-medium flex items-center gap-1">
              View All Engagements <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
          ) : projects.length > 0 ? (
            <div className="space-y-4">
              {projects.slice(0, 5).map((project) => (
                <div 
                  key={project.id} 
                  className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
                  data-testid={`project-item-${project.id}`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-full pointer-events-none"></div>
                  
                  {/* Top Row: Name & Tag */}
                  <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm group-hover:scale-110 transition-transform duration-300">
                             <div className="bg-brand-gradient p-2.5 rounded-xl">
                                <FolderKanban className="w-6 h-6 text-white" />
                             </div>
                          </div>
                          <div>
                             <div className="flex items-center gap-3">
                                <h4 className="font-extrabold text-xl text-gray-900 dark:text-white tracking-tight">{project.name || project.title}</h4>
                                <span className="px-2.5 py-1 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider rounded-md border border-gray-200">
                                   {project.type || 'Enterprise Tech'}
                                </span>
                             </div>
                             <p className="text-sm text-gray-500 mt-1.5 font-medium">
                                Leads: <span className="text-gray-900 dark:text-white">Sarah Jenning, Mike Ross</span>
                             </p>
                          </div>
                      </div>
                      <Link to={`/dashboard/client/projects/${project.id}`} className="px-5 py-2.5 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:text-black transition-all shadow-sm">
                         View Details
                      </Link>
                  </div>

                  {/* Middle Row: Progress & Phase */}
                  <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-10">
                     <div>
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                           <span>Completion Status</span>
                           <span className="text-brand-blue">{project.progress || 45}%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 dark:border-gray-700 h-2.5 rounded-full overflow-hidden shadow-inner">
                           <div className="h-full bg-brand-gradient rounded-full shadow-sm" style={{ width: `${project.progress || 45}%` }} />
                        </div>
                     </div>
                     <div className="flex items-center gap-6">
                        <div className="w-px h-12 bg-gray-200 hidden md:block" />
                        <div>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Current Lifecycle Phase</p>
                           <p className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-sm" />
                              {(project.status || 'Execution').replace('_', ' ')}
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* Bottom Row: Milestone Timeline (Mini) */}
                  <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl p-4 border border-gray-100 flex items-center justify-between relative z-10 group-hover:bg-blue-50/30 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="p-2 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-lg shadow-sm">
                           <Calendar className="w-5 h-5 text-brand-blue" />
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Upcoming Milestone</p>
                           <p className="text-sm font-bold text-gray-900 dark:text-white">UAT Sign-off & Production Deployment</p>
                        </div>
                     </div>
                     <div className="hidden lg:flex items-center gap-8 pr-2">
                        <div className="text-right">
                           <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Target Date</p>
                           <p className="text-xs font-bold text-gray-700 dark:text-gray-300">28 Feb 2026</p>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Risk Profile</p>
                           <p className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Low Risk</p>
                        </div>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-100">
                <FolderKanban className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Active Engagements</h3>
              <p className="text-gray-500 max-w-sm">Your active engagement cards will appear here.</p>
            </div>
          )}
        </div>

        {/* Right Column: Feeds & Actions */}
        <div className="space-y-6">
            {/* Recent Updates */}
            {/* Recent Updates as Visual Timeline */}
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200" data-testid="recent-updates-section">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-brand-blue rounded-full"></span> Delivery Timeline
                </h2>
                
                <VisualTimeline events={updates} loading={loading} />
            </div>

            {/* Support Tickets (Moved Here) */}
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200" data-testid="support-section">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span> Support Requests
                </h2>
            </div>
            
            {tickets.length > 0 ? (
                <div className="space-y-3">
                {tickets.slice(0, 3).map((ticket, index) => (
                    <div 
                    key={ticket.id || index} 
                    className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-xl hover:shadow-md hover:border-amber-200 transition-all group"
                    >
                    <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-50 group-hover:text-brand-blue transition-colors line-clamp-1">{ticket.subject}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Ticket #{ticket.id?.substring(0, 8)}</p>
                    </div>
                    <span className={`px-2 py-1 text-[10px] font-bold rounded-full capitalize border ${
                        ticket.status === 'open' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 border-red-100' :
                        ticket.status === 'in_progress' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-green-50 dark:bg-green-900/20 text-green-600 border-green-100'
                    }`}>
                        {ticket.status?.replace('_', ' ')}
                    </span>
                    </div>
                ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 bg-gray-50 dark:bg-[#050505] rounded-full flex items-center justify-center mb-3">
                    <MessageSquare className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">No support requests</p>
                </div>
            )}
            </div>
        </div>

        {/* Audit Log Widget (New Governance Layer) */}
        <div className="h-full">
            <ClientAuditWidget />
        </div>

        {/* Deliverables */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200" data-testid="deliverables-section">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span> Key Deliverables
            </h2>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
          ) : deliverables.length > 0 ? (
            <div className="space-y-3">
              {deliverables.slice(0, 5).map((item, index) => (
                <div 
                  key={item.id || index} 
                  className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-xl hover:shadow-md hover:border-emerald-200 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-100 transition-colors">
                        <CheckCircle className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:text-white">{item.name}</span>
                  </div>
                  {item.url && (
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-brand-blue transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 bg-gray-50 dark:bg-[#050505] rounded-full flex items-center justify-center mb-3">
                <CheckCircle className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No deliverables yet</p>
            </div>
          )}
        </div>

        {/* Documents */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200" data-testid="documents-section">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span> Reports & Documents
            </h2>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
          ) : documents.length > 0 ? (
            <div className="space-y-3">
              {documents.slice(0, 5).map((doc, index) => (
                <div 
                  key={doc.id || index} 
                  onClick={() => window.open(doc.url, '_blank')}
                  className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-xl hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg group-hover:bg-purple-100 transition-colors">
                        <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:text-white">{doc.title || doc.name}</span>
                  </div>
                  <Download className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 bg-gray-50 dark:bg-[#050505] rounded-full flex items-center justify-center mb-3">
                <FileText className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No documents available</p>
            </div>
          )}
        </div>

        </div>
      </div>
      
      {/* Financial Summary (Bottom Section) */}
        <div className="mt-8 bg-gray-900 rounded-2xl border border-gray-800 shadow-xl p-8 text-white relative overflow-hidden group">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-8 relative z-10">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-white dark:bg-gray-900 dark:border-gray-800/10 text-white rounded-xl backdrop-blur-sm border border-white/10">
                        <Receipt className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Financial Overview</h2>
                        <p className="text-sm text-gray-400">Consolidated billing status across all engagements</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-xs hidden sm:flex">
                     <div className="px-4 py-1.5 bg-white dark:bg-gray-900 dark:border-gray-800/5 rounded-full border border-white/10 backdrop-blur-sm">
                         <span className="text-gray-400">Model:</span> <span className="font-bold text-white ml-1">Fixed Bid + T&M</span>
                     </div>
                     <div className="px-4 py-1.5 bg-white dark:bg-gray-900 dark:border-gray-800/5 rounded-full border border-white/10 backdrop-blur-sm">
                         <span className="text-gray-400">Schedule:</span> <span className="font-bold text-white ml-1">Monthly Net-30</span>
                     </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                <div>
                     <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Total Contract Value</p>
                     <p className="text-3xl font-bold text-white tracking-tight">{stats?.contract_value || '₹0'}</p>
                     <p className="text-xs text-gray-400 mt-2 flex items-center gap-1"><span className="w-1 h-1 bg-gray-500 rounded-full"></span> PO #KQ-2026-001</p>
                </div>
                <div className="relative">
                     <div className="absolute left-0 top-2 bottom-2 w-px bg-white dark:bg-black/10 hidden lg:block"></div>
                     <div className="lg:pl-8">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Billed Till Date</p>
                        <p className="text-3xl font-bold text-white tracking-tight">{stats?.billed_total || '₹0'}</p>
                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1"><CheckCircle className="w-3 h-3 text-emerald-500" /> 4 Invoices Paid</p>
                     </div>
                </div>
                <div className="relative">
                     <div className="absolute left-0 top-2 bottom-2 w-px bg-white dark:bg-black/10 hidden lg:block"></div>
                     <div className="lg:pl-8">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Remaining Value</p>
                        <p className="text-3xl font-bold text-emerald-400 tracking-tight">{stats?.remaining_budget || '₹0'}</p>
                        <p className="text-xs text-emerald-400/80 mt-2 font-medium">Runway: 6 Months</p>
                     </div>
                </div>
                <div className="relative">
                     <div className="absolute left-0 top-2 bottom-2 w-px bg-white dark:bg-black/10 hidden lg:block"></div>
                     <div className="lg:pl-8">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Next Invoice</p>
                        <div className="flex items-center gap-3">
                            <p className="text-3xl font-bold text-blue-400 tracking-tight">{stats?.next_invoice_date || '-'}</p>
                            <span className="text-[10px] font-bold text-gray-900 dark:text-white bg-white dark:bg-black px-2 py-0.5 rounded uppercase tracking-wider">
                                Pending
                            </span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">Est: {stats?.next_invoice_amount || '₹0'}</p>
                     </div>
                </div>
            </div>
        </div>

        {/* Trust & Compliance Strip (New Footer) */}
        <div className="mt-12 border-t border-gray-200 pt-8 pb-4">
             <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-gray-400">
                 <div className="flex items-center gap-6">
                     <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-70">
                        <Shield className="w-4 h-4" /> Compliance Optimized
                     </span>
                     <div className="h-4 w-px bg-gray-200"></div>
                     <span className="text-xs">ISO 27001 Certified</span>
                     <span className="text-xs">SOC2 Type II Ready</span>
                     <span className="text-xs">GDPR Compliant</span>
                 </div>
                 
                 <div className="flex items-center gap-6">
                     <span className="flex items-center gap-2 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full border border-green-100">
                        <CheckCircle className="w-3 h-3" /> NDA Active
                     </span>
                     <span className="text-xs flex items-center gap-1">
                        Data Residency: <span className="font-bold text-gray-600 dark:text-gray-400">India (Mumbai)</span>
                     </span>
                 </div>
             </div>
        </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default ClientDashboard;
