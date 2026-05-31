import React, { useEffect, useRef, useState } from 'react';
import {
  Send,
  Sparkles,
  Mic,
  MicOff,
  Square,
  RefreshCw,
  MessageSquarePlus,
} from 'lucide-react';
import { useConcierge } from '../../hooks/useConcierge';
import { useVoiceInput } from '../../hooks/useVoiceInput';

function renderFormattedText(text) {
  if (!text) return text;
  const cleanText = text.replace(/\s*\[CHUNK:[A-Za-z0-9_\-#]+\]/g, '');
  const boldParts = cleanText.split(/(\*\*.*?\*\*)/g);
  return boldParts.flatMap((bPart, j) => {
    if (bPart.startsWith('**') && bPart.endsWith('**')) {
      return (
        <strong key={`bold-${j}`} className="text-white font-semibold">
          {bPart.slice(2, -2)}
        </strong>
      );
    }
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
            className="text-cyan-300 hover:underline"
          >
            {m[1]}
          </a>
        );
      }
      return <span key={`text-${j}-${k}`}>{lPart}</span>;
    });
  });
}

const HeroChatWidget = () => {
  const {
    messages,
    streaming,
    restoring,
    error,
    send,
    stop,
    reset,
  } = useConcierge({ persist: false });

  const [input, setInput] = useState('');
  const [micPressed, setMicPressed] = useState(false);
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

  // Emit chat engagement events to pause/resume hero carousel
  useEffect(() => {
    if (hasUserMessages || streaming || voice.listening) {
      window.dispatchEvent(new CustomEvent('hero-chat-engaged'));
    } else {
      window.dispatchEvent(new CustomEvent('hero-chat-idle'));
    }
  }, [hasUserMessages, streaming, voice.listening]);

  // Also signal engagement on focus
  const handleFocus = () => {
    window.dispatchEvent(new CustomEvent('hero-chat-engaged'));
  };
  const handleBlur = () => {
    if (!hasUserMessages && !streaming && !voice.listening) {
      window.dispatchEvent(new CustomEvent('hero-chat-idle'));
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

  const chips = [
    "Services/Capabilities",
    "What are your departments?",
    "Which industries do you serve?",
    "Why choose Kangqore?"
  ];

  const onChip = (text) => {
    if (streaming) return;
    send(text);
  };

  return (
    <div
      className="relative w-full bg-black/60 backdrop-blur-3xl border-2 border-white shadow-[0_8px_32px_rgba(0,0,0,0.6)] rounded-3xl flex flex-col animate-fade-in mt-6"
      style={{ minHeight: '298px', maxHeight: '440px', overflow: 'visible' }}
    >
      {/* 🎙️ Centralized Floating Mic atop the card border with realistic 3D appearance */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2/3 z-20">
        <div className="p-1 rounded-full border-[3px] border-white/90 bg-black/50 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.25)]">
          <button
          type="button"
          onClick={voice.toggle}
          disabled={streaming}
          onMouseDown={() => setMicPressed(true)}
          onMouseUp={() => setMicPressed(false)}
          onMouseLeave={() => setMicPressed(false)}
          onTouchStart={() => setMicPressed(true)}
          onTouchEnd={() => setMicPressed(false)}
          className="relative flex items-center justify-center w-16 h-16 rounded-full text-white transition-all duration-150 hover:scale-[1.05] active:scale-[0.98] border-t border-white/40 cursor-pointer"
          style={{
            background: voice.listening
              ? 'radial-gradient(circle at 50% 30%, #ef4444 0%, #b91c1c 100%)'
              : 'radial-gradient(circle at 50% 30%, #4ab6d4 0%, #2564ea 100%)',
            boxShadow: micPressed
              ? (voice.listening
                  ? '0 2px 0 #7f1d1d, 0 4px 10px rgba(239, 68, 68, 0.2), inset 0 2px 6px rgba(0,0,0,0.6)'
                  : '0 2px 0 #12347a, 0 4px 10px rgba(37, 100, 234, 0.2), inset 0 2px 6px rgba(0,0,0,0.6)')
              : (voice.listening
                  ? '0 6px 0 #7f1d1d, 0 12px 20px rgba(239, 68, 68, 0.4), inset 0 2px 3px rgba(255,255,255,0.4)'
                  : '0 6px 0 #12347a, 0 12px 24px rgba(37, 100, 234, 0.45), inset 0 2px 3px rgba(255,255,255,0.4)'),
            transform: micPressed ? 'translateY(4px)' : 'translateY(0)',
          }}
          aria-label={voice.listening ? 'Stop voice input' : 'Start voice input'}
        >
          {voice.listening ? (
            <MicOff className="w-7 h-7 animate-bounce" />
          ) : (
            <svg className="w-7 h-7 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 0 3-3V4.5a3 3 0 0 0-6 0v8.25a3 3 0 0 0 3 3Z" />
            </svg>
          )}
        </button>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-5 sm:px-7 pt-10 pb-3 custom-scrollbar scroll-smooth"
        style={{ minHeight: '100px', maxHeight: '210px' }}
      >
        {restoring && (
          <div className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-3 flex items-center gap-2">
            <RefreshCw className="w-3 h-3 animate-spin" /> Restoring…
          </div>
        )}
        <div className="space-y-3">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`flex items-start gap-2.5 max-w-[90%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 overflow-hidden ${
                      isUser ? '' : 'bg-white/10'
                    }`}
                    style={
                      isUser
                        ? {
                            background: 'linear-gradient(135deg, #2564ea 0%, #4ab6d4 100%)',
                            boxShadow: '0 0 8px rgba(37,100,234,0.3)',
                          }
                        : {}
                    }
                  >
                    {isUser ? (
                      <span className="text-[9px] font-bold text-white select-none">You</span>
                    ) : (
                      <img src="/images/eqore-avatar.png" alt="eQORE" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-brand-blue/80 text-white rounded-br-sm'
                        : msg.id === 'greeting'
                        ? 'bg-white/[0.06] border border-white/[0.06] rounded-bl-sm font-semibold'
                        : 'bg-white/[0.06] text-gray-200 border border-white/[0.06] rounded-bl-sm'
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
                      <span className="inline-block w-1.5 h-3.5 ml-0.5 align-middle bg-cyan-400 animate-pulse rounded-sm" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested Chips — show before user starts chatting */}
      {!hasUserMessages && (
        <div className="px-5 sm:px-7 pb-3 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip}
              onClick={() => onChip(chip)}
              disabled={streaming}
              className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-white/[0.06] border border-white/[0.10] text-white/70 hover:bg-white/[0.12] hover:text-white hover:border-white/20 transition-all duration-300 disabled:opacity-40"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="px-5 sm:px-7 py-4 border-t border-white/[0.06]">
        <form onSubmit={submit} className="relative">
          <div className="flex items-center gap-2">
            {/* White Glassmorphic Typing Area */}
            <div className="flex-1 relative">
              <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/60 z-10" />
              <input
                ref={inputRef}
                type="text"
                value={voice.listening && voice.interim ? `${input} ${voice.interim}`.trim() : input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={streaming}
                placeholder={voice.listening ? 'Listening…' : 'Ask me anything'}
                className="w-full pl-9 pr-4 py-3 rounded-xl text-[13px] backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/30 disabled:opacity-50 transition-all shadow-[0_4px_12px_rgba(255,255,255,0.05)]"
              />
            </div>



            {/* White Glassmorphic Send / Stop button */}
            {streaming ? (
              <button
                type="button"
                onClick={stop}
                className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-white flex items-center justify-center hover:bg-white/35 transition-all shrink-0 shadow-[0_4px_12px_rgba(255,255,255,0.05)]"
                aria-label="Stop"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/80 hover:bg-white/20 hover:text-white flex items-center justify-center disabled:opacity-30 transition-all shrink-0 shadow-[0_4px_12px_rgba(255,255,255,0.05)]"
                aria-label="Send"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            )}

            {/* White Glassmorphic Reset button */}
            {hasUserMessages && (
              <button
                type="button"
                onClick={reset}
                className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/60 hover:bg-white/20 hover:text-white flex items-center justify-center hover:bg-white/20 transition-all shrink-0 shadow-[0_4px_12px_rgba(255,255,255,0.05)]"
                title="New Session"
                aria-label="New Session"
              >
                <MessageSquarePlus className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {error && (
          <p className="mt-2 text-xs text-red-400">{error}</p>
        )}

        {/* Footer: Disclaimer only */}
        <div className="flex items-center justify-center mt-3">
          <span className="text-[10px] italic text-white/30 font-medium tracking-wide">
            Content is generated with AI assistance
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeroChatWidget;
