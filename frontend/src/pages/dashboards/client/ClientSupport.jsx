import React, { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  MessageSquare, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Plus, 
  Search, 
  Filter,
  ChevronDown,
  ChevronUp,
  FileText,
  Paperclip,
  Send,
  LifeBuoy,
  Phone,
  Activity,
  Link as LinkIcon,
  Receipt,
  BarChart3
} from 'lucide-react';
import ClientSLA from './ClientSLA';
import ClientLinks from './ClientLinks';
import ClientBilling from './ClientBilling';
import ClientReports from './ClientReports';
import TabNavigation from '../../../components/ui/TabNavigation';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import SmartProgressBar from '../../../components/ui/SmartProgressBar';
import CreateTicketModal from '../../../components/modals/CreateTicketModal';

const ClientSupport = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Tickets
  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['support-tickets'],
    queryFn: async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/tickets`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data.tickets;
    }
  });

  // 2. Ticket Mutation (Optimistic)
  const ticketMutation = useMutation({
    mutationFn: async (data) => {
        const token = localStorage.getItem('token');
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/tickets`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    },
    onMutate: async (newTicket) => {
        setIsSubmitting(true);
        setIsModalOpen(false);
        await queryClient.cancelQueries({ queryKey: ['support-tickets'] });
        const previousTickets = queryClient.getQueryData(['support-tickets']);

        // Optimistic Ticket
        const optimisticTicket = {
            id: 'TKT-OP-' + Date.now(),
            subject: newTicket.subject,
            category: newTicket.category,
            priority: newTicket.priority,
            status: 'Open',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            messages: [{ text: newTicket.content, sender: 'Client' }],
            isOptimistic: true
        };

        queryClient.setQueryData(['support-tickets'], (old = []) => [optimisticTicket, ...old]);
        return { previousTickets };
    },
    onError: (err, newTicket, context) => {
        queryClient.setQueryData(['support-tickets'], context.previousTickets);
        alert("Failed to submit ticket. Please try again.");
    },
    onSettled: () => {
        setIsSubmitting(false);
        queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
    }
  });

  const handleTicketSubmit = (formData) => {
      ticketMutation.mutate(formData);
  };

  // Tab State
  const [activeTab, setActiveTab] = useState('support'); // support, sla, links, billing, reports
  const [filterTab, setFilterTab] = useState('active'); // active, closed (for Support Tab)
  const [expandedTicket, setExpandedTicket] = useState(null);

  const getPriorityColor = (p) => {
    switch(p?.toUpperCase()) {
      case 'CRITICAL': return 'bg-red-100 text-red-700 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'MEDIUM': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusColor = (s) => {
    switch(s?.toLowerCase()) {
      case 'open': return 'bg-purple-100 text-purple-700';
      case 'in_progress':
      case 'in progress': return 'bg-blue-100 text-blue-700 animate-pulse';
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getSLAColor = (status) => {
    switch(status) {
      case 'breached': return 'text-red-600 font-bold';
      case 'breach_risk': return 'text-amber-600 font-bold';
      default: return 'text-green-600 font-medium';
    }
  };

  return (
    <DashboardLayout role="client" title="Support & Resources" subtitle="Enterprise Ticketing, SLAs, and Account Resources">
      <SmartProgressBar isProcessing={isSubmitting} label="Transmitting Ticket to Kangqore SRE..." />
      
      {/* Tab Navigation */}
      <TabNavigation 
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
            { id: 'support', label: 'Support Center', icon: LifeBuoy },
            { id: 'sla', label: 'SLA & Performance', icon: Activity },
            { id: 'links', label: 'Links', icon: LinkIcon },
            { id: 'billing', label: 'Billing & Contracts', icon: Receipt },
            { id: 'reports', label: 'Reports', icon: BarChart3 }
        ]}
      />

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          
        {/* SUPPORT CENTER TAB */}
        {activeTab === 'support' && (
            <>
            {/* 1. SLA & Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Open Tickets</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                            {tickets.filter(t => t.status !== 'Resolved').length}
                        </h3>
                    </div>
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                        <MessageSquare className="w-5 h-5" />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Avg Response</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">15m</h3>
                    </div>
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                        <Clock className="w-5 h-5" />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">SLA Compliance</p>
                        <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">99.8%</h3>
                    </div>
                    <div className="p-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                        <CheckCircle className="w-5 h-5" />
                    </div>
                </div>
                <div 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-brand-gradient p-5 rounded-xl text-white shadow-lg flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all"
                >
                    <div className="relative z-10">
                        <h3 className="text-lg font-bold">Raise Ticket</h3>
                        <p className="text-blue-100 text-xs mt-1">Report an issue or request service</p>
                    </div>
                    <div className="absolute right-0 bottom-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <LifeBuoy className="w-16 h-16 text-white" />
                    </div>
                    <button className="mt-4 bg-white dark:bg-black/20 hover:bg-white dark:bg-black/30 text-white text-xs font-bold py-2 px-3 rounded-lg w-fit backdrop-blur-sm flex items-center gap-2 relative z-10 transition-colors">
                        <Plus className="w-3 h-3" /> Create New
                    </button>
                </div>
            </div>

            {/* 2. Main Ticket List */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                    <div className="flex bg-transparent">
                        <TabNavigation 
                            activeTab={filterTab}
                            onChange={setFilterTab}
                            layoutId="support-tabs"
                            tabs={[
                                { id: 'active', label: 'Active Tickets', activeColor: 'bg-white dark:bg-gray-800 shadow-sm ring-1 ring-black/5', activeTextColor: 'text-gray-900 dark:text-white' },
                                { id: 'closed', label: 'Resolved / Closed', activeColor: 'bg-gray-100 dark:bg-gray-700', activeTextColor: 'text-gray-600 dark:text-gray-300' }
                            ]}
                        />
                    </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search tickets ID or subject..." 
                                className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-brand-blue outline-none w-64"
                            />
                        </div>
                        <button className="p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Tickets Grid/List */}
                <div className="divide-y divide-gray-50">
                    {tickets.filter(t => filterTab === 'active' ? t.status !== 'Resolved' : t.status === 'Resolved').map((ticket) => (
                        <div key={ticket.id} className={`group hover:bg-gray-50 dark:bg-[#050505]/50 transition-colors ${ticket.isOptimistic ? 'opacity-70 animate-pulse bg-blue-50/30' : ''}`}>
                            {/* Compact Row */}
                            <div 
                                className="p-5 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer"
                                onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
                            >
                                {/* Status Icon */}
                                <div className="hidden md:flex flex-shrink-0">
                                    {ticket.category === 'INCIDENT' ? (
                                        <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-full">
                                            <AlertCircle className="w-5 h-5" />
                                        </div>
                                    ) : (
                                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full">
                                            <LifeBuoy className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>

                                {/* Main Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono text-xs text-gray-400 font-medium">{ticket.id}</span>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getPriorityColor(ticket.priority)}`}>
                                            {ticket.priority}
                                        </span>
                                        {ticket.category === 'INCIDENT' && (
                                            <span className="text-[10px] font-bold text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-100 px-1.5 py-0.5 rounded">INCIDENT</span>
                                        )}
                                        {ticket.isOptimistic && (
                                            <span className="text-[9px] font-black text-blue-600 bg-white dark:bg-gray-900 dark:border-gray-800 border border-blue-100 px-2 py-0.5 rounded-full uppercase animate-bounce">Transmitting...</span>
                                        )}
                                    </div>
                                    <h4 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">
                                        {ticket.subject}
                                    </h4>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" /> Updated: {new Date(ticket.updatedAt || ticket.updated_at).toLocaleString()}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            SLA Target: <span className={`${getSLAColor(ticket.sla_status || 'healthy')}`}>{ticket.sla_due ? new Date(ticket.sla_due).toLocaleString() : 'Within 4h'}</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Assignee & Status */}
                                <div className="flex flex-col items-end gap-2 md:w-48 text-right">
                                   <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(ticket.status)}`}>
                                       {ticket.status}
                                   </span>
                                   <p className="text-xs text-gray-500 dark:text-gray-400">
                                       Assignee: <span className="font-medium text-gray-900 dark:text-gray-100">{ticket.assignee || 'Awaiting Triaging'}</span>
                                   </p>
                                </div>
                                
                                {/* Expand Icon */}
                                <div className="flex-shrink-0 ml-2">
                                     {expandedTicket === ticket.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                </div>
                            </div>

                            {/* Expanded Detail View */}
                            {expandedTicket === ticket.id && (
                                <div className="px-5 pb-6 pt-0 animate-in fade-in slide-in-from-top-1 duration-200">
                                    <div className="ml-0 md:ml-16 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                                        
                                        {/* Quick Stats Row */}
                                        <div className="grid grid-cols-3 gap-4 mb-6 border-b border-gray-200 pb-4">
                                            <div>
                                                <span className="text-[10px] text-gray-400 uppercase font-bold block">SLA Breaches</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">0</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-gray-400 uppercase font-bold block">Resolution Time Est.</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">2h 15m</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-gray-400 uppercase font-bold block">Escalation Level</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">L2 Support</span>
                                            </div>
                                        </div>

                                        {/* Thread */}
                                        <div className="space-y-4 mb-6">
                                            {ticket.messages.map((msg, i) => (
                                                <div key={i} className={`flex gap-3 ${msg.sender === 'Client' ? 'flex-row-reverse' : ''}`}>
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${msg.sender === 'Client' ? 'bg-blue-100 text-brand-blue' : 'bg-brand-gradient text-white'}`}>
                                                        {msg.sender === 'Client' ? 'ME' : 'SP'}
                                                    </div>
                                                    <div className={`p-3 rounded-xl max-w-lg text-sm ${msg.sender === 'Client' ? 'bg-blue-50 text-gray-800 dark:text-gray-50' : 'bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 shadow-sm text-gray-800 dark:text-gray-50'}`}>
                                                        <p className="font-bold text-xs mb-1 opacity-70 uppercase tracking-wide">{msg.role}</p>
                                                        {msg.text}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Reply Box */}
                                        <div className="flex gap-3">
                                            <div className="flex-1 relative">
                                                <input 
                                                    type="text" 
                                                    placeholder="Type a reply or attach logs..." 
                                                    className="w-full pl-4 pr-10 py-3 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                                                />
                                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-400">
                                                    <Paperclip className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <button className="bg-brand-blue hover:bg-blue-700 text-white px-4 rounded-xl flex items-center gap-2 font-bold shadow-sm transition-colors">
                                                <Send className="w-4 h-4" /> Reply
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {/* Empty State */}
                    {tickets.filter(t => filterTab === 'active' ? t.status !== 'Resolved' : t.status === 'Resolved').length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            <LifeBuoy className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                            <p>No {filterTab} tickets found.</p>
                        </div>
                    )}
                </div>

            </div>
            
            <CreateTicketModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleTicketSubmit}
                isLoading={ticketMutation.isLoading}
            />

            {/* Emergency Contact */}
            <div className="mt-8 flex justify-center">
                <p className="text-xs text-gray-400 flex items-center gap-2">
                    <Phone className="w-3 h-3" />
                    Emergency Escalation Hotline: <span className="font-bold text-gray-600 dark:text-gray-400">+1 (888) KANGQORE</span> (24/7 for Critical Incidents)
                </p>
            </div>
            </>
        )}

        {/* OTHER TABS - Imported Components */}
        {activeTab === 'sla' && <ClientSLA isTabContent={true} />}
        {activeTab === 'links' && <ClientLinks isTabContent={true} />}
        {activeTab === 'billing' && <ClientBilling isTabContent={true} />}
        {activeTab === 'reports' && <ClientReports isTabContent={true} />}

      </div>
    </DashboardLayout>
  );
};

export default ClientSupport;
