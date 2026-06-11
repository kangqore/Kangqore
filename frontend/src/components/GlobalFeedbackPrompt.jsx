import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MessageSquare, ArrowRight } from 'lucide-react';

const GlobalFeedbackPrompt = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 90000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => setVisible(true), 180000);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[99998] w-72 animate-fade-in-up">
      <div className="relative bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="absolute -top-8 -right-8 w-20 h-20 bg-brand-blue/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#050505] border border-brand-blue/30 flex items-center justify-center shadow-[0_0_10px_rgba(37,100,234,0.25)]">
              <MessageSquare className="w-3.5 h-3.5 text-brand-cyan" />
            </div>
            <span className="text-sm font-bold text-white">We Value Your Input</span>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-md hover:bg-white/5 text-gray-500 hover:text-white transition"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 py-4">
          <p className="text-xs text-gray-400 leading-relaxed mb-4">
            How are we doing? Share your thoughts on our website, services, UI/UX, or any recommendations — we read every message.
          </p>
          <button
            onClick={() => { setVisible(false); navigate('/contact#send-message'); }}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-cyan hover:text-white transition group"
          >
            <span>Share your feedback</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalFeedbackPrompt;
