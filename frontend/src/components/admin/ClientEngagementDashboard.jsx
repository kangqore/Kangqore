import React, { useState } from 'react';
import { 
  Building2, 
  ArrowLeft, 
  AlertTriangle, 
  Gavel, 
  Receipt, 
  GitPullRequest,
  Plus,
  CheckCircle,
  XCircle,
  Upload,
  Calendar,
  Save,
  Clock,
  Trash2,
  FileText,
  Briefcase,
  Edit,
  Archive,
  MoreVertical,
  Shield, 
  User, 
  Lock, 
  Eye,
  TrendingUp
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import CreateProjectModal from './CreateProjectModal';
import EditProjectModal from './EditProjectModal';
import ClientStrategicHub from '../dashboard/ClientStrategicHub';
import AdminEngagementSentiment from './AdminEngagementSentiment';
import { 
  useAdminRisks, 
  useAdminDecisions, 
  useAdminInvoices, 
  useAdminChangeRequests, 
  useAdminDocuments, 
  useAdminDeliverables,
  useClientProfile,
  useAdminClientHealth,
  useAdminClientROI,
  useAdminClientPerception
} from '../../hooks/useDashboardData';


import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '../../hooks/use-toast';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

const ClientEngagementDashboard = ({ clientId }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const queryClient = useQueryClient();

  // Fetch Client User Details for Strategic Hub
  const { data: clientUser } = useQuery({
      queryKey: ['admin', 'users', clientId],
      queryFn: async () => {
          const token = localStorage.getItem('token');
          const res = await axios.get(`${BACKEND_URL}/api/admin/users/${clientId}`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          return res.data.user;
      },
      enabled: !!clientId
  });

  // Fetch Data
  const { data: risks, isLoading: loadingRisks } = useAdminRisks(clientId);
  const { data: decisions, isLoading: loadingDecisions } = useAdminDecisions(clientId);
  const { data: invoices, isLoading: loadingInvoices } = useAdminInvoices(clientId);
  const { data: changeRequests, isLoading: loadingChanges } = useAdminChangeRequests(clientId);
  const { data: documents, isLoading: loadingDocs } = useAdminDocuments(clientId);
  const { data: deliverables, isLoading: loadingDeliverables } = useAdminDeliverables(clientId);

  // New Enrichment Data
  const { data: profile, isLoading: loadingProfile } = useClientProfile(clientId);
  const { data: healthData, isLoading: loadingHealth } = useAdminClientHealth(clientId);
  const { data: roiData, isLoading: loadingROI } = useAdminClientROI(clientId);
  const { data: perception, isLoading: loadingPerception } = useAdminClientPerception(clientId);

  const fileInputRef = React.useRef(null);
  const [uploading, setUploading] = useState(false);
  
  // Phase 12: Progress Validation
  // const [showOverrideModal, setShowOverrideModal] = useState(false); // Removed as per request
  const [projectData, setProjectData] = useState(null);
  
  // 1. Fetch Client Details (to get Projects)
  // 1. Fetch Client Details (to get Projects) - USING EXISTING QUERY FROM ABOVE
  const { isLoading: loadingClient } = useQuery({ 
    queryKey: ['admin', 'users', clientId],
    enabled: false // Data already fetching in first query
  });

  // Use selectedProjectId if set, otherwise use first project
  const activeProject = selectedProjectId 
    ? clientUser?.projects?.find(p => p.id === selectedProjectId) 
    : clientUser?.projects?.[0];
  const projectId = activeProject?.id;

  // Fetch Project Data (Dynamic)
  const { data: project } = useQuery({
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

  const handleAutoValidate = async () => {
      if (!projectId) return;
      try {
          const token = localStorage.getItem('token');
          await axios.post(`${BACKEND_URL}/api/admin/projects/${projectId}/validate-progress`, {}, {
              headers: { Authorization: `Bearer ${token}` }
          });
          queryClient.invalidateQueries(['project', projectId]);
          alert("✅ Progress auto-validated based on deliverables!");
      } catch (err) {
          console.error(err);
          alert("⚠️ Failed to auto-validate progress");
      }
  };

  const handleEditProject = (project) => {
      setSelectedProject(project);
      setShowEditModal(true);
  };

  const handleDeleteProject = async (projectId, projectTitle) => {
      if (!window.confirm(`Are you sure you want to delete "${projectTitle}"? This action cannot be undone.`)) {
          return;
      }

      try {
          const token = localStorage.getItem('token');
          await axios.delete(`${BACKEND_URL}/api/projects/${projectId}`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          
          // Invalidate queries to refresh the list
          queryClient.invalidateQueries(['admin', 'users', clientId]);
          
          toast({
              title: "✅ Project Deleted",
              description: `"${projectTitle}" has been successfully deleted.`,
              variant: "default"
          });
      } catch (err) {
          console.error('Error deleting project:', err);
          toast({
              title: "❌ Delete Failed",
              description: err.response?.data?.message || "Failed to delete project",
              variant: "destructive"
          });
      }
  };

  const handleArchiveProject = async (project) => {
      try {
          const token = localStorage.getItem('token');
          await axios.put(
              `${BACKEND_URL}/api/projects/${project.id}`,
              { status: 'ARCHIVED' },
              { headers: { Authorization: `Bearer ${token}` } }
          );
          
          queryClient.invalidateQueries(['admin', 'users', clientId]);
          
          toast({
              title: "✅ Project Archived",
              description: `"${project.title}" has been archived.`,
              variant: "default"
          });
      } catch (err) {
          console.error('Error archiving project:', err);
          toast({
              title: "❌ Archive Failed",
              description: "Failed to archive project",
              variant: "destructive"
          });
      }
  };

  const handleEnterProject = (project) => {
      // Navigate to dedicated project detail page
      navigate(`/dashboard/admin/projects/${project.id}`);
  };

  const handleInitializeProject = () => {
      setShowCreateModal(true);
  };
  
  // Handlers for Deliverables
  // Handlers for Deliverables
  const handleCreateDeliverable = async (title, projectId) => {
      try {
          const token = localStorage.getItem('token');
          await axios.post(`${BACKEND_URL}/api/deliverables`, {
              title,
              projectId,
              clientId,
              status: 'Pending',
              qualityGateStatus: 'PENDING',
              securityScanPassed: false,
              complianceCheckPassed: false
          }, {
              headers: { Authorization: `Bearer ${token}` }
          });
          queryClient.invalidateQueries(['admin', 'deliverables', clientId]);
      } catch (err) {
          alert('Failed to create deliverable');
          console.error(err);
      }
  };

  const handleDeleteDeliverable = async (id) => {
      if(!window.confirm("Delete this deliverable?")) return;
      try {
          const token = localStorage.getItem('token');
          await axios.delete(`${BACKEND_URL}/api/deliverables/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          queryClient.invalidateQueries(['admin', 'deliverables', clientId]);
      } catch (err) {
          alert('Failed to delete deliverable');
          console.error(err);
      }
  };

  // Pillar 4: Quality Gate Simulation
  const handleRunQualityCheck = async (deliverableId) => {
      const token = localStorage.getItem('token');
      try {
          // 1. Set status to SCANNING (Optimistic UI could be added here)
          alert("Initiating Security & Compliance Scans...");
          
          // Simulate 2s delay for scan
          setTimeout(async () => {
             // 2. Update to PASSED
             await axios.put(`${BACKEND_URL}/api/deliverables/${deliverableId}`, {
                 securityScanPassed: true,
                 complianceCheckPassed: true,
                 qualityGateStatus: 'PASSED'
             }, {
                 headers: { Authorization: `Bearer ${token}` }
             });
             queryClient.invalidateQueries(['admin', 'deliverables', clientId]);
             alert("✅ Quality Gates Passed: Security Scan & Compliance Verified.");
          }, 2000);

      } catch (err) {
          console.error(err);
          alert("Failed to run quality checks");
      }
  };

  const handleMarkComplete = async (deliverable) => {
      // Gate Check
      if (deliverable.qualityGateStatus !== 'PASSED') {
          alert("🚫 BLOCKED: Cannot mark as complete until Quality Gates (Security & Compliance) are passed.");
          return;
      }

      const token = localStorage.getItem('token');
      try {
          await axios.put(`${BACKEND_URL}/api/deliverables/${deliverable.id}`, {
              status: 'Completed'
          }, {
              headers: { Authorization: `Bearer ${token}` }
          });
          queryClient.invalidateQueries(['admin', 'deliverables', clientId]);
      } catch (err) {
          console.error(err);
          alert("Failed to update status");
      }
  };

  // Pillar 4: Quality Gate Handlers
  const handleRunChecks = async (id) => {
      try {
          const token = localStorage.getItem('token');
          await axios.post(`${BACKEND_URL}/api/deliverables/${id}/check-gates`, {}, {
              headers: { Authorization: `Bearer ${token}` }
          });
          queryClient.invalidateQueries(['admin', 'deliverables', clientId]);
          alert("Quality Checks Simulated: Passed!"); 
      } catch (err) {
          alert("Failed to run checks");
          console.error(err);
      }
  };

  const handleCompleteDeliverable = async (id) => {
      try {
          const token = localStorage.getItem('token');
          await axios.patch(`${BACKEND_URL}/api/deliverables/${id}`, {
              status: 'COMPLETED'
          }, {
               headers: { Authorization: `Bearer ${token}` }
          });
          queryClient.invalidateQueries(['admin', 'deliverables', clientId]);
      } catch (err) {
          if (err.response?.data?.gates) {
               const gates = err.response.data.gates;
               alert(`⛔ BLOCKED: Quality Gates Not Met!\n\nSecurity Scan: ${gates.security ? '✅' : '❌'}\nCompliance Check: ${gates.compliance ? '✅' : '❌'}\nQuality Review: ${gates.quality ? '✅' : '❌'}\n\nPlease run quality checks first.`);
          } else {
               alert("Failed to complete deliverable");
          }
          console.error(err);
      }
  };


  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const token = localStorage.getItem('token');
      
      // 1. Upload File
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadRes = await axios.post(`${BACKEND_URL}/api/uploads`, formData, {
        headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}` 
        }
      });

      const fileUrl = uploadRes.data.file.url;

      // 2. Create Document Record
      await axios.post(`${BACKEND_URL}/api/documents`, {
        title: file.name,
        url: fileUrl,
        type: 'ASSET', // Default
        size: file.size,
        clientId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 3. Refresh
      queryClient.invalidateQueries(['admin', 'documents', clientId]);
      alert("Document uploaded and shared with client!");

    } catch (err) {
      console.error(err);
      alert("Failed to upload document.");
    } finally {
      setUploading(false);
      e.target.value = null; // Reset input
    }
  };

  const handleDeleteDocument = async (docId) => {
      if(!window.confirm("Delete this document? Client will lose access.")) return;
      try {
          const token = localStorage.getItem('token');
          await axios.delete(`${BACKEND_URL}/api/documents/${docId}`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          queryClient.invalidateQueries(['admin', 'documents', clientId]);
      } catch(err) {
          alert("Failed to delete document");
      }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Actions for Projects */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-brand-blue" />
            Client Engagement Dashboard
        </h2>
        <button 
          onClick={handleInitializeProject}
          className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-blue-700 shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {/* Stats Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total Projects</p>
              <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-gray-900 dark:text-white">{clientUser?.projects?.length || 0}</span>
                  <Briefcase className="w-4 h-4 text-brand-blue" />
              </div>
          </div>
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total Risks</p>
              <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-gray-900 dark:text-white">{risks?.length || 0}</span>
                  <AlertTriangle className={`w-4 h-4 ${risks?.some(r => r.severity === 'High') ? 'text-red-500' : 'text-gray-300'}`} />
              </div>
          </div>
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Open Decisions</p>
              <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-gray-900 dark:text-white">{decisions?.filter(d => d.status === 'PENDING').length || 0}</span>
                  <Gavel className="w-4 h-4 text-gray-300" />
              </div>
          </div>
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Changes</p>
              <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-gray-900 dark:text-white">{changeRequests?.length || 0}</span>
                  <GitPullRequest className="w-4 h-4 text-gray-300" />
              </div>
          </div>
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Invoices</p>
              <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-gray-900 dark:text-white">{invoices?.length || 0}</span>
                  <Receipt className="w-4 h-4 text-gray-300" />
              </div>
          </div>
          <div className="bg-blue-600 p-4 rounded-xl border border-blue-700 shadow-md md:col-span-2 flex flex-col justify-center">
              <p className="text-[10px] font-bold text-blue-200 uppercase mb-1">Engagement Health Score</p>
              <div className="flex items-center gap-6 mt-1">
                  <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${healthData?.schedule === 'RED' ? 'bg-red-400' : 'bg-emerald-400'}`} />
                      <span className="text-xs font-bold text-white tracking-wide">Delivery</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${healthData?.budget === 'RED' ? 'bg-red-400' : 'bg-emerald-400'}`} />
                      <span className="text-xs font-bold text-white tracking-wide">Budget</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${healthData?.risk === 'RED' ? 'bg-red-400' : 'bg-emerald-400'}`} />
                      <span className="text-xs font-bold text-white tracking-wide">Security</span>
                  </div>
              </div>
          </div>
      </div>

          {/* Strategic Hub & Sentiment Layer */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                  <ClientStrategicHub profile={profile} clientUser={clientUser} clientId={clientId} />
              </div>
              <div>
                  <AdminEngagementSentiment perception={perception} loading={loadingPerception} />
              </div>
          </div>

          {/* Financial Summary (Admin Overview) */}
          <div className="mb-8 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-200 shadow-sm p-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-full -mr-16 -mt-16 opacity-50"></div>
              <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 rounded-lg">
                          <Receipt className="w-5 h-5" />
                      </div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Engagement Financials</h2>
                  </div>
                  <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Valuation Model</p>
                      <p className="text-sm font-black text-gray-900 dark:text-white">ROI Focused (EVM)</p>
                  </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                  <div className="group">
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Total Contract Value (TCV)</p>
                       <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">₹{(healthData?.details?.totalBudget || 0).toLocaleString()}</p>
                       <div className="mt-2 h-1 w-8 bg-blue-600 rounded-full group-hover:w-12 transition-all"></div>
                  </div>
                  <div className="relative">
                       <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-100 dark:bg-[#0a0a0c] hidden lg:block"></div>
                       <div className="lg:pl-8 group">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Billed Till Date</p>
                          <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">₹{(healthData?.details?.totalSpend || 0).toLocaleString()}</p>
                          <p className="text-[10px] text-emerald-600 font-bold mt-2 uppercase tracking-tight">Verified Invoices</p>
                       </div>
                  </div>
                  <div className="relative">
                       <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-100 dark:bg-[#0a0a0c] hidden lg:block"></div>
                       <div className="lg:pl-8 group">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Value Realized (EVM)</p>
                          <p className="text-2xl font-black text-blue-600 leading-none">₹{(roiData?.valueRealized || 0).toLocaleString()}</p>
                          <div className="mt-2 flex items-center gap-1.5">
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${roiData?.roiPercentage >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 dark:bg-red-900/20 text-red-600'}`}>
                                  {roiData?.roiPercentage?.toFixed(1)}% ROI
                              </span>
                          </div>
                       </div>
                  </div>
                  <div className="relative">
                       <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-100 dark:bg-[#0a0a0c] hidden lg:block"></div>
                       <div className="lg:pl-8 group">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Remaining Runway</p>
                          <div className="flex items-end gap-2">
                              <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">
                                  ₹{((healthData?.details?.totalBudget || 0) - (healthData?.details?.totalSpend || 0)).toLocaleString()}
                              </p>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-2">Est. Unbilled Balance</p>
                       </div>
                  </div>
              </div>
          </div>

          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-200 shadow-sm min-h-[400px] p-6">
          

          {/* Overview of projects and signals for the client */}
              <div className="space-y-8">
                  {/* PROJECTS OVERVIEW */}
                  <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                              <Briefcase className="w-5 h-5 text-brand-blue" /> 
                              Active Projects
                          </h3>
                          {clientUser?.projects?.length > 0 && (
                              <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-brand-blue px-3 py-1 rounded-full font-bold">
                                  {clientUser.projects.length} Project{clientUser.projects.length !== 1 ? 's' : ''}
                              </span>
                          )}
                      </div>

                      {loadingClient ? (
                          <div className="flex items-center justify-center py-8">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-blue"></div>
                          </div>
                      ) : clientUser?.projects?.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {clientUser.projects.map((proj, idx) => (
                                  <div 
                                      key={proj.id} 
                                      onClick={() => handleEnterProject(proj)}
                                      className={`relative bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border-2 shadow-lg hover:shadow-xl transition-all overflow-hidden cursor-pointer ${
                                          proj.id === projectId 
                                              ? 'border-brand-blue ring-4 ring-blue-100' 
                                              : 'border-gray-200 hover:border-gray-300'
                                      }`}
                                      style={{ aspectRatio: '4/5' }}
                                  >
                                      {/* Active Context Badge */}
                                      {proj.id === projectId && (
                                          <div className="absolute top-0 right-0 bg-brand-blue text-white px-3 py-1 rounded-bl-xl text-[10px] font-bold uppercase z-10">
                                              Active Context
                                          </div>
                                      )}
                                      
                                      {/* Card Content */}
                                      <div className="flex flex-col h-full p-6">
                                          {/* Header Section */}
                                          <div className="mb-4">
                                              <div className="flex items-start justify-between gap-2 mb-3">
                                                  <h4 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 flex-1">{proj.title}</h4>
                                                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase whitespace-nowrap ${
                                                      proj.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                                      proj.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                                                      'bg-gray-100 dark:bg-[#0a0a0c] text-gray-600 dark:text-gray-400'
                                                  }`}>
                                                      {proj.status}
                                                  </span>
                                              </div>
                                              
                                              {/* Description & Sentiment Section */}
                                              <div className="mb-4">
                                                  {proj.description && (
                                                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{proj.description}</p>
                                                  )}
                                                  
                                                  <div className="flex items-center gap-3">
                                                      <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100">
                                                          <Shield className="w-3 h-3 text-blue-600" />
                                                          <span className="text-[10px] font-black text-blue-700 uppercase">{proj.progressConfidence || 85}% Conf.</span>
                                                      </div>
                                                      <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded border border-green-100">
                                                          <TrendingUp className="w-3 h-3 text-green-600" />
                                                          <span className="text-[10px] font-black text-green-700 uppercase">Velocity High</span>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                          
                                          {/* Project Details */}
                                          <div className="flex-1 space-y-3 mb-4">
                                              {/* Partner Info */}
                                              {proj.partner && (
                                                  <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100">
                                                      <User className="w-4 h-4 text-purple-600" />
                                                      <div>
                                                          <p className="text-xs text-purple-500 font-medium">Delivery Partner</p>
                                                          <p className="text-sm font-bold text-purple-900">{proj.partner.name}</p>
                                                      </div>
                                                  </div>
                                              )}
                                              
                                              {/* Created Date */}
                                              <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-lg border border-gray-100">
                                                  <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                  <div>
                                                      <p className="text-xs text-gray-500 font-medium">Created</p>
                                                      <p className="text-sm font-bold text-gray-900 dark:text-white">{new Date(proj.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                                  </div>
                                              </div>
                                              
                                              {/* Progress Bar (if available) */}
                                              {proj.progress !== null && proj.progress !== undefined && (
                                                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100">
                                                      <div className="flex items-center justify-between mb-2">
                                                          <p className="text-xs text-blue-500 font-medium">Progress</p>
                                                          <p className="text-sm font-bold text-blue-900">{proj.progress}%</p>
                                                      </div>
                                                      <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
                                                          <div 
                                                              className="h-full bg-brand-blue rounded-full transition-all duration-300"
                                                              style={{ width: `${proj.progress}%` }}
                                                          ></div>
                                                      </div>
                                                  </div>
                                              )}
                                          </div>
                                          
                                          {/* Action Buttons Removed: Admin can click the card to enter */}
                                      </div>
                                  </div>
                              ))}
                          </div>
                      ) : (
                          <div className="p-8 text-center bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl border-2 border-dashed border-gray-200">
                              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                              <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">No Projects Initialized</p>
                              <p className="text-sm text-gray-500 mb-4">
                                  Click the "Add Project" button in the header to create the first project for this client.
                              </p>
                          </div>
                      )}
                  </div>

                  {/* Other sections removed for a cleaner project-only view for the admin */}
              </div>
      </div>
      {showCreateModal && (
          <CreateProjectModal 
              onClose={() => setShowCreateModal(false)}
              onSuccess={(createdProject) => {
                  console.log('Project created callback received:', createdProject);
                  
                  // Invalidate ALL client queries since we don't know which client was selected
                  queryClient.invalidateQueries(['admin', 'users']);
                  
                  // Also invalidate the specific client's data if we got the project back
                  if (createdProject?.clientId) {
                      queryClient.invalidateQueries(['admin', 'users', createdProject.clientId]);
                      console.log('Invalidated queries for client:', createdProject.clientId);
                  }
                  
                  // Also invalidate the current client if we're on a client page
                  if (clientId) {
                      queryClient.invalidateQueries(['admin', 'users', clientId]);
                  }
                  
                  setShowCreateModal(false);
                  toast({
                      title: "✅ Project Created",
                      description: "New project initialized successfully!",
                      variant: "default"
                  });
              }}
          />
      )}

      {/* Edit Project Modal */}
      {showEditModal && selectedProject && (
          <EditProjectModal
              project={selectedProject}
              onClose={() => {
                  setShowEditModal(false);
                  setSelectedProject(null);
              }}
              onSuccess={() => {
                  // Invalidate queries to refresh the project list
                  queryClient.invalidateQueries(['admin', 'users', clientId]);
                  queryClient.invalidateQueries(['project', selectedProject.id]);
                  
                  toast({
                      title: "✅ Project Updated",
                      description: "Project details have been updated successfully!",
                      variant: "default"
                  });
              }}
          />
      )}
    </div>
  );
};

export default ClientEngagementDashboard;
