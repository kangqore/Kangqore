import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { Check, Calendar as CalendarIcon, Clock, User, Video, RefreshCw, X, Loader2, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BookingConfirmationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/scheduling/events/public/${id}`);
        if (response.data.success) {
          setEvent(response.data.event);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load booking details.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, BACKEND_URL]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-10 h-10 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl text-center border border-red-100 dark:border-red-900/30">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Oops!</h2>
          <p className="text-gray-500 mb-8">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-brand-gradient text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
      >
        <div className="bg-brand-gradient p-10 text-center text-white relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 rounded-full bg-blue-400/20 blur-3xl"></div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[2rem] flex items-center justify-center mb-6 shadow-xl">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Booking Confirmed!</h1>
            <p className="text-blue-100 max-w-md mx-auto text-sm md:text-base">
              A calendar invitation has been sent to your email. You can find your meeting details below.
            </p>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="space-y-6 bg-gray-50 dark:bg-black/20 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
              {event.title}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm flex-shrink-0">
                  <CalendarIcon className="w-5 h-5 text-brand-blue" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Date</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {format(new Date(event.startTime), 'EEEE, MMMM do, yyyy')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm flex-shrink-0">
                  <Clock className="w-5 h-5 text-brand-blue" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Time</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {format(new Date(event.startTime), 'h:mm a')} - {format(new Date(event.endTime), 'h:mm a')} ({event.eventType.duration} min)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm flex-shrink-0">
                  <User className="w-5 h-5 text-brand-blue" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Host</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{event.host?.name}</p>
                  <p className="text-xs text-gray-500">{event.host?.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            {event.joinUrl && (
              <a
                href={event.joinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-4 bg-brand-blue text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-brand-blue/20"
              >
                <Video className="w-5 h-5" />
                Join Meeting
              </a>
            )}
            
            {event.rescheduleToken && (
              <a
                href={`/booking/reschedule/${event.rescheduleToken}`}
                className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Reschedule
              </a>
            )}
            
            {event.cancelToken && (
              <a
                href={`/booking/cancel/${event.cancelToken}`}
                className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
              >
                <X className="w-5 h-5" />
                Cancel
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
