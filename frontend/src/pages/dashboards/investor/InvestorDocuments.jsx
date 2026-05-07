import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  ShieldCheck,
  Calendar,
  PieChart,
  Landmark,
  Briefcase,
  Lock
} from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';

const InvestorDocuments = () => {
  const [activeTab, setActiveTab] = useState('Financials');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with API fetch
  const [documents] = useState([
    // Financials
    { id: 1, title: 'Q4 2025 Financial Statement', type: 'Financials', date: '2026-01-10', size: '1.2 MB', icon: Landmark },
    { id: 2, title: 'Annual Financial Audit 2025', type: 'Financials', date: '2026-01-15', size: '3.5 MB', icon: Landmark },
    
    // Board Decks
    { id: 3, title: 'Dec 2025 Board Meeting Deck', type: 'Board Decks', date: '2025-12-05', size: '5.8 MB', icon: Briefcase },
    { id: 4, title: 'Sep 2025 Board Meeting Deck', type: 'Board Decks', date: '2025-09-05', size: '4.2 MB', icon: Briefcase },

    // Cap Table
    { id: 5, title: 'Cap Table - Series A Post-Money', type: 'Cap Table', date: '2026-01-20', size: '850 KB', icon: PieChart },
    { id: 6, title: 'Option Pool Summary Q4', type: 'Cap Table', date: '2026-01-01', size: '420 KB', icon: PieChart },

    // Legal / Governance
    { id: 7, title: 'Amended Articles of Incorporation', type: 'Legal / Governance', date: '2024-06-15', size: '2.1 MB', icon: ShieldCheck },
    { id: 8, title: 'Shareholders Agreement', type: 'Legal / Governance', date: '2024-06-15', size: '1.8 MB', icon: ShieldCheck },
    { id: 9, title: 'Board Resolution - Series A', type: 'Legal / Governance', date: '2026-01-18', size: '600 KB', icon: FileText },
  ]);

  const tabs = [
    { id: 'Financials', label: 'Financials', icon: Landmark },
    { id: 'Board Decks', label: 'Board Decks', icon: Briefcase },
    { id: 'Cap Table', label: 'Cap Table', icon: PieChart },
    { id: 'Legal / Governance', label: 'Legal / Governance', icon: Lock },
  ];

  const filteredDocs = documents.filter(d => 
    (activeTab === 'All' || d.type === activeTab) &&
    d.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="investor" title="Documents" subtitle="Secure access to company records and agreements">
      <div className="space-y-6">

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-brand-blue text-brand-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-brand-blue"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-[#0a0a0c] text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Documents List */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Document Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Size</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 dark:bg-[#050505] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          doc.type === 'Financials' ? 'bg-green-50 text-green-600' :
                          doc.type === 'Board Decks' ? 'bg-blue-50 text-blue-600' :
                          doc.type === 'Cap Table' ? 'bg-purple-50 text-purple-600' :
                          'bg-gray-100 dark:bg-[#0a0a0c] text-gray-600 dark:text-gray-400'
                        }`}>
                          <doc.icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{doc.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 dark:bg-[#0a0a0c] text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">
                        {doc.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {doc.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{doc.size}</td>
                    <td className="px-6 py-4">
                      <button className="text-brand-blue hover:text-blue-800 font-medium text-sm flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                     No documents found in this section.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
      </div>
    </DashboardLayout>
  );
};

export default InvestorDocuments;
