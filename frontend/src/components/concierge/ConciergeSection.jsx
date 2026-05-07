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
} from 'lucide-react';
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

  const submit = (e) => {
    e?.preventDefault?.();
    const text = input.trim();
    if (!text || streaming) return;
    setInput('');
    send(text);
  };

  const onChip = (text) => {
    if (streaming) return;
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
            eQORE AI Assistant
            </span>
          </div>
          <h2
            id="eqore-ai-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight max-w-4xl"
          >
            Ask <span className="bg-brand-gradient bg-clip-text text-transparent">eQORE AI</span>. Get Answers Instantly.
          </h2>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
            Ask eQORE AI how we architect, scale, and secure your organization.
          </p>
        </div>

        <div className="rounded-[2rem] bg-[#11131a] shadow-2xl overflow-hidden relative border border-white/[0.05] w-full">
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
              {hasUserMessages && (
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white/50 hover:text-white px-3 py-2 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800/5 border border-white/10 transition-all"
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
                            ? 'bg-[#1c202a] font-semibold rounded-bl-sm border border-white/[0.03]'
                            : 'bg-[#1c202a] text-gray-200 rounded-bl-sm border border-white/[0.03]'
                        }`}
                      >
                        {msg.id === 'greeting' ? (
                          <span className="bg-brand-gradient bg-clip-text text-transparent">
                            {msg.content}
                          </span>
                        ) : (
                          renderInlineCitations(msg.content)
                        )}
                        {!msg.done && msg.role === 'assistant' && (
                          <span className="inline-block w-1.5 h-4 ml-0.5 align-middle bg-brand-cyan animate-pulse rounded-sm" />
                        )}
                      </div>
                    </div>

                    {!isUser && msg.done && msg.citations && msg.citations.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 ml-10">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">
                          Sources
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
                          className="inline-flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-1.5 py-0.5 rounded"
                          title="Copy"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" /> Copied
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
                          className="inline-flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-50 px-1.5 py-0.5 rounded"
                          title="Retry this answer"
                        >
                          <RotateCcw className="w-3 h-3" /> Retry
                        </button>
                        <button
                          type="button"
                          onClick={() => submitFeedback(msg.id, 'up')}
                          disabled={!conversationId || msg.feedback === 'up'}
                          className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${
                            msg.feedback === 'up'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          } disabled:opacity-50`}
                          title="Helpful"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => submitFeedback(msg.id, 'down')}
                          disabled={!conversationId || msg.feedback === 'down'}
                          className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${
                            msg.feedback === 'down'
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
                      <div className="ml-10">
                        <button
                          type="button"
                          onClick={() => setShowLeadFor(msg.id)}
                          className="text-xs font-semibold text-brand-blue dark:text-brand-cyan hover:underline"
                        >
                          → Talk to a Kangqore consultant
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
                  "What services do you offer?",
                  "What are your departments?",
                  "Which industries do you serve?",
                  "Why choose Kangqore?",
                  "Tell me about your success stories.",
                  "How does your GCC model work?",
                  "What is your approach to Agentic AI?",
                  "How do you ensure data security?",
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
                className="w-full pl-6 pr-28 py-[18px] rounded-full text-[15px] bg-[#1c202a] border border-white/5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/20 disabled:opacity-60 transition-all"
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
              eQORE may make mistakes. For commitments and pricing, confirm with a
              Kangqore consultant.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConciergeSection;
