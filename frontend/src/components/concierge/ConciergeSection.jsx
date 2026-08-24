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
  Cpu,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useConcierge } from '../../hooks/useConcierge';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import CitationBadge from './CitationBadge';
import SuggestedPromptChip from './SuggestedPromptChip';
import LeadCaptureInline from './LeadCaptureInline';
import ResponsiveImage from '../media/ResponsiveImage';

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

function parseInlineMarkdown(text) {
  if (!text) return text;

  let cleaned = text.replace(/\s*\[CHUNK:[A-Za-z0-9_\-#]+\]/g, '');
  const regex = /(\[.*?\]\(.*?\))|(\*\*.*?\*\*)|(\*.*?\*)|(`.*?`)/g;
  const parts = cleaned.split(regex).filter(Boolean);

  return parts.map((part, idx) => {
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <a
          key={idx}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-300 font-semibold hover:underline transition-colors"
        >
          {linkMatch[1]}
        </a>
      );
    }

    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={idx} className="text-white font-semibold">
          {parseInlineMarkdown(part.slice(2, -2))}
        </strong>
      );
    }

    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={idx} className="text-white/90 italic">
          {part.slice(1, -1)}
        </em>
      );
    }

    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code key={idx} className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 font-mono text-sm border border-white/15">
          {part.slice(1, -1)}
        </code>
      );
    }

    return <span key={idx}>{part}</span>;
  });
}

