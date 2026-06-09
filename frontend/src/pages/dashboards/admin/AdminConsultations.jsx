import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Mail,
  MessageSquare,
  Search,
  User,
  Video,
  XCircle,
  Send
} from 'lucide-react';
import React, { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';

const AdminConsultations = () => {
    const queryClient = useQueryClient();
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedConsultation, setSelectedConsultation] = useState(null);
    const [modalType, setModalType] = useState(null); // 'schedule' | 'reply' | 'reject'
    const [viewMode, setViewMode] = useState('grid');
    
    const [scheduleForm, setScheduleForm] = useState({
        title: '',
        startTime: '',
        duration: '30',
        platform: 'Google Meet',
        joinLink: '',
        notes: ''
    });

    const [replyForm, setReplyForm] = useState({
        message: '',
        notes: ''
    });

    const [rejectForm, setRejectForm] = useState({
        reason: ''
    });

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

    const { data, isLoading } = useQuery({
        queryKey: ['admin-consultations'],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${BACKEND_URL}/api/consultations`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }
    });

    // Schedule mutation
    const scheduleMutation = useMutation({
        mutationFn: async (data) => {
            const token = localStorage.getItem('token');
            const start = new Date(data.startTime);
            const end = new Date(start.getTime() + parseInt(data.duration) * 60000);
            
            return axios.post(`${BACKEND_URL}/api/consultations/${selectedConsultation.id}/schedule`, {
                title: data.title,
                startTime: start.toISOString(),
                endTime: end.toISOString(),
                platform: data.platform,
                joinLink: data.joinLink,
                notes: data.notes
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-consultations']);
            closeModal();
            alert('Consultation scheduled & Meeting created!');
        },
        onError: (err) => {
            alert('Failed to schedule: ' + (err.response?.data?.message || err.message));
        }
    });

    // Reply mutation - sets status to CONTACTED
    const replyMutation = useMutation({
        mutationFn: async (data) => {
            const token = localStorage.getItem('token');
            return axios.patch(`${BACKEND_URL}/api/consultations/${selectedConsultation.id}`, {
                status: 'CONTACTED',
                notes: `[Reply sent]: ${data.message}\n${data.notes ? `[Admin notes]: ${data.notes}` : ''}`
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-consultations']);
            closeModal();
            alert('Reply sent and consultation marked as Contacted!');
        },
        onError: (err) => {
            alert('Failed to reply: ' + (err.response?.data?.message || err.message));
        }
    });

    // Reject mutation - sets status to CANCELLED
    const rejectMutation = useMutation({
        mutationFn: async (data) => {
            const token = localStorage.getItem('token');
            return axios.patch(`${BACKEND_URL}/api/consultations/${selectedConsultation.id}`, {
                status: 'CANCELLED',
                notes: data.reason ? `[Rejected]: ${data.reason}` : '[Rejected by admin]'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-consultations']);
            closeModal();
            alert('Consultation rejected.');
        },
        onError: (err) => {
            alert('Failed to reject: ' + (err.response?.data?.message || err.message));
        }
    });

    const openModal = (consultation, type) => {
        setSelectedConsultation(consultation);
        setModalType(type);
        if (type === 'schedule') {
            setScheduleForm(prev => ({ ...prev, title: `Consultation: ${consultation.service}` }));
        } else if (type === 'reply') {
            setReplyForm({ 
                message: `Hi ${consultation.name},\n\nThank you for reaching out about ${consultation.service || 'a consultation'}. We'd be happy to help!\n\n`,
                notes: '' 
            });
        } else if (type === 'reject') {
            setRejectForm({ reason: '' });
        }
    };

    const closeModal = () => {
        setSelectedConsultation(null);
        setModalType(null);
    };

    const handleScheduleSubmit = (e) => {
        e.preventDefault();
        scheduleMutation.mutate(scheduleForm);
    };

    const handleReplySubmit = (e) => {
        e.preventDefault();
        replyMutation.mutate(replyForm);
    };

    const handleRejectSubmit = (e) => {
        e.preventDefault();
        rejectMutation.mutate(rejectForm);
    };

    const consultations = data?.consultations || [];

    // Time Filtering
    const filteredConsultations = statusFilter === 'all' 
        ? consultations 
        : consultations.filter(c => c.status === statusFilter.toUpperCase());

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'CONTACTED': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'SCHEDULED': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200';
            case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <DashboardLayout role="admin" title="Consultations" subtitle="Manage incoming consultation requests">
            


            <div className="space-y-6">
                {/* Stats Summary Strip */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
                    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-28">
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total</p>
                        <p className="text-4xl font-bold text-gray-900 dark:text-white">{consultations.length}</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-2xl border border-purple-100 shadow-sm flex flex-col justify-between h-28">
                        <p className="text-purple-600 text-xs font-bold uppercase tracking-wider">Scheduled</p>
                        <p className="text-4xl font-bold text-purple-900">{consultations.filter(c => c.status === 'SCHEDULED').length}</p>
                    </div>
                    <div className="bg-rose-50 p-5 rounded-2xl border border-rose-100 shadow-sm flex flex-col justify-between h-28">
                        <p className="text-rose-600 text-xs font-bold uppercase tracking-wider">Rescheduled</p>
                        <p className="text-4xl font-bold text-rose-900">{consultations.filter(c => c.status === 'RESCHEDULED').length}</p>
                    </div>
                    <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between h-28">
                        <p className="text-emerald-600 text-xs font-bold uppercase tracking-wider">Completed</p>
                        <p className="text-4xl font-bold text-emerald-900">{consultations.filter(c => c.status === 'COMPLETED').length}</p>
                    </div>
                </div>

                {/* Filters & Toggle */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 dark:border-gray-700/50 p-1.5 rounded-xl overflow-x-auto max-w-full">
                    {['all', 'pending', 'contacted', 'scheduled', 'completed', 'cancelled'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all capitalize whitespace-nowrap ${
                                statusFilter === status 
                                    ? 'bg-brand-blue text-white shadow-md' 
                                    : 'text-gray-500 hover:text-gray-900 dark:text-white hover:bg-white dark:bg-gray-900 dark:border-gray-800/50'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                    </div>
                    
                    {/* View Toggle */}
                    <div className="hidden md:flex bg-gray-100 dark:bg-[#0a0a0c]/50 p-1 rounded-lg gap-1 shrink-0">
                        <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all ${
                            viewMode === 'grid' 
                            ? 'bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue shadow-sm' 
                            : 'text-gray-400 hover:text-gray-600 dark:text-gray-400'
                        }`}
                        title="Grid View"
                        >
                        <div className="w-4 h-4 border-2 border-current rounded-sm" />
                        </button>
                        <button 
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-all ${
                            viewMode === 'list' 
                            ? 'bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue shadow-sm' 
                            : 'text-gray-400 hover:text-gray-600 dark:text-gray-400'
                        }`}
                        title="List View"
                        >
                        <div className="w-4 h-4 flex flex-col gap-0.5">
                            <div className="h-0.5 bg-current w-full"/>
                            <div className="h-0.5 bg-current w-full"/>
                            <div className="h-0.5 bg-current w-full"/>
                        </div>
                        </button>
                    </div>
                </div>

                {/* List/Grid Container */}
                <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
                    {isLoading ? (
                         <div className="col-span-full p-12 text-center text-gray-500">Loading requests...</div>
                    ) : filteredConsultations.length === 0 ? (
                        <div className="col-span-full p-12 text-center text-gray-500 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-dashed border-gray-200">
                             <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                             No consultations found.
                        </div>
                    ) : (
                        filteredConsultations.map(consultation => (
                            <div 
                                key={consultation.id} 
                                className={`bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md group relative overflow-hidden flex flex-col ${
                                    viewMode === 'grid' 
                                        ? 'min-h-[220px] hover:border-transparent hover:bg-brand-gradient' 
                                        : 'flex-row items-center p-4 gap-4'
                                }`}
                            >
                                <div className={`p-5 flex flex-col justify-between flex-1 w-full ${viewMode === 'list' && 'p-0 flex-row items-center'}`}>
                                    
                                    {/* Header Section */}
                                    <div className={`flex justify-between items-start ${viewMode === 'grid' && 'mb-4'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-brand-blue/10 text-brand-blue rounded-xl flex items-center justify-center font-bold group-hover:bg-white dark:bg-gray-900 dark:border-gray-800/20 group-hover:text-white transition-colors shrink-0">
                                                {consultation.name.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-white transition-colors truncate max-w-[180px]">{consultation.name}</h4>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 group-hover:text-blue-100 transition-colors">
                                                    <Mail className="w-3 h-3" />
                                                    <span className="truncate max-w-[150px]">{consultation.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Badge (Hidden in List view if needed, or styled consistently) */}
                                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-white dark:bg-gray-900 dark:border-gray-800/90 shadow-sm border-transparent ${
                                             consultation.status === 'PENDING' ? 'text-amber-600' :
                                             consultation.status === 'CONTACTED' ? 'text-purple-600' :
                                             consultation.status === 'SCHEDULED' ? 'text-blue-600' :
                                             consultation.status === 'COMPLETED' ? 'text-emerald-600' : 'text-red-600'
                                        }`}>
                                            {consultation.status}
                                        </span>
                                    </div>

                                    {/* Body Section (Grid Only details) */}
                                    {viewMode === 'grid' && (
                                        <div className="space-y-3 mb-5 mt-2">
                                            <div className="bg-gray-50 group-hover:bg-white dark:bg-gray-900 dark:border-gray-800/10 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors border border-transparent">
                                                <div className="font-medium mb-1 truncate">{consultation.topic || consultation.service}</div>
                                                <div className="text-xs opacity-75 truncate">{consultation.company || 'Personal Request'}</div>
                                            </div>
                                            
                                            {/* Schedule Info Box */}
                                            {consultation.scheduledAt && (
                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 group-hover:text-blue-100">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(consultation.scheduledAt).toLocaleDateString()}
                                                    <span className="opacity-50">|</span>
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {new Date(consultation.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Actions Section */}
                                    <div className={`flex gap-2 ${viewMode === 'grid' ? 'mt-auto' : 'ml-auto'}`}>
                                        {consultation.status === 'PENDING' && (
                                            <>
                                                <button 
                                                    onClick={() => openModal(consultation, 'schedule')}
                                                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 shadow-sm transition-colors group-hover:bg-white dark:bg-gray-900 dark:border-gray-800 group-hover:text-blue-600"
                                                >
                                                    Schedule
                                                </button>
                                                <button 
                                                    onClick={() => openModal(consultation, 'reply')}
                                                    className="px-3 py-2 border border-gray-200 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-lg hover:bg-gray-50 group-hover:bg-white dark:bg-gray-900 dark:border-gray-800/10 group-hover:text-white group-hover:border-white/20"
                                                >
                                                    Reply
                                                </button>
                                            </>
                                        )}
                                        {consultation.status !== 'PENDING' && (
                                            <button 
                                                onClick={() => openModal(consultation, 'reply')}
                                                className="w-full px-3 py-2 border border-gray-200 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-lg hover:bg-gray-50 group-hover:bg-white dark:bg-gray-900 dark:border-gray-800/10 group-hover:text-white group-hover:border-white/20 flex items-center justify-center gap-2"
                                            >
                                                <MessageSquare className="w-3.5 h-3.5" /> Message
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>


            {/* SCHEDULE MODAL */}
            {selectedConsultation && modalType === 'schedule' && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Schedule Consultation</h3>
                        <form onSubmit={handleScheduleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meeting Title</label>
                                <input type="text" required value={scheduleForm.title}
                                    onChange={e => setScheduleForm({...scheduleForm, title: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                                    <input type="datetime-local" required value={scheduleForm.startTime}
                                        onChange={e => setScheduleForm({...scheduleForm, startTime: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                                    <select value={scheduleForm.duration}
                                        onChange={e => setScheduleForm({...scheduleForm, duration: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg">
                                        <option value="15">15 min</option>
                                        <option value="30">30 min</option>
                                        <option value="45">45 min</option>
                                        <option value="60">1 hour</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Platform</label>
                                <select value={scheduleForm.platform}
                                    onChange={e => setScheduleForm({...scheduleForm, platform: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg">
                                    <option value="Google Meet">Google Meet</option>
                                    <option value="Zoom">Zoom</option>
                                    <option value="Teams">MS Teams</option>
                                    <option value="Phone">Phone Call</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meeting Link</label>
                                <input type="url" placeholder="https://meet.google.com/..."
                                    value={scheduleForm.joinLink}
                                    onChange={e => setScheduleForm({...scheduleForm, joinLink: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                                <textarea value={scheduleForm.notes}
                                    onChange={e => setScheduleForm({...scheduleForm, notes: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg" rows="2" />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={closeModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                                    Cancel
                                </button>
                                <button type="submit" disabled={scheduleMutation.isPending}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
                                    {scheduleMutation.isPending ? 'Scheduling...' : 'Confirm Schedule'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* REPLY MODAL */}
            {selectedConsultation && modalType === 'reply' && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-xl max-w-lg w-full p-6 animate-in zoom-in-95">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Reply to Consultation</h3>
                        <p className="text-sm text-gray-500 mb-4">Replying to: <strong>{selectedConsultation.name}</strong> ({selectedConsultation.email})</p>
                        <form onSubmit={handleReplySubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reply Message</label>
                                <textarea required rows={6} value={replyForm.message}
                                    onChange={e => setReplyForm({...replyForm, message: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                    placeholder="Your reply to the client..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Internal Notes (optional)</label>
                                <textarea rows={2} value={replyForm.notes}
                                    onChange={e => setReplyForm({...replyForm, notes: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                    placeholder="Admin notes (not sent to client)..." />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={closeModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                                    Cancel
                                </button>
                                <button type="submit" disabled={replyMutation.isPending}
                                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2">
                                    <Send className="w-4 h-4" />
                                    {replyMutation.isPending ? 'Sending...' : 'Send Reply'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* REJECT MODAL */}
            {selectedConsultation && modalType === 'reject' && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95">
                        <h3 className="text-lg font-bold text-red-700 mb-2">Reject Consultation</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Are you sure you want to reject the consultation request from <strong>{selectedConsultation.name}</strong>?
                        </p>
                        <form onSubmit={handleRejectSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason (optional)</label>
                                <textarea rows={3} value={rejectForm.reason}
                                    onChange={e => setRejectForm({...rejectForm, reason: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                    placeholder="Reason for rejecting (internal only)..." />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={closeModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                                    Cancel
                                </button>
                                <button type="submit" disabled={rejectMutation.isPending}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2">
                                    <XCircle className="w-4 h-4" />
                                    {rejectMutation.isPending ? 'Rejecting...' : 'Confirm Reject'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default AdminConsultations;
