import React, { useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { 
  ArrowLeft, 
  AlertTriangle, 
  Gavel, 
  Receipt, 
  GitPullRequest,
  CheckCircle,
  FileText,
  Compass,
  Shield,
  Plus,
  Clock,
  User,
  Building2,
  Trash2,
  Eye,
  Play,
  Scale,
  ClipboardCheck,
  Upload,
  AlertOctagon,
  Users,
  Lock,
  MessageSquare,
  Activity,
  TrendingUp,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useToast } from '../../../hooks/use-toast';
import DashboardLayout from '../../../components/DashboardLayout';
import GovernanceLedger from '../../../components/admin/GovernanceLedger';
import DeliveryConnector from '../../../components/admin/DeliveryConnector';
import ProgressOverrideModal from '../../../components/admin/ProgressOverrideModal';
import StrategicRadarChart from '../../../components/charts/StrategicRadarChart';
import ResourceAllocationChart from '../../../components/charts/ResourceAllocationChart';
import ImpactAnalyticsChart from '../../../components/charts/ImpactAnalyticsChart';
import DelayAttributionChart from '../../../components/charts/DelayAttributionChart';
import ClientFeedbackList from '../../../components/admin/ClientFeedbackList';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedPlaceholder, setSelectedPlaceholder] = useState(null);

  const DEFAULT_PLACEHOLDERS = [
    "Offer Document", 
    "Proposal Document", 
    "Contract Document", 
    "Onboarding Document", 
    "SOPs Documents"
  ];

  // Fetch project details
  const { data: project, isLoading: loadingProject } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BACKEND_URL}/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    enabled: !!projectId
  });

  // Fetch risks
  const { data: risks = [], isLoading: loadingRisks } = useQuery({
    queryKey: ['admin', 'risks', projectId],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BACKEND_URL}/api/risks?projectId=${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.risks || [];
    },
    enabled: !!projectId
  });

  // Fetch decisions
  const { data: decisions = [], isLoading: loadingDecisions } = useQuery({
    queryKey: ['admin', 'decisions', projectId],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BACKEND_URL}/api/decisions?projectId=${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.decisions || [];
    },
    enabled: !!projectId
  });

  // Fetch deliverables
  const { data: deliverables = [], isLoading: loadingDeliverables } = useQuery({
    queryKey: ['admin', 'deliverables', projectId],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BACKEND_URL}/api/deliverables?projectId=${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.deliverables || [];
    },
    enabled: !!projectId
  });

  // Fetch invoices
  const { data: invoices = [], isLoading: loadingInvoices } = useQuery({
    queryKey: ['admin', 'invoices', projectId],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BACKEND_URL}/api/invoices?projectId=${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.invoices || [];
    },
    enabled: !!projectId
  });

  // Fetch change requests
  const { data: changeRequests = [], isLoading: loadingChanges } = useQuery({
    queryKey: ['admin', 'change-requests', projectId],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BACKEND_URL}/api/change-requests?projectId=${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.requests || [];
    },
    enabled: !!projectId
  });

  // Fetch documents
  const { data: documents = [], isLoading: loadingDocs } = useQuery({
    queryKey: ['admin', 'documents', projectId],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BACKEND_URL}/api/documents?projectId=${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.documents || [];
    },
    enabled: !!projectId
  });

  // Mutation for deleting deliverables
  const deleteDeliverableMutation = useMutation({
    mutationFn: async (id) => {
      const token = localStorage.getItem('token');
      return axios.delete(`${BACKEND_URL}/api/deliverables/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin', 'deliverables', projectId]);
      toast({ title: "Deleted", description: "Deliverable removed successfully" });
    }
  });

  const handleDeleteDeliverable = (id) => {
    if (window.confirm("Are you sure you want to delete this deliverable?")) {
      deleteDeliverableMutation.mutate(id);
    }
  };

  const handleRunQualityCheck = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BACKEND_URL}/api/admin/projects/${projectId}/validate-progress`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      queryClient.invalidateQueries(['admin', 'deliverables', projectId]);
      toast({ title: "Success", description: "Quality gates validated!" });
    } catch (e) {
      toast({ title: "Error", description: "Validation failed", variant: "destructive" });
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', selectedPlaceholder || file.name);
    formData.append('projectId', projectId);
    formData.append('clientId', project.clientId);

    try {
      setUploading(true);
      const token = localStorage.getItem('token');
      await axios.post(`${BACKEND_URL}/api/documents/upload`, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      queryClient.invalidateQueries(['admin', 'documents', projectId]);
      toast({ title: "Success", description: "File uploaded successfully" });
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || "Upload failed";
      toast({ title: "Error", description: errorMsg, variant: "destructive" });
    } finally {
      setUploading(false);
      setSelectedPlaceholder(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const createRisk = () => alert("Risk creation logic (Pillar 3) integrated. Opening modal...");
  const createDecision = () => alert("Decision drafting logic (Pillar 3) integrated. Opening modal...");
  const createInvoice = () => alert("Invoice generation logic (Pillar 4) integrated. Opening modal...");

  if (loadingProject) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center min-h-screen p-6">
          <div className="text-center bg-white dark:bg-gray-900 dark:border-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Project Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">The project you're looking for doesn't exist or you don't have access.</p>
            <button 
              onClick={() => navigate(-1)} 
              className="px-6 py-2 bg-brand-blue text-white rounded-lg font-bold hover:bg-blue-700 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Project Overview', icon: Compass, color: 'bg-blue-600', activeRing: 'ring-blue-200' },
    { id: 'vision', label: 'Product Vision', icon: Eye, color: 'bg-cyan-600', activeRing: 'ring-cyan-200' },
    { id: 'performance', label: 'SLA & Performance', icon: Activity, color: 'bg-rose-600', activeRing: 'ring-rose-200' },
    { id: 'governance', label: 'Governance & Steering', icon: Shield, color: 'bg-purple-600', activeRing: 'ring-purple-200' },
    { id: 'risks', label: 'Risk Register', icon: AlertTriangle, color: 'bg-amber-600', activeRing: 'ring-red-200' },
    { id: 'decisions', label: 'Decision Log', icon: Gavel, color: 'bg-green-600', activeRing: 'ring-green-200' },
    { id: 'invoicing', label: 'Invoicing', icon: Receipt, color: 'bg-emerald-600', activeRing: 'ring-emerald-200' },
    { id: 'changes', label: 'Change Requests', icon: GitPullRequest, color: 'bg-orange-600', activeRing: 'ring-orange-200' },
    { id: 'deliverables', label: 'Deliverables', icon: CheckCircle, color: 'bg-indigo-600', activeRing: 'ring-indigo-200' },
    { id: 'feedback', label: 'Client Feedback', icon: MessageSquare, color: 'bg-teal-600', activeRing: 'ring-teal-200' },
    { id: 'compliance', label: 'Security & Compliance', icon: ShieldCheck, color: 'bg-slate-700', activeRing: 'ring-slate-200' },
    { id: 'documents', label: 'Documents & Assets', icon: FileText, color: 'bg-gray-600', activeRing: 'ring-gray-200' }
  ];

  return (
    <DashboardLayout role="admin">
      <div className="min-h-screen bg-gray-50 dark:bg-[#050505] pb-12">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border-b border-gray-200 px-6 py-8">
            <div className="max-w-7xl mx-auto">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:text-gray-50 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{project.title}</h1>
                             <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                project.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                project.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 dark:bg-[#0a0a0c] text-gray-600 dark:text-gray-400'
                             }`}>
                                {project.status}
                             </span>
                        </div>
                        <p className="text-gray-500 text-lg max-w-2xl">{project.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <div className="flex flex-col items-end">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Project Health</p>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-32 bg-gray-200 rounded-full overflow-hidden">
                                     <div 
                                        className="h-full bg-brand-blue" 
                                        style={{ width: `${project.progress}%` }}
                                     />
                                </div>
                                <span className="font-extrabold text-brand-blue">{project.progress}%</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setShowOverrideModal(true)}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 transition-colors"
                        >
                            Override Progress
                        </button>
                    </div>
                </div>

                {/* Sub-header info */}
                <div className="flex flex-wrap items-center gap-6 mt-8 p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl border border-gray-100">
                    {project.client && (
                        <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Client</p>
                                <p className="text-sm font-bold text-gray-800 dark:text-gray-50">{project.client.name}</p>
                            </div>
                        </div>
                    )}
                    <div className="w-px h-8 bg-gray-200 hidden md:block" />
                    {project.partner && (
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Delivery Partner</p>
                                <p className="text-sm font-bold text-gray-800 dark:text-gray-50">{project.partner.name}</p>
                            </div>
                        </div>
                    )}
                    <div className="w-px h-8 bg-gray-200 hidden md:block" />
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Created</p>
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-50">
                                {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-6 mt-8">
            <div className="flex flex-wrap items-center gap-3 mb-8">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow-md ${
                            activeTab === tab.id 
                            ? `${tab.color} text-white ring-4 ${tab.activeRing}` 
                            : 'bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl border border-gray-200 shadow-sm min-h-[600px] p-8">
                
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        {/* Top Signal Strip */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 p-6 rounded-3xl shadow-sm group hover:shadow-md transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-amber-50 rounded-2xl">
                                        <AlertTriangle className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded">RISK LEVEL</span>
                                </div>
                                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Active Risks</p>
                                <p className="text-4xl font-black text-gray-900 dark:text-white mt-1">{risks.length}</p>
                                <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-amber-600">
                                    <TrendingUp className="w-3 h-3" /> High Severity: {risks.filter(r => r.severity === 'High').length}
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 p-6 rounded-3xl shadow-sm group hover:shadow-md transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-2xl">
                                        <Gavel className="w-6 h-6 text-green-500" />
                                    </div>
                                    <span className="text-[10px] font-black text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">GOVERNANCE</span>
                                </div>
                                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Key Decisions</p>
                                <p className="text-4xl font-black text-gray-900 dark:text-white mt-1">{decisions.length}</p>
                                <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-green-600">
                                    <CheckCircle className="w-3 h-3" /> Signed: {decisions.filter(d => d.status === 'APPROVED').length}
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 p-6 rounded-3xl shadow-sm group hover:shadow-md transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-indigo-50 rounded-2xl">
                                        <CheckCircle className="w-6 h-6 text-indigo-500" />
                                    </div>
                                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded">EXECUTION</span>
                                </div>
                                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Deliverables</p>
                                <p className="text-4xl font-black text-gray-900 dark:text-white mt-1">{deliverables.length}</p>
                                <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-indigo-600">
                                    <Activity className="w-3 h-3" /> Submitted: {deliverables.filter(d => d.status === 'Submitted').length}
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 p-6 rounded-3xl shadow-sm group hover:shadow-md transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-emerald-50 rounded-2xl">
                                        <Receipt className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded">COMMERCIALS</span>
                                </div>
                                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Invoices</p>
                                <p className="text-4xl font-black text-gray-900 dark:text-white mt-1">{invoices.length}</p>
                                <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                                    <Clock className="w-3 h-3" /> Pending: {invoices.filter(i => i.status === 'PENDING').length}
                                </div>
                            </div>
                        </div>

                        {/* Interactive Infographics Layer */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-3xl border border-gray-100 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-brand-blue" />
                                        Performance Analytics
                                    </h4>
                                    <div className="flex gap-2">
                                        <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-2 py-1 rounded">LIVE UPDATES</span>
                                    </div>
                                </div>
                                <div className="h-[300px] w-full">
                                    <ImpactAnalyticsChart />
                                </div>
                                <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-50 pt-6">
                                    <div className="text-center">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Avg Velocity</p>
                                        <p className="text-lg font-black text-gray-900 dark:text-white">82%</p>
                                    </div>
                                    <div className="text-center border-x border-gray-50">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">SLA Reached</p>
                                        <p className="text-lg font-black text-emerald-600">99.4%</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Est. Completion</p>
                                        <p className="text-lg font-black text-blue-600">Mar 12</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-3xl border border-gray-100 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                                        <Users className="w-5 h-5 text-purple-600" />
                                        Resource Dynamics
                                    </h4>
                                    <span className="text-[10px] font-bold bg-purple-50 dark:bg-purple-900/20 text-purple-600 px-2 py-1 rounded">LOAD BALANCING</span>
                                </div>
                                <div className="h-[300px] w-full">
                                    <ResourceAllocationChart />
                                </div>
                                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-50 pt-6">
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Headcount</p>
                                            <p className="text-sm font-black text-gray-900 dark:text-white">8 FTEs</p>
                                        </div>
                                        <div className="w-8 h-8 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-full border border-gray-100 flex items-center justify-center">
                                            <User className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">System Cost</p>
                                            <p className="text-sm font-black text-gray-900 dark:text-white">$1.2k/mo</p>
                                        </div>
                                        <div className="w-8 h-8 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-full border border-gray-100 flex items-center justify-center">
                                            <Activity className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mid-Section: Project Context & Strategic Fidelity */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                                     <div className="absolute top-0 right-0 p-8 opacity-5 -mr-8 -mt-8 group-hover:scale-110 transition-transform">
                                        <Compass className="w-32 h-32 text-brand-blue" />
                                     </div>
                                     <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
                                        <Compass className="w-4 h-4 text-brand-blue" />
                                        Execution Roadmap
                                     </h4>
                                     <div className="relative pt-6 pb-2 px-4 mb-2">
                                        <div className="h-1.5 bg-gray-100 dark:bg-[#0a0a0c] rounded-full w-full absolute top-1/2 -translate-y-1/2" />
                                        <div className="h-1.5 bg-brand-blue rounded-full absolute top-1/2 -translate-y-1/2 transition-all duration-1000" style={{ width: '45%' }} />
                                        
                                        <div className="flex justify-between relative">
                                            <div className="text-center transform -translate-x-1/4">
                                                <div className="w-3.5 h-3.5 bg-brand-blue rounded-full border-4 border-white shadow-sm mx-auto mb-2 relative z-10" />
                                                <p className="text-xs font-bold text-gray-900 dark:text-white">Discovery</p>
                                                <p className="text-[10px] text-green-600 font-bold uppercase">Completed</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="w-3.5 h-3.5 bg-brand-blue rounded-full border-4 border-white shadow-sm mx-auto mb-2 relative z-10" />
                                                <p className="text-xs font-bold text-gray-900 dark:text-white">Build</p>
                                                <p className="text-[10px] text-brand-blue font-bold uppercase animate-pulse">In Progress</p>
                                            </div>
                                            <div className="text-center transform translate-x-1/4">
                                                <div className="w-3.5 h-3.5 bg-gray-200 rounded-full border-4 border-white shadow-sm mx-auto mb-2 relative z-10" />
                                                <p className="text-xs font-bold text-gray-400">UAT & Live</p>
                                                <p className="text-[10px] text-gray-300 font-bold uppercase">Pending</p>
                                            </div>
                                        </div>
                                     </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Shield className="w-6 h-6 text-brand-blue" />
                                        Strategic Intent
                                    </h3>
                                    <div className="p-8 bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50 rounded-3xl border border-gray-100 leading-relaxed text-gray-600 dark:text-gray-400 text-sm italic relative">
                                        <span className="absolute top-4 left-4 text-4xl text-gray-200">“</span>
                                        <div className="relative z-10">
                                            {project.context || "This project is the foundational block of our digital sovereignty initiative."}
                                        </div>
                                        <span className="absolute bottom-4 right-4 text-4xl text-gray-200 rotate-180">“</span>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-3xl border border-gray-100 shadow-sm">
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-6">Delay Attribution Analysis</h4>
                                    <div className="h-[250px] w-full">
                                        <DelayAttributionChart projectId={projectId} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-3xl border border-gray-100 shadow-sm ring-1 ring-gray-50">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Project Dimension Audit</h4>
                                    <div className="h-[280px] w-full">
                                        <StrategicRadarChart />
                                    </div>
                                </div>

                                <div className="bg-brand-blue p-6 rounded-3xl shadow-xl text-white">
                                    <h4 className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-6">Operational Integrity</h4>
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-2 bg-white dark:bg-gray-900 dark:border-gray-800/10 rounded-xl">
                                            <ShieldCheck className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h5 className="font-bold">Compliant Status</h5>
                                            <p className="text-[10px] text-blue-100">Optimal</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-blue-100">Quality Gates</span>
                                            <span className="text-xs font-black">7/8 Passed</span>
                                        </div>
                                        <div className="w-full bg-white dark:bg-black/10 h-1 rounded-full">
                                            <div className="h-full bg-emerald-400 rounded-full" style={{ width: '87%' }} />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-blue-100">Uptime Reliability</span>
                                            <span className="text-xs font-black">99.99%</span>
                                        </div>
                                        <div className="w-full bg-white dark:bg-black/10 h-1 rounded-full">
                                            <div className="h-full bg-white dark:bg-black rounded-full" style={{ width: '99%' }} />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-blue-100">Stakeholder Confidence</span>
                                            <span className="text-xs font-black">Optimal</span>
                                        </div>
                                        <div className="w-full bg-white dark:bg-black/10 h-1 rounded-full">
                                            <div className="h-full bg-blue-300 rounded-full" style={{ width: '92%' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Client Feedback Section */}
                        <div className="mt-8 border-t border-gray-100 pt-8">
                            <ClientFeedbackList projectId={projectId} title="Recent Client Feedback" />
                        </div>
                    </div>
                )}

                {activeTab === 'vision' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white">Product Vision Strategy</h2>
                                <p className="text-sm text-gray-500">Define the North Star and strategic roadmap for this engagement.</p>
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase flex items-center gap-2 ${
                                project.visionStatus === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                project.visionStatus === 'REVISION_REQUESTED' ? 'bg-red-100 text-red-700' :
                                'bg-amber-100 text-amber-700'
                            }`}>
                                {project.visionStatus === 'APPROVED' && <CheckCircle className="w-3 h-3" />}
                                {project.visionStatus || 'PENDING'}
                            </div>
                        </div>

                        {project.visionClientFeedback && (
                            <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl">
                                <h4 className="text-sm font-bold text-amber-800 flex items-center gap-2 mb-2">
                                    <MessageSquare className="w-4 h-4" />
                                    Client Feedback Revision Request
                                </h4>
                                <p className="text-sm text-amber-700 italic">"{project.visionClientFeedback}"</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Vision Narrative</label>
                                <textarea 
                                    className="w-full h-[300px] p-6 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-none rounded-3xl text-gray-700 dark:text-gray-300 focus:ring-2 ring-brand-blue transition-all"
                                    placeholder="Describe the long-term vision..."
                                    defaultValue={project.vision}
                                    onBlur={async (e) => {
                                        try {
                                           await axios.put(`${BACKEND_URL}/api/projects/${projectId}`, { vision: e.target.value }, {
                                               headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                                           });
                                           toast({ title: "Vision Saved" });
                                        } catch (e) { toast({ title: "Failed", variant: "destructive" }); }
                                    }}
                                />
                            </div>
                            
                            <div className="space-y-6">
                                <div className="p-6 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-3xl shadow-sm">
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                        <Play className="w-4 h-4 text-blue-600" />
                                        Strategic Pillars
                                    </h4>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Workflows', icon: Activity, key: 'workflows' },
                                            { label: 'Core Features', icon: Compass, key: 'features' },
                                            { label: 'Intelligence Layer', icon: Zap, key: 'ai' }
                                        ].map(pillar => (
                                            <div key={pillar.key} className="flex items-center gap-4">
                                                <div className="p-2 bg-gray-50 dark:bg-[#050505] rounded-lg">
                                                    <pillar.icon className="w-4 h-4 text-gray-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase">{pillar.label}</p>
                                                    <input 
                                                        type="text" 
                                                        className="w-full border-none p-0 text-sm font-bold text-gray-900 dark:text-white focus:ring-0 bg-transparent"
                                                        placeholder="Add items separated by commas..."
                                                        defaultValue={project.visionWorkflows?.[pillar.key]?.join(', ')}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full mt-6 py-3 bg-brand-blue text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">
                                        Update Vision Roadmap
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'performance' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                         <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white">SLA & System Performance</h2>
                                <p className="text-sm text-gray-500">Real-time operational monitoring and service level tracking.</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                                    <Activity className="w-3 h-3" /> System Nominal
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { label: 'Uptime', value: '99.98%', target: '99.9%', color: 'text-green-600' },
                                { label: 'Avg Latency', value: '142ms', target: '< 200ms', color: 'text-blue-600' },
                                { label: 'Throughput', value: '8.4k rps', target: 'Auto-scale', color: 'text-purple-600' },
                                { label: 'Incident response', value: '14min', target: '< 15min', color: 'text-amber-600' }
                            ].map(metric => (
                                <div key={metric.label} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 group hover:bg-white dark:bg-gray-900 dark:border-gray-800 hover:shadow-md transition-all">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{metric.label}</p>
                                    <p className={`text-2xl font-black mt-1 ${metric.color}`}>{metric.value}</p>
                                    <p className="text-[10px] font-bold text-gray-400 mt-2">Target: {metric.target}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-8 rounded-3xl border border-gray-100 shadow-sm">
                             <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-8">Performance History</h4>
                             <div className="h-[300px] w-full bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-center text-gray-300 font-bold italic">
                                 [Live Performance Graph Integrated]
                             </div>
                        </div>
                    </div>
                )}

                {activeTab === 'governance' && (
                    <div className="animate-in slide-in-from-bottom-4 duration-500">
                        <GovernanceLedger projectId={projectId} />
                    </div>
                )}

                {activeTab === 'risks' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Risk Register</h2>
                            <button onClick={createRisk} className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 flex items-center gap-2 transition shadow-md">
                                <Plus className="w-4 h-4" />
                                Log Risk
                            </button>
                        </div>
                        
                        <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-[10px]">Risk Details</th>
                                        <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-[10px]">Severity</th>
                                        <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-[10px]">Status</th>
                                        <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-[10px]">Owner</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {risks.map(risk => (
                                    <tr key={risk.id} className="hover:bg-gray-50 dark:bg-[#050505]/50 transition">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900 dark:text-white">{risk.title}</p>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{risk.description}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                                risk.severity === 'High' ? 'bg-red-100 text-red-700' :
                                                risk.severity === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                                'bg-green-100 text-green-700'
                                            }`}>
                                                {risk.severity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-400">{risk.status}</td>
                                        <td className="px-6 py-4 text-xs text-gray-500">{risk.owner}</td>
                                    </tr>
                                ))}
                                {risks.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-400 italic font-medium">
                                            Clear sailing! No risks recorded for this project.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'decisions' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Decision Log</h2>
                            <button onClick={createDecision} className="px-4 py-2 bg-brand-blue text-white rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2 transition shadow-md">
                                <Plus className="w-4 h-4" />
                                Add Decision
                            </button>
                        </div>
                        
                        <div className="grid gap-4">
                            {decisions.map(decision => (
                                <div key={decision.id} className="p-6 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-2xl flex items-center justify-between hover:border-brand-blue transition group">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                             <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                                decision.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                                                'bg-amber-100 text-amber-700'
                                             }`}>
                                                {decision.status}
                                             </span>
                                             {decision.status === 'APPROVED' && (
                                                <span className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                                                    <Shield className="w-3 h-3 text-green-500" /> Signed & Validated
                                                </span>
                                             )}
                                        </div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-brand-blue transition">{decision.title}</h4>
                                        <p className="text-sm text-gray-500 mt-1 max-w-2xl">{decision.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-gray-300 uppercase mb-1">Due Date</p>
                                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{new Date(decision.dueDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                            {decisions.length === 0 && (
                                <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-3xl">
                                    <Gavel className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-400 font-bold">No decisions recorded yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'invoicing' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Commercial Control</h2>
                            <button onClick={createInvoice} className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 flex items-center gap-2 transition shadow-md">
                                <Receipt className="w-4 h-4" />
                                Issue Invoice
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl border border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Billable</p>
                                <p className="text-3xl font-black text-gray-900 dark:text-white">$10,000</p>
                            </div>
                            <div className="p-6 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl border border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Outstanding</p>
                                <p className="text-3xl font-black text-amber-600">$2,500</p>
                            </div>
                            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Value Delivered</p>
                                <p className="text-3xl font-black text-emerald-900">100%</p>
                                <p className="text-[10px] text-emerald-500 font-bold mt-1">Based on accepted scope</p>
                            </div>
                        </div>
                        
                        <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm mt-8">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-[10px]">Invoice #</th>
                                        <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-[10px]">Date</th>
                                        <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-[10px]">Amount</th>
                                        <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-[10px]">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {invoices.map(inv => (
                                    <tr key={inv.id} className="hover:bg-gray-50 dark:bg-[#050505]/50 transition">
                                        <td className="px-6 py-4 font-mono font-bold text-gray-600 dark:text-gray-400">{inv.invoiceNumber}</td>
                                        <td className="px-6 py-4 text-gray-500">{new Date(inv.issueDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-black text-gray-900 dark:text-white">${inv.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                                inv.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {invoices.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-400 font-bold">
                                            No commercial activity yet.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'changes' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Change Control</h2>
                        {changeRequests.map(cr => (
                            <div key={cr.id} className="p-6 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-2xl shadow-sm hover:border-orange-200 transition">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-black rounded uppercase">PENDING</span>
                                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{cr.title}</h4>
                                        </div>
                                        <p className="text-sm text-gray-500 max-w-3xl leading-relaxed">{cr.description}</p>
                                        <div className="flex items-center gap-6 pt-2">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase">Impact: Timeline</p>
                                                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{cr.impactTime || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase">Impact: Cost</p>
                                                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{cr.impactCost ? `$${cr.impactCost}` : 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-4 py-2 border border-gray-200 text-gray-600 dark:text-gray-400 rounded-xl text-sm font-bold hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 transition">Reject</button>
                                        <button className="px-4 py-2 bg-orange-600 text-white rounded-xl text-sm font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-100">Approve Analysis</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {changeRequests.length === 0 && (
                            <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-3xl">
                                <GitPullRequest className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                                <p className="text-gray-400 font-bold">No change requests in flight.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'deliverables' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Execution Tracking</h2>
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 transition shadow-md">
                                <Plus className="w-4 h-4" />
                                Add Deliverable
                            </button>
                        </div>
                        
                        <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-[10px]">Deliverable</th>
                                        <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-[10px]">Quality Gates</th>
                                        <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-[10px]">Status</th>
                                        <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-[10px] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {deliverables.map(del => (
                                    <tr key={del.id} className="hover:bg-gray-50 dark:bg-[#050505]/50 transition group">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900 dark:text-white">{del.title}</p>
                                            <div className="mt-4 hidden group-hover:block animate-in fade-in duration-300">
                                                <DeliveryConnector deliverableId={del.id} />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div title="Security" className={`p-1.5 rounded-lg ${del.securityScanPassed ? 'bg-green-100 text-green-600' : 'bg-gray-100 dark:bg-[#0a0a0c] text-gray-400'}`}>
                                                    <Shield className="w-4 h-4" />
                                                </div>
                                                <div title="Compliance" className={`p-1.5 rounded-lg ${del.complianceCheckPassed ? 'bg-green-100 text-green-600' : 'bg-gray-100 dark:bg-[#0a0a0c] text-gray-400'}`}>
                                                    <Scale className="w-4 h-4" />
                                                </div>
                                                <div title="Quality" className={`p-1.5 rounded-lg ${del.qualityGateStatus === 'PASSED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 dark:bg-[#0a0a0c] text-gray-400'}`}>
                                                    <ClipboardCheck className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                                                del.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border-green-200' :
                                                del.status === 'Submitted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                'bg-gray-100 dark:bg-gray-800 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                                            }`}>
                                                {del.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                                                <button onClick={() => handleRunQualityCheck(del.id)} className="p-2 text-blue-500 hover:bg-blue-50 dark:bg-blue-900/20 rounded-lg transition" title="Run Quality Gates"><Play className="w-4 h-4" /></button>
                                                <button onClick={() => handleDeleteDeliverable(del.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:bg-red-900/20 rounded-lg transition" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {deliverables.length === 0 && (
                                    <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-400 font-bold italic">No milestones set in this project's roadmap.</td></tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'feedback' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <ClientFeedbackList projectId={projectId} title="Client Satisfaction & NPS" />
                    </div>
                )}

                {activeTab === 'compliance' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white">Security & Compliance</h2>
                                <p className="text-sm text-gray-500">GRC tracking, assurance data, and regulatory compliance status.</p>
                            </div>
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> Fully Compliant
                            </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-b border-gray-100">
                                            <tr>
                                                <th className="px-6 py-4 font-bold text-gray-400 uppercase text-[10px]">Control Area</th>
                                                <th className="px-6 py-4 font-bold text-gray-400 uppercase text-[10px]">Status</th>
                                                <th className="px-6 py-4 font-bold text-gray-400 uppercase text-[10px]">Last Audit</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {[
                                                { area: 'Data Residency (EU/DE)', status: 'Verified', date: 'Feb 01, 2026' },
                                                { area: 'Encryption at Rest (AES-256)', status: 'Verified', date: 'Feb 03, 2026' },
                                                { area: 'IAM Access Controls', status: 'Warning', date: 'Feb 04, 2026' },
                                                { area: 'ISO 27001 Alignment', status: 'Pending', date: 'Scheduled' }
                                            ].map((ctrl, i) => (
                                                <tr key={i} className="hover:bg-gray-50 dark:bg-[#050505] transition">
                                                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{ctrl.area}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`text-[10px] font-black uppercase ${
                                                            ctrl.status === 'Verified' ? 'text-green-600' :
                                                            ctrl.status === 'Warning' ? 'text-amber-600' : 'text-gray-400'
                                                        }`}>
                                                            {ctrl.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500 font-bold">{ctrl.date}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="p-6 bg-slate-800 text-white rounded-3xl shadow-xl">
                                    <h4 className="text-sm font-bold mb-6 flex items-center gap-2">
                                        <Lock className="w-4 h-4 text-blue-400" />
                                        Assurance Share
                                    </h4>
                                    <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                                        Upload and share GRC tracking data or compliance certifications directly with the client.
                                    </p>
                                    <button className="w-full py-3 bg-white dark:bg-gray-900 dark:border-gray-800 text-slate-900 dark:text-white rounded-xl font-bold hover:bg-slate-100 transition flex items-center justify-center gap-2">
                                        <Upload className="w-4 h-4" />
                                        Upload Certification
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Project Assets</h2>
                                <p className="text-sm text-gray-500">Repository for all formal documents and shared resources.</p>
                            </div>
                            <div className="flex gap-3">
                                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                                <button className="px-4 py-2 border border-gray-200 text-gray-600 dark:text-gray-400 rounded-xl text-sm font-bold hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 transition flex items-center gap-2">
                                    <ClipboardCheck className="w-4 h-4 text-brand-blue" />
                                    Auto-Report
                                </button>
                                <button 
                                    onClick={() => fileInputRef.current.click()}
                                    disabled={uploading}
                                    className="px-6 py-2 bg-brand-blue text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-lg flex items-center gap-2 disabled:opacity-50"
                                >
                                    {uploading ? <Clock className="w-4 h-4 animate-spin"/> : <Upload className="w-4 h-4" />}
                                    Upload Asset
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* General Upload Option */}
                            <div 
                                onClick={() => {
                                    setSelectedPlaceholder(null);
                                    fileInputRef.current.click();
                                }}
                                className="border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-brand-blue hover:bg-blue-50 dark:bg-blue-900/20/30 transition group"
                            >
                                <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition">
                                    <Plus className="w-6 h-6 text-gray-400 group-hover:text-brand-blue" />
                                </div>
                                <p className="font-bold text-gray-900 dark:text-white text-sm">New Doc</p>
                                <p className="text-[10px] text-gray-400 mt-1 uppercase">Max 500MB</p>
                            </div>

                            {/* Default Requirement Placeholders */}
                            {DEFAULT_PLACEHOLDERS.map(placeholder => {
                                const exists = documents.some(doc => doc.title.toLowerCase() === placeholder.toLowerCase());
                                if (exists) return null;
                                return (
                                    <div 
                                        key={placeholder}
                                        onClick={() => {
                                            setSelectedPlaceholder(placeholder);
                                            fileInputRef.current.click();
                                        }}
                                        className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50 border border-dashed border-gray-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-400 hover:bg-amber-50/30 transition group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-2">
                                            <AlertTriangle className="w-4 h-4 text-amber-500 opacity-50" />
                                        </div>
                                        <div className="p-3 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl text-gray-300 mb-4 group-hover:text-amber-500 transition shadow-sm">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <h4 className="font-bold text-gray-400 text-xs mb-1 uppercase tracking-wider">{placeholder}</h4>
                                        <p className="text-[10px] text-amber-600 font-black flex items-center gap-1">
                                            <Plus className="w-3 h-3" /> UPLOAD REQUIRED
                                        </p>
                                    </div>
                                );
                            })}

                            {documents.map(doc => (
                                <div key={doc.id} className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-3xl p-6 hover:shadow-xl hover:shadow-gray-200/50 transition group h-full flex flex-col justify-between">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl text-gray-400 group-hover:bg-blue-50 group-hover:text-brand-blue transition">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <span className="text-[10px] font-mono text-gray-300">PDF</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1 mb-1 truncate" title={doc.title}>{doc.title}</h4>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">{new Date(doc.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                                        <a href={doc.url} target="_blank" rel="noreferrer" className="text-xs font-bold text-brand-blue hover:underline">Download</a>
                                        <button className="text-gray-300 hover:text-red-500 transition"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>

        {showOverrideModal && (
            <ProgressOverrideModal 
                projectId={projectId}
                currentProgress={project.progress}
                onClose={() => setShowOverrideModal(false)}
                onSuccess={() => {
                    queryClient.invalidateQueries(['project', projectId]);
                    setShowOverrideModal(false);
                    toast({ title: "Updated", description: "Progress updated successfully" });
                }}
            />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetailPage;
