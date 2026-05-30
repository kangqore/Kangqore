import React from 'react';
import { Route, Navigate } from 'react-router-dom';
const Login = React.lazy(() => import('../pages/Login'));
const Register = React.lazy(() => import('../pages/Register'));
const AuthCallback = React.lazy(() => import('../pages/AuthCallback'));
const Signup = React.lazy(() => import('../pages/Signup'));
const Settings = React.lazy(() => import('../pages/Settings'));
const Profile = React.lazy(() => import('../pages/Profile'));
const ChangePassword = React.lazy(() => import('../pages/ChangePassword'));
const ForgotPassword = React.lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('../pages/ResetPassword'));
const ClientDashboard = React.lazy(() => import('../pages/dashboards/client/ClientDashboard'));
const ClientMeetings = React.lazy(() => import('../pages/dashboards/client/ClientMeetings'));
const ClientProductVersions = React.lazy(() => import('../pages/dashboards/client/ClientMVPs'));
const ClientLinks = React.lazy(() => import('../pages/dashboards/client/ClientLinks'));
const ClientMessages = React.lazy(() => import('../pages/dashboards/client/ClientMessages'));
const AdminMessages = React.lazy(() => import('../pages/dashboards/admin/AdminMessages'));
const ClientEmails = React.lazy(() => import('../pages/dashboards/client/ClientEmails'));
const ClientPlaceholder = React.lazy(() => import('../pages/dashboards/client/ClientPlaceholder'));
const PartnerDashboard = React.lazy(() => import('../pages/dashboards/partner/PartnerDashboard'));
const InvestorDashboard = React.lazy(() => import('../pages/dashboards/investor/InvestorDashboard'));
const CareersDashboard = React.lazy(() => import('../pages/dashboards/careers/CareersDashboard'));
const AdminDashboard = React.lazy(() => import('../pages/dashboards/admin/AdminDashboard'));
const ConsultationsManagement = React.lazy(() => import('../pages/admin/ConsultationsManagement'));
const SchedulingManagement = React.lazy(() => import('../pages/admin/SchedulingManagement'));
const ContactsManagement = React.lazy(() => import('../pages/admin/ContactsManagement'));
const JobApplicationsManagement = React.lazy(() => import('../pages/admin/JobApplicationsManagement'));
const UsersManagement = React.lazy(() => import('../pages/admin/UsersManagement'));
const LeadsManagement = React.lazy(() => import('../pages/admin/LeadsManagement'));
const AnalyticsManagement = React.lazy(() => import('../pages/admin/AnalyticsManagement'));
const ConciergeAnalytics = React.lazy(() => import('../pages/admin/concierge/ConciergeAnalytics'));
const ConciergeKnowledge = React.lazy(() => import('../pages/admin/concierge/ConciergeKnowledge'));
const AssuranceIntelligencePanel = React.lazy(() => import('../pages/admin/concierge/AssuranceIntelligencePanel'));
const ContentManagementPage = React.lazy(() => import('../pages/admin/ContentManagementPage'));
const SystemSettings = React.lazy(() => import('../pages/admin/SystemSettings'));
const CapacityDashboard = React.lazy(() => import('../pages/dashboards/admin/CapacityDashboard'));
const AIInfrastructureDashboard = React.lazy(() => import('../pages/dashboards/admin/AIInfrastructureDashboard'));
const ProgramsDashboard = React.lazy(() => import('../pages/dashboards/admin/ProgramsDashboard'));
const EngagementDashboard = React.lazy(() => import('../pages/dashboards/admin/EngagementDashboard'));
const DeliveryHealthDashboard = React.lazy(() => import('../pages/dashboards/admin/DeliveryHealthDashboard'));
const SkillsBenchDashboard = React.lazy(() => import('../pages/dashboards/admin/SkillsBenchDashboard'));
const BillingDashboard = React.lazy(() => import('../pages/dashboards/admin/BillingDashboard'));
const ContractsDashboard = React.lazy(() => import('../pages/dashboards/admin/ContractsDashboard'));
const AdminAuditLogs = React.lazy(() => import('../pages/dashboards/admin/AdminAuditLogs'));
const ComplianceDashboard = React.lazy(() => import('../pages/dashboards/admin/ComplianceDashboard'));
const PMODashboard = React.lazy(() => import('../pages/dashboards/admin/PMODashboard'));
const EscalationsDashboard = React.lazy(() => import('../pages/dashboards/admin/EscalationsDashboard'));
const SteeringDashboard = React.lazy(() => import('../pages/dashboards/admin/SteeringDashboard'));
const DecisionLogsDashboard = React.lazy(() => import('../pages/dashboards/admin/DecisionLogsDashboard'));
const Risk = React.lazy(() => import('../pages/dashboards/admin/Risk'));
const ChangeControlDashboard = React.lazy(() => import('../pages/dashboards/admin/ChangeControlDashboard'));
const ServicePerformanceDashboard = React.lazy(() => import('../pages/dashboards/admin/ServicePerformanceDashboard'));
const PracticeDashboard = React.lazy(() => import('../pages/dashboards/admin/PracticeDashboard'));
const VendorDashboard = React.lazy(() => import('../pages/dashboards/admin/VendorDashboard'));

