import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, X, ChevronRight, RefreshCw, Volume2, VolumeX, 
  Mic, Menu, History, Plus, LogOut, ArrowLeft, ShieldAlert,
  Sparkles, User, LogIn, ChevronLeft, Trash2, Minimize2
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useConcierge, CONCIERGE_SUGGESTED_PROMPTS, stripSystemMetadata } from '../hooks/useConcierge';
import { useAuth } from '../context/AuthContext';
import CitationBadge from '../components/concierge/CitationBadge';

// Helper to sanitize markdown bold & links for TTS
function cleanTextForSpeech(text) {
  if (!text) return '';
  return stripSystemMetadata(text)
    .replace(/\[CHUNK:[a-zA-Z0-9_-]+\]/g, '') 
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') 
    .replace(/\*\*(.*?)\*\*/g, '$1') 
    .replace(/`(.*?)`/g, '$1') 
    .replace(/#/g, '') 
    .trim();
}

// Format markdown links & bold text beautifully for premium output
function renderFormattedText(text) {
  if (!text) return text;
  const cleanText = stripSystemMetadata(text).replace(/\s*\[CHUNK:[A-Za-z0-9_#-]+\]/g, '');
  const boldParts = cleanText.split(/(\*\*.*?\*\*)/g);

  return boldParts.flatMap((bPart, j) => {
    if (bPart.startsWith('**') && bPart.endsWith('**')) {
      const boldInner = bPart.slice(2, -2);
      const boldLinkParts = boldInner.split(/(\[.*?\]\(.*?\))/g);
      return (
        <strong key={`bold-${j}`} className="text-white font-bold">
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

const EQoreAIConsole = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Return path handling to preserve page context
  const returnTo = location.state?.returnTo || '/';

  const handleClose = () => {
    navigate(returnTo);
  };

  const handleMinimize = () => {
    const nextPath = `${returnTo}${returnTo.includes('?') ? '&' : '?'}openChat=true`;
    navigate(nextPath);
  };

  // Layout states
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inputText, setInputText] = useState('');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // (Auth state moved to GlobalAuthPrompt)

  // References for scrolling & voice
  const recognitionRef = useRef(null);
  const spokenMessagesRef = useRef(new Set());
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Active concierge session
  const { 
    messages, 
    streaming, 
    restoring, 
    conversationId, 
    error: chatError, 
    send, 
    reset, 
    loadConversation 
  } = useConcierge();

  // Past conversation list state (stored locally)
  const [historyList, setHistoryList] = useState(() => {
    try {
      const raw = localStorage.getItem('eqore.concierge.history');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Track conversation in history list
  useEffect(() => {
    if (!conversationId) return;
    const firstUser = messages.find(m => m.role === 'user');
    if (!firstUser) return;
    
    const cleanText = stripSystemMetadata(firstUser.content);
    setHistoryList((prev) => {
      const exists = prev.find(item => item.id === conversationId);
      if (exists) return prev;
      
      const title = cleanText.slice(0, 35) + (cleanText.length > 35 ? '...' : '');
      const newList = [{ id: conversationId, title, createdAt: new Date().toISOString() }, ...prev];
      localStorage.setItem('eqore.concierge.history', JSON.stringify(newList));
      return newList;
    });
  }, [conversationId, messages]);

  // (Auth handlers and timers moved to GlobalAuthPrompt)

  // ─── Voice Input (Web Speech API) ──────────────────────────────────
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

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
      setInputText(finalTranscript || interimTranscript);

      if (finalTranscript.trim()) {
        setIsListening(false);
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
  }, [send]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.abort();
      setIsListening(false);
    } else {
      setInputText('');
      try { recognitionRef.current.abort(); } catch (_) {}
      try {
        recognitionRef.current.start();
        setIsListening(true);
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      } catch (err) {
        console.warn('SpeechRecognition start failed:', err.message);
        setIsListening(false);
      }
    }
  };

  // Voice Output (SpeechSynthesis)
  useEffect(() => {
    if (!isVoiceEnabled || !messages.length) return;
    
    const latestAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant' && m.done);
    if (latestAssistantMsg && !spokenMessagesRef.current.has(latestAssistantMsg.id)) {
      spokenMessagesRef.current.add(latestAssistantMsg.id);
      
      const cleanText = cleanTextForSpeech(latestAssistantMsg.content);
      if (cleanText && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        
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

  // Handle message sending
  const handleSend = (e, textOverride = null) => {
    if (e) e.preventDefault();
    const text = (textOverride || inputText).trim();
    if (!text || streaming) return;
    setInputText('');

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); 
    }

    send(text);
  };

  // Auto-scroll chat window
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  // Delete chat thread
  const handleDeleteHistory = (e, idToDelete) => {
    e.stopPropagation();
    setHistoryList((prev) => {
      const newList = prev.filter(item => item.id !== idToDelete);
      localStorage.setItem('eqore.concierge.history', JSON.stringify(newList));
      return newList;
    });
    if (conversationId === idToDelete) {
      reset();
    }
  };

  return (
    <div className="flex h-screen bg-[#05080f] text-gray-200 overflow-hidden font-sans relative">
      
      {/* Ambient Glow Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-[80vw] h-[80vh] rounded-full bg-cyan-950/20 blur-[140px]"></div>
      </div>

      {/* LEFT COLLAPSIBLE SIDEBAR */}
      <div 
        className={`h-full bg-[#0b0f19]/90 border-r border-white/5 backdrop-blur-xl z-20 flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'w-56 opacity-100' : 'w-0 opacity-0 overflow-hidden border-r-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-[60px] px-3 flex items-center justify-between border-b border-white/5">
          <Link to="/" className="group" style={{ overflow: 'hidden', height: '36px', display: 'flex', alignItems: 'center' }}>
            <img 
              src="https://customer-assets.emergentagent.com/job_cog-site-clone/artifacts/focgf8oz_Logo%2BText.png" 
              alt="Kangqore Logo" 
              style={{ width: '126px', marginTop: '-28px', marginBottom: '-28px' }}
              className="brightness-0 invert group-hover:opacity-80 transition-opacity duration-300" 
            />
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* New Session Action */}
        <div className="p-3">
          <button 
            onClick={reset}
            className="w-full py-2 px-2 text-brand-cyan hover:text-white font-medium text-xs flex items-center justify-start gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat Session</span>
          </button>
        </div>

        {/* Saved Threads List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold text-gray-500 tracking-wider uppercase">
            Conversation History
          </div>
          {historyList.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-500 italic">
              No saved threads on this device.
            </div>
          ) : (
            historyList.map((item) => (
              <div key={item.id} className="relative group mb-1">
                <div 
                  onClick={() => loadConversation(item.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors text-xs ${
                    conversationId === item.id 
                      ? 'text-brand-cyan font-bold bg-white/5' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <History className="w-3.5 h-3.5 flex-shrink-0 text-brand-cyan" />
                    <span className="truncate">{item.title}</span>
                  </div>
                  <button 
                    onClick={(e) => handleDeleteHistory(e, item.id)}
                    className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-white/10 text-gray-400 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5 bg-[#080b13]">
          
          {/* User state details */}
          <div className="flex items-center gap-3 mb-3 px-1 py-1">
            <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-cyan text-sm font-semibold shrink-0">
              {user ? user.name.slice(0, 2).toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <div className="truncate flex-1">
              <span className="block text-xs font-bold text-white truncate">
                {user ? user.name : 'Guest User'}
              </span>
              <span className="block text-[10px] text-gray-400 truncate">
                {user ? user.email : 'Limited Session'}
              </span>
            </div>
            {!user && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {!user ? (
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('show-auth-modal', { detail: { tab: 'signin' } }))}
                className="py-1.5 px-2 text-brand-cyan hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Link Account / Sign In</span>
              </button>
            ) : (
              <button 
                onClick={logout}
                className="py-1.5 px-2 text-rose-400 hover:text-rose-300 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
            
            <Link 
              to="/" 
              className="py-1.5 px-2 text-gray-400 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </Link>
          </div>
        </div>
      </div>

      {/* MAIN CONSOLE PANEL */}
      <div className="flex-1 h-full flex flex-col z-10 relative">
        
        {/* Navigation / Header bar */}
        <header className="h-[60px] px-4 border-b border-white/5 bg-[#0b0f19]/70 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition flex items-center justify-center mr-2"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center gap-3">
              {/* Premium eQORE Avatar with glowing online status */}
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-cyan-400/30 bg-[#050505] flex items-center justify-center">
                  <img src="/images/eqore-avatar.png" alt="eQORE" className="w-full h-full object-cover" />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-gray-200">eQORE AI Assistant Console</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Voice Output Toggle */}
            <button
              onClick={() => {
                const newState = !isVoiceEnabled;
                setIsVoiceEnabled(newState);
                if (!newState && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
              }}
              className={`p-2 rounded-xl transition-colors ${isVoiceEnabled ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'}`}
              title={isVoiceEnabled ? 'Disable Voice Output' : 'Enable Voice Output'}
            >
              {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Reset chat button */}
            <button 
              onClick={reset}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition flex items-center justify-center"
              title="Clear Active Chat Session"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Minimize / Back to floating chat button */}
            <button
              onClick={handleMinimize}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition flex items-center justify-center cursor-pointer"
              title="Minimize (Return to floating chat window)"
            >
              <Minimize2 className="w-4 h-4 text-white/80" />
            </button>

            {/* Close / Return to site button */}
            <button
              onClick={handleClose}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition flex items-center justify-center cursor-pointer"
              title="Close Console"
            >
              <X className="w-4 h-4 text-white/80" />
            </button>
          </div>
        </header>

        {/* Scrollable Conversation Stream */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 z-10"
        >
          {messages.length <= 1 ? (
            
            /* DYNAMIC EMPTY STATE DASHBOARD */
            <div className="h-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center px-4 pb-[200px]">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-display mb-6 mt-8">
                Ask <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-cyan">eQORE AI</span><sup className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-cyan text-lg ml-1">™</sup>
              </h1>
            </div>

          ) : (
            
            /* MESSAGE LIST CANVAS */
            <div className="max-w-5xl mx-auto space-y-6 pb-32">
              {messages.map((m, idx) => {
                if (m.id === 'greeting') return null; // handled via empty state or clean greet layout

                const isUser = m.role === 'user';
                return (
                  <div 
                    key={m.id || idx}
                    className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Assistant Avatar Icon */}
                    {!isUser && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-blue to-brand-cyan flex-shrink-0 flex items-center justify-center shadow-md">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    )}

                    {/* Chat Bubble Cards - VisionOS Glassmorphism */}
                    <div className={`p-4 rounded-3xl max-w-[85%] shadow-2xl backdrop-blur-2xl border ${
                      isUser 
                        ? 'bg-white/10 border-white/10 text-white rounded-tr-sm' 
                        : 'bg-[#0f1320]/60 border-white/5 text-gray-100 rounded-tl-sm shadow-cyan-900/10'
                    }`}>
                      
                      {/* Formatted Text Content */}
                      <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                        {renderFormattedText(m.content)}
                      </p>

                      {/* Display Citations badges if present */}
                      {m.citations && m.citations.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/5">
                          {m.citations.map((cite, cIdx) => (
                            <CitationBadge key={cIdx} citation={cite} index={cIdx + 1} />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* User Avatar Initials */}
                    {isUser && (
                      <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex-shrink-0 border border-brand-blue/30 flex items-center justify-center text-[11px] font-bold text-brand-cyan">
                        {user ? user.name.slice(0, 2).toUpperCase() : 'US'}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Clean Streaming Indicator */}
              {streaming && (
                <div className="flex gap-3 items-center text-xs text-gray-400 pl-1">
                  <div className="w-7 h-7 rounded-full bg-brand-blue/20 border border-brand-cyan/30 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
                  </div>
                  <span className="text-gray-400 font-medium">eQORE is processing...</span>
                </div>
              )}

              {/* Hook errors */}
              {chatError && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                  <div>{chatError}</div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Floating lead/scheduling card container in chat area if needed */}
        {/* Render a custom schedule card when scheduling intent is confirmed */}

        {/* BOTTOM INPUT FORM CANVAS - FLOATING PILL OR CENTERED */}
        <div className={`left-0 right-0 px-4 pointer-events-none z-20 transition-all duration-700 ease-in-out ${
          messages.length <= 1 
            ? 'absolute top-1/2 -translate-y-1/2 mt-[120px]' 
            : 'absolute bottom-6'
        }`}>
          <div className="max-w-4xl mx-auto pointer-events-auto w-full">
            <form onSubmit={handleSend} className="relative flex flex-col group bg-[#111622]/80 backdrop-blur-3xl border border-white/10 focus-within:border-cyan-400/50 shadow-2xl shadow-cyan-900/20 rounded-2xl overflow-hidden transition-all duration-300">

              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isListening ? "Listening to your voice..." : "Ask eQORE AI a question... (e.g. Build me a capability roadmap)"}
                className="w-full bg-transparent pl-4 pr-4 pt-4 pb-2 text-sm placeholder-gray-500 text-white outline-none relative z-10"
                disabled={streaming}
              />

              {/* Bottom Actions Row inside the input box */}
              <div className="flex items-center justify-between px-2 pb-2 relative z-10">
                {/* Left side actions (+) */}
                <button 
                  type="button"
                  className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white transition-all ml-1"
                  title="Upload attachment (Coming soon)"
                >
                  <Plus className="w-4 h-4" />
                </button>

                {/* Right side actions (Mic + Send) */}
                <div className="flex items-center gap-1.5">
                  {(window.SpeechRecognition || window.webkitSpeechRecognition) && (
                    <button
                      type="button"
                      onClick={toggleListening}
                      disabled={streaming}
                      className={`p-1.5 rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                        isListening
                          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      } disabled:opacity-50`}
                      title={isListening ? 'Stop listening' : 'Voice input'}
                    >
                      {isListening ? (
                        <svg className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="2" y="8" width="4" height="8" rx="2">
                            <animate attributeName="height" values="8;16;8" dur="1s" repeatCount="indefinite"/>
                            <animate attributeName="y" values="8;4;8" dur="1s" repeatCount="indefinite"/>
                          </rect>
                          <rect x="10" y="4" width="4" height="16" rx="2">
                            <animate attributeName="height" values="16;4;16" dur="0.8s" repeatCount="indefinite"/>
                            <animate attributeName="y" values="4;10;4" dur="0.8s" repeatCount="indefinite"/>
                          </rect>
                          <rect x="18" y="8" width="4" height="8" rx="2">
                            <animate attributeName="height" values="8;20;8" dur="1.2s" repeatCount="indefinite"/>
                            <animate attributeName="y" values="8;2;8" dur="1.2s" repeatCount="indefinite"/>
                          </rect>
                        </svg>
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </button>
                  )}

                  {/* Submit Message Button */}
                  <button 
                    type="submit"
                    disabled={!inputText.trim() || streaming}
                    className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 mr-1"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>

            {/* Suggested Prompt Chips below input */}
            {messages.length <= 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 pointer-events-auto max-w-3xl mx-auto">
                {CONCIERGE_SUGGESTED_PROMPTS.map((prompt) => {
                  const isSpecial = prompt === "Which industries do you serve?" || prompt === "Schedule Your Consultation" || prompt === "What is your approach to Agentic AI?";
                  return (
                    <button
                      key={prompt}
                      type="button"
                      disabled={streaming}
                      onClick={() => handleSend(null, prompt)}
                      className={`group inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-1 rounded-full border transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                        isSpecial
                          ? 'bg-brand-blue/10 border-brand-cyan/40 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:bg-brand-blue/20 hover:border-brand-cyan/60 hover:shadow-[0_0_20px_rgba(34,211,238,0.25)]'
                          : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-brand-cyan/30 hover:shadow-[0_0_12px_rgba(34,211,238,0.12)]'
                      }`}
                    >
                      <span>{prompt}</span>
                      <ChevronRight className="w-2.5 h-2.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-brand-cyan" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global Auth Modal handles Auth now */}


    </div>
  );
};

export default EQoreAIConsole;
