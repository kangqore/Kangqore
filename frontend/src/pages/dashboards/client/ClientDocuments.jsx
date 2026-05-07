import React, { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { FileText, Download, Search, Filter, Shield, Receipt, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SmartProgressBar from '../../../components/ui/SmartProgressBar';

// ... (DOCUMENT_GROUPS mock is not used anymore since we fetch)

const ClientDocuments = ({ isTabContent = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();
  const fileInputRef = React.useRef(null);
  const [targetCategory, setTargetCategory] = useState(null);
  
  const DEFAULT_PLACEHOLDERS = [
    "Offer Document", 
    "Proposal Document", 
    "Legal & Contracts Document", 
    "Onboarding Document", 
    "SOPs Document",
    "Other Documents"
  ];
  
  // Fetch Real Documents
  const { data: documents = [], isLoading } = useQuery({
      queryKey: ['client-documents'],
      queryFn: async () => {
          const token = localStorage.getItem('token');
          const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/documents/my-documents`, {
             headers: { Authorization: `Bearer ${token}` }
          });
          return res.data.documents;
      }
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ file, category }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', category); // Map category to type
        formData.append('title', file.name);
        
        // Get clientId from current user
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        formData.append('clientId', user.id);

        const token = localStorage.getItem('token');
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/documents/upload`, formData, {
            headers: { 
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}` 
            }
        });
        return res.data.document;
    },
    onMutate: async (newDoc) => {
        setIsUploading(true);
        await queryClient.cancelQueries({ queryKey: ['client-documents'] });
        const previousDocs = queryClient.getQueryData(['client-documents']);
        
        // Optimistic Placeholder
        const optimisticDoc = {
            id: 'optimistic-' + Date.now(),
            title: newDoc.file.name,
            size: newDoc.file.size,
            type: newDoc.category,
            createdAt: new Date().toISOString(),
            url: '#',
            isOptimistic: true // For UI feedback
        };

        queryClient.setQueryData(['client-documents'], (old = []) => [optimisticDoc, ...old]);
        return { previousDocs };
    },
    onSuccess: () => {
        // Success state is handled by onSettled/invalidation
    },
    onError: (err, newDoc, context) => {
        queryClient.setQueryData(['client-documents'], context.previousDocs);
        alert("Upload failed. Please try again.");
    },
    onSettled: () => {
        setIsUploading(false);
        queryClient.invalidateQueries({ queryKey: ['client-documents'] });
    }
  });

  const handleFileSelect = (e) => {
      const file = e.target.files[0];
      if (file) {
          uploadMutation.mutate({ file, category: targetCategory || 'Other Documents' });
      }
  };

  const triggerUpload = (category) => {
      setTargetCategory(category);
      fileInputRef.current.click();
  };

  // Group documents by type (Mapping from backend "type" to UI "Group")
  const groupedDocuments = React.useMemo(() => {
    if (!documents) return [];
    
    const groups = {
        'Offer Document': [],
        'Proposal Document': [],
        'Legal & Contracts Document': [],
        'Onboarding Document': [],
        'SOPs Document': [],
        'Other Documents': []
    };

    documents.forEach(doc => {
        let category = 'Other Documents';
        const title = doc.title || '';
        const type = doc.type || '';
        
        if (type === 'OFFER' || title.toLowerCase().includes('offer')) category = 'Offer Document';
        else if (type === 'PROPOSAL' || title.toLowerCase().includes('proposal')) category = 'Proposal Document';
        else if (type === 'LEGAL' || title.toLowerCase().includes('contract') || title.toLowerCase().includes('agreement') || title.toLowerCase().includes('nda') || title.toLowerCase().includes('msa')) category = 'Legal & Contracts Document';
        else if (type === 'ONBOARDING' || title.toLowerCase().includes('onboarding') || title.toLowerCase().includes('checklist')) category = 'Onboarding Document';
        else if (type === 'SOP' || title.toLowerCase().includes('sop') || title.toLowerCase().includes('procedure') || title.toLowerCase().includes('protocol')) category = 'SOPs Document';

        groups[category].push(doc);
    });

    return Object.entries(groups)
        .filter(([_, docs]) => docs.length > 0)
        .map(([title, docs]) => ({ title, items: docs }));
  }, [documents]);

  const pendingRequirements = React.useMemo(() => {
    if (!documents) return DEFAULT_PLACEHOLDERS;
    return DEFAULT_PLACEHOLDERS.filter(p => 
        !documents.some(doc => {
            const docCat = doc.type || '';
            const title = doc.title || '';
            if (p === 'Offer Document' && (docCat === 'OFFER' || title.toLowerCase().includes('offer'))) return true;
            if (p === 'Proposal Document' && (docCat === 'PROPOSAL' || title.toLowerCase().includes('proposal'))) return true;
            if (p === 'Legal & Contracts Document' && (docCat === 'LEGAL' || title.toLowerCase().includes('contract') || title.toLowerCase().includes('agreement'))) return true;
            if (p === 'Onboarding Document' && (docCat === 'ONBOARDING' || title.toLowerCase().includes('onboarding'))) return true;
            if (p === 'SOPs Document' && (docCat === 'SOP' || title.toLowerCase().includes('sop'))) return true;
            return false;
        })
    );
  }, [documents]);

  const filteredGroups = groupedDocuments.map(group => ({
      ...group,
      items: group.items.filter(d => d.title.toLowerCase().includes(searchTerm.toLowerCase()))
  })).filter(g => g.items.length > 0);


  const content = (
      <div className="space-y-8">
        <SmartProgressBar isProcessing={isUploading} label="Uploading Document Securely..." />
        
        <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
        />

        {/* Enhanced Search & Filter Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 dark:border-gray-800/80 backdrop-blur-sm p-5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100/50 flex justify-between items-center hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300">
                 <div className="relative w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search documents by name or type..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border-0 rounded-xl focus:ring-2 focus:ring-brand-blue/50 focus:bg-white dark:bg-gray-900 dark:border-gray-800 transition-all text-sm font-medium"
                    />
                 </div>
                 <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400 ml-4">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-bold text-xs uppercase tracking-wider">Secure Vault</span>
                 </div>
            </div>

            {/* Enhanced DCI Card */}
            <div className="relative overflow-hidden bg-brand-gradient rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group">
                {/* Decorative Mesh */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-white dark:bg-black/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
                
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.15em] font-black text-blue-100 mb-2">Delivery Confidence Index</p>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-black">92</span>
                            <span className="text-lg text-blue-100 mb-1 font-bold">/ 100</span>
                        </div>
                        <p className="text-[10px] text-blue-200 font-semibold mt-1">Excellent Standing</p>
                    </div>
                    <div className="h-14 w-14 rounded-full bg-white dark:bg-gray-900 dark:border-gray-800/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <CheckCircle2 className="w-7 h-7 text-white" />
                    </div>
                </div>
            </div>
        </div>

        {/* Refined Pending Strategic Requirements */}
        {pendingRequirements.length > 0 && !searchTerm && (
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-3xl border border-slate-200 p-7 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm">
                        <Clock className="w-5 h-5 text-slate-600 dark:text-gray-400" />
                    </div>
                    <h3 className="font-black text-slate-900 dark:text-white text-lg">Pending Strategic Requirements</h3>
                    <span className="text-[9px] font-black bg-slate-200 text-slate-700 dark:text-gray-300 px-3 py-1 rounded-full uppercase tracking-wider ml-auto">Awaiting Upload</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {pendingRequirements.map((placeholder, idx) => (
                        <div 
                            key={placeholder} 
                            onClick={() => triggerUpload(placeholder)}
                            className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-slate-200 rounded-2xl p-5 flex flex-col items-center text-center hover:border-brand-blue hover:shadow-md transition-all duration-300 group cursor-pointer"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <div className="p-3 bg-slate-100 rounded-xl mb-3 group-hover:bg-blue-50 dark:bg-blue-900/20 transition-colors">
                                <FileText className="w-7 h-7 text-slate-400 group-hover:text-brand-blue transition-colors" />
                            </div>
                            <p className="text-[11px] font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wide">{placeholder}</p>
                            <p className="text-[9px] text-slate-500 font-semibold mt-2">Click to Upload</p>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Premium Document Sections */}
        {isLoading ? (
            <div className="text-center py-16">
                <div className="inline-block p-4 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-lg mb-4">
                    <FileText className="w-8 h-8 text-gray-300 animate-pulse" />
                </div>
                <p className="text-gray-500 font-medium">Loading documents...</p>
            </div>
        ) : filteredGroups.length > 0 ? (
            filteredGroups.map((group, groupIdx) => (
            <div 
                key={groupIdx} 
                className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100/50 overflow-hidden hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300"
                style={{ animationDelay: `${groupIdx * 100}ms` }}
            >
                <div className="bg-gradient-to-r from-gray-50 to-white px-7 py-5 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-black text-gray-900 dark:text-white text-lg tracking-tight">{group.title}</h3>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] bg-gray-100 dark:bg-[#0a0a0c] px-3 py-1.5 rounded-full">{group.items.length} Files</span>
                </div>
                <div className="divide-y divide-gray-50">
                    {group.items.map((doc, docIdx) => (
                        <div 
                            key={doc.id} 
                            className={`p-6 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/20 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-5 group ${doc.isOptimistic ? 'opacity-70 animate-pulse' : ''}`}
                            style={{ animationDelay: `${(groupIdx * 100) + (docIdx * 50)}ms` }}
                        >
                            
                            {/* Document Info */}
                            <div className="flex items-start gap-5">
                                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 text-brand-blue rounded-2xl shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                                    <FileText className="w-7 h-7" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">{doc.title}</h4>
                                        {doc.isOptimistic && (
                                            <span className="text-[9px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">Uploading...</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <span className="font-mono bg-gradient-to-r from-gray-100 to-slate-100 px-2.5 py-1 rounded-lg text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-wider">{doc.isOptimistic ? 'Syncing...' : 'Latest'}</span>
                                        <span className="text-gray-300">•</span>
                                        <span className="font-semibold">{(doc.size / 1024 / 1024).toFixed(2)} MB</span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-gray-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(doc.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Actions */}
                            <div className="flex items-center gap-3 self-end sm:self-center">
                                <button 
                                    disabled={doc.isOptimistic}
                                    className={`px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-brand-blue hover:bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl border border-transparent hover:border-gray-200 hover:shadow-sm transition-all ${doc.isOptimistic ? 'cursor-not-allowed text-gray-300' : ''}`}
                                >
                                    View
                                </button>
                                <button 
                                    disabled={doc.isOptimistic}
                                    className={`flex items-center gap-2 px-4 py-2 text-sm font-black text-white bg-brand-gradient hover:shadow-lg rounded-xl transition-all hover:scale-105 active:scale-95 ${doc.isOptimistic ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <Download className="w-4 h-4" />
                                    {doc.isOptimistic ? 'Uploading' : 'Download'}
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        ))) : (
            <div className="text-center py-16 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl border border-dashed border-gray-300 shadow-sm">
                <div className="inline-block p-5 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl mb-4">
                    <FileText className="w-10 h-10 text-gray-300" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-bold text-lg mb-2">No documents available</p>
                <p className="text-sm text-gray-400">Your engagement manager will upload relevant assets here.</p>
            </div>
        )}
        
      </div>
  );

  if (isTabContent) return content;

  return (
    <DashboardLayout role="client" title="Documents & Assets" subtitle="Audit-ready repository of all engagement assets">
      {content}
    </DashboardLayout>
  );
};

export default ClientDocuments;
