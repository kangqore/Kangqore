import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Info, ChevronRight, RefreshCw, Check, Volume2, VolumeX, Mic, MicOff, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useConcierge, getSuggestedPrompts } from '../hooks/useConcierge';
import { parseSchedulingRequest } from '../hooks/nlpSchedulingParser';
import CitationBadge from './concierge/CitationBadge';
import LeadCaptureInline from './concierge/LeadCaptureInline';
import InlineSchedulingCard from './concierge/InlineSchedulingCard';
import SlotPicker from './concierge/SlotPicker';

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

// ─── Scheduling intent detection ────────────────────────────────────────────
const SCHEDULING_KEYWORDS = /\b(book|schedule|consultation|appointment|meeting|call|slot|reschedule|available|availability|tomorrow|next\s+week|next\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)|this\s+week|morning|afternoon|evening|after\s+lunch|before\s+\d)\b/i;

function looksLikeSchedulingRequest(text) {
  if (!text) return false;
  return SCHEDULING_KEYWORDS.test(text);
}

function renderFormattedText(text) {
  if (!text) return text;
  
  // Strip out citations and any preceding whitespace to fix punctuation spacing
  const cleanText = text.replace(/\s*\[CHUNK:[A-Za-z0-9_\-#]+\]/g, '');
  
  // Handle bold syntax
  const boldParts = cleanText.split(/(\*\*.*?\*\*)/g);
  return boldParts.flatMap((bPart, j) => {
    if (bPart.startsWith('**') && bPart.endsWith('**')) {
      const boldInner = bPart.slice(2, -2);
      // Check if the bold text itself contains a link
      const boldLinkParts = boldInner.split(/(\[.*?\]\(.*?\))/g);
      return <strong key={`bold-${j}`} className="text-white font-bold">
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

function getProactiveGreeting(page) {
  if (!page) return null;
  if (/\/services\/bids|\/bids/i.test(page))       return "I see you're exploring BIDS™ — what industry are you in? I can show you the edition built for it.";
  if (/\/services/i.test(page))                     return "You've been looking at our services — want me to help narrow down what fits your situation?";
  if (/\/pricing/i.test(page))                      return "Exploring pricing? I can walk you through the model or give you a rough estimate based on your needs.";
  if (/\/about|\/company/i.test(page))              return "Learning about Kangqore? Happy to answer any questions about who we are or how we work.";
  if (/\/careers/i.test(page))                      return "Interested in joining Kangqore? I can tell you about open roles or what it's like to work here.";
  if (/\/contact/i.test(page))                      return "Ready to connect? I can help you book a consultation or route you to the right team.";
  if (/\/case-studies|\/portfolio/i.test(page))     return "Browsing our work? Ask me about any case study or the results we've driven for clients like yours.";
  return "You've been here a while — can I help with anything? I know everything about Kangqore.";
}

const EQoreChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [showLeadFor, setShowLeadFor] = useState(null);
  const [seedContext, setSeedContext] = useState(null);
  const [schedulingIntents, setSchedulingIntents] = useState({}); // msgId → parsedIntent
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);
  const spokenMessagesRef = useRef(new Set());
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const { messages, streaming, conversationId, error, send, reset } = useConcierge({ seedContext });

  // ─── Voice Input (Web Speech API) ──────────────────────────────────
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return; // Browser doesn't support it

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      // Show interim results in the input field for live feedback
      setInputText(finalTranscript || interimTranscript);

      // Auto-send on final result
      if (finalTranscript.trim()) {
        setIsListening(false);
        // Small delay so user sees the final text before it sends
        setTimeout(() => {
          send(finalTranscript.trim());
          setInputText('');
        }, 300);
      }
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.abort();
      setIsListening(false);
    } else {
      setInputText('');
      // Abort any lingering session before starting fresh
      try { recognitionRef.current.abort(); } catch (_) { /* noop */ }
      try {
        recognitionRef.current.start();
        setIsListening(true);
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      } catch (err) {
        console.warn('SpeechRecognition.start() failed:', err.message);
        setIsListening(false);
      }
    }
  };

  // Floating prompts (3) — derived from seed when present, otherwise default top 3.
  const floatingPrompts = getSuggestedPrompts(seedContext).slice(0, 3);

  useEffect(() => {
    const handleToggle = (event) => {
      const detail = event?.detail;
      if (detail && detail.proactive) {
        const greeting = getProactiveGreeting(detail.page);
        if (greeting) setProactiveGreeting(greeting);
        setIsOpen(true);
        return;
      }
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
    if (typeof window !== 'undefined' && window.location.search.includes('openChat=true')) {
      setIsOpen(true);
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('openChat');
        window.history.replaceState({}, '', url.pathname + url.search + url.hash);
      } catch (e) {
        console.warn('Failed to clean openChat param', e);
      }
    }
  }, []);

  // Auto-Popout Logic (Aggressive Proactive Mode)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/kangqore-view')) {
      return;
    }
    
    // Initial popup at 5 seconds
    const initialTimer = setTimeout(() => {
      setIsOpen(true);
    }, 5000); 
    
    // Recurring popup every 45 seconds
    const intervalTimer = setInterval(() => {
      setIsOpen(true);
    }, 45000);
    
    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);

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

  const handleSend = (e, textOverride = null) => {
    if (e) e.preventDefault();
    const text = (textOverride || inputText).trim();
    if (!text || streaming) return;
    setInputText('');
    setProactiveGreeting(null);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cut off voice when user asks new question
    }

    // Check for scheduling intent before sending
    if (looksLikeSchedulingRequest(text)) {
      const parsed = parseSchedulingRequest(text);
      // We'll associate this with the next assistant message
      // using a temp key that we resolve after send
      const tempKey = `pending-${Date.now()}`;
      setSchedulingIntents(prev => ({ ...prev, [tempKey]: parsed }));
    }

    send(text);
  };

  const formatTime = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(date);
  };

  if (!isOpen) return null;

  const hasUserMessages = messages.some((m) => m.role === 'user');

  return (
    <div className="fixed bottom-[152px] right-8 z-[10001]">
      <div className={`absolute bottom-0 right-0 bg-[#0a0a0c]/95 backdrop-blur-xl rounded-2xl shadow-2xl ${isMaximized ? 'w-[80vw] sm:w-[75vw] lg:w-[760px] h-[80vh]' : 'w-[300px] sm:w-[350px] lg:w-[400px] h-[520px]'} border border-white/10 overflow-hidden flex flex-col max-h-[85vh] animate-fade-in-up origin-bottom-right transition-all duration-500`}>

        {/* Header */}
        <div className="bg-[#111115] border-b border-white/5 py-2 px-4 flex items-center justify-between text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-cyan/5 blur-xl pointer-events-none"></div>
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="flex items-center gap-2 group relative z-20">
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-3.5 h-3.5 rounded-full bg-pink-500 hover:bg-pink-400 transition-colors shadow-sm flex items-center justify-center relative cursor-pointer" 
                title="Close"
              >
                <X className="w-2 h-2 text-black/80 opacity-80 hover:opacity-100 transition-opacity absolute pointer-events-none font-bold" strokeWidth={3.5} />
              </button>
              <button 
                onClick={() => setIsMaximized(false)} 
                className="w-3.5 h-3.5 rounded-full bg-purple-500 hover:bg-purple-400 transition-colors shadow-sm flex items-center justify-center relative cursor-pointer" 
                title="Minimize"
              >
                <div className="w-1.5 h-0.5 bg-black/80 opacity-85 hover:opacity-100 transition-opacity absolute rounded-full pointer-events-none font-bold" />
              </button>
              <button 
                onClick={() => setIsMaximized(true)} 
                className="w-3.5 h-3.5 rounded-full bg-blue-500 hover:bg-blue-400 transition-colors shadow-sm flex items-center justify-center relative cursor-pointer" 
                title="Maximize"
              >
                <div className="w-1.5 h-1.5 border border-black/80 opacity-85 hover:opacity-100 transition-opacity absolute rounded-[1px] pointer-events-none font-bold" strokeWidth={3.5} />
              </button>
            </div>

            <div className="flex items-center gap-3">
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
          </div>
          <div className="flex items-center gap-1 relative z-10">
            <Link to="/eqore-ai" className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white" title="Launch Standalone Full-Screen Console">
              <ExternalLink className="w-4 h-4 text-cyan-400 animate-[pulse_2s_infinite]" />
            </Link>
            <button
              onClick={() => {
                const newState = !isVoiceEnabled;
                setIsVoiceEnabled(newState);
                if (!newState && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
              }}
              className={`p-2 rounded-lg transition-colors ${isVoiceEnabled ? 'bg-cyan-400/20 text-cyan-400' : 'hover:bg-white/10 text-slate-400 hover:text-white'}`}
              title={isVoiceEnabled ? 'Disable Voice Output' : 'Enable Voice Output'}
            >
              {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            {hasUserMessages && (
              <button
                onClick={() => { reset(); setProactiveGreeting(null); }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                title="Start a new conversation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
            <Link to="/eqore" className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white" title="About eQORE">
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
                      ? 'bg-brand-blue text-white rounded-2xl rounded-br-sm font-medium'
                      : 'bg-[#1a1a1e] border border-white/5 text-slate-200 rounded-2xl rounded-bl-sm'
                  }`}>
                    {renderFormattedText(msg.content)}
                    {!msg.done && msg.role === 'assistant' && (
                      <span className="inline-block w-1.5 h-4 ml-0.5 align-middle bg-cyan-400 animate-pulse rounded-sm" />
                    )}
                  </div>
                </div>

                {!isUser && msg.done && msg.citations && msg.citations.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 ml-8 mt-1">
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

                {!isUser && msg.leadCaptured && (
                  <div className="ml-8 mt-1 max-w-xs rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2.5 flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-emerald-200 leading-snug">
                      Got it — a Kangqore consultant will reach out to {msg.leadCaptured.email} within one business day.
                    </p>
                  </div>
                )}

                {showHandoffOffer && !msg.leadCaptured && (
                  <div className="ml-9 mt-1">
                    <button
                      type="button"
                      onClick={() => setShowLeadFor(msg.id)}
                      className="text-[11px] font-bold text-white hover:text-gray-200 hover:underline flex items-center gap-1.5 transition-colors"
                    >
                      <span>&rarr;</span> Talk to a Kangqore consultant
                    </button>
                  </div>
                )}

                {/* Inline Scheduling Card — rendered after assistant messages when preceding user message had scheduling intent */}
                {!isUser && msg.done && msg.id !== 'greeting' && (() => {
                  // Find the user message immediately before this assistant message
                  const msgIndex = messages.indexOf(msg);
                  const precedingUser = msgIndex > 0 ? messages[msgIndex - 1] : null;
                  if (precedingUser?.role === 'user' && looksLikeSchedulingRequest(precedingUser.content)) {
                    const parsed = parseSchedulingRequest(precedingUser.content);
                    return (
                      <div className="ml-8 mt-2">
                        <InlineSchedulingCard parsedIntent={parsed} />
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Real Slot Picker (Phase 4) */}
                {!isUser && msg.done && msg.schedulingSlots && msg.schedulingSlots.length > 0 && (
                  <div className="ml-8 mt-2">
                    <SlotPicker 
                      leadId={msg.leadId} 
                      slots={msg.schedulingSlots} 
                      onBooked={(booking) => {
                        console.log('Booking confirmed:', booking);
                      }}
                    />
                  </div>
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
                    className="text-left text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white py-2 px-3 rounded-lg flex items-center justify-between group transition-all"
                  >
                    {prompt}
                    <ChevronRight className="w-3 h-3 text-cyan-400 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
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
        <form onSubmit={handleSend} className="py-2 px-4 bg-[#111115] border-t border-white/5">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={streaming || isListening}
              placeholder={isListening ? 'Listening...' : 'Query the intelligence core...'}
              className={`w-full pl-4 pr-24 py-2 bg-[#050505] border rounded-xl focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 outline-none text-sm text-white placeholder-slate-500 transition-all shadow-inner disabled:opacity-60 ${
                isListening ? 'border-red-500/60 ring-1 ring-red-500/30' : 'border-white/10'
              }`}
            />
            <div className="absolute right-2 flex items-center gap-1">
              {/* Mic Button */}
              {(window.SpeechRecognition || window.webkitSpeechRecognition) && (
                <button
                  type="button"
                  onClick={toggleListening}
                  disabled={streaming}
                  className={`p-2 rounded-lg transition-all flex items-center justify-center ${
                    isListening
                      ? 'bg-red-500/20 text-red-400 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                      : 'hover:bg-white/10 text-slate-400 hover:text-cyan-400'
                  } disabled:opacity-30`}
                  title={isListening ? 'Stop listening' : 'Voice input'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}
              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim() || streaming}
                className="p-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/80 disabled:opacity-30 disabled:bg-white/10 disabled:text-white/30 transition-all flex items-center justify-center"
              >
                {streaming ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EQoreChatbot;