const AdminDashboardOld = React.lazy(() => import('../pages/AdminDashboard'));
const AdminConsultations = React.lazy(() => import('../pages/dashboards/admin/AdminConsultations'));
const AdminProjectsManagement = React.lazy(() => import('../pages/admin/AdminProjectsManagement'));
const AdminUserEdit = React.lazy(() => import('../pages/admin/AdminUserEdit'));
const InvestorUpdates = React.lazy(() => import('../pages/dashboards/investor/InvestorUpdates'));
const InvestorMeetings = React.lazy(() => import('../pages/dashboards/investor/InvestorMeetings'));
const InvestorMessages = React.lazy(() => import('../pages/dashboards/investor/InvestorMessages'));
const InvestorEmails = React.lazy(() => import('../pages/dashboards/investor/InvestorEmails'));
const PartnerTasks = React.lazy(() => import('../pages/dashboards/partner/PartnerTasks'));
const PartnerMeetings = React.lazy(() => import('../pages/dashboards/partner/PartnerMeetings'));
const PartnerMessages = React.lazy(() => import('../pages/dashboards/partner/PartnerMessages'));
const PartnerDocuments = React.lazy(() => import('../pages/dashboards/partner/PartnerDocuments'));
const PartnerEmails = React.lazy(() => import('../pages/dashboards/partner/PartnerEmails'));
const CareersJobs = React.lazy(() => import('../pages/dashboards/careers/CareersJobs'));
const CareersApplications = React.lazy(() => import('../pages/dashboards/careers/CareersApplications'));
const CareersInterviews = React.lazy(() => import('../pages/dashboards/careers/CareersInterviews'));
const CareersMessages = React.lazy(() => import('../pages/dashboards/careers/CareersMessages'));
const CareersDocuments = React.lazy(() => import('../pages/dashboards/careers/CareersDocuments'));
const CareersPortfolio = React.lazy(() => import('../pages/dashboards/careers/CareersPortfolio'));
const CareersWork = React.lazy(() => import('../pages/dashboards/careers/CareersWork'));
const ClientProjects = React.lazy(() => import('../pages/dashboards/client/ClientProjects'));
const ClientEngagementDetails = React.lazy(() => import('../pages/dashboards/client/ClientEngagementDetails'));
const ClientDeliverables = React.lazy(() => import('../pages/dashboards/client/ClientDeliverables'));
const ClientDocuments = React.lazy(() => import('../pages/dashboards/client/ClientDocuments'));
const ClientReports = React.lazy(() => import('../pages/dashboards/client/ClientReports'));
const ClientBilling = React.lazy(() => import('../pages/dashboards/client/ClientBilling'));
const ClientControl = React.lazy(() => import('../pages/dashboards/client/ClientControl'));
const ClientDecisions = React.lazy(() => import('../pages/dashboards/client/ClientDecisions'));
const ClientExecutiveReport = React.lazy(() => import('../pages/dashboards/client/ClientExecutiveReport'));
const ClientSettings = React.lazy(() => import('../pages/dashboards/client/ClientSettings'));
const ClientAudit = React.lazy(() => import('../pages/dashboards/client/ClientAudit'));
const ClientChangeRequests = React.lazy(() => import('../pages/dashboards/client/ClientChangeRequests'));
const ClientRisks = React.lazy(() => import('../pages/dashboards/client/ClientRisks'));
const InvestorPortfolio = React.lazy(() => import('../pages/dashboards/investor/InvestorPortfolio'));
const InvestorDocuments = React.lazy(() => import('../pages/dashboards/investor/InvestorDocuments'));
const NotificationsPage = React.lazy(() => import('../pages/NotificationsPage'));
const InvestorReports = React.lazy(() => import('../pages/dashboards/investor/InvestorReports'));
const KPIAnalyticsDashboard = React.lazy(() => import('../pages/dashboards/admin/KPIAnalyticsDashboard'));
const AdminPartnerEmails = React.lazy(() => import('../pages/dashboards/admin/AdminPartnerEmails'));
const JobSeekerEmails = React.lazy(() => import('../pages/dashboards/careers/JobSeekerEmails'));
const AdminClientEmails = React.lazy(() => import('../pages/dashboards/admin/AdminClientEmails'));
const AdminInvestorEmails = React.lazy(() => import('../pages/dashboards/admin/AdminInvestorEmails'));
const AdminJobSeekerEmails = React.lazy(() => import('../pages/dashboards/admin/AdminJobSeekerEmails'));
const AdminEmailTabs = React.lazy(() => import('../pages/dashboards/admin/AdminEmailTabs'));
const AdminClients = React.lazy(() => import('../pages/dashboards/admin/AdminClients'));
const AdminProjectManager = React.lazy(() => import('../pages/dashboards/admin/AdminProjectManager'));
const ProjectDetailPage = React.lazy(() => import('../pages/dashboards/admin/ProjectDetailPage'));
const PartnerProjects = React.lazy(() => import('../pages/dashboards/partner/PartnerProjects'));
const PartnerEarnings = React.lazy(() => import('../pages/dashboards/partner/PartnerEarnings'));
const PartnerDeliverables = React.lazy(() => import('../pages/dashboards/partner/PartnerDeliverables'));
const AdminPartners = React.lazy(() => import('../pages/dashboards/admin/AdminPartners'));
const AdminClientProfile = React.lazy(() => import('../pages/dashboards/admin/AdminClientProfile'));

