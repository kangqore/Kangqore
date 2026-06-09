import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../../../components/DashboardLayout';
import { Calendar, Video, Clock, FileText, Users, Info, MapPin, ExternalLink, MessageSquare, ChevronDown, ChevronUp, XCircle, Building2, Phone, Mail, CheckCircle } from 'lucide-react';
import RescheduleBanner from '../../../components/Dashboards/RescheduleBanner';
import MeetingCard from '../../../components/Dashboards/MeetingCard';

const PartnerMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState(null); // Sidebar logic
  const [filter, setFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null); // Keeping for legacy reference, but unused for sidebar
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('partnerMeetingView') || 'grid');
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

  useEffect(() => {
    localStorage.setItem('partnerMeetingView', viewMode);
  }, [viewMode]);

  // Unify Data
  // Helper to normalize status
  const normalizeStatus = (item) => {
    const s = item.status?.toUpperCase();
    if (s === 'RESCHEDULED' || s === 'PENDING' || s === 'ACTION REQUIRED') {
      return 'ACTION_REQUIRED';
    }
    return s || 'SCHEDULED';
  };

  // Unify Data
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

  // Filter Logic
  const filteredMeetings = unifiedMeetings.filter(item => {
    if (filter === 'All') return true;
    if (filter === 'Action Required') return item.status === 'ACTION_REQUIRED';
    if (filter === 'Scheduled') return item.status === 'SCHEDULED';
    if (filter === 'Completed') return item.status === 'COMPLETED';
    return item.status === filter.toUpperCase();
  });

  // Calculate Stats
  const stats = {
     total: unifiedMeetings.length,
     scheduled: unifiedMeetings.filter(i => i.status === 'SCHEDULED').length,
     actionRequired: unifiedMeetings.filter(i => i.status === 'ACTION_REQUIRED').length,
     completed: unifiedMeetings.filter(i => i.status === 'COMPLETED').length
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    console.log('🔍 FETCHING PARTNER MEETINGS - START');
    
    try {
      const token = localStorage.getItem('token');
      console.log('✓ Token exists:', !!token);
      
      const apiUrl = `${BACKEND_URL}/api/partner/meetings`;
      console.log('📡 Calling API:', apiUrl);
      
      const res = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✓ API Response received');
      console.log('📦 Response data:', res.data);
      
      const { meetings: fetchedMeetings, consultations: fetchedConsultations } = res.data;
      
      console.log('📋 Meetings from API:', fetchedMeetings);
      console.log('📅 Consultations from API:', fetchedConsultations);
      
      // Filter to show relevant meeting types
      const partnerMeetings = (fetchedMeetings || []).filter(m => 
        !m.type || 
        ['partner', 'VIDEO', 'CONSULTATION', 'sprint_review', 'tech_sync', 'kickoff', 'retrospective'].includes(m.type)
      );
      const partnerConsultations = fetchedConsultations || [];
      
      console.log('✓ Filtered partner meetings:', partnerMeetings.length);
      console.log('✓ Consultations count:', partnerConsultations.length);
      console.log('📋 Consultation details:', partnerConsultations);
      
      // Log each consultation for debugging
      partnerConsultations.forEach((c, idx) => {
        console.log(`  [${idx}] ID: ${c.id} | Status: ${c.status} | Service: ${c.service}`);
      });
      
      console.log('📌 Setting state with:', {
        meetings: partnerMeetings.length,
        consultations: partnerConsultations.length
      });
      
      setMeetings(partnerMeetings);
      setConsultations(partnerConsultations);
      
      console.log('✅ FETCH COMPLETE');
    } catch (error) {
      console.error('❌ ERROR FETCHING MEETINGS');
      console.error('Error:', error.message);
      console.error('Response:', error.response?.data);
      console.error('Status:', error.response?.status);
      
      // Show empty state on error
      setMeetings([]);
      setConsultations([]);
    } finally {
      setLoading(false);
      console.log('🏁 Fetch complete, loading set to false');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'CONTACTED': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'SCHEDULED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ACTION_REQUIRED': return 'bg-blue-50 text-blue-700 border-blue-200 font-semibold';
      case 'RESCHEDULED': return 'bg-blue-50 text-blue-700 border-blue-200 font-semibold';
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
      case 'WALKTHROUGH': return <Clock className="w-4 h-4" />;
      case 'INTERVIEW': return <MessageSquare className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getMeetingTypeStyle = (type) => {
    switch(type) {
      case 'sprint_review': return 'bg-blue-100 text-blue-700';
      case 'tech_sync': return 'bg-purple-100 text-purple-700';
      case 'kickoff': return 'bg-green-100 text-green-700';
      case 'retrospective': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getMeetingTypeLabel = (type) => {
    switch(type) {
      case 'sprint_review': return 'Sprint Review';
      case 'tech_sync': return 'Tech Sync';
      case 'kickoff': return 'Kickoff';
      case 'retrospective': return 'Retrospective';
      default: return 'Meeting';
    }
  };

  return (
    <DashboardLayout role="partner" title="Meetings" subtitle="Sprint Syncs & Reviews">
      {/* Info Banner */}
      <div className="mb-6 bg-blue-50 dark:bg-blue-900/20/50 border border-blue-100 rounded-xl p-4 flex gap-3 text-brand-blue text-sm items-center shadow-sm">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-brand-blue">
            <Info className="w-4 h-4" />
        </div>
        <div>
          <strong className="font-bold">View Only:</strong> You can view scheduled meetings and join via the provided link. Meeting scheduling is managed by your project administrator.
        </div>
      </div>


      {/* Context Banner */}
      <RescheduleBanner 
        count={consultations.filter(c => c.status === 'RESCHEDULED' || c.status === 'ACTION_REQUIRED').length}
        onReview={() => {
          setFilter('Action Required');
          // Short delay to allow filter to apply
          setTimeout(() => {
             const firstRescheduled = unifiedMeetings.find(m => m.status === 'ACTION_REQUIRED');
             if (firstRescheduled) {
               // Open sidebar for the item
               setSelectedMeeting(firstRescheduled);
             }
          }, 100);
        }}
      />

      {/* Status Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

      {/* Filters & Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
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
        
         {/* View Toggle */}
         <div className="hidden md:flex bg-gray-100 dark:bg-[#0a0a0c]/50 p-1 rounded-lg gap-1">
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

      {/* Unified Meeting List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {loading && <div className="text-center py-12 text-gray-500">Loading meetings...</div>}
        {!loading && filteredMeetings.length === 0 && (
           <div className="text-center py-16 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-dashed border-gray-200">
             <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
             <h3 className="text-lg font-medium text-gray-900 dark:text-white">
               {filter === 'Action Required' ? 'No meetings require your action' : `No ${filter === 'All' ? '' : filter} Meetings`}
             </h3>
             <p className="text-gray-500">
               {filter === 'Action Required' ? 'You are all caught up!' : 'You have no meetings in this category.'}
             </p>
           </div>
        )}
        
        {filteredMeetings.map((item) => (
           <MeetingCard 
             key={item.id}
             consultation={{
                ...item,
                title: item.title || item.service, // Map title properly
                startTime: item.startTime || item.scheduledAt, // Map time properly
                meetingLink: item.joinLink || item.meetingLink
             }}
             isExpanded={false} // Disable inline expansion
             onToggle={() => setSelectedMeeting(item)} // Open Sidebar instead
             onAction={() => {
               setExpandedId(null);
               fetchMeetings();
             }}
           />
        ))}
      </div>

      {/* Detail Sidebar */}
      {selectedMeeting && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
              onClick={() => setSelectedMeeting(null)} 
            />
            <div className="absolute inset-y-0 right-0 max-w-xl w-full flex">
              <div className="relative w-screen max-w-xl bg-white dark:bg-gray-900 dark:border-gray-800 shadow-2xl flex flex-col h-full ring-1 ring-black/5 animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Meeting Details</h2>
                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mt-1 flex items-center gap-1.5">
                      ID: {selectedMeeting.id?.slice(0, 8)} • <span className={`${getStatusColor(selectedMeeting.status)} px-2 py-0.5 rounded-full`}>{selectedMeeting.status}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedMeeting(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-lg transition-all"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  {/* Section: Meeting Info */}
                  <section>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Meeting Scope</h3>
                    <div className="space-y-4">
                      {/* Service / Title */}
                      {/* Topic / Service */}
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-brand-blue/10 text-brand-blue rounded-xl flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase mb-0.5">Topic</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedMeeting.topic || selectedMeeting.title || selectedMeeting.service}</p>
                          {selectedMeeting.service && selectedMeeting.service !== selectedMeeting.topic && (
                              <p className="text-sm text-gray-500 mt-1 font-medium">{selectedMeeting.service}</p>
                          )}
                          {selectedMeeting.company && <p className="text-sm text-gray-400 mt-0.5">{selectedMeeting.company}</p>}
                        </div>
                      </div>

                      {/* Time & Status */}
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-gray-400 uppercase mb-0.5">Scheduling</p>
                          <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 p-4 rounded-xl border border-gray-100">
                             <div className="flex justify-between items-center mb-3">
                                <div className="font-semibold text-gray-900 dark:text-white">
                                   {(selectedMeeting.startTime || selectedMeeting.scheduledAt) ? new Date(selectedMeeting.startTime || selectedMeeting.scheduledAt).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' }) : 'Date Pending'}
                                </div>
                                {selectedMeeting.meetingMode && (
                                   <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${getModeStyle(selectedMeeting.meetingMode)}`}>
                                      {selectedMeeting.meetingMode}
                                   </div>
                                )}
                             </div>
                             
                             {/* Join Link / Location */}
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
                             {(selectedMeeting.location) && (
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 p-2.5 rounded-lg border border-gray-200">
                                   <MapPin className="w-4 h-4 text-gray-500" />
                                   {selectedMeeting.location}
                                </div>
                             )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Section: Requester / Details (Optional for Partner View) */}
                  {(selectedMeeting.message || selectedMeeting.notes) && (
                  <section>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Context & Notes</h3>
                    <div className="space-y-4">
                      {selectedMeeting.message && (
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block ml-1">Initial Inquiry</label>
                          <div className="p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl border border-gray-100 text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
                            "{selectedMeeting.message}"
                          </div>
                        </div>
                      )}
                      {selectedMeeting.notes && (
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block ml-1">Notes</label>
                          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 text-sm text-amber-900">
                             {selectedMeeting.notes}
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                  )}
                  
                  {/* Actions Section */}
                  {selectedMeeting.status === 'ACTION_REQUIRED' && (
                     <section className="pt-4 border-t border-gray-100">
                        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl border border-blue-100 p-4 shadow-sm">
                           <h4 className="font-bold text-blue-900 mb-2">Action Required</h4>
                           <p className="text-sm text-blue-700/80 mb-4">
                              The administrator has updated this meeting request. Please review and confirm.
                           </p>
                           <div className="flex gap-3">
                              <button 
                                onClick={async () => {
                                  console.log('=== CONFIRM BUTTON CLICKED ===');
                                  console.log('Selected Meeting:', selectedMeeting);
                                  
                                  try {
                                    const token = localStorage.getItem('token');
                                    console.log('Token exists:', !!token);
                                    console.log('Meeting ID:', selectedMeeting.id);
                                    console.log('Is Demo:', selectedMeeting.id?.toString().includes('demo-'));
                                    
                                    // Check if this is demo data
                                    if (selectedMeeting.id?.toString().includes('demo-')) {
                                      console.log('Processing as DEMO consultation');
                                      await new Promise(resolve => setTimeout(resolve, 500));
                                      alert('✅ Meeting confirmed! The administrator will be notified.');
                                      setSelectedMeeting(null);
                                      fetchMeetings();
                                      return;
                                    }
                                    
                                    // Real API call
                                    const apiUrl = `${BACKEND_URL}/api/consultations/${selectedMeeting.id}/action-reschedule`;
                                    console.log('Making API call to:', apiUrl);
                                    
                                    const response = await axios.post(apiUrl, {
                                      action: 'CONFIRM',
                                      notes: 'Partner confirmed the rescheduled meeting'
                                    }, {
                                      headers: { Authorization: `Bearer ${token}` }
                                    });
                                    
                                    console.log('API Response:', response.data);
                                    alert('✅ Meeting confirmed! Calendar invite will be sent shortly.');
                                    setSelectedMeeting(null);
                                    fetchMeetings();
                                  } catch (error) {
                                    console.error('=== ERROR CONFIRMING MEETING ===');
                                    console.error('Error details:', error);
                                    console.error('Error response:', error.response?.data);
                                    console.error('Error status:', error.response?.status);
                                    
                                    const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
                                    alert(`❌ Failed to confirm meeting: ${errorMsg}`);
                                  }
                                }}
                                className="flex-1 py-2.5 bg-brand-blue text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm"
                              >
                                Confirm
                              </button>
                              <button 
                                onClick={async () => {
                                  try {
                                    const token = localStorage.getItem('token');
                                    
                                    // Check if this is demo data
                                    if (selectedMeeting.id?.toString().includes('demo-')) {
                                      await new Promise(resolve => setTimeout(resolve, 500));
                                      alert('Reschedule request sent to administrator.');
                                      setSelectedMeeting(null);
                                      return;
                                    }
                                    
                                    // Real API call
                                    await axios.post(`${BACKEND_URL}/api/consultations/${selectedMeeting.id}/action-reschedule`, {
                                      action: 'MODIFY',
                                      notes: 'Partner requested to modify the schedule'
                                    }, {
                                      headers: { Authorization: `Bearer ${token}` }
                                    });
                                    
                                    alert('Request submitted. Our team will contact you with alternative time slots.');
                                    setSelectedMeeting(null);
                                  } catch (error) {
                                    console.error('Error requesting reschedule:', error);
                                    alert('Failed to send request. Please try again.');
                                  }
                                }}
                                className="px-4 py-2.5 border border-gray-200 text-gray-700 dark:text-gray-300 rounded-lg font-bold text-sm hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 transition-colors"
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
    </DashboardLayout>
  );
};

export default PartnerMeetings;
