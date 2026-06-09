import React, { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { Layers, Globe, Smartphone, Server, ExternalLink, Clock, CheckCircle, AlertCircle, FileText, MessageSquare, Bug, Shield, Lock } from 'lucide-react';
import axios from 'axios';

const ClientProductVersions = () => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  const DEMO_VERSIONS = [
    {
      id: 'ver-1',
      name: 'Supply Chain AI - PoC',
      type: 'Prototype',
      version: 'v0.5.0-alpha',
      status: 'Live',
      environment: 'Staging',
      url: '#',
      updatedAt: '2025-12-10',
      metadata: {
        description: 'Initial proof-of-concept for the demand forecasting module using historical data.',
        features: ['Historical Data Ingestion', 'Basic Regression Model', 'Dashboard Wireframe'],
        limitations: ['Static Data Only', 'No User Auth'],
        // New Business Context
        business_impact: 'Validates core data pipeline assumptions before full investment.',
        change_risk: 'low',
        rollback_available: false,
        support_sla: 'Best Effort (Mon-Fri)'
      }
    },
    {
      id: 'ver-2',
      name: 'Customer Support Bot MVP',
      type: 'MVP',
      version: 'v1.0.0-beta',
      status: 'In Review',
      environment: 'UAT',
      url: '#',
      updatedAt: '2026-01-15',
      metadata: {
        description: 'Feature-complete MVP of the support bot ready for user acceptance testing.',
        features: ['Intent Recognition', 'Ticket Creation API', 'Slack Integration'],
        limitations: ['English Only', 'Response delay ~2s'],
        // New Business Context
        business_impact: 'Reduces Tier-1 support load by est. 40% once deployed.',
        change_risk: 'medium',
        rollback_available: true,
        support_sla: '24h Response'
      }
    },
    {
      id: 'ver-3',
      name: 'Financial Data Lake',
      type: 'Production',
      version: 'v2.1.0',
      status: 'Live',
      environment: 'Production',
      url: '#',
      updatedAt: '2025-11-20',
      metadata: {
        description: 'Production release of the secure data lake infrastructure.',
        features: ['RBAC Enabled', 'Audit Logging', 'Daily Snapshots'],
        limitations: [],
        // New Business Context
        business_impact: 'Enables real-time financial reporting for Q1 Board Member meeting.',
        change_risk: 'high',
        rollback_available: true,
        support_sla: '1h Critical Incident'
      }
    }
  ];

  React.useEffect(() => {
    const fetchVersions = async () => {
      try {
        const token = localStorage.getItem('token');
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
        // const response = await axios.get(`${BACKEND_URL}/api/client/mvps`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // setVersions(response.data.mvps);
        
        // Demo Data Injection
        const response = await axios.get(`${BACKEND_URL}/api/client/mvps`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { mvps: [] } }));
        const apiVersions = response.data.mvps || [];
        setVersions([...apiVersions, ...DEMO_VERSIONS]);

      } catch (error) {
        console.error('Failed to fetch product versions:', error);
        setVersions(DEMO_VERSIONS);
      } finally {
        setLoading(false);
      }
    };
    fetchVersions();
  }, []);

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'in review': return 'bg-yellow-100 text-yellow-700';
      case 'in progress': return 'bg-blue-100 text-blue-700';
      case 'live': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved': 
      case 'live': return CheckCircle;
      case 'in review': return Clock;
      case 'in progress': return Layers;
      default: return AlertCircle;
    }
  };

  const getTypeStyle = (type) => {
    switch(type?.toLowerCase()) {
      case 'prototype': return { bg: 'bg-blue-50', text: 'text-blue-700', label: 'UX Prototype' };
      case 'mvp': return { bg: 'bg-green-50', text: 'text-green-700', label: 'MVP' };
      case 'beta': return { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Beta' };
      case 'rc': return { bg: 'bg-purple-50', text: 'text-purple-700', label: 'Release Candidate' };
      case 'production': return { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Production' };
      case 'post-launch': return { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Post-Launch' };
      default: return { bg: 'bg-gray-50', text: 'text-gray-700', label: type };
    }
  };

  return (
    <DashboardLayout role="client" title="Product Versions" subtitle="Track your product evolution from Prototype to Production">
      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="text-center py-12">Loading Versions...</div>
        ) : versions.map((version) => {
          const typeStyle = getTypeStyle(version.type);
          const StatusIcon = getStatusIcon(version.status);
          const metadata = version.metadata || {};

          return (
            <div key={version.id} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${typeStyle.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Layers className={`w-6 h-6 ${typeStyle.text}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{version.name}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${typeStyle.bg} ${typeStyle.text}`}>
                          {typeStyle.label}
                        </span>
                      </div>
                      
                      {/* Business Impact Summary */}
                      {metadata.business_impact && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2">
                            "{metadata.business_impact}"
                          </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="font-mono bg-gray-50 dark:bg-[#050505] px-2 py-0.5 rounded text-gray-600 dark:text-gray-400">{version.version || 'v0.0.1'}</span>
                        <span>•</span>
                        <span>{version.environment}</span>
                        <span>•</span>
                        {metadata.change_risk && (
                            <span className={`flex items-center gap-1 text-xs font-bold uppercase px-1.5 py-0.5 rounded ${
                                metadata.change_risk === 'high' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-100' :
                                metadata.change_risk === 'medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                'bg-green-50 dark:bg-green-900/20 text-green-600 border border-green-100'
                            }`}>
                                {metadata.change_risk} Risk
                            </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 self-start ${getStatusColor(version.status)}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {version.status}
                  </span>
                </div>

                {/* Content Body */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t border-gray-50">
                  
                  {/* Left Column: Details & Metadata */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* Features / Notes */}
                    {metadata.description && (
                       <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Release Notes</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{metadata.description}</p>
                      </div>
                    )}
                    
                    {metadata.features && metadata.features.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Features Implemented</h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {metadata.features.map((feat, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {feat}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {metadata.limitations && metadata.limitations.length > 0 && (
                      <div className="mt-4">
                         <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Known Limitations</h4>
                         <ul className="space-y-1">
                            {metadata.limitations.map((lim, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                {lim}
                              </li>
                            ))}
                         </ul>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Actions & Docs */}
                  <div className="space-y-3">
                    <a 
                      href={version.url}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-blue text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View {typeStyle.label}
                    </a>

                    <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl p-4 space-y-4">
                      <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Actions & Docs</h5>
                      
                      {/* Operational Info (New) */}
                      <div className="text-xs space-y-2 pb-3 border-b border-gray-200">
                         <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Rollback Avail.</span>
                            <span className={`font-bold ${metadata.rollback_available ? 'text-green-600' : 'text-gray-400'}`}>
                                {metadata.rollback_available ? 'Yes' : 'No'}
                            </span>
                         </div>
                         <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Support SLA</span>
                            <span className="font-bold text-gray-900 dark:text-white">{metadata.support_sla || 'N/A'}</span>
                         </div>
                      </div>

                      {/* Conditional Actions based on Type */}
                      {version.type === 'Prototype' && (
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-white dark:bg-black hover:text-brand-blue rounded-lg transition-colors text-left">
                          <FileText className="w-4 h-4" />
                          Change Request
                        </button>
                      )}
                      
                      {(version.type === 'MVP' || version.type === 'Beta') && (
                        <>
                          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-white dark:bg-black hover:text-brand-blue rounded-lg transition-colors text-left">
                            <MessageSquare className="w-4 h-4" />
                            Provide Feedback
                          </button>
                          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-white dark:bg-black hover:text-red-600 rounded-lg transition-colors text-left">
                            <Bug className="w-4 h-4" />
                            Report Bug
                          </button>
                        </>
                      )}

                      {version.type === 'RC' && (
                         <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-white dark:bg-black hover:text-green-600 rounded-lg transition-colors text-left">
                           <Shield className="w-4 h-4" />
                           Review QA & Security
                         </button>
                      )}

                      {version.type === 'Production' && (
                         <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-white dark:bg-black hover:text-brand-blue rounded-lg transition-colors text-left">
                           <Lock className="w-4 h-4" />
                           Admin Credentials
                         </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
        
        {versions.length === 0 && (
           <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl border border-dashed border-gray-200">
              <Layers className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Versions Yet</h3>
              <p className="text-gray-500">Your product versions will appear here as they are released.</p>
           </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientProductVersions;
