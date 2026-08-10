import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { X, Check, Calendar, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const API_URL = import.meta.env.VITE_BACKEND_URL || '';

export default function BookingCancelPage() {
  const { token } = useParams();
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'done' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [cancelledEvent, setCancelledEvent] = useState(null);

  const handleCancel = async e => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await axios.post(`${API_URL}/api/scheduling/events/cancel-by-token`, {
        token,
        reason: reason.trim() || undefined
      });
      setCancelledEvent(res.data.event);
      setStatus('done');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Something went wrong. The link may have already been used.');
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 text-center border border-gray-100 dark:border-gray-800">
          <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
            <Check className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Meeting Canceled</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Your consultation has been canceled and both parties have been notified.
          </p>
          {cancelledEvent && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-left text-sm text-gray-600 dark:text-gray-400 mb-6 space-y-1">
              <p className="font-semibold text-gray-800 dark:text-white">{cancelledEvent.title}</p>
              {cancelledEvent.startTime && (
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 shrink-0" />
                  {format(new Date(cancelledEvent.startTime), 'EEEE, MMMM d, yyyy')}
                </p>
              )}
            </div>
          )}
          <Link to="/" className="inline-block px-6 py-3 bg-brand-gradient text-white font-bold rounded-xl hover:opacity-90 transition text-sm">
            Back to Kangqore
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 text-center border border-gray-100 dark:border-gray-800">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Unable to Cancel</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{errorMsg}</p>
          <Link to="/" className="inline-block px-6 py-3 bg-brand-gradient text-white font-bold rounded-xl hover:opacity-90 transition text-sm">
            Back to Kangqore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 border border-gray-100 dark:border-gray-800">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Cancel Consultation</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Are you sure you want to cancel this meeting? Both you and the Kangqore team will be notified.
          </p>
        </div>

        <form onSubmit={handleCancel} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Reason for cancellation <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g. Schedule conflict, need to reschedule..."
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition resize-none text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-3 px-6 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {status === 'loading'
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Canceling…</>
              : 'Confirm Cancellation'}
          </button>

          <Link to="/" className="block text-center text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mt-2">
            Go back — keep my meeting
          </Link>
        </form>
      </div>
    </div>
  );
}