function renderFormattedText(text) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let currentList = [];

  const flushList = (keyPrefix) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`ul-${keyPrefix}`} className="my-2 space-y-1.5 pl-1">
          {currentList.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-white/95 text-[15px] sm:text-[16px]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2.5 shrink-0 shadow-[0_0_6px_rgba(34,211,238,0.6)]" />
              <span className="flex-1">{parseInlineMarkdown(item)}</span>
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      currentList.push(trimmed.slice(2));
      return;
    }

    flushList(index);

    if (!trimmed) {
      elements.push(<div key={`sp-${index}`} className="h-2" />);
      return;
    }

    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${index}`} className="text-[17px] font-bold text-white mt-4 mb-1.5 tracking-tight flex items-center gap-2">
          {parseInlineMarkdown(trimmed.slice(4))}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${index}`} className="text-[19px] font-extrabold text-white mt-5 mb-2 tracking-tight">
          {parseInlineMarkdown(trimmed.slice(3))}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${index}`} className="text-[22px] font-black text-white mt-6 mb-2 tracking-tight">
          {parseInlineMarkdown(trimmed.slice(2))}
        </h1>
      );
      return;
    }

    elements.push(
      <p key={`p-${index}`} className="my-1.5 leading-[1.65] text-white/95 text-[15px] sm:text-[16px]">
        {parseInlineMarkdown(line)}
      </p>
    );
  });

  flushList('end');

  return <div className="space-y-1">{elements}</div>;
}

const DEFAULT_PROMPTS = [
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
  "What is your approach to SAP S/4HANA migration?",
  "Do you have SOC 2 Type II?",
  "Schedule Your Consultation",
  "Contact Us...",
];

const TypewriterSkateText = ({
  text,
  speed = 45,
  pauseDelay = 3500,
  className = '',
  disableLoop = false,
}) => {
  const [displayedLength, setDisplayedLength] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView || !text) {
      setIsTyping(false);
      return;
    }

    let isCancelled = false;
    let charTimer = null;
    let pauseTimer = null;

    const startTyping = () => {
      setDisplayedLength(0);
      setIsTyping(true);
      let index = 0;

      charTimer = setInterval(() => {
        if (isCancelled) return;
        index++;
        setDisplayedLength(index);

        if (index >= text.length) {
          clearInterval(charTimer);
          setIsTyping(false);

          if (!disableLoop) {
            pauseTimer = setTimeout(() => {
              if (!isCancelled) {
                startTyping();
              }
            }, pauseDelay);
          }
        }
      }, speed);
    };

    startTyping();

    return () => {
      isCancelled = true;
      if (charTimer) clearInterval(charTimer);
      if (pauseTimer) clearTimeout(pauseTimer);
    };
  }, [isInView, text, speed, pauseDelay, disableLoop]);

  const visibleText = text.slice(0, displayedLength);

  return (
    <span ref={containerRef} className={`relative inline-wrap font-medium text-white/95 leading-[1.6] ${className}`}>
      <span className="transition-all duration-150 ease-out tracking-[0.01em]">
        {visibleText}
      </span>
      {isTyping && (
        <span 
          className="inline-block w-[2px] h-[1.15em] bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.8)] align-middle ml-1 rounded-full animate-pulse transition-opacity duration-300"
          aria-hidden="true"
        />
      )}
    </span>
  );
};

// `heading` is the lead-in only; the "Ask eQORE AI" mark and its trademark stay
// fixed so the branding cannot be overridden away. Both fall back to the copy
// that shipped on every page, so a service that sets neither is unchanged.
const ConciergeSection = ({
  inverted = false,
  suggestedPrompts,
  heading = 'From Business Questions to Solution Direction',
  intro = 'eQORE helps leaders identify relevant Kangqore capabilities, understand possible solution paths, and connect with the right team for deeper consultation.',
}) => {
  const prompts = suggestedPrompts || DEFAULT_PROMPTS;
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
      className={`relative w-full py-24 sm:py-32 overflow-hidden ${inverted ? 'bg-black' : 'bg-white dark:bg-black'}`}
      aria-labelledby="eqore-ai-heading"
    >
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Apple macOS Ambient Liquid Backdrop Blobs */}
        <div className="absolute -top-24 left-1/4 w-[600px] h-[400px] bg-indigo-950/30 rounded-full blur-[150px] pointer-events-none animate-blob" />
        <div className="absolute top-1/3 -right-24 w-[500px] h-[500px] bg-slate-800/20 rounded-full blur-[150px] pointer-events-none animate-blob animation-delay-2000" />
        <div className="absolute -bottom-24 left-10 w-[500px] h-[400px] bg-blue-950/20 rounded-full blur-[140px] pointer-events-none animate-blob animation-delay-4000" />

        <div className="mb-12 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className={`h-[1px] w-12 ${inverted ? 'bg-white/40' : 'bg-gray-400 dark:bg-gray-600'}`}></div>
            <span className={`text-sm font-semibold uppercase tracking-widest ${inverted ? 'text-white/60' : 'text-gray-500 dark:text-gray-400'}`}>
            eQORE AI<sup className="text-[11px] ml-0.5 opacity-70">™</sup> Assistant
            </span>
          </div>
          <h2
            id="eqore-ai-heading"
            className={`text-[1.8rem] sm:text-[2.4rem] lg:text-[3rem] font-extrabold leading-[1.2] tracking-tight max-w-5xl ${inverted ? 'text-white' : 'text-gray-900 dark:text-white'}`}
          >
            {heading} — Ask <span className="bg-brand-gradient bg-clip-text text-transparent">eQORE AI</span><sup className="bg-brand-gradient bg-clip-text text-transparent text-[0.45em] ml-0.5">™</sup>
          </h2>
          <p className={`mt-6 text-lg leading-relaxed max-w-3xl ${inverted ? 'text-white/70' : 'text-gray-600 dark:text-gray-400'}`}>
            {intro}
          </p>
        </div>

        <div className="group relative rounded-[30px] overflow-hidden w-full transition-all duration-500 hover:-translate-y-0.5 border border-white/[0.14] bg-[#0c0d14]/65 backdrop-blur-[60px] backdrop-saturate-200 shadow-[0_35px_100px_rgba(0,0,0,0.8),inset_0_1px_1px_0_rgba(255,255,255,0.3),inset_0_-1px_1px_0_rgba(0,0,0,0.5)]">
          {/* macOS Tahoe Specular Hairline Rim Beam */}
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none z-20" />

          {/* ───────────── Header Bar ───────────── */}
          <div className="relative z-10 px-6 sm:px-8 pt-6 pb-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl overflow-hidden flex items-center justify-center shrink-0 border border-white/30 bg-slate-900/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_16px_rgba(0,0,0,0.25)]">
                <ResponsiveImage src="/images/eqore-avatar.png" alt="eQORE" loading="lazy" sizes="64px" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[16px] font-black tracking-tight text-white flex items-center gap-2">
                  eQORE
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/60 opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white/75 shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
                  </span>
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60 mt-0.5">
                  {streaming ? 'Synchronizing Intelligence…' : 'Your AI Assistant'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Link
                to="/eqore-ai"
                className="group inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full border border-white/20 hover:border-white/40 bg-white/[0.08] hover:bg-white/[0.18] text-white backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.15)] transition-all duration-300 active:scale-95"
                title="Launch Immersive Full-Screen AI Experience"
              >
                <span>Immersive AI Experience</span>
                <ArrowRight className="w-3.5 h-3.5 -rotate-45 group-hover:rotate-0 transition-transform duration-300 text-white/80 group-hover:text-white" strokeWidth={2.5} />
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
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full border transition-all duration-300 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.2)] active:scale-95 ${
                  isVoiceEnabled
                    ? 'bg-white/[0.22] text-white border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)]'
                    : 'bg-white/[0.08] text-white/90 hover:text-white hover:bg-white/[0.18] border-white/20 hover:border-white/40'
                }`}
                title={isVoiceEnabled ? 'Disable Voice Output' : 'Enable Voice Output'}
              >
                {isVoiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-white" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">Voice</span>
              </button>
              {hasUserMessages && (
                <button
                  type="button"
                  onClick={reset}
                  className="group inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full border border-white/20 hover:border-white/40 bg-white/[0.08] hover:bg-white/[0.18] text-white backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.2)] transition-all duration-300 active:scale-95"
                  title="Start a new conversation"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5 text-white/80 group-hover:text-white" /> New Session
                </button>
              )}
            </div>
          </div>

          {/* ───────────── Message Conversation Area ───────────── */}
          <div 
            ref={chatContainerRef}
            className="relative z-10 px-6 sm:px-8 py-6 max-h-[520px] overflow-y-auto custom-scrollbar bg-transparent scroll-smooth"
          >
            {restoring && (
              <div className="text-[11px] uppercase tracking-[0.2em] font-bold mb-4 flex items-center gap-2 text-cyan-300">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Restoring previous conversation
              </div>
            )}
            <div className="space-y-6">
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
                      className={`flex items-start gap-3 max-w-[90%] sm:max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shrink-0 mt-1 border backdrop-blur-xl ${
                          isUser 
                            ? 'border-white/20 bg-black/60 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]' 
                            : 'border-cyan-400/40 bg-slate-950/90 shadow-[0_0_15px_rgba(34,211,238,0.35)] relative'
                        }`}
                      >
                        {isUser ? (
                          <span className="text-[11px] font-black text-white tracking-wider select-none">YOU</span>
                        ) : (
                          <>
                            <ResponsiveImage src="/images/eqore-avatar.png" alt="eQORE" loading="lazy" sizes="64px" className="w-full h-full object-cover" />
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-cyan-400 rounded-full border-2 border-slate-950 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse" />
                          </>
                        )}
                      </div>
                      <div
                        className={`text-[16px] leading-[1.65] transition-all ${
                          isUser
                            ? 'px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-[linear-gradient(90deg,#2564ea_0%,#4ab6d4_100%)] text-white font-medium shadow-[0_8px_25px_rgba(37,100,234,0.4)] backdrop-blur-2xl border border-white/20'
                            : 'bg-transparent text-white/95 border-0 shadow-none px-0 py-0.5 font-normal'
                        }`}
                      >
                        {msg.id === 'greeting' ? (
                          <TypewriterSkateText text={msg.content} speed={45} pauseDelay={3500} disableLoop={hasUserMessages} />
                        ) : (
                          renderFormattedText(msg.content)
                        )}
                        {!msg.done && msg.role === 'assistant' && (
                          <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-white animate-pulse rounded-sm shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
                        )}
                      </div>
                    </div>

                    {!isUser && msg.done && msg.citations && msg.citations.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 ml-12">
                        <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-white/70">
                          Sources:{' '}
                          <a 
                            href="https://kangqore.com" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-cyan-300 hover:underline lowercase tracking-normal font-semibold"
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
                      <div className="flex items-center gap-1.5 ml-12 mt-0.5 opacity-80 hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => copyMessage(msg)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/15 bg-white/[0.06] hover:bg-white/[0.15] text-white/80 hover:text-white transition-all shadow-sm"
                          title="Copy"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-cyan-300" /> Copied
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
                          className="inline-flex items-center gap-1 text-[11px] font-semibold disabled:opacity-50 px-2.5 py-1 rounded-full border border-white/15 bg-white/[0.06] hover:bg-white/[0.15] text-white/80 hover:text-white transition-all shadow-sm"
                          title="Retry this answer"
                        >
                          <RotateCcw className="w-3 h-3" /> Retry
                        </button>
                        <button
                          type="button"
                          onClick={() => submitFeedback(msg.id, 'up')}
                          disabled={!conversationId || msg.feedback === 'up'}
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all shadow-sm ${
                            msg.feedback === 'up'
                              ? 'border-cyan-400/40 bg-cyan-500/20 text-cyan-200'
                              : 'border-white/15 bg-white/[0.06] hover:bg-white/[0.15] text-white/80 hover:text-white'
                          } disabled:opacity-50`}
                          title="Helpful"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => submitFeedback(msg.id, 'down')}
                          disabled={!conversationId || msg.feedback === 'down'}
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all shadow-sm ${
                            msg.feedback === 'down'
                              ? 'border-rose-400/40 bg-rose-500/20 text-rose-300'
                              : 'border-white/15 bg-white/[0.06] hover:bg-white/[0.15] text-white/80 hover:text-white'
                          } disabled:opacity-50`}
                          title="Not helpful"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {!isUser && msg.done && msg.followups && msg.followups.length > 0 && (
                      <div className="flex flex-wrap gap-2 ml-12 mt-2">
                        {msg.followups.map((q, i) => (
                          <SuggestedPromptChip
                            key={`${msg.id}-fu-${i}`}
                            prompt={q}
                            onSelect={onChip}
                            disabled={streaming}
                            inverted={inverted}
                          />
                        ))}
                      </div>
                    )}

                    {!isUser && msg.leadCaptured && (
                      <div className="ml-12 w-full max-w-md rounded-2xl border border-emerald-400/30 bg-emerald-950/40 backdrop-blur-2xl p-4 flex items-start gap-3.5 shadow-xl">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                          <Check className="w-4 h-4" />
                        </div>
                        <div className="text-xs leading-relaxed">
                          <p className="font-semibold text-emerald-200">
                            Got it — a Kangqore consultant will reach out to {msg.leadCaptured.email} within one business day.
                          </p>
                        </div>
                      </div>
                    )}

                    {showHandoffOffer && !msg.leadCaptured && (
                      <div className="ml-12 mt-1">
                        <button
                          type="button"
                          onClick={() => setShowLeadFor(msg.id)}
                          className="group inline-flex items-center gap-2.5 text-xs font-bold text-cyan-300 hover:text-white transition-all bg-white/[0.05] hover:bg-white/[0.12] border border-white/15 hover:border-cyan-400/40 px-3.5 py-1.5 rounded-full backdrop-blur-md"
                        >
                          <span>Talk to a Kangqore consultant</span>
                          <ArrowRight className="w-3 h-3 -rotate-45 group-hover:rotate-0 transition-transform duration-300" strokeWidth={2.5} />
                        </button>
                      </div>
                    )}

                    {!isUser && showLeadFor === msg.id && !msg.leadCaptured && (
                      <div className="ml-12 w-full max-w-md">
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

          {/* ───────────── Bottom Prompt Chips & Input Bar ───────────── */}
          <div className="relative z-10 px-6 sm:px-8 pb-6 pt-2 bg-transparent">
            {!hasUserMessages && (
              <div className="mb-4 -mx-1 flex flex-wrap gap-2">
                {prompts.map((p) => (
                  <SuggestedPromptChip
                    key={p}
                    prompt={p}
                    onSelect={onChip}
                    disabled={streaming}
                    inverted={inverted}
                  />
                ))}
              </div>
            )}

            <form onSubmit={submit} className="relative">
              <div className="relative flex items-center rounded-full bg-white/[0.05] hover:bg-white/[0.07] focus-within:bg-white/[0.08] border border-white/15 focus-within:border-white/30 backdrop-blur-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),0_12px_32px_rgba(0,0,0,0.4)] focus-within:ring-1 focus-within:ring-white/15 transition-all duration-300">
                <input
                  ref={inputRef}
                  type="text"
                  value={voice.listening && voice.interim ? `${input} ${voice.interim}`.trim() : input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={streaming}
                  aria-label="Ask eQORE AI a question"
                  placeholder={voice.listening ? 'System Listening…' : 'Engineer a query…'}
                  className="w-full bg-transparent pl-6 pr-28 py-4 text-[16px] font-medium text-white placeholder-white/45 focus:outline-none disabled:opacity-60"
                />
                
                <div className="absolute right-2 flex items-center gap-1.5">
                  {voice.supported && (
                    <button
                      type="button"
                      onClick={voice.toggle}
                      disabled={streaming}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-xl shadow-md active:scale-95 ${
                        voice.listening
                          ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.7)]'
                          : 'bg-white/[0.10] hover:bg-white/[0.20] border border-white/20 text-white/90 hover:text-white'
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
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
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-white/[0.15] hover:bg-white/[0.25] border border-white/20 text-white shadow-md active:scale-95 backdrop-blur-xl"
                      aria-label="Stop generating"
                      title="Stop"
                    >
                      <Square className="w-4 h-4 fill-current text-white" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!input.trim()}
                      className="w-10 h-10 rounded-full bg-white/[0.10] hover:bg-white/[0.20] text-white/90 hover:text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-md backdrop-blur-xl border border-white/20 hover:border-white/40 active:scale-95"
                      aria-label="Send"
                    >
                      <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300 text-white/90 group-hover:text-white" strokeWidth={2.5} />
                    </button>
                  )}
                </div>
              </div>
            </form>

            {error && (
              <p className="mt-2 text-xs text-rose-400 font-semibold">{error}</p>
            )}

            <p className="mt-3.5 text-[11px] text-center text-white/50 font-medium tracking-wide">
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
