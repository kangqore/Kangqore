import React, { useState, useEffect } from 'react';
import { Calendar, Mail, Phone, Building2, MessageSquare, Clock, CheckCircle, XCircle, Filter, Search, ChevronDown, Video } from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';

const ConsultationsManagement = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [meetingMode, setMeetingMode] = useState('ONLINE'); // ONLINE, OFFLINE, WALKTHROUGH, INTERVIEW
  const [meetingLink, setMeetingLink] = useState('');
  const [location, setLocation] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [internalNotes, setInternalNotes] = useState('');
  const [stats, setStats] = useState(null);
  const [viewMode, setViewMode] = useState('board'); // 'table' or 'board'

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

  useEffect(() => {
    fetchConsultations();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const url = filter === 'all' 
        ? `${BACKEND_URL}/api/consultations`
        : `${BACKEND_URL}/api/consultations?status=${filter.toUpperCase()}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setConsultations(response.data.consultations || []);
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_URL}/api/consultations/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${BACKEND_URL}/api/consultations/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchConsultations();
      fetchStats();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleSaveNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${BACKEND_URL}/api/consultations/${selectedConsultation.id}`,
        { notes: internalNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      const updated = { ...selectedConsultation, notes: internalNotes };
      setSelectedConsultation(updated);
      setConsultations(consultations.map(c => c.id === updated.id ? updated : c));
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Failed to save notes');
    }
  };

  const handleReschedule = async () => {
    console.log('=== RESCHEDULE ATTEMPT ===');
    console.log('Consultation ID:', selectedConsultation?.id);
    console.log('Reschedule Date:', rescheduleDate);
    console.log('Meeting Mode:', meetingMode);
    
    try {
      if (!rescheduleDate) {
        alert('Please select a date and time');
        return;
      }
      
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      console.log('Token preview:', token?.substring(0, 20) + '...');
      
      if (!token) {
        alert('Authentication error. Please log in again.');
        window.location.href = '/login';
        return;
      }
      
      const isFirstSchedule = !selectedConsultation.scheduledAt;
      const targetStatus = isFirstSchedule ? 'SCHEDULED' : 'RESCHEDULED';
      
      const apiUrl = `${BACKEND_URL}/api/consultations/${selectedConsultation.id}`;
      console.log('Making API call to:', apiUrl);
      console.log('Request payload:', {
        scheduledAt: rescheduleDate,
        meetingMode,
        status: targetStatus
      });

      const response = await axios.patch(
        apiUrl,
        { 
            scheduledAt: rescheduleDate, 
            meetingMode,
            meetingLink,
            location,
            status: targetStatus,
            notes: internalNotes
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('✅ Reschedule successful:', response.data);
      
      // Update local state
      const updated = { 
          ...selectedConsultation, 
          scheduledAt: rescheduleDate, 
          status: targetStatus,
          meetingMode,
          meetingLink,
          location,
          notes: internalNotes 
      };
      setSelectedConsultation(updated);
      setConsultations(consultations.map(c => c.id === updated.id ? updated : c));
      setIsRescheduling(false);
      alert(isFirstSchedule ? 'Meeting scheduled and user notified!' : 'Meeting rescheduled and user notified!');
    } catch (error) {
      console.error('=== RESCHEDULE ERROR ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.message);
      
      if (error.response?.status === 401) {
        alert('Authentication failed. Your session may have expired. Please log in again.');
        // Optionally redirect to login
        // window.location.href = '/login';
      } else if (error.response?.status === 404) {
        alert('Consultation not found. It may have been deleted.');
      } else if (error.response?.data?.message) {
        alert(`Failed to reschedule: ${error.response.data.message}`);
      } else {
        alert(`Failed to reschedule: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      CONTACTED: 'bg-blue-100 text-blue-700',
      SCHEDULED: 'bg-purple-100 text-purple-700',
      RESCHEDULED: 'bg-amber-100 text-amber-700 font-bold',
      COMPLETED: 'bg-green-100 text-green-700',
      CANCELLED: 'bg-red-100 text-red-700'
    };
    return colors[status?.toUpperCase()] || 'bg-gray-100 text-gray-700';
  };

  const getModeStyle = (mode) => {
    switch (mode?.toUpperCase()) {
      case 'ONLINE': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'OFFLINE': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'WALKTHROUGH': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'INTERVIEW': return 'bg-purple-50 text-purple-700 border-purple-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getModeIcon = (mode) => {
    switch (mode?.toUpperCase()) {
      case 'ONLINE': return <Video className="w-3.5 h-3.5" />;
      case 'OFFLINE': return <Phone className="w-3.5 h-3.5" />;
      case 'WALKTHROUGH': return <Clock className="w-3.5 h-3.5" />;
      case 'INTERVIEW': return <MessageSquare className="w-3.5 h-3.5" />;
      default: return <Clock className="w-3.5 h-3.5" />;
    }
  };

  // Time Filtering
  const [timeFilter, setTimeFilter] = useState('all');

  const filterByTime = (items) => {
    if (timeFilter === 'all') return items;
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return items.filter(item => {
        const itemDate = new Date(item.createdAt);
        if (timeFilter === 'today') {
            return itemDate >= startOfDay;
        } else if (timeFilter === 'week') {
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - 7);
            return itemDate >= startOfWeek;
        } else if (timeFilter === 'month') {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            return itemDate >= startOfMonth;
        }
        return true;
    });
  };

  const timeFilteredConsultations = filterByTime(consultations);

  // Compute Category Stats from Time-Filtered Data
  const categoryStats = timeFilteredConsultations.reduce((acc, curr) => {
      const category = curr.service || 'General';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
  }, {});

  const filteredConsultations = timeFilteredConsultations.filter(c =>
    (filter === 'all' || c.status === filter.toUpperCase()) &&
    (c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <DashboardLayout 
      role="admin" 
      title="Consultation Requests" 
      subtitle="Manage incoming consultation requests and schedule meetings"
    >
      {/* Scheduled Summary Banner */}
{/* Scheduled Summary Banner */}
      <div className="bg-brand-gradient rounded-2xl p-6 mb-8 text-white shadow-lg relative overflow-hidden animate-in slide-in-from-top-2">
          <div className="absolute inset-0 pointer-events-none overflow-hidden"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 relative z-10 gap-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-100" />
                  Scheduled Consultancy
              </h3>

              {/* Time Filter Dropdown */}
              <div className="relative group">
                  <select
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value)}
                      className="appearance-none bg-white dark:bg-gray-900 dark:border-gray-800/10 hover:bg-white dark:bg-gray-900 dark:border-gray-800/20 text-white font-medium border border-blue-300/30 rounded-xl py-2.5 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer backdrop-blur-sm transition-all text-sm w-full md:w-48 shadow-sm"
                  >
                      <option value="all" className="text-gray-900 dark:text-white">All Time</option>
                      <option value="today" className="text-gray-900 dark:text-white">Today</option>
                      <option value="week" className="text-gray-900 dark:text-white">This Week</option>
                      <option value="month" className="text-gray-900 dark:text-white">This Month</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-100 pointer-events-none group-hover:text-white transition-colors" />
              </div>
          </div>

{/* Scheduled Counts (Today/Next 7 Days/Previous 7 Days) + Category Stats */}
              <div className="col-span-full">
                  <div className="flex flex-wrap gap-8 md:gap-12 items-start">
                    {/* Time Stats */}
                    <div>
                        <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Today</p>
                        <div className="text-4xl font-bold">
                            {consultations.filter(c => {
                                if (c.status !== 'SCHEDULED' || !c.scheduledAt) return false;
                                const d = new Date(c.scheduledAt);
                                const today = new Date();
                                return d.getDate() === today.getDate() && 
                                       d.getMonth() === today.getMonth() && 
                                       d.getFullYear() === today.getFullYear();
                            }).length}
                        </div>
                    </div>
                    <div>
                        <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Next 7 Days</p>
                        <div className="text-4xl font-bold">
                            {consultations.filter(c => {
                                if (c.status !== 'SCHEDULED' || !c.scheduledAt) return false;
                                const d = new Date(c.scheduledAt);
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                const weekLater = new Date(today);
                                weekLater.setDate(today.getDate() + 7);
                                return d >= today && d <= weekLater;
                            }).length}
                        </div>
                    </div>
                    <div>
                        <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Previous 7 Days</p>
                        <div className="text-4xl font-bold">
                            {consultations.filter(c => {
                                if (c.status !== 'SCHEDULED' && c.status !== 'COMPLETED') return false; 
                                if (!c.scheduledAt) return false;
                                const d = new Date(c.scheduledAt);
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                const weekAgo = new Date(today);
                                weekAgo.setDate(today.getDate() - 7);
                                return d >= weekAgo && d < today;
                            }).length}
                        </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="hidden md:block w-px h-12 bg-blue-400/30 self-center" />

                    {/* Category Stats (Simple Layout) */}
                    {Object.entries(categoryStats).map(([category, count]) => (
                        <div key={category}>
                            <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1 opacity-80">{category}</p>
                            <div className="text-4xl font-bold">{count}</div>
                        </div>
                    ))}
                  </div>
              </div>
      </div>

      <div className="space-y-6">

        {/* Category Stats & Time Filter Section */}


        {/* Stats Cards (Overall) */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 shadow-sm">
              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-1">Pending</p>
              <p className="text-2xl font-bold text-orange-900">{stats.pending}</p>
            </div>
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 shadow-sm">
              <p className="text-[10px] font-bold text-sky-600 uppercase tracking-wider mb-1">Contacted</p>
              <p className="text-2xl font-bold text-sky-900">{stats.contacted}</p>
            </div>
            <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 shadow-sm">
              <p className="text-[10px] font-bold text-violet-600 uppercase tracking-wider mb-1">Scheduled</p>
              <p className="text-2xl font-bold text-violet-900">{stats.scheduled}</p>
            </div>
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 shadow-sm">
              <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider mb-1">Rescheduled</p>
              <p className="text-2xl font-bold text-rose-900">{stats.rescheduled || 0}</p>
            </div>
            <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 shadow-sm">
              <p className="text-[10px] font-bold text-teal-600 uppercase tracking-wider mb-1">Completed</p>
              <p className="text-2xl font-bold text-teal-900">{stats.completed}</p>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-brand-blue"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-800 dark:border-gray-700 p-1 rounded-lg border border-gray-200">
              <button
                onClick={() => setViewMode('board')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'board' ? 'bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-300'
                }`}
              >
                Board
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'table' ? 'bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-300'
                }`}
              >
                List
              </button>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {['all', 'pending', 'contacted', 'scheduled', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize whitespace-nowrap ${
                    filter === status
                      ? 'bg-brand-gradient text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Board View */}
        {viewMode === 'board' && !loading && (
          filteredConsultations.length === 0 ? (
            <div className="text-center py-24 bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50 rounded-2xl border-2 border-dashed border-gray-100">
               <div className="bg-white dark:bg-gray-900 dark:border-gray-800 inline-block p-6 rounded-3xl shadow-sm mb-6">
                 <Calendar className="w-12 h-12 text-gray-300" />
               </div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white">No matching requests</h3>
               <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                 {searchTerm 
                   ? `We couldn't find any consultation requests matching "${searchTerm}". Try a different name or email.`
                   : "There are no consultation requests in this category yet."}
               </p>
               {searchTerm && (
                 <button 
                   onClick={() => setSearchTerm('')}
                   className="mt-6 text-brand-blue font-bold hover:underline"
                 >
                   Clear Search
                 </button>
               )}
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConsultations.map((consultation) => (
              <div 
                key={consultation.id}
                onClick={() => {
                  setSelectedConsultation(consultation);
                  setInternalNotes(consultation.notes || '');
                  setMeetingMode(consultation.meetingMode || 'ONLINE');
                  setMeetingLink(consultation.meetingLink || '');
                  setLocation(consultation.location || '');
                  setIsEditing(false);
                  setIsRescheduling(false);
                  setRescheduleDate(consultation.scheduledAt ? new Date(consultation.scheduledAt).toISOString().slice(0, 16) : '');
                }}
                className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer group hover:bg-brand-gradient hover:border-transparent"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-blue/10 text-brand-blue rounded-xl flex items-center justify-center font-bold group-hover:bg-white dark:bg-gray-900 dark:border-gray-800/20 group-hover:text-white transition-colors">
                        {consultation.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-white transition-colors">{consultation.name}</h3>
                        <p className="text-xs text-gray-500 group-hover:text-blue-100 transition-colors">{new Date(consultation.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(consultation.status)} bg-white dark:bg-gray-900 dark:border-gray-800/90 shadow-sm`}>
                      {consultation.status}
                    </span>
                  </div>

                  <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 group-hover:text-blue-50 transition-colors">
                      <Building2 className="w-4 h-4 text-gray-400 group-hover:text-blue-200 transition-colors" />
                      <span className="truncate">{consultation.company || 'Private Individual'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 group-hover:text-blue-50 transition-colors">
                      <MessageSquare className="w-4 h-4 text-gray-400 group-hover:text-blue-200 transition-colors" />
                      <span className="truncate">{consultation.topic || consultation.service || 'General Inquiry'}</span>
                    </div>
                    {(consultation.status === 'SCHEDULED' || consultation.status === 'RESCHEDULED') && (
                      <div className="pt-2 border-t border-gray-50 group-hover:border-white/10 mt-2 transition-colors">
                        <div className={`flex items-center justify-between p-2 rounded-lg border ${getModeStyle(consultation.meetingMode)} bg-white dark:bg-gray-900 dark:border-gray-800/90 shadow-sm border-transparent`}>
                          <div className="flex items-center gap-2">
                            {getModeIcon(consultation.meetingMode)}
                            <span className="text-xs font-bold uppercase">{consultation.meetingMode || 'Online'}</span>
                          </div>
                          <span className="text-[10px] font-medium">
                            {new Date(consultation.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 py-2 text-xs font-bold bg-gray-50 text-gray-600 dark:text-gray-400 rounded-lg group-hover:bg-white dark:bg-black/10 group-hover:text-white group-hover:backdrop-blur-sm transition-colors">
                      View Details
                    </button>
                    {consultation.status === 'PENDING' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(consultation.id, 'CONTACTED');
                        }}
                        className="px-3 py-2 text-xs font-bold bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors group-hover:bg-white dark:bg-black group-hover:text-brand-blue"
                      >
                        Contact
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          )
        )}

        {/* Consultations Table (List View) */}
        {viewMode === 'table' && !loading && (
            filteredConsultations.length === 0 ? (
              <div className="text-center py-24 bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50 rounded-2xl border-2 border-dashed border-gray-100">
                <div className="bg-white dark:bg-gray-900 dark:border-gray-800 inline-block p-6 rounded-3xl shadow-sm mb-6">
                  <Calendar className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">No matching requests</h3>
                <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                  {searchTerm 
                    ? `We couldn't find any consultation requests matching "${searchTerm}". Try a different name or email.`
                    : "There are no consultation requests in this category yet."}
                </p>
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requester
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preferred Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-black divide-y divide-gray-200">
                  {filteredConsultations.map((consultation) => (
                    <tr 
                      key={consultation.id} 
                      className="hover:bg-gray-50 dark:bg-[#050505] cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedConsultation(consultation);
                        setInternalNotes(consultation.notes || '');
                        setMeetingMode(consultation.meetingMode || 'ONLINE');
                        setMeetingLink(consultation.meetingLink || '');
                        setLocation(consultation.location || '');
                        setIsEditing(false);
                        setIsRescheduling(false);
                        setRescheduleDate(consultation.scheduledAt ? new Date(consultation.scheduledAt).toISOString().slice(0, 16) : '');
                      }}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {consultation.name}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Mail className="w-4 h-4" />
                            {consultation.email}
                          </div>
                          {consultation.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Phone className="w-4 h-4" />
                              {consultation.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {consultation.company ? (
                          <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <Building2 className="w-4 h-4" />
                            {consultation.company}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">
                        {consultation.topic || consultation.service || <span className="text-gray-400">Not specified</span>}
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">
                        {consultation.preferredDate || <span className="text-gray-400">Flexible</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                          {consultation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedConsultation(consultation);
                              setInternalNotes(consultation.notes || '');
                              setIsEditing(false);
                              setIsRescheduling(false);
                              setRescheduleDate(consultation.scheduledAt ? new Date(consultation.scheduledAt).toISOString().slice(0, 16) : '');
                            }}
                            className="text-brand-blue hover:text-blue-800 text-sm font-medium"
                          >
                            View Details
                          </button>
                          {consultation.status === 'PENDING' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateStatus(consultation.id, 'CONTACTED');
                              }}
                              className="text-green-600 hover:text-green-800 text-sm font-medium"
                            >
                              Mark Contacted
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )
        )}
      </div>

        {/* Detail Sidebar */}
        {selectedConsultation && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
              onClick={() => setSelectedConsultation(null)} 
            />
            <div className="absolute inset-y-0 right-0 max-w-xl w-full flex">
              <div className="relative w-screen max-w-xl bg-white dark:bg-gray-900 dark:border-gray-800 shadow-2xl flex flex-col h-full ring-1 ring-black/5 animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Consultation Profile</h2>
                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mt-1 flex items-center gap-1.5">
                      ID: {selectedConsultation.id.slice(0, 8)} • <span className={`${getStatusColor(selectedConsultation.status)} px-2 py-0.5 rounded-full`}>{selectedConsultation.status}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-1.5 text-xs font-bold text-brand-blue bg-white dark:bg-gray-900 dark:border-gray-800 border border-blue-100 hover:bg-blue-50 rounded-lg shadow-sm transition-all"
                      >
                        Edit Notes
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedConsultation(null)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-lg transition-all"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  {/* Section: Requester Information */}
                  <section>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Requester Details</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl p-5 space-y-4 border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-blue text-white rounded-xl flex items-center justify-center text-lg font-bold">
                          {selectedConsultation.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedConsultation.name}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Building2 className="w-3.5 h-3.5" />
                            {selectedConsultation.company || 'Private Individual'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <a href={`mailto:${selectedConsultation.email}`} className="flex items-center gap-2.5 p-3 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-xl hover:border-brand-blue hover:text-brand-blue transition-all group">
                          <Mail className="w-4 h-4 text-gray-400 group-hover:text-brand-blue" />
                          <span className="text-xs font-medium truncate">{selectedConsultation.email}</span>
                        </a>
                        <a href={`tel:${selectedConsultation.phone}`} className="flex items-center gap-2.5 p-3 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-xl hover:border-brand-blue hover:text-brand-blue transition-all group">
                          <Phone className="w-4 h-4 text-gray-400 group-hover:text-brand-blue" />
                          <span className="text-xs font-medium truncate">{selectedConsultation.phone || 'No Phone'}</span>
                        </a>
                      </div>
                    </div>
                  </section>

                  {/* Section: Request Context */}
                  <section>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Meeting Scope</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                          <p className="text-xs font-bold text-gray-400 uppercase mb-0.5">Service Interest</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedConsultation.service || 'General Consultation'}</p>
                        </div>
                      {selectedConsultation.topic && (
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase mb-0.5">Topic</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedConsultation.topic}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg flex items-center justify-center shrink-0">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-gray-400 uppercase mb-0.5">Scheduling Status</p>
                          {isRescheduling ? (
                            <div className="mt-3 p-4 bg-white dark:bg-gray-900 dark:border-gray-800 border border-blue-100 rounded-xl shadow-sm space-y-4">
                              <div>
                                <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1.5 ml-1">Proposed Date & Time</label>
                                <input 
                                  type="datetime-local"
                                  value={rescheduleDate}
                                  onChange={(e) => setRescheduleDate(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1.5 ml-1">Meeting Type</label>
                                <div className="grid grid-cols-2 gap-2">
                                  {['ONLINE', 'OFFLINE', 'WALKTHROUGH', 'INTERVIEW'].map((mode) => (
                                    <button
                                      key={mode}
                                      onClick={() => setMeetingMode(mode)}
                                      className={`px-3 py-2 rounded-lg text-[10px] font-bold transition-all ${
                                        meetingMode === mode 
                                        ? 'bg-blue-600 text-white shadow-md' 
                                        : 'bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-500 border border-gray-100 hover:border-blue-200'
                                      }`}
                                    >
                                      {mode}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {meetingMode === 'ONLINE' ? (
                                <div>
                                  <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1.5 ml-1">Meeting Link</label>
                                  <input 
                                    type="url"
                                    placeholder="https://meet.google.com/..."
                                    value={meetingLink}
                                    onChange={(e) => setMeetingLink(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm outline-none"
                                  />
                                </div>
                              ) : (
                                <div>
                                  <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1.5 ml-1">Location Address</label>
                                  <input 
                                    type="text"
                                    placeholder="Full office address"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm outline-none"
                                  />
                                </div>
                              )}

                              <div className="flex gap-2 pt-2">
                                <button 
                                  onClick={handleReschedule}
                                  className="flex-1 px-4 py-2 bg-brand-blue text-white rounded-lg text-xs font-bold hover:bg-blue-700 shadow-lg transition-all"
                                >
                                  {selectedConsultation.scheduledAt ? 'Reschedule' : 'Confirm Schedule'}
                                </button>
                                <button 
                                  onClick={() => setIsRescheduling(false)}
                                  className="px-4 py-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 rounded-lg text-xs font-bold hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 transition-all"
                                >
                                  Back
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between group">
                              <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {selectedConsultation.scheduledAt 
                                    ? new Date(selectedConsultation.scheduledAt).toLocaleString() 
                                    : (selectedConsultation.preferredDate || 'Flexible/Negotiable')}
                                </p>
                                {selectedConsultation.meetingMode && (
                                  <div className={`mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase ${getModeStyle(selectedConsultation.meetingMode)}`}>
                                    {getModeIcon(selectedConsultation.meetingMode)}
                                    {selectedConsultation.meetingMode}
                                  </div>
                                )}
                              </div>
                              <button 
                                onClick={() => {
                                  setIsRescheduling(true);
                                  if (!rescheduleDate && selectedConsultation.scheduledAt) {
                                    setRescheduleDate(new Date(selectedConsultation.scheduledAt).toISOString().slice(0, 16));
                                  }
                                }}
                                className="text-[10px] font-bold text-brand-blue hover:underline bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded"
                              >
                                {selectedConsultation.scheduledAt ? 'Change Time' : 'Set Time'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Section: Messages & Notes */}
                  <section>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Communication</h3>
                    <div className="space-y-6">
                      {selectedConsultation.message && (
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block ml-1">Inquiry Message</label>
                          <div className="p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl border border-gray-100 text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
                            "{selectedConsultation.message}"
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block ml-1">Admin Internal Notes</label>
                        {isEditing ? (
                          <div className="space-y-3">
                            <textarea
                              value={internalNotes}
                              onChange={(e) => setInternalNotes(e.target.value)}
                              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 min-h-[120px] text-sm outline-none shadow-sm"
                              placeholder="Add private notes for the team..."
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  setIsEditing(false);
                                  setInternalNotes(selectedConsultation.notes || '');
                                }}
                                className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-lg transition-all"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleSaveNotes}
                                className="px-4 py-1.5 text-xs font-bold text-white bg-brand-blue hover:bg-blue-700 rounded-lg shadow-lg transition-all"
                              >
                                Update Notes
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-2xl p-4 shadow-sm min-h-[80px] group relative">
                            {selectedConsultation.notes ? (
                              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">{selectedConsultation.notes}</p>
                            ) : (
                              <p className="text-sm text-gray-400 italic">No notes have been added yet.</p>
                            )}
                            <button 
                              onClick={() => setIsEditing(true)}
                              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-brand-blue"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        )}
    </DashboardLayout>
  );
};

export default ConsultationsManagement;
