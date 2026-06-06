import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Check, X, RefreshCw, MessageSquare, ChevronDown, ChevronUp, MapPin, Video, Info, Users, Building2 } from 'lucide-react';
import axios from 'axios';

const MeetingCard = ({ consultation, onAction, isExpanded, onToggle }) => {
  // const [isExpanded, setIsExpanded] = useState(isForceExpanded); // Removed internal state
  const [userNotes, setUserNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useEffect(() => {
  //   if (isForceExpanded) setIsExpanded(true);
  // }, [isForceExpanded]);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

  const handleAction = async (action) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      
      // Check if this is demo data (has 'demo-' in ID)
      if (consultation.id?.toString().includes('demo-')) {
        // Simulate API delay for demo
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Show success message
        const actionMessages = {
          'CONFIRM': 'Meeting confirmed! Calendar invite will be sent shortly.',
          'MODIFY': 'Request submitted. Our team will contact you with alternative time slots.',
          'CANCEL': 'Meeting cancelled successfully.'
        };
        
        alert(actionMessages[action] || 'Action completed successfully!');
        

        // Call onAction to refresh the meeting list and close expanding
        if (onAction) onAction();
        
        return;
      }
      
      // Real API call for non-demo consultations
      await axios.post(`${BACKEND_URL}/api/consultations/${consultation.id}/action-reschedule`, {
        action,
        notes: userNotes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (onAction) onAction();
    } catch (error) {
      console.error('Error performing action:', error);
      alert('Failed to update. Please try again.');
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

  const status = consultation.status || 'SCHEDULED';
  const isRescheduled = status === 'ACTION_REQUIRED' || status === 'RESCHEDULED';
  const isCompleted = status === 'COMPLETED';
  const isScheduled = status === 'SCHEDULED' || status === 'PENDING';

  // Badge Logic
  const getBadgeStyle = () => {
    if (isRescheduled) return 'bg-amber-100 text-amber-700';
    if (isCompleted) return 'bg-green-100 text-green-700';
    return 'bg-blue-100 text-blue-700';
  };

  const getBadgeLabel = () => {
    if (isRescheduled) return 'RESCHEDULED';
    if (isCompleted) return 'COMPLETED';
    return 'SCHEDULED';
  };

  // Mode Style Logic
  const getModeStyle = (mode) => {
      const m = mode?.toUpperCase();
      switch(m) {
          case 'ONLINE': return 'border-blue-200 text-blue-700 bg-blue-50';
          case 'OFFLINE': return 'border-orange-200 text-orange-700 bg-orange-50';
          case 'WALKTHROUGH': return 'border-teal-200 text-teal-700 bg-teal-50';
          case 'INTERVIEW': return 'border-purple-200 text-purple-700 bg-purple-50';
          default: return 'border-gray-200 text-gray-700 bg-gray-50';
      }
  };

  const getModeIcon = (mode) => {
      const m = mode?.toUpperCase();
      switch(m) {
          case 'ONLINE': return <Video className="w-3.5 h-3.5" />;
          case 'OFFLINE': return <MapPin className="w-3.5 h-3.5" />;
          case 'WALKTHROUGH': return <MapPin className="w-3.5 h-3.5" />; // Or specific icon if avail
          case 'INTERVIEW': return <Users className="w-3.5 h-3.5" />;
          default: return <Video className="w-3.5 h-3.5" />;
      }
  };

  return (
    <div 
      id={`meeting-${consultation.id}`} 
      className={`bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-md cursor-pointer group relative overflow-hidden flex flex-col min-h-[220px] ${
        isRescheduled 
            ? 'border-rose-100 hover:border-transparent hover:bg-brand-gradient' // Admin style: Gradient on hover
            : 'border-gray-100 hover:border-transparent hover:bg-brand-gradient'
      }`}
      onClick={(e) => {
         // Allow clicking to open sidebar/expand for any status if onToggle is provided
         if (onToggle) onToggle();
      }}
    >
      {/* Rescheduled Gradient Indicator (Only if not hovering to avoid clash with brand gradient) */}
      {isRescheduled && (
          <div className="absolute top-0 left-0 w-1 h-full bg-brand-gradient group-hover:opacity-0 transition-opacity" />
      )}

      {/* Admin-Style Card Layout (Collapsible) */}
      <div className="p-5 flex flex-col h-full justify-between">
        <div>
           {/* Header: Avatar + Title */}
           <div className="flex justify-between items-start mb-4">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-brand-blue/10 text-brand-blue rounded-xl flex items-center justify-center font-bold group-hover:bg-white dark:bg-gray-900 dark:border-gray-800/20 group-hover:text-white transition-colors shrink-0">
                 {consultation.title?.charAt(0) || 'M'}
               </div>
               <div className="min-w-0">
                 <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-white transition-colors break-words line-clamp-2">
                    {consultation.topic || consultation.title || consultation.service || 'Meeting'}
                 </h3>
                 <p className="text-xs text-gray-500 group-hover:text-blue-100 transition-colors">
                    {new Date(consultation.startTime || consultation.scheduledAt || new Date()).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                 </p>
               </div>
             </div>
           </div>

           {/* Body Details */}
           <div className="space-y-3 mb-5">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                 <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                   status === 'ACTION_REQUIRED' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 border-blue-200' :
                   status === 'RESCHEDULED' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                   status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                   'bg-purple-50 dark:bg-purple-900/20 text-purple-700 border-purple-200'
                 }`}>
                   {status === 'ACTION_REQUIRED' ? 'Action Required' : 
                    status === 'RESCHEDULED' ? 'Rescheduled' : 
                    status === 'COMPLETED' ? 'Completed' : 
                    'Scheduled'}
                 </span>
              </div>

              {/* Rep / Company Line */}
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 group-hover:text-blue-50 transition-colors">
                 <Video className="w-4 h-4 text-gray-400 group-hover:text-blue-200 transition-colors" />
                 <span className="truncate">Kangqore Team</span>
              </div>
              
              {/* Time & Mode Box */}
              <div className="pt-2 border-t border-gray-50 group-hover:border-white/10 mt-2 transition-colors">
                 <div className={`flex items-center justify-between p-2 rounded-lg border bg-white dark:bg-gray-900 dark:border-gray-800/90 shadow-sm border-transparent ${getModeStyle(consultation.meetingMode)}`}>
                    <div className="flex items-center gap-2">
                       {getModeIcon(consultation.meetingMode)}
                       <span className="text-xs font-bold uppercase">{consultation.meetingMode || 'Online'}</span>
                    </div>
                    <span className="text-[10px] font-medium">
                       {new Date(consultation.startTime || consultation.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                 </div>
              </div>
           </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-2 mt-auto">
             {!isExpanded && (
                <div className="w-full flex gap-2" onClick={(e) => e.stopPropagation()}>
                    {isRescheduled ? (
                        <button 
                            onClick={() => onToggle && onToggle()}
                            className="flex-1 py-2 text-xs font-bold bg-white dark:bg-gray-900 dark:border-gray-800 text-rose-600 rounded-lg shadow-sm hover:bg-rose-50 transition-colors"
                        >
                            Review Update
                        </button>
                    ) : consultation.joinLink ? (
                        <a 
                            href={consultation.joinLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 py-2 text-xs font-bold bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue rounded-lg shadow-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                        >
                             Join Meeting
                        </a>
                    ) : (
                        <button className="flex-1 py-2 text-xs font-bold bg-gray-50 dark:bg-[#050505] text-gray-400 rounded-lg cursor-not-allowed">
                            Scheduled
                        </button>
                    )}
                </div>
             )}
             
             {/* Expansion Toggle (only if rescheduled) */}
             {isRescheduled && (
                 <button 
                    onClick={(e) => { e.stopPropagation(); onToggle && onToggle(); }}
                    className="p-2 text-gray-400 hover:text-white transition-colors group-hover:text-blue-200"
                 >
                     {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                 </button>
             )}
        </div>
      </div>

      {/* Expanded Content (Only for Rescheduled) */}
      {isExpanded && isRescheduled && (
        <div className="border-t border-amber-100 bg-amber-50/20 p-6 animate-in slide-in-from-top-2 cursor-auto" onClick={(e) => e.stopPropagation()}>
          {/* Section A: Acknowledgement */}
          <div className="mb-6">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Your meeting has been rescheduled</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
               We updated the timing to ensure the right team member is available.
               <span className="text-gray-400 text-xs">• Rescheduled by Kangqore Team</span>
            </p>
          </div>

          {/* Section B: Before vs After */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-amber-100 rounded-xl overflow-hidden mb-6 shadow-sm">
             <div className="grid grid-cols-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-b border-gray-100 p-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
               <div className="px-2">Detail</div>
               <div className="px-2">New Plan</div>
             </div>
             <div className="divide-y divide-gray-50">
               <div className="grid grid-cols-2 p-3 text-sm hover:bg-gray-50 dark:bg-[#050505]/50 transition-colors">
                 <div className="px-2 text-gray-500">Original Time</div>
                 <div className="px-2 text-gray-400 line-through decoration-red-300">
                    {formatDate(consultation.previousScheduledAt || consultation.preferredDate || new Date())}
                 </div>
               </div>
               <div className="grid grid-cols-2 p-3 text-sm bg-blue-50 dark:bg-blue-900/20/10">
                 <div className="px-2 text-gray-500 font-medium">New Time</div>
                 <div className="px-2 font-bold text-brand-blue flex items-center gap-2">
                   {formatDate(consultation.startTime || consultation.scheduledAt)}
                   <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                 </div>
               </div>
               <div className="grid grid-cols-2 p-3 text-sm">
                 <div className="px-2 text-gray-500">Rep</div>
                 <div className="px-2 font-medium text-gray-900 dark:text-white">Rina Devi (Senior Consultant)</div>
               </div>
             </div>
          </div>

          {/* Section C: Optional Reason */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl border border-gray-100/80">
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Why this changed?</p>
             <p className="text-sm text-gray-600 dark:text-gray-400 italic">"We reassigned the meeting to ensure the appropriate stakeholder is present for your technical queries."</p>
          </div>

          {/* Section D: User Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
             <button 
               onClick={() => handleAction('CONFIRM')}
               disabled={isSubmitting}
               // Brand Blue for Confirm
               className="flex-1 px-6 py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all transform active:scale-95"
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
               // Soft Red for Cancel
               className="px-6 py-3 bg-white dark:bg-gray-900 dark:border-gray-800 text-red-600 font-bold border border-red-100 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
             >
               <X className="w-5 h-5" /> Cancel
             </button>
          </div>

          {/* Section E: Notes */}
          <div className="mt-6">
             <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
               Add Note (Optional)
             </label>
             <textarea 
               value={userNotes}
               onChange={(e) => setUserNotes(e.target.value)}
               placeholder="Anything you'd like us to prepare in advance?"
               className="w-full h-20 p-4 text-sm bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all outline-none resize-none"
             />
          </div>

          {/* Section F: What Happens Next */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 text-[10px] text-gray-400">
              <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-500" /> Calendar invite will be sent</span>
              <span className="hidden sm:inline text-gray-300">•</span>
              <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-500" /> Link shared before start</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingCard;
