import React, { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import AdminClientEmails from './AdminClientEmails';
import AdminPartnerEmails from './AdminPartnerEmails';
import AdminInvestorEmails from './AdminInvestorEmails';
import AdminJobSeekerEmails from './AdminJobSeekerEmails';
import { 
  Users, Handshake, TrendingUp, Briefcase,
  Plus, Inbox, Send, FileText, Star, AlertCircle, Trash2, Archive
} from 'lucide-react';
import ComposeEmailModal from './ComposeEmailModal';

const AdminEmailTabs = () => {
  const [activeTab, setActiveTab] = useState('client');
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const tabs = [
    { id: 'client', label: 'Clients', icon: Users, component: AdminClientEmails },
    { id: 'partner', label: 'Partners', icon: Handshake, component: AdminPartnerEmails },
    { id: 'investor', label: 'Investors', icon: TrendingUp, component: AdminInvestorEmails },
    { id: 'job_seeker', label: 'Candidates', icon: Briefcase, component: AdminJobSeekerEmails },
  ];

  // Dynamically selecting the component
  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || AdminClientEmails;


  const [activeFolder, setActiveFolder] = useState('inbox');

  const folders = [
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'sent', label: 'Sent', icon: Send },
    { id: 'drafts', label: 'Drafts', icon: FileText },
    { id: 'starred', label: 'Starred', icon: Star },
    { id: 'important', label: 'Important', icon: AlertCircle },
    { id: 'spam', label: 'Spam', icon: Archive },
    { id: 'trash', label: 'Trash', icon: Trash2 },
  ];

  return (
    <DashboardLayout role="admin" title="Emails" subtitle="Manage all communications">
      <div className="flex gap-6 h-[calc(100vh-140px)]">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-6">
          <button 
            onClick={() => setIsComposeOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 hover:opacity-90 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Compose Mail</span>
          </button>

          <nav className="space-y-1">
            {folders.map((folder) => {
              const Icon = folder.icon;
              const isActive = activeFolder === folder.id;
              return (
                <button
                  key={folder.id}
                  onClick={() => setActiveFolder(folder.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all
                    ${isActive 
                      ? 'bg-brand-gradient text-white shadow-md' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  <span className="font-medium">{folder.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Tabs Header */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 dark:border-gray-700/50 p-1 rounded-xl w-fit">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                                ${isActive 
                                    ? 'bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 dark:text-white shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 hover:bg-gray-200/50'}
                            `}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    )
                })}
            </div>
          </div>
          
          {/* Email List Content */}
          <div className="flex-1 overflow-hidden relative">
             <ActiveComponent embedded={true} folder={activeFolder} />
          </div>
        </div>
      </div>
      <ComposeEmailModal isOpen={isComposeOpen} onClose={() => setIsComposeOpen(false)} />
    </DashboardLayout>
  );
};

export default AdminEmailTabs;
