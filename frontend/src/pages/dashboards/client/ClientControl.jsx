import React from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  GitPullRequest, 
  AlertTriangle, 
  CheckCircle, 
  Target, 
  ArrowRight,
  Shield, 
  Lock,
  FileText,
  Download,
  History,
  Settings,
  Layout,
  GitCommit
} from 'lucide-react';
import TabNavigation from '../../../components/ui/TabNavigation';
import ClientAudit from './ClientAudit';
import ClientDocuments from './ClientDocuments';
import ClientSteering from './ClientSteering';
import ClientDecisions from './ClientDecisions';
import ClientCompliance from './ClientCompliance';
import ClientChangeRequests from './ClientChangeRequests';

const ACTION_CARDS = [
  {
    id: 'change-request',
    title: 'Change Request',
    description: 'Propose changes to scope, timeline, or deliverables.',
    icon: GitPullRequest,
    color: 'blue',
    action: 'Initiate Request',
    impactDelay: 'Implementation delayed by 1 sprint',
    impactReject: 'Current scope remains strictly enforced'
  },
  {
    id: 'escalation',
    title: 'Raise Escalation',
    description: 'Flag critical blockers directly to Kangqore leadership.',
    icon: AlertTriangle,
    color: 'red',
    action: 'Raise Flag',
    impactDelay: 'Issue may compound; timeline risk increases',
    impactReject: 'N/A'
  },
  {
    id: 'approval',
    title: 'Approve Milestone',
    description: 'Sign-off on completed deliverables to trigger next phase.',
    icon: CheckCircle,
    color: 'green',
    action: 'Review Pending',
    impactDelay: 'Phase 3 Kickoff blocked (+3 days risk)',
    impactReject: 'Rework cycle triggered (approx 1 week)'
  },
  {
    id: 'priority',
    title: 'Add Priority / Constraint',
    description: 'Update business priorities or flag new constraints.',
    icon: Target,
    color: 'purple',
    action: 'Update Context',
    impactDelay: 'Team continues on current ambiguous path',
    impactReject: 'N/A'
  }
];

const USERS = [
    { id: 1, name: 'Massimo Red', email: 'm.red@client.com', role: 'Admin' },
    { id: 2, name: 'Sarah Jones', email: 's.jones@client.com', role: 'Approver' },
    { id: 3, name: 'Legal Corp', email: 'legal@client.com', role: 'Viewer' },
];

const COMPLIANCE_DOCS = [
    { name: 'Master Services Agreement (MSA)', date: 'Oct 10, 2025' },
    { name: 'Data Processing Agreement (DPA)', date: 'Oct 12, 2025' },
    { name: 'Non-Disclosure Agreement (NDA)', date: 'Oct 01, 2025' },
];

const AUDIT_LOGS = [
    { id: 102, timestamp: '2026-01-26 14:30:22', user: 'Massimo Red', action: 'Approved Milestone: Phase 1', ip: '203.0.113.45' },
    { id: 101, timestamp: '2026-01-25 09:15:10', user: 'Sarah Jones', action: 'Viewed Invoice #INV-2026-001', ip: '198.51.100.12' },
    { id: 100, timestamp: '2026-01-24 11:05:00', user: 'System', action: 'Generated Weekly Report', ip: '10.0.0.5' },
];

const ClientControl = () => {
  const [activeTab, setActiveTab] = React.useState('audit');

  return (
    <DashboardLayout role="client" title="Governance & Control" subtitle="Governance, Approvals, and Strategic Direction">
      
      {/* Tab Navigation */}
      <TabNavigation 
        activeTab={activeTab}
        onChange={setActiveTab}
        layoutId="control-tabs"
        tabs={[
            { id: 'audit', label: 'Audit Logs', icon: History },
            { id: 'documents', label: 'Documents & Assets', icon: FileText },
            { id: 'steering', label: 'Steering Governance', icon: Layout },
            { id: 'decisions', label: 'Decision Log', icon: GitCommit },
            { id: 'compliance', label: 'Security & Compliance', icon: Shield },
            { id: 'change', label: 'Change Requests', icon: AlertTriangle }
        ]}
      />

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === 'audit' && <ClientAudit isTabContent={true} />}
        {activeTab === 'documents' && <ClientDocuments isTabContent={true} />}
        {activeTab === 'steering' && <ClientSteering isTabContent={true} />}
        {activeTab === 'decisions' && <ClientDecisions isTabContent={true} />}
        {activeTab === 'compliance' && <ClientCompliance isTabContent={true} />}
        {activeTab === 'change' && <ClientChangeRequests isTabContent={true} />}
      </div>
    </DashboardLayout>
  );
};

export default ClientControl;
