import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Info, ChevronRight, RefreshCw, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useConcierge, getSuggestedPrompts } from '../hooks/useConcierge';
import CitationBadge from './concierge/CitationBadge';
import LeadCaptureInline from './concierge/LeadCaptureInline';

const HANDOFF_KEYWORDS = [
  "connect you to a kangqore consultant",
  "kangqore consultant can",
  "verified information",
  "share your name and email",
];

function looksLikeHandoff(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return HANDOFF_KEYWORDS.some((k) => lower.includes(k));
}

function renderInlineCitations(text) {
  if (!text) return text;
  const parts = text.split(/(\[CHUNK:[A-Za-z0-9_\-#]+\])/g);
  return parts.map((part, i) => {
    const m = part.match(/^\[CHUNK:([A-Za-z0-9_\-#]+)\]$/);
    if (m) {
      return (
        <span key={i} className="mx-1 align-middle">
          <CitationBadge chunkId={m[1]} />
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

const EQoreChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [showLeadFor, setShowLeadFor] = useState(null);
  const [seedContext, setSeedContext] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const { messages, streaming, conversationId, error, send, reset } = useConcierge({ seedContext });

  // Floating prompts (3) — derived from seed when present, otherwise default top 3.
  const floatingPrompts = getSuggestedPrompts(seedContext).slice(0, 3);

  useEffect(() => {
    const handleToggle = (event) => {
      const detail = event?.detail;
      if (detail && detail.surface && detail.name) {
        // Seed payload from an "Ask eQORE about X" CTA.
        setSeedContext({
          surface: detail.surface,
          name: detail.name,
          slug: detail.slug,
          departmentName: detail.departmentName,
        });
        if (detail.openOnly) {
          setIsOpen(true);
          return;
        }
      }
      setIsOpen((prev) => !prev);
    };
    window.addEventListener('toggle-eqore-chatbot', handleToggle);
    return () => window.removeEventListener('toggle-eqore-chatbot', handleToggle);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  const handleSend = (e, textOverride = null) => {
    if (e) e.preventDefault();
    const text = (textOverride || inputText).trim();
    if (!text || streaming) return;
    setInputText('');
    send(text);
  };

  const formatTime = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(date);
  };

  if (!isOpen) return null;

  const hasUserMessages = messages.some((m) => m.role === 'user');

  return (
    <div className="fixed bottom-28 left-8 z-[101]">
      <button
        onClick={() => setIsOpen(false)}
        className="absolute -top-3 -right-3 w-8 h-8 bg-[#1a1a1a] hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10 rounded-full shadow-lg flex items-center justify-center z-[51] transition-all"
        aria-label="Close chatbot"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="absolute bottom-0 left-0 bg-[#0a0a0c]/95 backdrop-blur-xl rounded-2xl shadow-2xl w-[360px] sm:w-[400px] border border-white/10 overflow-hidden flex flex-col h-[600px] max-h-[80vh] animate-fade-in-up origin-bottom-left">

        {/* Header */}
        <div className="bg-[#111115] border-b border-white/5 p-4 flex items-center justify-between text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-cyan/5 blur-xl pointer-events-none"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.2)] bg-[#050505]">
                <img src="/images/eqore-avatar.png" alt="eQORE" className="w-full h-full object-cover" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-cyan-400 border-2 border-[#111115] rounded-full animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.6)]"></span>
            </div>
            <div>
              <h3 className="font-display font-bold text-sm tracking-wide">eQORE</h3>
              <p className="text-[10px] text-cyan-400/80 uppercase tracking-widest font-semibold">
                {streaming ? 'Thinking…' : 'System Online'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 relative z-10">
            {hasUserMessages && (
              <button
                onClick={reset}
                className="p-2 hover:bg-white dark:bg-black/5 rounded-lg transition-colors text-slate-400 hover:text-white"
                title="Start a new conversation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
            <Link to="/eqore" className="p-2 hover:bg-white dark:bg-black/5 rounded-lg transition-colors text-slate-400 hover:text-white" title="About eQORE">
              <Info className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Chat Area */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-5 bg-transparent custom-scrollbar scroll-smooth"
        >
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const showHandoffOffer =
              !isUser &&
              msg.done &&
              looksLikeHandoff(msg.content) &&
              showLeadFor !== msg.id &&
              msg.id !== 'greeting';
            return (
              <div key={msg.id} className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`flex items-end gap-2 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isUser && (
                    <div className="w-6 h-6 rounded-md overflow-hidden border border-cyan-400/20 bg-[#050505] shrink-0 mb-1 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                      <img src="/images/eqore-avatar.png" alt="eQORE" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className={`p-3.5 text-[13px] leading-relaxed shadow-sm whitespace-pre-wrap ${
                    isUser
                      ? 'bg-white dark:bg-gray-900 dark:border-gray-800 text-black rounded-2xl rounded-br-sm font-medium'
                      : 'bg-[#1a1a1e] border border-white/5 text-slate-200 rounded-2xl rounded-bl-sm'
                  }`}>
                    {renderInlineCitations(msg.content)}
                    {!msg.done && msg.role === 'assistant' && (
                      <span className="inline-block w-1.5 h-4 ml-0.5 align-middle bg-cyan-400 animate-pulse rounded-sm" />
                    )}
                  </div>
                </div>

                {!isUser && msg.done && msg.citations && msg.citations.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 ml-8">
                    {msg.citations.map((cid) => (
                      <CitationBadge key={cid} chunkId={cid} />
                    ))}
                  </div>
                )}

                {!isUser && msg.leadCaptured && (
                  <div className="ml-8 mt-1 max-w-xs rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2.5 flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-emerald-200 leading-snug">
                      Got it — a Kangqore consultant will reach out to {msg.leadCaptured.email} within one business day.
                    </p>
                  </div>
                )}

                {showHandoffOffer && !msg.leadCaptured && (
                  <button
                    type="button"
                    onClick={() => setShowLeadFor(msg.id)}
                    className="ml-8 text-[11px] font-semibold text-cyan-400 hover:underline"
                  >
                    → Talk to a Kangqore consultant
                  </button>
                )}

                {!isUser && showLeadFor === msg.id && !msg.leadCaptured && (
                  <div className="ml-8 w-full max-w-xs">
                    <LeadCaptureInline
                      conversationId={conversationId}
                      defaultIntent={
                        messages.filter((m) => m.role === 'user').slice(-1)[0]?.content
                      }
                    />
                  </div>
                )}

                <span className={`text-[10px] text-slate-500 font-medium px-8 ${isUser ? 'text-right' : 'text-left'}`}>
                  {msg.id === 'greeting' ? '' : formatTime(new Date())}
                </span>
              </div>
            );
          })}

          {/* Suggested Prompts (only show if no user messages yet) */}
          {!hasUserMessages && !streaming && (
            <div className="pt-4 flex flex-col gap-2">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold ml-8">Suggested Queries</p>
              <div className="flex flex-col gap-2 ml-8">
                {floatingPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => handleSend(e, prompt)}
                    className="text-left text-xs bg-white dark:bg-gray-900 dark:border-gray-800/5 hover:bg-white dark:bg-gray-900 dark:border-gray-800/10 border border-white/5 text-slate-300 py-2 px-3 rounded-lg flex items-center justify-between group transition-all"
                  >
                    {prompt}
                    <ChevronRight className="w-3 h-3 text-cyan-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}
          {error && (
            <p className="text-[11px] text-red-400 ml-8">{error}</p>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-4 bg-[#111115] border-t border-white/5">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={streaming}
              placeholder="Query the intelligence core..."
              className="w-full pl-4 pr-12 py-3.5 bg-[#050505] border border-white/10 rounded-xl focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 outline-none text-sm text-white placeholder-slate-500 transition-all shadow-inner disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || streaming}
              className="absolute right-2 p-2 bg-white dark:bg-black text-black rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:bg-white dark:bg-black/10 disabled:text-white/30 transition-all flex items-center justify-center"
            >
              {streaming ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EQoreChatbot;
