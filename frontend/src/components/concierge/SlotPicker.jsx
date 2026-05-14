import React, { useState } from 'react';
import { Calendar, Clock, Check, ChevronRight, Zap, Loader2 } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

const SlotPicker = ({ leadId, slots, onBooked }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirm = async () => {
    if (!selectedId) return;
    setBooking(true);
    setError(null);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/eqore/leads/confirm-booking`, {
        leadId,
        slotId: selectedId
      });
      if (res.data.success) {
        setBooked(true);
        if (onBooked) onBooked(res.data.booking);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to book slot');
    } finally {
      setBooking(false);
    }
  };

  if (booked) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex flex-col items-center text-center animate-fade-in">
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
          <Check className="w-6 h-6 text-emerald-400" />
        </div>
        <h4 className="text-sm font-bold text-white mb-1">Consultation Confirmed!</h4>
        <p className="text-[11px] text-emerald-200/70">
          A calendar invite has been sent to your email. We look forward to talking with you.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[320px] rounded-xl overflow-hidden border border-cyan-400/20 bg-[#12121a] shadow-xl">
      <div className="px-4 py-2.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-bold text-cyan-400/90 uppercase tracking-widest">
            Select a Slot
          </span>
        </div>
        <span className="text-[10px] text-white/30 font-medium">30 min</span>
      </div>

      <div className="p-3 space-y-2">
        {slots.map((slot) => (
          <button
            key={slot.id}
            onClick={() => setSelectedId(slot.id)}
            disabled={booking}
            className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between group ${
              selectedId === slot.id
                ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                : 'bg-white/[0.03] border-white/5 hover:border-white/20 hover:bg-white/[0.05]'
            }`}
          >
            <div className="flex flex-col">
              <span className={`text-[12px] font-semibold ${selectedId === slot.id ? 'text-cyan-300' : 'text-slate-300'}`}>
                {slot.label}
              </span>
              <span className="text-[10px] text-slate-500">Google Meet / Online</span>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 transition-all ${
              selectedId === slot.id ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600'
            }`} />
          </button>
        ))}

        {error && (
          <p className="text-[10px] text-red-400 px-1">{error}</p>
        )}

        <button
          onClick={handleConfirm}
          disabled={!selectedId || booking}
          className="w-full mt-2 py-3 px-4 rounded-lg bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-40 disabled:hover:bg-brand-blue text-white text-[12px] font-bold tracking-wide transition-all flex items-center justify-center gap-2"
        >
          {booking ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Confirming...
            </>
          ) : (
            <>
              Confirm Appointment
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SlotPicker;
