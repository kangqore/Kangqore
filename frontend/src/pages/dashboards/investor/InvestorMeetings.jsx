import React, { useState, useEffect } from 'react';
import { Calendar, Video, Clock, Users, Link as LinkIcon, FileText, MapPin, Info, XCircle, ExternalLink } from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';
import axios from 'axios';
import RescheduleBanner from '../../../components/Dashboards/RescheduleBanner';
import RescheduledCard from '../../../components/Dashboards/RescheduledCard';
import MeetingCard from '../../../components/Dashboards/MeetingCard';

const InvestorMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('investorMeetingView') || 'grid');
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

  useEffect(() => {
    localStorage.setItem('investorMeetingView', viewMode);
  }, [viewMode]);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BACKEND_URL}/api/investor/meetings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMeetings(res.data.meetings || []);
      setConsultations(res.data.consultations || []);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Normalize status
  const normalizeStatus = (item) => {
    const s = item.status?.toUpperCase();
    if (s === 'RESCHEDULED' || s === 'PENDING' || s === 'ACTION REQUIRED') {
      return 'ACTION_REQUIRED';
    }
    return s || 'SCHEDULED';
  };

  // Unify meetings and consultations
  const unifiedMeetings = [
    ...meetings.map(m => {
      const isPast = new Date(m.startTime) < new Date();
      return { ...m, status: isPast ? 'COMPLETED' : 'SCHEDULED', isMeeting: true };
    }),
    ...consultations.map(c => ({
      ...c,
      isConsultation: true,
      status: normalizeStatus(c)
    }))
  ].sort((a, b) => new Date(a.startTime || a.scheduledAt) - new Date(b.startTime || b.scheduledAt));

  // Filter logic
  const filteredMeetings = unifiedMeetings.filter(item => {
    if (filter === 'All') return true;
    if (filter === 'Action Required') return item.status === 'ACTION_REQUIRED';
    if (filter === 'Scheduled') return item.status === 'SCHEDULED';
    if (filter === 'Completed') return item.status === 'COMPLETED';
    return item.status === filter.toUpperCase();
  });

  // Stats
  const stats = {
    total: unifiedMeetings.length,
    scheduled: unifiedMeetings.filter(i => i.status === 'SCHEDULED').length,
    actionRequired: unifiedMeetings.filter(i => i.status === 'ACTION_REQUIRED').length,
    completed: unifiedMeetings.filter(i => i.status === 'COMPLETED').length
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'CONTACTED': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'SCHEDULED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ACTION_REQUIRED': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'RESCHEDULED': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
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
      case 'ONLINE': return <Video className="w-4 h-4" />;
      case 'OFFLINE': return <MapPin className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <DashboardLayout role="investor" title="Meetings" subtitle="Scheduled calls and board meetings">
      <div className="space-y-6">
        {/* Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20/50 border border-blue-100 rounded-xl p-4 flex gap-3 text-brand-blue text-sm items-center shadow-sm">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <strong className="font-bold">Managed Scheduling:</strong> These meetings are scheduled by the company administration. You can join directly via the links provided.
          </div>
        </div>

        {/* Reschedule Banner */}
        <RescheduleBanner 
          count={consultations.filter(c => c.status === 'RESCHEDULED').length}
          onReview={() => {
            setFilter('Action Required');
            const firstRescheduled = unifiedMeetings.find(m => m.status === 'ACTION_REQUIRED');
            if (firstRescheduled) setSelectedMeeting(firstRescheduled);
          }}
        />

        {/* Status Summary Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-28">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total</p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-2xl border border-purple-100 shadow-sm flex flex-col justify-between h-28">
            <p className="text-purple-600 text-xs font-bold uppercase tracking-wider">Scheduled</p>
            <p className="text-4xl font-bold text-purple-900">{stats.scheduled}</p>
          </div>
          <div className="bg-rose-50 p-5 rounded-2xl border border-rose-100 shadow-sm flex flex-col justify-between h-28">
            <p className="text-rose-600 text-xs font-bold uppercase tracking-wider">Action Required</p>
            <p className="text-4xl font-bold text-rose-900">{stats.actionRequired}</p>
          </div>
          <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between h-28">
            <p className="text-emerald-600 text-xs font-bold uppercase tracking-wider">Completed</p>
            <p className="text-4xl font-bold text-emerald-900">{stats.completed}</p>
          </div>
        </div>

        {/* Filters & View Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 dark:border-gray-700/50 p-1.5 rounded-xl">
            {['All', 'Scheduled', 'Action Required', 'Completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${
                  filter === f 
                    ? 'bg-brand-blue text-white shadow-md' 
                    : 'text-gray-500 hover:text-gray-900 dark:text-white hover:bg-white dark:bg-gray-900 dark:border-gray-800/50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <div className="hidden md:flex bg-gray-100 dark:bg-[#0a0a0c]/50 p-1 rounded-lg gap-1">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:text-gray-400'}`}
            >
              <div className="w-4 h-4 border-2 border-current rounded-sm" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:text-gray-400'}`}
            >
              <div className="w-4 h-4 flex flex-col gap-0.5">
                <div className="h-0.5 bg-current w-full"/>
                <div className="h-0.5 bg-current w-full"/>
                <div className="h-0.5 bg-current w-full"/>
              </div>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && <div className="p-8 text-center text-gray-500">Loading meetings...</div>}
        
        {/* Empty State */}
        {!loading && filteredMeetings.length === 0 && (
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No {filter === 'All' ? '' : filter} meetings</h3>
            <p className="text-gray-500">Scheduled investor calls will appear here.</p>
          </div>
        )}
        
        {/* Meetings Grid/List */}
        {!loading && filteredMeetings.length > 0 && (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
           {filteredMeetings.map((item) => (
              <React.Fragment key={item.id}>
                 <MeetingCard 
                    consultation={item}
                    onToggle={() => setSelectedMeeting(item)}
                    onAction={() => fetchMeetings()}
                    isExpanded={false}
                 />
              </React.Fragment>
           ))}
        </div>
        )}

        {/* Detail Sidebar */}
        {selectedMeeting && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedMeeting(null)} />
            <div className="absolute inset-y-0 right-0 max-w-xl w-full flex">
              <div className="relative w-screen max-w-xl bg-white dark:bg-gray-900 dark:border-gray-800 shadow-2xl flex flex-col h-full ring-1 ring-black/5 animate-in slide-in-from-right duration-300">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Meeting Details</h2>
                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mt-1 flex items-center gap-1.5">
                      ID: {selectedMeeting.id?.slice(0, 8)} • <span className={`${getStatusColor(selectedMeeting.status)} px-2 py-0.5 rounded-full`}>{selectedMeeting.status?.replace('_', ' ')}</span>
                    </p>
                  </div>
                  <button onClick={() => setSelectedMeeting(null)} className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-lg">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  <section>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Meeting Scope</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-brand-blue/10 text-brand-blue rounded-xl flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase mb-0.5">Topic</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedMeeting.topic || selectedMeeting.title || selectedMeeting.service}</p>
                          {selectedMeeting.company && <p className="text-sm text-gray-400 mt-0.5">{selectedMeeting.company}</p>}
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-gray-400 uppercase mb-0.5">Scheduling</p>
                          <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 p-4 rounded-xl border border-gray-100">
                            <div className="flex justify-between items-center mb-3">
                              <div className="font-semibold text-gray-900 dark:text-white">
                                {(selectedMeeting.startTime || selectedMeeting.scheduledAt) 
                                  ? new Date(selectedMeeting.startTime || selectedMeeting.scheduledAt).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' }) 
                                  : 'Date Pending'}
                              </div>
                              {selectedMeeting.meetingMode && (
                                <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${getModeStyle(selectedMeeting.meetingMode)}`}>
                                  {selectedMeeting.meetingMode}
                                </div>
                              )}
                            </div>
                            
                            {(selectedMeeting.meetingLink || selectedMeeting.joinLink) && (
                              <a 
                                href={selectedMeeting.meetingLink || selectedMeeting.joinLink} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex items-center gap-2 text-sm font-bold text-brand-blue bg-blue-50 dark:bg-blue-900/20/50 p-2.5 rounded-lg hover:bg-blue-50 dark:bg-blue-900/20 transition-colors border border-blue-100/50"
                              >
                                <Video className="w-4 h-4" />
                                Join Meeting
                                <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                              </a>
                            )}
                            {selectedMeeting.location && (
                              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 p-2.5 rounded-lg border border-gray-200 mt-2">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                {selectedMeeting.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {(selectedMeeting.message || selectedMeeting.notes) && (
                    <section>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Context & Notes</h3>
                      <div className="space-y-4">
                        {selectedMeeting.message && (
                          <div className="p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl border border-gray-100 text-sm text-gray-700 dark:text-gray-300 italic">
                            "{selectedMeeting.message}"
                          </div>
                        )}
                        {selectedMeeting.notes && (
                          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 text-sm text-amber-900">
                            {selectedMeeting.notes}
                          </div>
                        )}
                      </div>
                    </section>
                  )}

                  {selectedMeeting.status === 'ACTION_REQUIRED' && (
                    <section className="pt-4 border-t border-gray-100">
                      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl border border-blue-100 p-4 shadow-sm">
                        <h4 className="font-bold text-blue-900 mb-2">Action Required</h4>
                        <p className="text-sm text-blue-700/80 mb-4">The admin has updated this meeting request. Please review and confirm.</p>
                        <div className="flex gap-3">
                          <button 
                            onClick={async () => {
                              try {
                                const token = localStorage.getItem('token');
                                await axios.post(`${BACKEND_URL}/api/consultations/${selectedMeeting.id}/action-reschedule`, {
                                  action: 'CONFIRM',
                                  notes: 'Investor confirmed the rescheduled meeting'
                                }, { headers: { Authorization: `Bearer ${token}` } });
                                alert('✅ Meeting confirmed!');
                                setSelectedMeeting(null);
                                fetchMeetings();
                              } catch (err) {
                                alert('Failed to confirm meeting.');
                              }
                            }}
                            className="flex-1 py-2.5 bg-brand-blue text-white rounded-lg font-bold text-sm hover:bg-blue-700"
                          >
                            Confirm
                          </button>
                          <button 
                            onClick={async () => {
                              try {
                                const token = localStorage.getItem('token');
                                await axios.post(`${BACKEND_URL}/api/consultations/${selectedMeeting.id}/action-reschedule`, {
                                  action: 'MODIFY',
                                  notes: 'Investor requested to modify the schedule'
                                }, { headers: { Authorization: `Bearer ${token}` } });
                                alert('Request submitted. We will contact you.');
                                setSelectedMeeting(null);
                              } catch (err) {
                                alert('Failed to send request.');
                              }
                            }}
                            className="px-4 py-2.5 border border-gray-200 text-gray-700 dark:text-gray-300 rounded-lg font-bold text-sm hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                          >
                            Modify
                          </button>
                        </div>
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InvestorMeetings;
