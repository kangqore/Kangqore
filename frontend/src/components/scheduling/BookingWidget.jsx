import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { format, addDays, startOfDay, parseISO, isSameDay } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Building,
  MessageSquare,
  Check,
  ChevronRight,
  ChevronLeft,
  Globe,
  ArrowRight,
  Loader2,
  Video,
  RefreshCw,
  X
} from 'lucide-react';
import axios from 'axios';
import { useToast } from '../../hooks/use-toast';

function detectTimezone() {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; }
  catch { return 'UTC'; }
}

const BookingWidget = forwardRef(({ eventTypeSlug, schedulingLinkId }, ref) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1); // 1: Date/Time, 2: Form, 3: Success
  const [eventType, setEventType] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);
  const [timezone] = useState(detectTimezone);

  // Expose control to parent (e.g., eQORE automation)
  useImperativeHandle(ref, () => ({
    selectDateTime: (date, timeStr) => {
      setSelectedDate(date);
      setPendingAutomation({ date, timeStr });
    },
    setStep: (s) => setStep(s)
  }));

  const [pendingAutomation, setPendingAutomation] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingEventType, setLoadingEventType] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    smsOptIn: false,
    responses: { specificHostId: null }
  });

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

  // Automation Effect: When slots load, if we have a pending request, try to fulfill it
  useEffect(() => {
    if (pendingAutomation && !loadingSlots && availableSlots.length > 0) {
      const { timeStr } = pendingAutomation;
      // Find slot that matches timeStr (e.g. "10:00 AM")
      const slot = availableSlots.find(s => {
        const t = format(new Date(s.startTime), 'h:mm a').toLowerCase();
        return t === timeStr.toLowerCase();
      });

      if (slot) {
        setSelectedSlot(slot);
        setStep(2); // Automatically move to form step
        toast({
          title: "eQORE Automation",
          description: `Selected ${format(new Date(slot.startTime), 'EEEE, MMM do')} at ${timeStr}.`,
        });
      } else {
        toast({
          title: "Slot Unavailable",
          description: `Sorry, ${timeStr} is not available on this day.`,
          variant: "destructive"
        });
      }
      setPendingAutomation(null);
    }
  }, [availableSlots, loadingSlots, pendingAutomation, toast]);

  // Load Event Type
  useEffect(() => {
    const fetchEventType = async () => {
      try {
        setLoadingEventType(true);
        const url = `${BACKEND_URL}/api/scheduling/event-types/${eventTypeSlug}`;
        const response = await axios.get(url);
        if (response.data.success) {
          const type = response.data.eventType;
          setEventType(type);
          setSelectedDuration(type.duration);
          if (type.assignmentStrategy === 'HOST_PICK') {
            setStep(0);
          }
        } else {
          throw new Error(response.data.message || 'Failed to load event type');
        }
      } catch (error) {
        console.error('Error fetching event type:', error);
        const errorMsg = error.response?.data?.message || error.message || 'Could not load booking details';
        setError(errorMsg);
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive"
        });
      } finally {
        setLoadingEventType(false);
      }
    };

    if (eventTypeSlug) fetchEventType();
  }, [eventTypeSlug, toast, BACKEND_URL]);

  // Load Slots when date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!eventType) return;
      try {
        setLoadingSlots(true);
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const durationParam = selectedDuration ? `&duration=${selectedDuration}` : '';
        const hostParam = formData.responses?.specificHostId ? `&hostId=${formData.responses.specificHostId}` : '';
        const response = await axios.get(`${BACKEND_URL}/api/scheduling/availability/slots/${eventTypeSlug}?date=${dateStr}${durationParam}${hostParam}`);
        setAvailableSlots(response.data.slots);
        setSelectedSlot(null);
      } catch (error) {
        console.error('Error fetching slots:', error);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDate, eventType, eventTypeSlug, selectedDuration, BACKEND_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/scheduling/events`, {
        eventTypeId: eventType.id,
        startTime: selectedSlot.startTime,
        invitee: { ...formData, timezone },
        schedulingLinkId
      });

      if (response.data.success) {
        window.location.href = `/booking/${response.data.event.id}`;
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: error.response?.data?.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingEventType) {
    return (
      <div className="flex flex-col items-center justify-center p-20 min-h-[500px]">
        <Loader2 className="w-10 h-10 text-brand-blue animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Preparing your session...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-12 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-[2.5rem] text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <MessageSquare className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-8">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-brand-gradient text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-brand-blue/20"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!eventType) return null;

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
      
      {/* Left Sidebar: Event Info */}
      <div className="md:w-1/3 bg-gray-50 dark:bg-black/20 p-8 md:p-12 border-r border-gray-100 dark:border-gray-800">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-gradient text-white rounded-full text-[11px] font-extrabold uppercase tracking-widest shadow-md shadow-brand-blue/20 border border-white/10 hover:scale-[1.03] transition-all">
            <Clock className="w-3.5 h-3.5 text-white/90" />
            {selectedDuration || eventType.duration} Minutes
          </div>
          {eventType.durationOptions && Array.isArray(eventType.durationOptions) && eventType.durationOptions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {[eventType.duration, ...eventType.durationOptions].filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a - b).map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDuration(d)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    selectedDuration === d 
                    ? 'bg-brand-blue text-white border-brand-blue shadow-md' 
                    : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700 hover:border-brand-blue hover:text-brand-blue'
                  }`}
                >
                  {d} min
                </button>
              ))}
            </div>
          )}
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
            {eventType.name}
          </h1>
          
          {eventType.description && (
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              {eventType.description}
            </p>
          )}

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                <Globe className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">Timezone</p>
                <p className="text-sm font-medium">{timezone === 'Asia/Calcutta' || timezone === 'Asia/Kolkata' ? 'India (GMT+5:30)' : timezone}</p>
              </div>
            </div>
            
            {eventType.location && (
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                  <MessageSquare className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-400">Location</p>
                  <p className="text-sm font-medium">{eventType.locationType}</p>
                </div>
              </div>
            )}
          </div>

          {eventType.host && (
            <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex items-center gap-4">
              {eventType.assignmentStrategy === 'COLLECTIVE' && eventType.teamMembers?.length > 0 ? (
                <div className="flex -space-x-4">
                  {[eventType.host, ...eventType.teamMembers.map(tm => tm.user)].map((u, i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-900 bg-brand-blue flex items-center justify-center overflow-hidden shadow-sm z-10 relative">
                      {u.avatarUrl ? (
                        <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-bold text-sm">{u.name.charAt(0)}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : null}
              
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {eventType.assignmentStrategy === 'COLLECTIVE' ? 'Your Hosts' : 'Your Host'}
                </p>
                <p className="font-bold text-gray-900 dark:text-white">
                  {eventType.assignmentStrategy === 'COLLECTIVE' 
                    ? [eventType.host.name, ...eventType.teamMembers.map(tm => tm.user.name)].join(', ')
                    : "Kangqore Executive"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Section: Content */}
      <div className="flex-1 bg-white dark:bg-gray-900 relative overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div 
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col p-8 md:p-12 justify-center"
            >
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Choose a Team Member</h3>
              <p className="text-gray-500 mb-8">Select who you'd like to meet with, or choose "No Preference".</p>
              
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setFormData(prev => ({ ...prev, responses: { ...prev.responses, specificHostId: null } }));
                    setStep(1);
                  }}
                  className="w-full text-left p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-brand-blue hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-400 group-hover:text-brand-blue transition-colors" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">No Preference</p>
                    <p className="text-sm text-gray-500">Find the next available time</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-brand-blue" />
                </button>
                
                {eventType.teamMembers?.map(tm => (
                  <button
                    key={tm.userId}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, responses: { ...prev.responses, specificHostId: tm.userId } }));
                      setStep(1);
                    }}
                    className="w-full text-left p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-brand-blue hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex items-center gap-4 group"
                  >
                    {tm.user.avatarUrl ? (
                      <img src={tm.user.avatarUrl} alt={tm.user.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold">
                        {tm.user.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">{tm.user.name}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-brand-blue" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col md:flex-row p-4 md:p-8"
            >
              <div className="flex-1 p-4">
                <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                  Select Date
                </h3>
                <div className="day-picker-container scale-110 origin-top-left">
                  <style>{`
                    .day-picker-container .rdp-day_selected,
                    .day-picker-container .rdp-day_selected:focus,
                    .day-picker-container .rdp-day_selected:hover,
                    .day-picker-container .rdp-day_button:focus,
                    .day-picker-container .rdp-selected .rdp-day_button {
                      border: none !important;
                      outline: none !important;
                      box-shadow: none !important;
                      background-color: transparent !important;
                    }
                  `}</style>
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    disabled={{ before: new Date() }}
                    styles={{
                      caption: { color: '#2564ea', fontWeight: 'bold' },
                      head_cell: { color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }
                    }}
                    modifiersStyles={{
                      selected: {
                        background: 'linear-gradient(90deg, #2564ea 0%, #4ab6d4 100%)',
                        color: 'white',
                        fontWeight: 'bold',
                        border: 'none',
                        outline: 'none',
                        boxShadow: 'none',
                        borderRadius: '50%'
                      }
                    }}
                  />
                </div>
              </div>

              <div className="md:w-64 flex flex-col border-l border-gray-100 dark:border-gray-800 md:pl-8 p-4">
                <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">
                  {format(selectedDate, 'EEEE, MMM do')}
                </h3>
                
                <div className="flex-1 overflow-y-auto p-2 -m-2 pr-4 space-y-2 max-h-[400px] scrollbar-thin scrollbar-thumb-gray-200">
                  {loadingSlots ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 className="w-6 h-6 text-brand-blue animate-spin" />
                    </div>
                  ) : availableSlots.length > 0 ? (
                    availableSlots.map((slot, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSlot(slot)}
                        className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition-all border ${
                          selectedSlot === slot 
                          ? 'text-white shadow-lg shadow-brand-blue/30 scale-[1.02]' 
                          : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-brand-blue hover:border-brand-blue hover:bg-blue-50'
                        }`}
                        style={selectedSlot === slot ? { background: 'linear-gradient(90deg, #2564ea 0%, #4ab6d4 100%)', border: 'none' } : {}}
                      >
                        {format(new Date(slot.startTime), 'h:mm a')}
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-12 px-6 bg-gray-50 dark:bg-black/20 rounded-[2rem] border border-dashed border-gray-200 dark:border-white/5 flex flex-col items-center justify-center space-y-4">
                      <div className="w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-sm">
                        <CalendarIcon className="w-6 h-6 text-gray-300" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">No Slots Found</p>
                        <p className="text-xs text-gray-400 font-medium">Please select another date on the calendar.</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <button
                    disabled={!selectedSlot}
                    onClick={() => setStep(2)}
                    className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none shadow-xl shadow-gray-200 dark:shadow-none"
                  >
                    Next Step
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8 md:p-12 h-full flex flex-col"
            >
              <button 
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-brand-blue mb-8 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to calendar
              </button>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Almost there!</h2>
              <p className="text-gray-500 mb-8">Confirm your details to finalize the booking.</p>

              <form onSubmit={handleSubmit} className="space-y-6 flex-1 overflow-y-auto p-2 -m-2 pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                      <input 
                        required
                        type="text"
                        placeholder="C.O.D.E."
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-brand-blue transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                      <input 
                        required
                        type="email"
                        placeholder="business@kangqore.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-brand-blue transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Company Name</label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                      <input 
                        required
                        type="text"
                        placeholder="Kangqore"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-brand-blue transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <input 
                      type="tel"
                      required
                      placeholder="+91 7782010696"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-brand-blue transition-all outline-none"
                    />
                    {formData.phone && (
                      <div className="flex items-center gap-2 mt-3 ml-2">
                        <input
                          type="checkbox"
                          id="smsOptIn"
                          checked={formData.smsOptIn}
                          onChange={(e) => setFormData({...formData, smsOptIn: e.target.checked})}
                          className="w-4 h-4 text-brand-blue rounded border-gray-300 focus:ring-brand-blue bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                        />
                        <label htmlFor="smsOptIn" className="text-sm text-gray-500 dark:text-gray-400">
                          Send me SMS reminders before the meeting
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-5 bg-brand-gradient text-white rounded-[1.5rem] font-bold text-lg flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-95 transition-all shadow-xl shadow-brand-blue/20"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        Confirm Booking
                        <ArrowRight className="w-6 h-6" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-tighter">
                    By confirming, you agree to Kangqore's terms and privacy policy.
                  </p>
                </div>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 flex flex-col items-center justify-center text-center h-full bg-brand-gradient text-white"
            >
              <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-[2rem] flex items-center justify-center mb-8 animate-bounce">
                <Check className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-4xl font-bold mb-4">You're all set!</h2>
              <p className="text-blue-50 text-lg mb-8 max-w-md">
                A calendar invitation has been sent to <strong>{formData.email}</strong>. We look forward to our session!
              </p>

              <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Date</p>
                  <p className="font-bold">{format(selectedDate, 'MMM do, yyyy')}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Time</p>
                  <p className="font-bold">{format(new Date(selectedSlot?.startTime), 'h:mm a')}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full max-w-sm">
                {bookingResult?.event?.joinUrl && (
                  <a
                    href={bookingResult.event.joinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-white text-brand-blue rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-lg"
                  >
                    <Video className="w-5 h-5" />
                    Join Meeting
                  </a>
                )}
                <div className="grid grid-cols-2 gap-3">
                  {bookingResult?.event?.rescheduleToken && (
                    <a
                      href={`/booking/reschedule/${bookingResult.event.rescheduleToken}`}
                      className="py-3 bg-white/10 hover:bg-white/20 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reschedule
                    </a>
                  )}
                  {bookingResult?.event?.cancelToken && (
                    <a
                      href={`/booking/cancel/${bookingResult.event.cancelToken}`}
                      className="py-3 bg-white/10 hover:bg-white/20 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </a>
                  )}
                </div>
              </div>

              <button
                onClick={() => window.location.href = '/'}
                className="mt-10 text-sm font-bold border-b border-white/30 hover:border-white transition-all pb-1"
              >
                Back to Homepage
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});


export default BookingWidget;
