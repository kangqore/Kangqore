import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Info, ChevronRight, RefreshCw, Check, Volume2, VolumeX, Mic, MicOff, ExternalLink, Square, Copy, Maximize2, Minimize2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useConcierge, getSuggestedPrompts, stripSystemMetadata } from '../hooks/useConcierge';
import { parseSchedulingRequest } from '../hooks/nlpSchedulingParser';
import CitationBadge from './concierge/CitationBadge';
import LeadCaptureInline from './concierge/LeadCaptureInline';
import InlineSchedulingCard from './concierge/InlineSchedulingCard';
import SlotPicker from './concierge/SlotPicker';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import TextareaAutosize from 'react-textarea-autosize';

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
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [proactiveGreeting, setProactiveGreeting] = useState(null);
  const [isSlideIn, setIsSlideIn] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const [isHovered, setIsHovered] = useState(false);
  const idleTimerRef = useRef(null);
  const location = useLocation();

  if (location.pathname.startsWith('/kangqore-view')) return null;

  // Staged animation logic
  useEffect(() => {
    if (isOpen) {
      setIsSlideIn(true);
      const timer = setTimeout(() => {
        setIsExpanded(true);
      }, 1000); // Wait for slide in to finish (1 second)
      return () => clearTimeout(timer);
    } else {
      setIsExpanded(false);
      const timer = setTimeout(() => {
        setIsSlideIn(false);
      }, 1000); // Wait for collapse to finish (1 second)
      return () => clearTimeout(timer);
    }
  }, [isOpen]);



  const [showLeadFor, setShowLeadFor] = useState(null);
  const [seedContext, setSeedContext] = useState(null);
  const [schedulingIntents, setSchedulingIntents] = useState({}); // msgId → parsedIntent

  const [isListening, setIsListening] = useState(false);
  const [isIdle, setIsIdle] = useState(false);

  const recognitionRef = useRef(null);
  const spokenMessagesRef = useRef(new Set());
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const { messages, streaming, conversationId, error, send, reset, stop } = useConcierge({ seedContext });
  const hasUserMessages = messages.some((m) => m.role === 'user');

  // Idle Timer Logic
  useEffect(() => {
    if (!isExpanded) {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      setIsIdle(true);
      return;
    }

    const isTyping = inputText.trim().length > 0;
    const isBusy = streaming || isListening;
    
    if (isHovered || isTyping || isBusy) {
      setIsIdle(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    } else {
      setIsIdle(true);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      // Auto-closing removed to prevent chatbot from fading away while reading
      // idleTimerRef.current = setTimeout(() => {
      //   setIsOpen(false);
      // }, 5000);
    }

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [isExpanded, isHovered, inputText, streaming, isListening]);

  // Keyboard Shortcut: Esc to close
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

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
      // Show results in the input field for live feedback
      setInputText(finalTranscript || interimTranscript);

      // Do NOT auto-send. Just stop listening and let user review.
      if (finalTranscript.trim()) {
        setIsListening(false);
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

  // Auto-Popout & Scroll Detection Logic
  const [isInHero, setIsInHero] = useState(true);
  const [cookieAccepted, setCookieAccepted] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('cookieConsent');
    }
    return false;
  });

  useEffect(() => {
    const handleCookieAccepted = () => {
      setCookieAccepted(true);
    };
    window.addEventListener('cookies-accepted', handleCookieAccepted);
    return () => window.removeEventListener('cookies-accepted', handleCookieAccepted);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const inHero = window.location.pathname === '/' && window.scrollY < window.innerHeight * 0.6;
      setIsInHero(inHero);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/kangqore-view')) {
      return;
    }
    
    if (!cookieAccepted) return;
    
    // Initial popup at 5 seconds after cookie consent is accepted (only if not in hero)
    const initialTimer = setTimeout(() => {
      if (!isInHero) setIsOpen(true);
    }, 5000); 
    
    // Recurring popup every 3 minutes (only if not in hero)
    const intervalTimer = setInterval(() => {
      if (!isInHero) setIsOpen(true);
    }, 180000); // Increased from 60s to 3 minutes
    
    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [cookieAccepted, isInHero]);

  // Unread Badge Logic
  const [hasUnread, setHasUnread] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
    } else if (messages.length > 1) {
      const last = messages[messages.length - 1];
      if (last.role === 'assistant' && last.done && !isExpanded) {
        setHasUnread(true);
      }
    }
  }, [isOpen, messages, isExpanded]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('eqore-unread-status', { detail: { hasUnread } }));
    }
  }, [hasUnread]);

  // Auto-close when user scrolls back into hero
  useEffect(() => {
    if (isInHero && isOpen && !hasUserMessages) {
      setIsOpen(false);
    }
  }, [isInHero, isOpen, hasUserMessages]);

  // Auto-Dismissal Logic
  useEffect(() => {
    if (isOpen && !hasUserMessages && !isInHero && !isHovered) {
      const dismissTime = 5000;
      const autoDismiss = setTimeout(() => {
        setIsOpen(false);
      }, dismissTime);
      return () => clearTimeout(autoDismiss);
    }
  }, [isOpen, isInHero, hasUserMessages, isHovered]);

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

  // Draggability Logic
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    // Only allow drag on header, but prevent if clicking buttons
    if (e.target.closest('button') || e.target.closest('a')) return;
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStartPos.current.x,
      y: e.clientY - dragStartPos.current.y
    });
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div 
      className={`fixed ${isInHero ? 'bottom-[152px]' : 'bottom-[172px]'} right-8 z-[10001] transition-opacity duration-1000 ${isSlideIn ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      style={{
        transform: `translate(calc(${isSlideIn ? '0%' : '120%'} + ${position.x}px), ${position.y}px)`,
        transition: isDragging ? 'none' : 'opacity 1s, transform 1s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative bg-[#0a0a0c]/95 backdrop-blur-xl rounded-2xl ${isExpanded ? (isMaximized ? 'w-[80vw] sm:w-[75vw] lg:w-[760px] h-[80vh]' : 'w-[300px] sm:w-[350px] lg:w-[400px] h-[500px]') : 'w-[300px] sm:w-[350px] lg:w-[400px] h-[116px]'} border border-white/10 overflow-hidden flex flex-col max-h-[85vh] transition-all duration-1000 shadow-2xl`}
      >

        {/* Header */}
        <div 
          className="bg-[#111115] border-b border-white/5 py-2 px-4 flex items-center justify-between text-white relative overflow-hidden cursor-move touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
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
              <p className="text-[6px] text-cyan-400/80 uppercase tracking-widest font-semibold">
                {streaming ? 'Thinking…' : 'AI Assistant'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 relative z-10">
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
            <Link
              to="/eqore-ai"
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white cursor-pointer"
              title="Launch eQORE AI Full-Screen Console"
            >
              <Maximize2 className="w-4 h-4 text-white/80" />
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4 text-white/80" />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div 
          ref={chatContainerRef}
          className={`overflow-y-auto bg-transparent custom-scrollbar scroll-smooth transition-all duration-1000 ${isExpanded ? 'flex-1 p-4 space-y-5 opacity-100 max-h-[1000px]' : 'flex-none p-0 space-y-0 opacity-0 max-h-0'}`}
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
                      ? 'bg-[linear-gradient(90deg,#2564ea_0%,#4ab6d4_100%)] text-white rounded-2xl rounded-br-sm font-medium'
                      : 'bg-[#1a1a1e] border border-white/5 text-slate-200 rounded-2xl rounded-bl-sm'
                  }`}>
                    {!isUser && !msg.done && msg.content === '' ? (
                      <div className="flex items-center gap-1.5 h-4 px-1">
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    ) : (
                      <>
                        <div className="text-sm leading-relaxed overflow-hidden">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              a: ({node, ...props}) => <a className="text-brand-cyan hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                              strong: ({node, ...props}) => <strong className="text-white font-bold" {...props} />,
                              p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                              ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                              ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
                              li: ({node, ...props}) => <li className="" {...props} />,
                              code: ({node, inline, className, children, ...props}) => {
                                return !inline ? (
                                  <pre className="bg-[#050505] p-3 rounded-lg border border-white/10 text-xs overflow-x-auto mb-2 mt-2 font-mono text-slate-300">
                                    <code className={className} {...props}>{children}</code>
                                  </pre>
                                ) : (
                                  <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono text-cyan-200" {...props}>{children}</code>
                                )
                              }
                            }}
                          >
                            {stripSystemMetadata(msg.content || '').replace(/\s*\[CHUNK:[A-Za-z0-9_\-#]+\]/g, '')}
                          </ReactMarkdown>
                        </div>
                        {!msg.done && msg.role === 'assistant' && (
                          <span className="inline-block w-1.5 h-4 ml-0.5 align-middle bg-cyan-400 animate-pulse rounded-sm" />
                        )}
                        {/* Copy Button */}
                        {msg.done && msg.role === 'assistant' && (
                          <div className="flex justify-end mt-2">
                            <button
                              onClick={() => navigator.clipboard.writeText(msg.content)}
                              className="text-slate-500 hover:text-white p-1 rounded transition-colors flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider"
                              title="Copy to clipboard"
                            >
                              <Copy className="w-3 h-3" /> Copy
                            </button>
                          </div>
                        )}
                      </>
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
            <TextareaAutosize
              minRows={1}
              maxRows={5}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              disabled={streaming || isListening}
              placeholder={isListening ? 'Listening...' : 'Query the intelligence core...'}
              className={`w-full pl-4 pr-24 py-2 bg-[#050505] border rounded-xl focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 outline-none text-sm text-white placeholder-slate-500 transition-all shadow-inner disabled:opacity-60 resize-none leading-relaxed ${
                isListening ? 'border-red-500/60 ring-1 ring-red-500/30' : 'border-white/10'
              }`}
            />
            <div className="absolute right-2 bottom-1 flex items-center gap-1">
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
              {/* Stop / Send Button */}
              {streaming ? (
                <button
                  type="button"
                  onClick={stop}
                  className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all flex items-center justify-center"
                  title="Stop generating"
                >
                  <Square className="w-4 h-4 fill-current" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/80 disabled:opacity-30 disabled:bg-white/10 disabled:text-white/30 transition-all flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EQoreChatbot;
