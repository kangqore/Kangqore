import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Send, X, Info, ChevronRight, RefreshCw, Check, Volume2, VolumeX, 
  Mic, MicOff, Menu, History, Plus, LogOut, ArrowLeft, ShieldAlert,
  Globe, Laptop, Sparkles, User, LogIn, ChevronLeft, Trash2
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useConcierge, CONCIERGE_SUGGESTED_PROMPTS } from '../hooks/useConcierge';
import { useAuth } from '../context/AuthContext';
import CitationBadge from '../components/concierge/CitationBadge';
import { parseSchedulingRequest } from '../hooks/nlpSchedulingParser';

// Helper to sanitize markdown bold & links for TTS
function cleanTextForSpeech(text) {
  if (!text) return '';
  return text
    .replace(/\[CHUNK:[a-zA-Z0-9_\-]+\]/g, '') 
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') 
    .replace(/\*\*(.*?)\*\*/g, '$1') 
    .replace(/`(.*?)`/g, '$1') 
    .replace(/#/g, '') 
    .trim();
}

// Format markdown links & bold text beautifully for premium output
function renderFormattedText(text) {
  if (!text) return text;
  const cleanText = text.replace(/\s*\[CHUNK:[A-Za-z0-9_\-#]+\]/g, '');
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
  const { user, login, signup, logout } = useAuth();
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
    
    setHistoryList((prev) => {
      const exists = prev.find(item => item.id === conversationId);
      if (exists) return prev;
      
      const title = firstUser.content.slice(0, 35) + (firstUser.content.length > 35 ? '...' : '');
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
    <div className="w-screen h-screen flex bg-[#06080e] text-white font-sans overflow-hidden relative">
      
      {/* Background Decorative Neon Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-brand-cyan/5 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* LEFT COLLAPSIBLE SIDEBAR */}
      <div 
        className={`h-full bg-[#0b0f19]/90 border-r border-white/5 backdrop-blur-xl z-20 flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'w-72 opacity-100' : 'w-0 opacity-0 overflow-hidden border-r-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between border-b border-white/5">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative group-hover:scale-105 transition-all shrink-0">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-cyan-400/30 bg-[#050505] flex items-center justify-center">
                <img src="/images/eqore-avatar.png" alt="eQORE" className="w-full h-full object-cover" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-cyan-400 border-2 border-[#0b0f19] rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.6)]"></span>
            </div>
            <div>
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-cyan tracking-wide font-display text-lg">
                eQORE AI
              </span>
              <span className="block text-[10px] text-gray-500 font-medium tracking-wider -mt-1">
                SYSTEM CONSOLE
              </span>
            </div>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* New Session Action */}
        <div className="p-3">
          <button 
            onClick={reset}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-white font-semibold text-sm hover:shadow-[0_0_20px_rgba(37,100,234,0.3)] flex items-center justify-center gap-2 transition duration-300"
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
              <div 
                key={item.id}
                onClick={() => loadConversation(item.id)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition text-xs border ${
                  conversationId === item.id 
                    ? 'bg-brand-blue/10 border-brand-blue/30 text-white font-medium' 
                    : 'border-transparent text-gray-400 hover:bg-white/5 hover:text-white'
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
            ))
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5 bg-[#080b13]">
          
          {/* User state details */}
          <div className="flex items-center gap-3 mb-4 p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-cyan text-sm font-semibold">
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
                className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-brand-cyan" />
                <span>Link Account / Sign In</span>
              </button>
            ) : (
              <button 
                onClick={logout}
                className="w-full py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
            
            <Link 
              to="/" 
              className="py-2 px-3 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to main website</span>
            </Link>
          </div>
        </div>
      </div>

      {/* MAIN CONSOLE PANEL */}
      <div className="flex-1 h-full flex flex-col z-10 relative">
        
        {/* Navigation / Header bar */}
        <header className="p-4 border-b border-white/5 bg-[#0b0f19]/70 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition flex items-center justify-center mr-2"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}

            {/* macOS Circular Controls for Brand Continuity */}
            <div className="flex items-center gap-1.5 mr-4 relative z-20">
              <button 
                onClick={handleClose}
                className="w-3.5 h-3.5 rounded-full bg-pink-500 hover:bg-pink-400 transition-all shadow-[0_0_8px_rgba(236,72,153,0.5)] flex items-center justify-center relative group/btn cursor-pointer" 
                title="Close (Return to previous page)"
              >
                <X className="w-2 h-2 text-black/80 opacity-80 hover:opacity-100 transition-opacity absolute pointer-events-none font-bold" strokeWidth={3.5} />
              </button>
              <button 
                onClick={handleMinimize}
                className="w-3.5 h-3.5 rounded-full bg-purple-500 hover:bg-purple-400 transition-all shadow-[0_0_8px_rgba(168,85,247,0.5)] flex items-center justify-center relative group/btn cursor-pointer" 
                title="Minimize (Back to normal page floating chat)"
              >
                <div className="w-1.5 h-0.5 bg-black/80 opacity-85 hover:opacity-100 transition-opacity absolute rounded-full pointer-events-none font-bold" />
              </button>
              <button 
                disabled
                className="w-3.5 h-3.5 rounded-full bg-blue-500/20 shadow-none cursor-not-allowed flex items-center justify-center relative opacity-45" 
                title="Maximize (Already full-screen)"
              >
                <Plus className="w-2 h-2 text-blue-400/40 absolute pointer-events-none font-bold" strokeWidth={3.5} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Premium eQORE Avatar with glowing online status */}
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-cyan-400/30 bg-[#050505] flex items-center justify-center">
                  <img src="/images/eqore-avatar.png" alt="eQORE" className="w-full h-full object-cover" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-cyan-400 border-2 border-[#0b0f19] rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.6)]"></span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-gray-200">eQORE AI System Console</span>
                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 text-[9px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  ACTIVE PIPELINE
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            
            {/* Audio Voice Output Toggles */}
            <button 
              onClick={() => setIsVoiceEnabled(prev => !prev)}
              className={`p-2 rounded-xl border transition flex items-center justify-center gap-1.5 text-xs font-medium ${
                isVoiceEnabled 
                  ? 'bg-brand-blue/20 border-brand-blue/40 text-brand-cyan shadow-[0_0_15px_rgba(37,100,234,0.2)]' 
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              }`}
              title={isVoiceEnabled ? "Mute Voice output" : "Enable Male Speech synthesizer Output"}
            >
              {isVoiceEnabled ? <Volume2 className="w-4 h-4 animate-[pulse_1.5s_infinite]" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">Voice Engine</span>
            </button>

            {/* Reset chat button */}
            <button 
              onClick={reset}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition flex items-center justify-center"
              title="Clear Active Chat Session"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Conversation Stream */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6"
        >
          {messages.length <= 1 ? (
            
            /* DYNAMIC EMPTY STATE DASHBOARD */
            <div className="h-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center px-4">
              
              <div className="relative mb-8 group shrink-0">
                <div className="w-20 h-20 rounded-[1.75rem] overflow-hidden border border-cyan-400/40 shadow-[0_0_40px_rgba(34,211,238,0.25)] bg-[#050505] flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite]">
                  <img src="/images/eqore-avatar.png" alt="eQORE" className="w-full h-full object-cover" />
                </div>
                <span className="absolute bottom-0 right-0 flex h-4.5 w-4.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-400 border border-[#0b0f19]"></span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display mb-4 max-w-5xl text-center">
                From Business Questions to Solution Direction — Ask <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-cyan">eQORE AI</span><sup className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-cyan text-[0.55em] ml-0.5">™</sup>
              </h1>
              <p className="text-gray-400 text-sm sm:text-base max-w-3xl mb-12 text-center leading-relaxed">
                eQORE helps leaders identify relevant Kangqore capabilities, understand possible solution paths, and connect with the right team for deeper consultation.
              </p>

              {/* Premium Suggested Prompt Chips Cloud */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mt-4">
                {CONCIERGE_SUGGESTED_PROMPTS.map((prompt) => {
                  const isSpecial = prompt === "Which industries do you serve?" || prompt === "Schedule Your Consultation" || prompt === "What is your approach to Agentic AI?";
                  return (
                    <button
                      key={prompt}
                      type="button"
                      disabled={streaming}
                      onClick={() => handleSend(null, prompt)}
                      className={`group inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-full border transition-all duration-300 cursor-pointer ${
                        isSpecial
                          ? 'bg-brand-blue/10 border-brand-cyan/40 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:bg-brand-blue/20 hover:border-brand-cyan/60 hover:shadow-[0_0_20px_rgba(34,211,238,0.25)]'
                          : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-brand-cyan/30 hover:shadow-[0_0_12px_rgba(34,211,238,0.12)]'
                      }`}
                    >
                      <span>{prompt}</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-brand-cyan" />
                    </button>
                  );
                })}
              </div>
            </div>

          ) : (
            
            /* MESSAGE LIST CANVAS */
            <div className="max-w-4xl mx-auto space-y-6">
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

                    {/* Chat Bubble Cards */}
                    <div className={`p-4 rounded-2xl max-w-[85%] border shadow-lg ${
                      isUser 
                        ? 'bg-[#151b2a]/90 border-brand-blue/20 text-white rounded-tr-none' 
                        : 'bg-[#0f1320]/80 border-white/5 text-gray-200 rounded-tl-none backdrop-blur-md'
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

              {/* Streaming Indicator */}
              {streaming && (
                <div className="flex gap-4 justify-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-blue to-brand-cyan flex-shrink-0 flex items-center justify-center animate-spin-slow">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="p-4 rounded-2xl bg-[#0f1320]/80 border border-white/5 rounded-tl-none backdrop-blur-md flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-cyan animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-brand-cyan animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-brand-cyan animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
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

        {/* BOTTOM INPUT FORM CANVAS */}
        <div className="p-4 border-t border-white/5 bg-[#0b0f19]/70 backdrop-blur-md">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSend} className="relative flex items-center">
              
              {/* Mic Speech-to-Text Button */}
              <button 
                type="button"
                onClick={toggleListening}
                className={`absolute left-3 p-2 rounded-xl flex items-center justify-center transition ${
                  isListening 
                    ? 'bg-rose-500 text-white animate-pulse' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                title={isListening ? "Stop voice listening" : "Speak to eQORE"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isListening ? "Listening to your voice..." : "Ask eQORE AI a question... (e.g. Build me a capability roadmap)"}
                className="w-full bg-[#111622] border border-white/10 focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 rounded-2xl pl-12 pr-14 py-3.5 text-sm placeholder-gray-500 text-white outline-none transition"
                disabled={streaming}
              />

              {/* Submit Message Button */}
              <button 
                type="submit"
                disabled={!inputText.trim() || streaming}
                className="absolute right-3 p-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition shadow-lg"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-gray-500 text-center mt-2 font-medium">
              eQORE AI may retrieve information from the corporate knowledge indexes. Standard data compliance rules apply.
            </p>
          </div>
        </div>
      </div>

      {/* Global Auth Modal handles Auth now */}


    </div>
  );
};

export default EQoreAIConsole;
