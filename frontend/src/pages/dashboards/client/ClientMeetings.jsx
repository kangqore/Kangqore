
import React, { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import TabNavigation from '../../../components/ui/TabNavigation';
import { CalendarDays, MessageSquare, Mail, Star } from 'lucide-react';
import ClientMeetingsList from './ClientMeetingsList';
import ClientMessages from './ClientMessages';
import ClientEmails from './ClientEmails';
import ClientFeedback from './ClientFeedback';

const ClientMeetings = () => {
  const [activeTab, setActiveTab] = useState('meetings');

  return (
    <DashboardLayout role="client" title="Collaboration & Communication" subtitle="Schedule, messages, and feedback channels">
      
      {/* Tab Navigation */}
      <TabNavigation 
        activeTab={activeTab}
        onChange={setActiveTab}
        layoutId="meetings-tabs"
        tabs={[
            { id: 'meetings', label: 'Meetings', icon: CalendarDays },
            { id: 'messages', label: 'Messages', icon: MessageSquare },
            { id: 'emails', label: 'Emails', icon: Mail },
            { id: 'feedback', label: 'Client Feedback', icon: Star }
        ]}
      />

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === 'meetings' && <ClientMeetingsList isTabContent={true} />}
        {activeTab === 'messages' && <ClientMessages isTabContent={true} />}
        {activeTab === 'emails' && <ClientEmails isTabContent={true} />}
        {activeTab === 'feedback' && <ClientFeedback isTabContent={true} />}
      </div>
    </DashboardLayout>
  );
};

export default ClientMeetings;
