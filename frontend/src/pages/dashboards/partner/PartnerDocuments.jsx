import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../../../components/DashboardLayout';
import { FileText, Download, ExternalLink, Shield, FolderOpen, Award, FileCheck } from 'lucide-react';

const PartnerDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('work');
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BACKEND_URL}/api/partner/documents`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDocuments(res.data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, [BACKEND_URL]);

  const tabs = [
    { id: 'work', label: 'Work Docs', icon: FolderOpen, description: 'Specs, designs, requirements' },
    { id: 'compliance', label: 'Compliance', icon: Shield, description: 'NDA, MSA, security forms' },
    { id: 'certifications', label: 'Certifications', icon: Award, description: 'Certificates, badges' },
  ];

  const getDocCategory = (doc) => {
    // Determine category from document type or category field
    const category = doc.category?.toLowerCase() || doc.type?.toLowerCase() || '';
    if (category.includes('nda') || category.includes('msa') || category.includes('security') || category.includes('compliance')) {
      return 'compliance';
    }
    if (category.includes('cert') || category.includes('badge') || category.includes('award')) {
      return 'certifications';
    }
    return 'work';
  };

  const filteredDocs = documents.filter(doc => getDocCategory(doc) === activeTab);

  const getDocIcon = (category) => {
    switch(category) {
      case 'compliance': return Shield;
      case 'certifications': return Award;
      default: return FileText;
    }
  };

  const getDocIconStyle = (category) => {
    switch(category) {
      case 'compliance': return 'bg-amber-50 text-amber-600';
      case 'certifications': return 'bg-purple-50 text-purple-600';
      default: return 'bg-blue-50 text-blue-600';
    }
  };

  return (
    <DashboardLayout role="partner" title="Documents" subtitle="Specs, Designs, Compliance & Certifications">
      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-100">
          <div className="flex">
            {tabs.map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <TabIcon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Description */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-b border-gray-100">
          <p className="text-sm text-gray-500">
            {tabs.find(t => t.id === activeTab)?.description}
          </p>
        </div>

        {/* Documents List */}
        <div className="divide-y divide-gray-100">
          {loading && <div className="p-8 text-center text-gray-500">Loading documents...</div>}
          {!loading && filteredDocs.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-[#0a0a0c] text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={32} />
              </div>
              <h3 className="text-gray-900 dark:text-white font-medium mb-1">No {tabs.find(t => t.id === activeTab)?.label}</h3>
              <p className="text-gray-500 text-sm">No documents in this category yet.</p>
            </div>
          )}
          {filteredDocs.map(doc => {
            const DocIcon = getDocIcon(getDocCategory(doc));
            const iconStyle = getDocIconStyle(getDocCategory(doc));
            return (
              <div key={doc.id} className="p-6 hover:bg-gray-50 dark:bg-[#050505] transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${iconStyle}`}>
                    <DocIcon size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-0.5">{doc.title}</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="capitalize">{doc.platform || doc.category || 'Document'}</span>
                      <span>•</span>
                      <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                      {doc.fileSize && (
                        <>
                          <span>•</span>
                          <span>{doc.fileSize}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <a 
                  href={doc.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium flex items-center gap-2"
                >
                  <ExternalLink size={16} />
                  Open
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confidentiality Notice */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 rounded-xl p-4 flex gap-4 text-blue-800 text-sm">
        <div className="p-1"><Shield size={16} /></div>
        <div>
          <strong>Note on Confidentiality:</strong> All documents listed here are subject to your Non-Disclosure Agreement (NDA). Do not share, download, or distribute these files to unauthorized third parties.
        </div>
      </div>
    </DashboardLayout>
  );
};
export default PartnerDocuments;

