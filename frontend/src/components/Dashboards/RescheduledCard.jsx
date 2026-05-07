import React, { useState } from 'react';
import { Calendar, Clock, Check, X, RefreshCw, MessageSquare, ChevronDown, ChevronUp, MapPin, Video } from 'lucide-react';
import axios from 'axios';

const RescheduledCard = ({ consultation, onAction, roleColor = "brand-blue" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userNotes, setUserNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

  const handleAction = async (action) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BACKEND_URL}/api/consultations/${consultation.id}/action-reschedule`, {
        action,
        notes: userNotes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onAction();
    } catch (error) {
      console.error('Error performing action:', error);
      alert('Failed to update consultation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div id={`rescheduled-${consultation.id}`} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-amber-200 overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Collapsed Header */}
      <div 
        className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center justify-center w-14 h-14 bg-amber-50 rounded-xl border border-amber-100 text-amber-600">
            <RefreshCw className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900 dark:text-white">{consultation.service || 'Executive Consultation'}</h3>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Rescheduled
              </span>
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> {formatDate(consultation.scheduledAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button className={`px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-bold hover:bg-amber-100 transition-colors`}>
             {isExpanded ? 'Hide Details' : 'Review & Confirm'}
           </button>
           {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-amber-100 bg-amber-50/20 p-6 animate-in slide-in-from-top-2">
          {/* Section A: Alert */}
          <div className="mb-6">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Your meeting has been rescheduled</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">We’ve updated the time to ensure the right expert is available for you. Please confirm if this works.</p>
          </div>

          {/* Section B: Comparison Table */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-amber-100 rounded-xl overflow-hidden mb-6">
             <div className="grid grid-cols-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-b border-gray-100 p-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
               <div className="px-2">Detail</div>
               <div className="px-2">Updated Meeting Details</div>
             </div>
             <div className="divide-y divide-gray-50">
               <div className="grid grid-cols-2 p-3 text-sm">
                 <div className="px-2 text-gray-500">Meeting Type</div>
                 <div className="px-2 font-semibold text-gray-900 dark:text-white capitalize">
                    {consultation.meetingMode === 'WALKTHROUGH' || consultation.meetingMode === 'INTERVIEW' 
                      ? consultation.meetingMode.toLowerCase() 
                      : (consultation.service || 'Consultation')}
                 </div>
               </div>
               <div className="grid grid-cols-2 p-3 text-sm">
                 <div className="px-2 text-gray-500">Mode</div>
                 <div className="px-2 font-medium text-gray-900 dark:text-white capitalize">
                    {consultation.meetingMode?.toLowerCase() || 'Online Video'}
                 </div>
               </div>
               <div className="grid grid-cols-2 p-3 text-sm">
                 <div className="px-2 text-gray-500">Original Time</div>
                 <div className="px-2 text-gray-400 line-through">{formatDate(consultation.previousScheduledAt || consultation.preferredDate)}</div>
               </div>
               <div className="grid grid-cols-2 p-3 text-sm">
                 <div className="px-2 text-gray-500">New Time</div>
                 <div className="px-2 font-bold text-emerald-600 flex items-center gap-2">
                   {formatDate(consultation.scheduledAt)}
                   <Check className="w-4 h-4" />
                 </div>
               </div>
               {consultation.meetingMode === 'ONLINE' && consultation.meetingLink && (
                 <div className="grid grid-cols-2 p-3 text-sm bg-blue-50 dark:bg-blue-900/20/30">
                   <div className="px-2 text-blue-600 font-bold">Meeting Link</div>
                   <div className="px-2 truncate">
                      <a href={consultation.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
                        {consultation.meetingLink}
                      </a>
                   </div>
                 </div>
               )}
               {(consultation.meetingMode === 'OFFLINE' || consultation.meetingMode === 'WALKTHROUGH') && consultation.location && (
                 <div className="grid grid-cols-2 p-3 text-sm bg-amber-50/30">
                   <div className="px-2 text-amber-700 font-bold">Location</div>
                   <div className="px-2 text-gray-900 dark:text-white">{consultation.location}</div>
                 </div>
               )}
             </div>
          </div>

          {/* Section C: Mode-Aware CTA Section */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl border border-gray-100">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 shadow-sm">
                   {consultation.meetingMode === 'ONLINE' ? <Video className="w-5 h-5 text-blue-500" /> : <MapPin className="w-5 h-5 text-amber-500" />}
                </div>
                <div>
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-tight">How to attend</p>
                   <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      {consultation.meetingMode === 'ONLINE' 
                        ? "Join via the secure link provided above." 
                        : `Please arrive at ${consultation.location || 'the venue'} 10 minutes early.`}
                   </p>
                </div>
             </div>
          </div>

          {/* Section D: Notes Input */}
          <div className="mb-6">
             <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
               <MessageSquare className="w-4 h-4" /> Add Notes for Kangqore Team
             </label>
             <textarea 
               value={userNotes}
               onChange={(e) => setUserNotes(e.target.value)}
               placeholder="Anything you'd like us to prepare in advance or a message about the new time..."
               className="w-full h-24 p-4 text-sm bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none"
             />
          </div>

          {/* Section E: Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
             <button 
               onClick={() => handleAction('CONFIRM')}
               disabled={isSubmitting}
               className="flex-1 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 disabled:opacity-50"
             >
               <Check className="w-5 h-5" /> Confirm New Time
             </button>
             <button 
               onClick={() => handleAction('MODIFY')}
               disabled={isSubmitting}
               className="px-6 py-3 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-bold border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
             >
               Request Different Time
             </button>
             <button 
               onClick={() => handleAction('CANCEL')}
               disabled={isSubmitting}
               className="px-6 py-3 bg-white dark:bg-gray-900 dark:border-gray-800 text-red-600 font-bold border border-red-100 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
             >
               <X className="w-5 h-5" /> Cancel Meeting
             </button>
          </div>

          <div className="mt-4 space-y-1">
             <p className="text-[10px] text-gray-400 flex items-center gap-1.5">
               <Check className="w-3 h-3" /> Calendar invite will be sent after confirmation
             </p>
             <p className="text-[10px] text-gray-400 flex items-center gap-1.5">
               <Check className="w-3 h-3" /> Video link shared 15 minutes before call
             </p>
             <p className="text-[10px] text-gray-400 flex items-center gap-1.5">
               <Check className="w-3 h-3" /> You can add notes anytime before the meeting
             </p>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}} />
    </div>
  );
};

export default RescheduledCard;