// KangqoreVis — Visibility Intelligence admin routes (lazy-loaded array)
import { kangqoreVisAdminRoutes } from '../kangqore-vis';

// New Client Dashboard sections
const ClientFeedback = React.lazy(() => import('../pages/dashboards/client/ClientFeedback'));
const ClientSupport = React.lazy(() => import('../pages/dashboards/client/ClientSupport'));
const ClientVision = React.lazy(() => import('../pages/dashboards/client/ClientVision'));
const ClientSLA = React.lazy(() => import('../pages/dashboards/client/ClientSLA'));
const ClientSteering = React.lazy(() => import('../pages/dashboards/client/ClientSteering'));
const ClientCompliance = React.lazy(() => import('../pages/dashboards/client/ClientCompliance'));


const CalendarSettings = React.lazy(() => import('../pages/settings/CalendarSettings'));

/**
 * Authentication and Dashboard Routes
 * These routes don't include the Header/Footer layout
 */
export const authRoutes = [
  // Auth Routes
  <Route key="auth-callback" path="/auth/callback" element={<AuthCallback />} />,
  <Route key="login" path="/login" element={<Login />} />,
  <Route key="register" path="/register" element={<Register />} />,
  <Route key="signup" path="/signup" element={<Signup />} />,
  <Route key="forgot-password" path="/forgot-password" element={<ForgotPassword />} />,
  <Route key="reset-password" path="/reset-password" element={<ResetPassword />} />,
  <Route key="settings" path="/settings" element={<Navigate to="/dashboard/client/settings" replace />} />, // Should ideally use a RoleBasedRedirect component
  <Route key="calendar-settings" path="/dashboard/calendar" element={<CalendarSettings />} />,
  <Route key="profile" path="/profile" element={<Navigate to="/dashboard/client/profile" replace />} />, // Should ideally use a RoleBasedRedirect component
  <Route key="change-password" path="/change-password" element={<ChangePassword />} />,
  <Route key="admin-dashboard-old" path="/admin/dashboard" element={<AdminDashboardOld />} />,

  // Legacy consultation route removed to fix conflict
  // <Route key="admin-consultations-old" path="/dashboard/admin/consultations" element={<AdminConsultations />} />,
  
  // Role-based Dashboard Routes
  <Route key="dashboard-client-meetings" path="/dashboard/client/meetings" element={<ClientMeetings />} />,
  <Route key="dashboard-client-mvps" path="/dashboard/client/product" element={<ClientProductVersions />} />,
  <Route key="dashboard-client-links" path="/dashboard/client/links" element={<ClientLinks />} />,
  <Route key="dashboard-client-messages" path="/dashboard/client/messages" element={<ClientMessages />} />,
  <Route key="dashboard-client-emails" path="/dashboard/client/emails" element={<ClientEmails />} />,
  
  // Placeholders for unfinished sections
  // Client Dashboard Routes
  <Route key="client-projects" path="/dashboard/client/projects" element={<ClientProjects />} />,
  <Route key="client-project-details" path="/dashboard/client/projects/:id" element={<ClientEngagementDetails />} />,
  <Route key="client-deliverables" path="/dashboard/client/deliverables" element={<ClientDeliverables />} />,
  <Route key="client-reports" path="/dashboard/client/reports" element={<ClientReports />} />,
  <Route key="client-executive-report" path="/dashboard/client/executive-report" element={<ClientExecutiveReport />} />, // Gap 5: Executive Narrative
  <Route key="client-documents" path="/dashboard/client/documents" element={<ClientDocuments />} />,
  <Route key="client-mvps" path="/dashboard/client/product" element={<ClientProductVersions />} />,
  <Route key="client-billing" path="/dashboard/client/billing" element={<ClientBilling />} />,
  <Route key="client-control" path="/dashboard/client/control" element={<ClientControl />} />,
  <Route key="client-decisions" path="/dashboard/client/decisions" element={<ClientDecisions />} />,
  <Route key="client-change-requests" path="/dashboard/client/change-requests" element={<ClientChangeRequests />} />,
  <Route key="client-audit" path="/dashboard/client/audit" element={<ClientAudit />} />, // Gap 5
  <Route key="client-risks" path="/dashboard/client/risks" element={<ClientRisks />} />,
  <Route key="client-links" path="/dashboard/client/links" element={<ClientLinks />} />,
  
  // NEW: Strategic & Operational Sections
  <Route key="client-vision" path="/dashboard/client/vision" element={<ClientVision />} />,
  <Route key="client-feedback" path="/dashboard/client/feedback" element={<ClientFeedback />} />,
  <Route key="client-support" path="/dashboard/client/support" element={<ClientSupport />} />,
  <Route key="client-sla" path="/dashboard/client/performance" element={<ClientSLA />} />,
  <Route key="client-steering" path="/dashboard/client/steering" element={<ClientSteering />} />,
  <Route key="client-compliance" path="/dashboard/client/compliance" element={<ClientCompliance />} />,
  <Route key="dashboard-client-wildcard" path="/dashboard/client/*" element={<ClientDashboard />} />,
  
  // Partner Dashboard Routes
  <Route key="dashboard-partner" path="/dashboard/partner" element={<PartnerDashboard />} />,
  <Route key="partner-tasks" path="/dashboard/partner/tasks" element={<PartnerTasks />} />,
  <Route key="partner-documents" path="/dashboard/partner/documents" element={<PartnerDocuments />} />,
  <Route key="partner-meetings" path="/dashboard/partner/meetings" element={<PartnerMeetings />} />,
  <Route key="partner-messages" path="/dashboard/partner/messages" element={<PartnerMessages />} />,
  <Route key="partner-emails" path="/dashboard/partner/emails" element={<PartnerEmails />} />,
  <Route key="partner-projects" path="/dashboard/partner/projects" element={<PartnerProjects />} />,
  <Route key="partner-earnings" path="/dashboard/partner/earnings" element={<PartnerEarnings />} />,
  <Route key="partner-deliverables" path="/dashboard/partner/deliverables" element={<PartnerDeliverables />} />,
  <Route key="partner-notifications" path="/dashboard/partner/notifications" element={<NotificationsPage />} />,
  <Route key="dashboard-partner-wildcard" path="/dashboard/partner/*" element={<PartnerDashboard />} />,
  
  // Investor Dashboard Routes
  <Route key="dashboard-investor" path="/dashboard/investor" element={<InvestorDashboard />} />,
  <Route key="investor-updates" path="/dashboard/investor/updates" element={<InvestorUpdates />} />,
  <Route key="investor-meetings" path="/dashboard/investor/meetings" element={<InvestorMeetings />} />,
  <Route key="investor-messages" path="/dashboard/investor/messages" element={<InvestorMessages />} />,
  <Route key="investor-emails" path="/dashboard/investor/emails" element={<InvestorEmails />} />,
  <Route key="investor-portfolio" path="/dashboard/investor/portfolio" element={<InvestorPortfolio />} />,
  <Route key="investor-documents" path="/dashboard/investor/documents" element={<InvestorDocuments />} />,
  <Route key="investor-reports" path="/dashboard/investor/reports" element={<InvestorReports />} />,
  <Route key="dashboard-investor-wildcard" path="/dashboard/investor/*" element={<InvestorDashboard />} />,
  <Route key="investor-notifications" path="/dashboard/investor/notifications" element={<NotificationsPage />} />,
  <Route key="dashboard-careers" path="/dashboard/careers" element={<CareersDashboard />} />,
  <Route key="careers-jobs" path="/dashboard/careers/jobs" element={<CareersJobs />} />,
  <Route key="careers-applications" path="/dashboard/careers/applications" element={<CareersApplications />} />,
  <Route key="careers-interviews" path="/dashboard/careers/interviews" element={<CareersInterviews />} />,
  <Route key="careers-messages" path="/dashboard/careers/messages" element={<CareersMessages />} />,
  <Route key="careers-documents" path="/dashboard/careers/documents" element={<CareersDocuments />} />,
  <Route key="careers-portfolio" path="/dashboard/careers/portfolio" element={<CareersPortfolio />} />, // NEW
  <Route key="careers-work" path="/dashboard/careers/work" element={<CareersWork />} />, // NEW
  <Route key="careers-emails" path="/dashboard/careers/emails" element={<JobSeekerEmails />} />, // NEW
  <Route key="careers-notifications" path="/dashboard/careers/notifications" element={<NotificationsPage />} />,
  <Route key="dashboard-careers-wildcard" path="/dashboard/careers/*" element={<CareersDashboard />} />,
  <Route key="dashboard-admin" path="/dashboard/admin" element={<AdminDashboard />} />,
  <Route key="admin-users" path="/dashboard/admin/users" element={<UsersManagement />} />,
  <Route key="admin-partners" path="/dashboard/admin/partners" element={<AdminPartners />} />, // NEW
  <Route key="admin-leads" path="/dashboard/admin/leads" element={<LeadsManagement />} />,
  <Route key="admin-analytics" path="/dashboard/admin/analytics" element={<AnalyticsManagement />} />,
  <Route key="admin-concierge-analytics" path="/dashboard/admin/concierge/analytics" element={<ConciergeAnalytics />} />,
  <Route key="admin-concierge-knowledge" path="/dashboard/admin/concierge/knowledge" element={<ConciergeKnowledge />} />,
  <Route key="admin-concierge-assurance" path="/dashboard/admin/concierge/assurance" element={<AssuranceIntelligencePanel />} />,
  <Route key="admin-kpi" path="/dashboard/admin/kpi" element={<KPIAnalyticsDashboard />} />, // NEW Board KPI Dashboard
  <Route key="admin-capacity" path="/dashboard/admin/capacity" element={<CapacityDashboard />} />, // NEW Capacity Dashboard
  <Route key="admin-infrastructure" path="/dashboard/admin/infrastructure" element={<AIInfrastructureDashboard />} />, // NEW AI Infra Dashboard

  // Admin Expansion Phase
  <Route key="admin-programs" path="/dashboard/admin/programs" element={<ProgramsDashboard />} />,
  <Route key="admin-engagements" path="/dashboard/admin/engagements" element={<EngagementDashboard />} />,
  <Route key="admin-delivery-health" path="/dashboard/admin/delivery-health" element={<DeliveryHealthDashboard />} />,
  <Route key="admin-skills" path="/dashboard/admin/skills" element={<SkillsBenchDashboard />} />,
  <Route key="admin-billing" path="/dashboard/admin/billing" element={<BillingDashboard />} />,
  <Route key="admin-contracts" path="/dashboard/admin/contracts" element={<ContractsDashboard />} />,
  <Route key="admin-audit-logs" path="/dashboard/admin/audit-logs" element={<AdminAuditLogs />} />,
  <Route key="admin-compliance" path="/dashboard/admin/compliance" element={<ComplianceDashboard />} />,
  // <Route key="admin-ip" path="/dashboard/admin/ip" element={<IPDashboard />} />,

  // Phase 2: PMO & Governance
  <Route key="admin-pmo" path="/dashboard/admin/pmo" element={<PMODashboard />} />,
  <Route key="admin-escalations" path="/dashboard/admin/escalations" element={<EscalationsDashboard />} />,
  <Route key="admin-steering" path="/dashboard/admin/steering" element={<SteeringDashboard />} />,
  <Route key="admin-decisions" path="/dashboard/admin/decisions" element={<DecisionLogsDashboard />} />,
  <Route key="admin-risk" path="/dashboard/admin/risk" element={<Risk />} />,
  <Route key="admin-ccb" path="/dashboard/admin/change-control" element={<ChangeControlDashboard />} />,

  // Phase 2: Service Lines
  <Route key="admin-services" path="/dashboard/admin/services" element={<ServicePerformanceDashboard />} />,
  <Route key="admin-practice" path="/dashboard/admin/services/:practiceId" element={<PracticeDashboard />} />,

  // Phase 2: Vendors
  <Route key="admin-vendors" path="/dashboard/admin/vendors" element={<VendorDashboard />} />,

  <Route key="admin-emails" path="/dashboard/admin/emails" element={<AdminEmailTabs />} />, // NEW Consolidated
  <Route key="admin-consultations" path="/dashboard/admin/consultations" element={<ConsultationsManagement />} />,
  <Route key="admin-scheduling" path="/dashboard/admin/scheduling" element={<SchedulingManagement />} />,
  <Route key="admin-contacts" path="/dashboard/admin/contacts" element={<ContactsManagement />} />,
  <Route key="admin-applications" path="/dashboard/admin/applications" element={<JobApplicationsManagement />} />,

  <Route key="admin-content" path="/dashboard/admin/content" element={<ContentManagementPage />} />, // NEW
  <Route key="admin-settings" path="/dashboard/admin/settings" element={<SystemSettings />} />, // NEW
  <Route key="admin-clients" path="/dashboard/admin/clients" element={<AdminClients />} />, // NEW
  <Route key="admin-client-profile" path="/dashboard/admin/clients/:clientId" element={<AdminClientProfile />} />, // NEW (MNC Pillar 1 - Client Profile with Governance Audit)
  <Route key="admin-client-projects" element={<AdminProjectManager />} path="/dashboard/admin/clients/:clientId/projects" />, // Client Projects Manager
  <Route key="admin-project-detail" path="/dashboard/admin/projects/:projectId" element={<ProjectDetailPage />} />, // NEW - Project Detail Page

  // New Admin Item Pages
  <Route key="admin-user-edit" path="/dashboard/admin/users/:id/edit" element={<AdminUserEdit />} />,
  <Route key="admin-messages" path="/dashboard/admin/messages" element={<AdminMessages />} />,
  <Route key="admin-notifications" path="/dashboard/admin/notifications" element={<NotificationsPage />} />,
  <Route key="dashboard-admin-wildcard" path="/dashboard/admin/*" element={<AdminDashboard />} />,
  
  // Legacy redirect
  <Route key="client-portal-redirect" path="/client-portal" element={<Navigate to="/dashboard/client" replace />} />,
  
  // Scoped Profile & Settings Routes
  <Route key="client-profile" path="/dashboard/client/profile" element={<Profile />} />,
  <Route key="client-profile-edit" path="/dashboard/client/profile/edit" element={<Profile startEditing={true} />} />,
  <Route key="client-settings" path="/dashboard/client/settings" element={<ClientSettings />} />,
  
  <Route key="partner-profile" path="/dashboard/partner/profile" element={<Profile />} />,
  <Route key="partner-profile-edit" path="/dashboard/partner/profile/edit" element={<Profile startEditing={true} />} />,
  <Route key="partner-settings" path="/dashboard/partner/settings" element={<Settings />} />,
  
  <Route key="investor-profile" path="/dashboard/investor/profile" element={<Profile />} />,
  <Route key="investor-profile-edit" path="/dashboard/investor/profile/edit" element={<Profile startEditing={true} />} />,
  <Route key="investor-settings" path="/dashboard/investor/settings" element={<Settings />} />,
  
  <Route key="careers-profile" path="/dashboard/careers/profile" element={<Profile />} />,
  <Route key="careers-profile-edit" path="/dashboard/careers/profile/edit" element={<Profile startEditing={true} />} />,
  <Route key="careers-settings" path="/dashboard/careers/settings" element={<Settings />} />,
  
  // Admin Profile Routes
  <Route key="admin-profile" path="/dashboard/admin/profile" element={<Profile />} />,
  <Route key="admin-profile-edit" path="/dashboard/admin/profile/edit" element={<Profile startEditing={true} />} />,

  // KangqoreVis — Visibility Intelligence admin pages
  ...kangqoreVisAdminRoutes,
];

export default authRoutes;
