import React, { useEffect, useRef, useState } from 'react';
import {
  Send,
  Sparkles,
  RefreshCw,
  MessageSquarePlus,
  User,
  Copy,
  Check,
  RotateCcw,
  Square,
  ThumbsUp,
  ThumbsDown,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useConcierge, CONCIERGE_SUGGESTED_PROMPTS } from '../../hooks/useConcierge';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import CitationBadge from './CitationBadge';
import SuggestedPromptChip from './SuggestedPromptChip';
import LeadCaptureInline from './LeadCaptureInline';

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

function cleanTextForSpeech(text) {
  if (!text) return '';
  return text
    .replace(/\[CHUNK:[a-zA-Z0-9_\-]+\]/g, '') // remove citation chunks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // replace markdown links with just the text
    .replace(/\*\*(.*?)\*\*/g, '$1') // remove bold
    .replace(/`(.*?)`/g, '$1') // remove inline code
    .replace(/#/g, '') // remove heading hashes
    .trim();
}

function renderFormattedText(text) {
  if (!text) return text;
  
  // Strip out citations and any preceding whitespace to fix punctuation spacing
  const cleanText = text.replace(/\s*\[CHUNK:[A-Za-z0-9_\-#]+\]/g, '');
  
  // For non-citation parts, handle **bold** syntax
  const boldParts = cleanText.split(/(\*\*.*?\*\*)/g);
  return boldParts.flatMap((bPart, j) => {
    if (bPart.startsWith('**') && bPart.endsWith('**')) {
      const boldInner = bPart.slice(2, -2);
      // Check if the bold text itself contains a link
      const boldLinkParts = boldInner.split(/(\[.*?\]\(.*?\))/g);
      return <strong key={`bold-${j}`} className="text-white font-semibold">
        {boldLinkParts.map((lPart, k) => {
          const m = lPart.match(/^\[(.*?)\]\((.*?)\)$/);
          if (m) {
            return (
              <a key={`blink-${j}-${k}`} href={m[2]} target="_blank" rel="noopener noreferrer" className="text-brand-cyan hover:underline">
                {m[1]}
              </a>
            );
          }
          return <span key={`btext-${j}-${k}`}>{lPart}</span>;
        })}
      </strong>;
    }
    
    // Also parse markdown links outside of bold [text](url)
    const linkParts = bPart.split(/(\[.*?\]\(.*?\))/g);
    return linkParts.map((lPart, k) => {
      const m = lPart.match(/^\[(.*?)\]\((.*?)\)$/);
      if (m) {
        return (
          <a
            key={`link-${j}-${k}`}
            href={m[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-cyan hover:underline"
          >
            {m[1]}
          </a>
        );
      }
      return <span key={`text-${j}-${k}`}>{lPart}</span>;
    });
  });
}

const ConciergeSection = () => {
  const {
    messages,
    streaming,
    restoring,
    conversationId,
    error,
    send,
    stop,
    reset,
    retry,
    submitFeedback,
  } = useConcierge();
  const [input, setInput] = useState('');
  const [showLeadFor, setShowLeadFor] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const spokenMessagesRef = useRef(new Set());
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const hasUserMessages = messages.some((m) => m.role === 'user');

  const voice = useVoiceInput({
    onFinal: (text) => {
      setInput((prev) => (prev ? `${prev} ${text}`.trim() : text));
      inputRef.current?.focus();
    },
  });

  const copyMessage = async (msg) => {
    try {
      const plain = (msg.content || '').replace(/\[CHUNK:[A-Za-z0-9_\-#]+\]/g, '').trim();
      await navigator.clipboard.writeText(plain);
      setCopiedId(msg.id);
      setTimeout(() => setCopiedId((id) => (id === msg.id ? null : id)), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  // Voice Output Logic
  useEffect(() => {
    if (!isVoiceEnabled || !messages.length) return;
    
    // Find the latest assistant message that is completely done streaming
    const latestAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant' && m.done);
    
    if (latestAssistantMsg && !spokenMessagesRef.current.has(latestAssistantMsg.id)) {
      spokenMessagesRef.current.add(latestAssistantMsg.id);
      
      const cleanText = cleanTextForSpeech(latestAssistantMsg.content);
      if (cleanText && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // stop any current speech
        const utterance = new SpeechSynthesisUtterance(cleanText);
        
        // Prioritize male voices
        const voices = window.speechSynthesis.getVoices();
        const maleVoice = voices.find(v => 
          v.name.includes('Google UK English Male') || 
          v.name.includes('Google US English') && v.name.includes('Male') || 
          v.name === 'Daniel' || 
          v.name === 'Alex' || 
          v.name === 'David' || 
          v.name === 'Mark' ||
          v.name === 'George'
        );
        if (maleVoice) {
          utterance.voice = maleVoice;
        }
        
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [messages, isVoiceEnabled]);

  const submit = (e) => {
    e?.preventDefault?.();
    const text = input.trim();
    if (!text || streaming) return;
    setInput('');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cut off voice when user asks new question
    }
    send(text);
  };

  const onChip = (text) => {
    if (streaming) return;
    if (text === "Schedule Your Consultation") {
      const widget = document.getElementById('scheduling-widget');
      if (widget) {
        widget.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }
    if (text === "Contact Us...") {
      window.location.href = '/contact';
      return;
    }
    send(text);
  };

  return (
    <section
      id="eqore-ai-concierge"
      className="relative w-full bg-white dark:bg-black py-24 sm:py-32 overflow-hidden"
      aria-labelledby="eqore-ai-heading"
    >
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-gray-400 dark:bg-gray-600"></div>
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            eQORE AI<sup className="text-[10px] ml-0.5 opacity-70">™</sup> Assistant
            </span>
          </div>
          <h2
            id="eqore-ai-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight max-w-5xl"
          >
            From Business Questions to Solution Direction — Ask <span className="bg-brand-gradient bg-clip-text text-transparent">eQORE AI</span><sup className="bg-brand-gradient bg-clip-text text-transparent text-[0.45em] ml-0.5">™</sup>
          </h2>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
            eQORE helps leaders identify relevant Kangqore capabilities, understand possible solution paths, and connect with the right team for deeper consultation.
          </p>
        </div>

        <div className="group relative rounded-2xl overflow-hidden border border-white/[0.05] w-full shadow-2xl hover:shadow-[0_20px_40px_rgba(37,100,234,0.15)] transition-all duration-500 hover:-translate-y-1 bg-[#11131a]">
          {/* Sleek "Glossy Black" Background */}
          <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl pointer-events-none" style={{ background: 'linear-gradient(145deg, #181a20 0%, #000000 100%)' }}>
            {/* Sharp diagonal gloss reflection */}
            <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(125deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.01) 30%, rgba(255,255,255,0) 50%)' }} />
            
            {/* Soft inner glow from the top edge */}
            <div className="absolute inset-x-0 top-0 h-[100px] z-[2]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)' }} />
            
            {/* Subtle bottom edge reflection */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 z-[1]" style={{ background: 'linear-gradient(0deg, rgba(255,255,255,0.02) 0%, transparent 100%)' }} />
          </div>

          <div className="relative z-10 px-6 sm:px-8 py-5 border-b border-white/5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                <img src="/images/eqore-avatar.png" alt="eQORE" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-white tracking-tight">
                  eQORE
                </p>
                <p className="text-[10px] uppercase tracking-widest font-bold text-brand-cyan mt-0.5">
                  {streaming ? 'Syncing...' : 'System Active'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/eqore-ai"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white/60 hover:text-white px-3 py-2 rounded-xl bg-white/10 border border-white/10 transition-all"
                title="Launch Standalone Full-Screen Console"
              >
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" /> Launch Console
              </Link>
              <button
                type="button"
                onClick={() => {
                  const newState = !isVoiceEnabled;
                  setIsVoiceEnabled(newState);
                  if (!newState && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                }}
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition-all ${
                  isVoiceEnabled 
                    ? 'bg-cyan-400/20 text-cyan-400 border-cyan-400/30' 
                    : 'bg-white/10 text-white/60 hover:text-white border-white/10'
                }`}
                title={isVoiceEnabled ? 'Disable Voice Output' : 'Enable Voice Output'}
              >
                {isVoiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">Voice</span>
              </button>
              {hasUserMessages && (
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white/60 hover:text-white px-3 py-2 rounded-xl bg-white/10 border border-white/10 transition-all"
                  title="Start a new conversation"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5" /> New Session
                </button>
              )}
            </div>
          </div>

          <div 
            ref={chatContainerRef}
            className="relative z-10 px-6 sm:px-8 py-8 max-h-[520px] overflow-y-auto custom-scrollbar bg-transparent scroll-smooth"
          >
            {restoring && (
              <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-2">
                <RefreshCw className="w-3 h-3 animate-spin" /> Restoring previous conversation
              </div>
            )}
            <div className="space-y-5">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                const showHandoffOffer =
                  !isUser &&
                  msg.done &&
                  looksLikeHandoff(msg.content) &&
                  showLeadFor !== msg.id &&
                  msg.id !== 'greeting';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`flex items-start gap-3 max-w-[90%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 overflow-hidden ${
                          isUser
                            ? ''
                            : 'bg-slate-800'
                        }`}
                        style={isUser ? {
                          background: 'linear-gradient(135deg, #2564ea 0%, #4ab6d4 100%)',
                          boxShadow: '0 0 12px rgba(37,100,234,0.3)',
                        } : {}}
                      >
                        {isUser ? (
                          <span className="text-[11px] font-bold text-white tracking-wide select-none">You</span>
                        ) : (
                          <img src="/images/eqore-avatar.png" alt="eQORE" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div
                        className={`px-5 py-4 rounded-3xl text-[15px] leading-relaxed whitespace-pre-wrap transition-all shadow-sm ${
                          isUser
                            ? 'bg-brand-blue text-white rounded-br-sm'
                            : msg.id === 'greeting'
                            ? 'bg-[#1c202a]/80 backdrop-blur-md font-semibold rounded-bl-sm border border-white/10'
                            : 'bg-[#1c202a]/80 backdrop-blur-md text-gray-100 rounded-bl-sm border border-white/10'
                        }`}
                      >
                        {msg.id === 'greeting' ? (
                          <span className="bg-brand-gradient bg-clip-text text-transparent">
                            {msg.content}
                          </span>
                        ) : (
                          renderFormattedText(msg.content)
                        )}
                        {!msg.done && msg.role === 'assistant' && (
                          <span className="inline-block w-1.5 h-4 ml-0.5 align-middle bg-brand-cyan animate-pulse rounded-sm" />
                        )}
                      </div>
                    </div>

                    {!isUser && msg.done && msg.citations && msg.citations.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 ml-10">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">
                          Sources:{' '}
                          <a 
                            href="https://kangqore.com" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-brand-cyan hover:underline lowercase tracking-normal"
                          >
                            kangqore.com
                          </a>
                        </span>
                        {msg.citations.map((cid) => (
                          <CitationBadge key={cid} chunkId={cid} />
                        ))}
                      </div>
                    )}

                    {!isUser && msg.done && msg.id !== 'greeting' && (
                      <div className="flex items-center gap-1 ml-10 mt-0.5 opacity-60 hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => copyMessage(msg)}
                          className="inline-flex items-center gap-1 text-[10px] text-white/50 hover:text-white px-1.5 py-0.5 rounded transition-colors"
                          title="Copy"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-brand-cyan" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => retry(msg.id)}
                          disabled={streaming}
                          className="inline-flex items-center gap-1 text-[10px] text-white/50 hover:text-white disabled:opacity-50 px-1.5 py-0.5 rounded transition-colors"
                          title="Retry this answer"
                        >
                          <RotateCcw className="w-3 h-3" /> Retry
                        </button>
                        <button
                          type="button"
                          onClick={() => submitFeedback(msg.id, 'up')}
                          disabled={!conversationId || msg.feedback === 'up'}
                          className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded transition-colors ${
                            msg.feedback === 'up'
                              ? 'text-brand-cyan'
                              : 'text-white/50 hover:text-white'
                          } disabled:opacity-50`}
                          title="Helpful"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => submitFeedback(msg.id, 'down')}
                          disabled={!conversationId || msg.feedback === 'down'}
                          className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded transition-colors ${
                            msg.feedback === 'down'
                              ? 'text-rose-400'
                              : 'text-white/50 hover:text-white'
                          } disabled:opacity-50`}
                          title="Not helpful"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {!isUser && msg.done && msg.followups && msg.followups.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 ml-10 mt-1">
                        {msg.followups.map((q, i) => (
                          <SuggestedPromptChip
                            key={`${msg.id}-fu-${i}`}
                            prompt={q}
                            onSelect={onChip}
                            disabled={streaming}
                          />
                        ))}
                      </div>
                    )}

                    {!isUser && msg.leadCaptured && (
                      <div className="ml-10 w-full max-w-md rounded-xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/5 p-4 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                          <Check className="w-4 h-4" />
                        </div>
                        <div className="text-xs">
                          <p className="font-semibold text-emerald-700 dark:text-emerald-300">
                            Got it — a Kangqore consultant will reach out to {msg.leadCaptured.email} within one business day.
                          </p>
                        </div>
                      </div>
                    )}

                    {showHandoffOffer && !msg.leadCaptured && (
                      <div className="ml-11 mt-1">
                        <button
                          type="button"
                          onClick={() => setShowLeadFor(msg.id)}
                          className="text-xs font-bold text-white hover:text-gray-200 hover:underline flex items-center gap-1.5 transition-colors"
                        >
                          <span>&rarr;</span> Talk to a Kangqore consultant
                        </button>
                      </div>
                    )}

                    {!isUser && showLeadFor === msg.id && !msg.leadCaptured && (
                      <div className="ml-10 w-full max-w-md">
                        <LeadCaptureInline
                          conversationId={conversationId}
                          defaultIntent={
                            messages.filter((m) => m.role === 'user').slice(-1)[0]?.content
                          }
                          onSubmitted={() => {}}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="relative z-10 px-6 sm:px-8 py-6 border-t border-white/5 bg-transparent">
            {!hasUserMessages && (
              <div className="mb-6 -mx-1 flex flex-wrap gap-2">
                {[
                  "What is Kangqore?",
                  "Services/Capabilities",
                  "What are your departments?",
                  "Which industries do you serve?",
                  "Why choose Kangqore?",
                  "What services does Kangqore offer?",
                  "Who is the founder and CEO of the company?",
                  "who is eQORE in Kangqore?",
                  "Tell me about your success stories.",
                  "How does your GCC model work?",
                  "What is your approach to Agentic AI?",
                  "How do you ensure data security?",
                  "Schedule Your Consultation",
                  "Contact Us...",
                ].map((p) => (
                  <SuggestedPromptChip
                    key={p}
                    prompt={p}
                    onSelect={onChip}
                    disabled={streaming}
                  />
                ))}
              </div>
            )}

            <form onSubmit={submit} className="relative">
              <input
                ref={inputRef}
                type="text"
                value={voice.listening && voice.interim ? `${input} ${voice.interim}`.trim() : input}
                onChange={(e) => setInput(e.target.value)}
                disabled={streaming}
                placeholder={voice.listening ? 'System Listening…' : 'Engineer a query…'}
                className="w-full pl-6 pr-28 py-[18px] rounded-full text-[15px] bg-[#1c202a]/80 backdrop-blur-md border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/20 disabled:opacity-60 transition-all shadow-lg"
              />
              {voice.supported && (
                <button
                  type="button"
                  onClick={voice.toggle}
                  disabled={streaming}
                  className={`absolute right-[52px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    voice.listening
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-[#f8fafc] hover:bg-white dark:bg-gray-900 dark:border-gray-800 text-slate-700 dark:text-gray-300'
                  } disabled:opacity-40 disabled:cursor-not-allowed shadow-sm`}
                  aria-label={voice.listening ? 'Stop voice input' : 'Start voice input'}
                  title={voice.listening ? 'Stop' : 'Voice input'}
                >
                  {voice.listening ? (
                    <MicOff className="w-[18px] h-[18px]" />
                  ) : (
                    <Mic className="w-[18px] h-[18px]" />
                  )}
                </button>
              )}
              {streaming ? (
                <button
                  type="button"
                  onClick={stop}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-700 text-white flex items-center justify-center hover:bg-slate-600 transition-all shadow-sm"
                  aria-label="Stop generating"
                  title="Stop"
                >
                  <Square className="w-4 h-4 fill-current" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1e3a5f] hover:bg-brand-blue text-[#60a5fa] hover:text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                  aria-label="Send"
                >
                  <Send className="w-[18px] h-[18px] ml-0.5" />
                </button>
              )}
            </form>

            {error && (
              <p className="mt-2 text-xs text-red-500 dark:text-red-400">{error}</p>
            )}

            <p className="mt-3 text-[11px] text-slate-400 dark:text-slate-500 text-center">
              eQORE provides guidance based on Kangqore’s service knowledge. Final scope, pricing, and commitments are confirmed by our consultants.
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Background Styles */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 15s infinite alternate;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default ConciergeSection;
