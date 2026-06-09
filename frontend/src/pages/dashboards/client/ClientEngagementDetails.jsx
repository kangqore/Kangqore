
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  BarChart3, 
  Calendar, 
  CheckSquare, 
  Clock, 
  FileText, 
  Layout, 
  MessageSquare, 
  PieChart, 
  Settings, 
  Users, 
  Video, 
  Download, 
  ChevronRight, 
  Bell, 
  Search, 
  Menu, 
  X, 
  ArrowUpRight, 
  TrendingUp, 
  Check, 
  ExternalLink, 
  Activity, 
  AlertTriangle, 
  FileCheck, 
  Shield, 
  ShieldCheck, 
  HelpCircle, 
  GitPullRequest, 
  CheckCircle, 
  CreditCard,
  ArrowLeft
} from 'lucide-react';
import { useClientChangeRequests } from '../../../hooks/useDashboardData';
import DelayAttributionChart from '../../../components/charts/DelayAttributionChart';
import StrategicRadarChart from '../../../components/charts/StrategicRadarChart';

const ClientEngagementDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  /* Hook Integration */
  const { data: changeRequests } = useClientChangeRequests();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

  useEffect(() => {
    // Fetch Project Details
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BACKEND_URL}/api/projects/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setProject(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading Project...</div>;
  if (!project) return <div className="p-8 text-center">Project not found</div>;

  return (
    <DashboardLayout role="client" title={project.title} subtitle="Project Details">
      
      {/* Back & Project Header */}
      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-t-2xl border-b border-gray-200 px-6 pt-6 pb-6 mb-6">
        <Link to="/dashboard/client/projects" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Projects
        </Link>
        
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-brand-blue" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project.title}</h1>
                <p className="text-sm text-gray-500">Project ID: #{project.id.substring(0,8).toUpperCase()}</p>
            </div>
            <div className="ml-auto flex items-center gap-3">
                 <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 text-xs font-bold rounded-full uppercase border border-green-100">
                    Active Project
                 </span>
            </div>
        </div>
      </div>

      {/* Detail Content Area */}
      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-b-2xl p-8 min-h-[500px] shadow-sm">
        
        {/* Project Overview */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Project Summary</h3>
                            <p className="text-gray-900 dark:text-white leading-relaxed text-sm font-medium">
                                {project.description || "Strategic digital transformation engagement aimed at modernizing core legacy systems. Current focus is on API consolidation and security compliance to ensure enterprise readiness for upcoming UAT."}
                            </p>
                        </div>

                        {/* Assurance Statement (NEW) */}
                        <div className="bg-blue-50 dark:bg-blue-900/20/50 border border-blue-100 p-4 rounded-lg flex items-start gap-3">
                             <div className="mt-0.5">
                                <Shield className="w-5 h-5 text-blue-700" />
                             </div>
                             <div>
                                <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">Delivery Assurance</h4>
                                <p className="text-sm text-blue-900/80 leading-relaxed">
                                   This project is governed under <span className="font-semibold text-blue-900">Kangqore’s enterprise delivery framework</span> with defined SLAs, escalation paths, and quality gates.
                                </p>
                             </div>
                        </div>
                        
                        {/* Timeline Bar */}
                        <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 p-6 rounded-xl border border-gray-100">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Project Timeline</h4>
                            <div className="relative pt-6 pb-2">
                                <div className="h-2 bg-gray-200 rounded-full w-full absolute top-1/2 -translate-y-1/2" />
                                <div className="h-2 bg-blue-600 rounded-full absolute top-1/2 -translate-y-1/2 transition-all duration-1000" style={{ width: '45%' }} />
                                
                                <div className="flex justify-between relative">
                                    <div className="text-center transform -translate-x-1/4">
                                        <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-sm mx-auto mb-2 relative z-10" />
                                        <p className="text-xs font-bold text-blue-700">Discovery</p>
                                        <p className="text-[10px] text-gray-400">Completed</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-sm mx-auto mb-2 relative z-10" />
                                        <p className="text-xs font-bold text-blue-700">Build</p>
                                        <p className="text-[10px] text-blue-600 font-medium">In Progress</p>
                                    </div>
                                    <div className="text-center transform translate-x-1/4">
                                        <div className="w-4 h-4 bg-gray-300 rounded-full border-4 border-white shadow-sm mx-auto mb-2 relative z-10" />
                                        <p className="text-xs font-bold text-gray-400">UAT & Live</p>
                                        <p className="text-[10px] text-gray-400">Pending</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Progress Validation Transparency (Phase 12) */}
                        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                            {/* Background Pattern for Trust */}
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Shield className="w-24 h-24 text-brand-blue" />
                            </div>

                            <div className="relative z-10">
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-brand-blue" />
                                    Progress Audit & Validation
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Left: Calculation Method */}
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Calculation Method</p>
                                        <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-lg p-3 border border-gray-200">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                                                {project.progressCalculationMethod === 'AUTO_DELIVERABLES' ? 'Automatic (Deliverable-based)' :
                                                 project.progressCalculationMethod === 'AUTO_MILESTONES' ? 'Automatic (Milestone-based)' :
                                                 project.progressCalculationMethod === 'MANUAL' ? 'Manual Reporting' : 'Hybrid Calculation'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {project.progressCalculationMethod === 'AUTO_DELIVERABLES' 
                                                    ? 'Progress is strictly tied to the completion of validated deliverables.' 
                                                    : project.progressCalculationMethod === 'MANUAL'
                                                    ? 'Progress is reported by the delivery manager.'
                                                    : 'Derived from direct system evidence.'}
                                            </p>
                                        </div>

                                        {/* Override Notice */}
                                        {project.progressOverride && (
                                            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                                                <p className="text-xs font-bold text-amber-800 uppercase mb-1 flex items-center gap-1">
                                                    <AlertTriangle className="w-3 h-3" /> Manual Adjustment Applied
                                                </p>
                                                <p className="text-xs text-amber-900 italic">
                                                    "{project.progressOverrideReason}"
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right: Confidence Score */}
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">System Confidence Score</p>
                                        <div className="flex items-end gap-3 mb-2">
                                            <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                                {project.progressConfidence || 0}%
                                            </span>
                                            <span className={`text-xs font-bold px-2 py-1 rounded mb-1 uppercase ${
                                                (project.progressConfidence || 0) > 80 ? 'bg-green-100 text-green-700' :
                                                (project.progressConfidence || 0) > 50 ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {(project.progressConfidence || 0) > 80 ? 'High Fidelity' : 
                                                 (project.progressConfidence || 0) > 50 ? 'Medium Fidelity' : 'Low Fidelity'}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-[#0a0a0c] h-1.5 rounded-full overflow-hidden mb-2">
                                            <div 
                                                className={`h-full rounded-full ${
                                                    (project.progressConfidence || 0) > 80 ? 'bg-green-500' : 
                                                    (project.progressConfidence || 0) > 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                }`} 
                                                style={{ width: `${project.progressConfidence || 0}%` }} 
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-400">
                                            Based on evidence quality, recency of updates, and manual intervention levels.
                                        </p>
                                    </div>
                                </div>

                                {/* Evidence Trail (if Auto) */}
                                {project.progressEvidence?.deliverables?.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Latest Evidence</p>
                                        <div className="flex flex-wrap gap-2">
                                            {project.progressEvidence.deliverables.slice(0, 3).map((d, i) => (
                                                <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 text-[10px] font-bold rounded border border-green-100">
                                                    <CheckCircle className="w-3 h-3" /> {d.title}
                                                </span>
                                            ))}
                                            {project.progressEvidence.deliverables.length > 3 && (
                                                <span className="inline-flex items-center px-2 py-1 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-500 text-[10px] font-bold rounded border border-gray-100">
                                                    +{project.progressEvidence.deliverables.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* Recent Decisions Log */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Decisions & Change Log</h3>
                            <div className="space-y-4">
                                <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-xl p-4 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold uppercase">Approved</span>
                                            <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-1">Architecture finalized (Client approved)</h4>
                                            <p className="text-xs text-gray-500 font-mono">12 Jan 2026</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded pl-3 pr-2 py-2 border-l-2 border-blue-400 my-2">
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            <span className="font-bold text-blue-800">Rationale:</span> Monolithic architecture chosen over microservices to reduce initial operational overhead and accelerate MVP delivery.
                                        </p>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                         <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-100">
                                            <AlertTriangle className="w-3 h-3" /> Impact: Low Ops Cost
                                         </span>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-xl p-4 shadow-sm">
                                     <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold uppercase">Approved</span>
                                            <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-1">Phase-2 scope expansion</h4>
                                            <p className="text-xs text-gray-500 font-mono">18 Jan 2026</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded pl-3 pr-2 py-2 border-l-2 border-blue-400 my-2">
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            <span className="font-bold text-blue-800">Rationale:</span> Includes "Audit Log" module early to meet new compliance requirement (ISO-27001).
                                        </p>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                         <span className="inline-flex items-center gap-1 text-[10px] bg-purple-50 dark:bg-purple-900/20 text-purple-800 px-1.5 py-0.5 rounded border border-purple-100">
                                            <Clock className="w-3 h-3" /> Impact: +2 Weeks
                                         </span>
                                         <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-100">
                                            <CreditCard className="w-3 h-3" /> Impact: +$5k Budget
                                         </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Stats */}
                    <div className="space-y-6">
                        {/* Project Health Badge (Repeated) */}
                        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Project Health</h4>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded border border-emerald-100 uppercase tracking-wide">
                                    Stable
                                </span>
                            </div>
                            {/* Gap Closure: Live Perforamnce Trust */}
                            <div className="grid grid-cols-2 gap-2 mt-4">
                                <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 p-2 rounded border border-gray-100">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Avg Response</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{project.slaMetrics?.avgResponse || '1.2 hrs'}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 p-2 rounded border border-gray-100">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Uptime (30d)</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{project.slaMetrics?.uptime || '99.98%'}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 p-2 rounded border border-gray-100">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Velocity</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{project.slaMetrics?.velocity || '15 Pts/Wk'}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 p-2 rounded border border-gray-100">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Code Quality</p>
                                    <p className="text-sm font-bold text-green-600">{project.slaMetrics?.codeQuality || 'A+'}</p>
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-2 text-center flex items-center justify-center gap-1">
                                <Activity className="w-3 h-3" /> Live metrics from last 7 days
                            </p>
                            
                            {/* Impact Attribution Chart */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 text-center">Engagement Health Signature</h5>
                                <StrategicRadarChart />
                            </div>

                            {/* Impact Attribution Chart */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Delay Attribution</h5>
                                <DelayAttributionChart projectId={project.id} />
                            </div>
                        </div>
                        
                        {/* Risks & Dependencies */}
                        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Risks & Dependencies</h4>
                            
                            {/* If risks exist (mock logic for demo) */}
                            <div className="space-y-4">
                                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold text-amber-900">API dependency on client data</p>
                                            {/* Gap Closure: Risk Trend */}
                                            <span title="Trend: Worsening" className="text-red-600">
                                                <TrendingUp className="w-3 h-3" />
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded">Medium</span>
                                    </div>
                                    
                                    {/* Gap Closure: Mitigation Ownership */}
                                    <p className="text-xs text-amber-800/70 mt-1 font-medium flex items-center gap-1">
                                        <Shield className="w-3 h-3" /> Mitigation Owner: <span className="font-bold underline">Kangqore Engineering</span>
                                    </p>

                                    {/* Gap Closure: Their Role in Resolution */}
                                    <div className="mt-2 text-xs bg-white dark:bg-gray-900 dark:border-gray-800/60 p-2 rounded border border-amber-200">
                                        <p className="font-bold text-amber-900 mb-1">Your Role in Resolution:</p>
                                        <p className="text-amber-800 flex items-center gap-1">
                                            <AlertTriangle className="w-3 h-3" /> Provide UAT Data Set by Friday
                                        </p>
                                        <button className="mt-1.5 w-full bg-white dark:bg-gray-900 dark:border-gray-800 border border-amber-300 text-amber-800 font-bold py-1 rounded hover:bg-amber-100 text-[10px] shadow-sm">
                                            Acknowledge & Action
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Explicit "No Risks" state (Commented out but ready for logic toggle)
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-lg text-center border border-gray-100 border-dashed">
                                <CheckCircle className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                                <p className="text-xs text-gray-500">No delivery risks identified for this project.</p>
                            </div> 
                            */}
                        </div>

                        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl border border-gray-200 shadow-sm">
                           <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Key Contacts</h4>
                           <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">RS</div>
                                 <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">Rahul Sharma</p>
                                    <p className="text-xs text-gray-500 truncate">Account Manager</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">SJ</div>
                                 <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">Sarah Jenning</p>
                                    <p className="text-xs text-gray-500 truncate">Delivery Lead</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                    </div>
                </div>
            </div>

        {/* DELIVERABLES TAB (Evidence Layer) */}
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Deliverables & Evidence</h3>
                    <div className="text-sm text-gray-500">
                        Showing status linked to live execution data.
                    </div>
                 </div>

                 <div className="grid grid-cols-1 gap-6">
                    {/* Mock Deliverable 1 */}
                    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h4 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    Backend API Service
                                    <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide">In Progress</span>
                                </h4>
                                <p className="text-sm text-gray-500 mt-1">Core connection hub implementation.</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">85%</span>
                                <span className="text-xs font-bold text-green-600 uppercase tracking-wide">Confidence: High</span>
                            </div>
                        </div>

                        {/* Evidence Section */}
                        <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-lg p-4 border border-gray-100">
                            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Shield className="w-3 h-3" /> Execution Evidence
                            </h5>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Connected Resources */}
                                <div>
                                    <h6 className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">Connected Resources</h6>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm bg-white dark:bg-gray-900 dark:border-gray-800 p-2 rounded border border-gray-200">
                                            <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center text-white text-[10px] font-bold">GH</div>
                                            <span className="font-mono text-xs text-blue-600 flex-1 truncate">kangqore/backend-core</span>
                                            <span className="text-[10px] text-gray-400">Synced 2m ago</span>
                                        </div>
                                         <div className="flex items-center gap-2 text-sm bg-white dark:bg-gray-900 dark:border-gray-800 p-2 rounded border border-gray-200">
                                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">JR</div>
                                            <span className="font-mono text-xs text-blue-600 flex-1 truncate">KAN-2049 Epic</span>
                                            <span className="text-[10px] text-gray-400">Synced 10m ago</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Live Signals Filter */}
                                <div>
                                    <h6 className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">Live Activity Signals</h6>
                                    <div className="space-y-2 h-32 overflow-y-auto pr-1">
                                         <div className="flex items-start gap-2 text-xs">
                                            <span className="text-green-600 mt-0.5"><CheckCircle className="w-3 h-3" /></span>
                                            <div>
                                                <p className="text-gray-900 dark:text-white font-medium">PR #204 Merged: Auth Middleware</p>
                                                <p className="text-gray-400 text-[10px]">10 mins ago • GitHub</p>
                                            </div>
                                         </div>
                                         <div className="flex items-start gap-2 text-xs">
                                            <span className="text-blue-600 mt-0.5"><Clock className="w-3 h-3" /></span>
                                            <div>
                                                <p className="text-gray-900 dark:text-white font-medium">Ticket KAN-305 Moved to QA</p>
                                                <p className="text-gray-400 text-[10px]">2 hours ago • Jira</p>
                                            </div>
                                         </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Definition of Done Confirmation */}
                                <div>
                                    <h6 className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                                        <CheckSquare className="w-3 h-3" /> Definition of Done
                                    </h6>
                                    <ul className="space-y-1">
                                        <li className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                            <div className="w-3 h-3 rounded-full border border-green-500 bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                                                <Check className="w-2 h-2 text-green-600" />
                                            </div>
                                            <span>Unit tests passed (90% coverage)</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                            <div className="w-3 h-3 rounded-full border border-green-500 bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                                                <Check className="w-2 h-2 text-green-600" />
                                            </div>
                                            <span>API Documentation updated</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-xs text-gray-400">
                                            <div className="w-3 h-3 rounded-full border border-gray-300"></div>
                                            <span>Security audit signed off</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Direct Access / Evidence */}
                                <div>
                                     <h6 className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                                        <ExternalLink className="w-3 h-3" /> Access & Evidence
                                    </h6>
                                    <div className="flex gap-2">
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 hover:border-gray-300 transition-colors">
                                            <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" className="w-3 h-3 opacity-60" alt="" />
                                            View Source
                                        </button>
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 hover:border-gray-300 transition-colors">
                                            <FileText className="w-3 h-3 text-blue-500" />
                                            API Docs
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>
        
        {/* Milestones Section */}
            <div className="max-w-3xl">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Delivery Milestones</h3>
                <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 pl-8 pb-8">
                    {/* Milestone 1 */}
                    <div className="relative">
                        <div className="absolute -left-[41px] w-5 h-5 bg-green-500 rounded-full border-4 border-white shadow shadow-green-200" />
                        <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl p-5 border border-gray-200">
                             <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-gray-900 dark:text-white">Phase 1: Discovery & Strategy</h4>
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded font-bold uppercase">Completed</span>
                             </div>
                             <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Requirements gathering, stakeholder interviews, and initial architectural blueprint.</p>
                             <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Delivered: Dec 15, 2025</span>
                                {/* Gap Closure: Explicit Mutual Confirmation */}
                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200 flex items-center gap-1 font-bold cursor-pointer hover:bg-green-200 transition-colors">
                                    <ShieldCheck className="w-3 h-3" /> Signed by YOU (Dec 15)
                                </span>
                             </div>
                        </div>
                    </div>

                    {/* Milestone 2 */}
                    <div className="relative">
                        <div className="absolute -left-[41px] w-5 h-5 bg-blue-600 rounded-full border-4 border-white shadow" />
                        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl p-5 border border-blue-200 shadow-sm ring-1 ring-blue-50">
                             <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-gray-900 dark:text-white">Phase 2: Core Development (API)</h4>
                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded font-bold uppercase">In Progress</span>
                             </div>
                             <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Development of the core backend services and API gateway integration.</p>
                             <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                                <span className="flex items-center gap-1 text-blue-600 font-bold"><Calendar className="w-3 h-3" /> Target: Feb 14, 2026</span>
                             </div>
                        </div>
                    </div>

                    {/* Milestone 3 */}
                    <div className="relative opacity-60">
                        <div className="absolute -left-[41px] w-5 h-5 bg-gray-300 rounded-full border-4 border-white" />
                         <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl p-5 border border-gray-100 border-dashed">
                             <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-gray-900 dark:text-white">Phase 3: UAT & Go-Live</h4>
                                <span className="bg-gray-100 dark:bg-[#0a0a0c] text-gray-500 text-xs px-2 py-0.5 rounded font-bold uppercase">Pending</span>
                             </div>
                             <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">User Acceptance Testing, bug fixes, and production deployment.</p>
                             <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Est: Feb 28, 2026</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        
        {/* Reports Section */}
            <div>
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Reports & Artifacts</h3>
                    <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 px-3 py-1 rounded text-xs font-bold border border-blue-100">
                        Secure Audit Vault
                    </div>
                </div>
                
                {/* Gap Closure: Real-time "What Changed" Delta */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-lg shadow-sm text-blue-600">
                             <BarChart3 className="w-6 h-6" />
                        </div>
                        <div>
                             <h4 className="font-bold text-gray-900 dark:text-white text-sm">Since your last report (24 Jan 2026)</h4>
                             <p className="text-xs text-gray-500 mb-2">Real-time deltas tracked by the system:</p>
                             <div className="flex gap-4">
                                 <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                     <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> 3 Decisions Finalized
                                 </span>
                                 <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                     <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> 2 Risks Updated
                                 </span>
                                 <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                     <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> 15% Progress Gain
                                 </span>
                             </div>
                        </div>
                        <div className="ml-auto">
                            <button className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-blue-200 text-brand-blue px-3 py-1.5 rounded text-xs font-bold shadow-sm hover:bg-blue-50">
                                View Drill-down
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    {/* Headers */}
                    <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                        <div className="col-span-5">Document Name</div>
                        <div className="col-span-3">Category</div>
                        <div className="col-span-2">Date</div>
                        <div className="col-span-2 text-right">Action</div>
                    </div>

                    {['Solution Architecture v2.0', 'Security Compliance Report Q1', 'Jan 2026 Progress Report', 'Discovery Phase Sign-off'].map((doc, i) => (
                        <div key={i} className="grid grid-cols-12 gap-4 px-4 py-4 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-b border-gray-100 items-center transition-colors">
                            <div className="col-span-5 flex items-center gap-3">
                                <div className="p-2 bg-gray-100 dark:bg-[#0a0a0c] rounded text-gray-500">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white text-sm">{doc}</span>
                            </div>
                            <div className="col-span-3">
                                <span className="px-2 py-0.5 bg-gray-100 dark:bg-[#0a0a0c] text-gray-600 dark:text-gray-400 text-[10px] font-bold uppercase rounded">
                                    {doc.includes('Architecture') ? 'Technical' : doc.includes('Security') ? 'Compliance' : 'Governance'}
                                </span>
                            </div>
                            <div className="col-span-2 text-xs text-gray-500">24 Jan 2026</div>
                            <div className="col-span-2 text-right">
                                <button className="text-brand-blue hover:text-blue-800 text-xs font-bold flex items-center justify-end gap-1 ml-auto">
                                    <Download className="w-3 h-3" /> Download
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        
        {/* Meetings Section */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Governance Meetings</h3>
                {/* Empty State for now or mock data */}
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl border border-dashed border-gray-200">
                    <Video className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h4 className="text-gray-900 dark:text-white font-bold">No Recordings Available</h4>
                    <p className="text-sm text-gray-500">Past meeting recordings and minutes will appear here.</p>
                </div>
            </div>
        
        {/* Billing Section */}
            <div>
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Billing & Contracts</h3>
                 <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-xl overflow-hidden mb-8">
                     <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 px-6 py-4 border-b border-gray-200">
                         <h4 className="font-bold text-gray-800 dark:text-gray-50 text-sm uppercase">Contract Summary</h4>
                     </div>
                     <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                         <div>
                             <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Contract Value</p>
                             <p className="text-xl font-bold text-gray-900 dark:text-white">$120,000.00</p>
                         </div>
                         <div>
                             <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Billed to Date</p>
                             <p className="text-xl font-bold text-gray-900 dark:text-white">$45,000.00</p>
                         </div>
                         <div>
                             <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Next Invoice</p>
                             <p className="text-xl font-bold text-gray-900 dark:text-white">Feb 01, 2026</p>
                         </div>
                     </div>
                 </div>

                 <h4 className="font-bold text-gray-900 dark:text-white mb-4">Invoice History</h4>
                 <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <table className="w-full text-sm text-left">
                          <thead className="bg-gray-50 dark:bg-[#050505] text-gray-500 font-bold uppercase text-xs">
                              <tr>
                                  <th className="px-6 py-3">Invoice #</th>
                                  <th className="px-6 py-3">Date</th>
                                  <th className="px-6 py-3">Amount</th>
                                  <th className="px-6 py-3">Status</th>
                                  <th className="px-6 py-3 text-right">Action</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                              <tr>
                                  <td className="px-6 py-4 font-mono">INV-2026-001</td>
                                  <td className="px-6 py-4">Jan 01, 2026</td>
                                  <td className="px-6 py-4 font-bold">$45,000.00</td>
                                  <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold uppercase">Paid</span></td>
                                  <td className="px-6 py-4 text-right">
                                      <div className="flex justify-end gap-3">
                                          <button className="text-gray-400 hover:text-gray-600 dark:text-gray-400" title="Ask a question about this invoice">
                                              <HelpCircle className="w-4 h-4" />
                                          </button>
                                          <button className="text-brand-blue hover:underline font-medium">Download</button>
                                      </div>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                 </div>
            </div>
        
        {/* Changes Section */}
            <div>
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <GitPullRequest className="w-5 h-5 text-gray-400" />
                    Change Control
                 </h3>
                 {/* Embedded Change Request List (Simplified from ClientChangeRequests.jsx) */}
                 <div className="space-y-4">
                      {/* New Request Button */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 p-4 rounded-xl flex items-center justify-between mb-6">
                           <div>
                               <h4 className="font-bold text-blue-900 text-sm">Need to adjust scope?</h4>
                               <p className="text-xs text-blue-800">Submit a formal change request to track budget & timeline impact.</p>
                           </div>
                           <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700">
                               + New Request
                           </button>
                      </div>

                      {/* Real Request List */}
                      {changeRequests && changeRequests.length > 0 ? changeRequests.map((req, i) => (
                          <div key={i} className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 p-4 rounded-lg flex items-center justify-between">
                               <div>
                                   <div className="flex items-center gap-2 mb-1">
                                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                           req.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                       }`}>{req.status}</span>
                                       <span className="text-xs text-gray-400">{new Date(req.createdAt || Date.now()).toLocaleDateString()}</span>
                                   </div>
                                   <h4 className="font-bold text-sm text-gray-900 dark:text-white">{req.title}</h4>
                               </div>
                               <div className="text-right">
                                   <span className="text-xs font-bold text-gray-500 block">Impact</span>
                                   <span className="text-xs text-gray-900 dark:text-white font-mono">{req.timeImpact || 'TBD'}</span>
                               </div>
                          </div>
                      )) : (
                          <div className="text-center py-8 text-gray-400 text-sm">No active change requests found.</div>
                      )}
                 </div>
            </div>
        
        {/* Team Section */}
            <div>
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-400" />
                    Your Project Squad
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* PM Card */}
                      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 p-6 rounded-xl text-center relative overflow-hidden group hover:border-blue-200 transition-colors">
                           <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-800 dark:border-gray-700 rounded-full mb-4 overflow-hidden border-2 border-white shadow-sm">
                               <img src="https://ui-avatars.com/api/?name=Sarah+J&background=0D8ABC&color=fff" alt="PM" />
                           </div>
                           <div className="absolute top-4 right-4 w-3 h-3 bg-green-500 rounded-full border-2 border-white" title="Online now" />
                           
                           <h4 className="font-bold text-gray-900 dark:text-white">Sarah Jenkins</h4>
                           <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-4">Project Manager</p>
                           
                           <button className="w-full bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs py-2 rounded hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 border border-gray-200">
                               Message
                           </button>
                      </div>

                      {/* Tech Lead Card */}
                      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 p-6 rounded-xl text-center relative overflow-hidden group hover:border-purple-200 transition-colors">
                           <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-800 dark:border-gray-700 rounded-full mb-4 overflow-hidden border-2 border-white shadow-sm">
                               <img src="https://ui-avatars.com/api/?name=Mike+T&background=6366F1&color=fff" alt="Lead" />
                           </div>
                           <h4 className="font-bold text-gray-900 dark:text-white">Mike Thompson</h4>
                           <p className="text-xs text-purple-600 font-bold uppercase tracking-wider mb-4">Technical Lead</p>
                           
                           <button className="w-full bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs py-2 rounded hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 border border-gray-200">
                               Message
                           </button>
                      </div>

                      {/* Account Manager */}
                      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 p-6 rounded-xl text-center relative overflow-hidden group hover:border-emerald-200 transition-colors">
                           <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-800 dark:border-gray-700 rounded-full mb-4 overflow-hidden border-2 border-white shadow-sm">
                               <img src="https://ui-avatars.com/api/?name=David+R&background=10B981&color=fff" alt="AM" />
                           </div>
                           <h4 className="font-bold text-gray-900 dark:text-white">David Ross</h4>
                           <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-4">Account Success</p>
                           
                           <button className="w-full bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs py-2 rounded hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 border border-gray-200">
                               Schedule Call
                           </button>
                      </div>
                 </div>
            </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientEngagementDetails;
