import React, { useEffect, useRef } from 'react';
import { Mic, X } from 'lucide-react';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';

const STATE_LABEL = {
  idle: 'Talk to eQORE',
  connecting: 'Connecting…',
  listening: 'Listening…',
  thinking: 'Thinking…',
  speaking: 'Speaking…',
  unavailable: 'Voice Assistant unavailable',
  error: 'Connection lost — tap to retry',
};

function Waveform({ micAnalyser, playbackAnalyser, active, state }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx2d = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx2d.scale(dpr, dpr);

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const barCount = 28;
    const barWidth = width / barCount;

    const draw = () => {
      const analyserRef = state === 'speaking' ? playbackAnalyser : micAnalyser;
      const analyser = analyserRef?.current;
      ctx2d.clearRect(0, 0, width, height);

      if (active && analyser) {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        const step = Math.floor(data.length / barCount) || 1;

        for (let i = 0; i < barCount; i++) {
          const v = data[i * step] / 255;
          const barHeight = Math.max(2, v * height);
          const x = i * barWidth;
          const color = state === 'speaking' ? 'rgba(74,182,212,0.9)' : 'rgba(37,100,234,0.85)';
          ctx2d.fillStyle = color;
          ctx2d.fillRect(x + barWidth * 0.2, (height - barHeight) / 2, barWidth * 0.6, barHeight);
        }
      } else {
        // Idle resting line
        ctx2d.fillStyle = 'rgba(148,163,184,0.35)';
        for (let i = 0; i < barCount; i++) {
          ctx2d.fillRect(i * barWidth + barWidth * 0.2, height / 2 - 1, barWidth * 0.6, 2);
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [micAnalyser, playbackAnalyser, active, state]);

  return <canvas ref={canvasRef} className="w-full h-10" />;
}

/**
 * Fluent, full-duplex eQORE VoiceAssistant — mic toggle + live waveform +
 * captions. Drops into BookingWidget/BookingPage; reports scheduling intent
 * back to the parent via onBookingAction, same shape as the typed NLP path.
 */
export default function VoiceAssistant({ eventTypeSlug, onBookingAction, className = '' }) {
  const {
    state,
    interimTranscript,
    assistantText,
    error,
    toggle,
    micAnalyser,
    playbackAnalyser,
  } = useVoiceAssistant({ eventTypeSlug, onBookingAction });

  const active = state !== 'idle' && state !== 'unavailable' && state !== 'error';
  const caption = interimTranscript || assistantText;

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <button
        type="button"
        onClick={toggle}
        disabled={state === 'unavailable'}
        aria-label={active ? 'End voice conversation' : 'Start voice conversation with eQORE'}
        title={state === 'unavailable' ? error || 'Voice Assistant unavailable' : undefined}
        className={`relative shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(37,100,234,0.5)] ${
          state === 'unavailable'
            ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed opacity-60'
            : active
              ? 'bg-red-500 text-white hover:bg-red-400'
              : 'bg-brand-gradient text-white hover:opacity-90'
        }`}
      >
        {active && state !== 'connecting' && (
          <span className="absolute inset-0 rounded-full bg-brand-gradient opacity-40 animate-ping pointer-events-none" />
        )}
        {active ? <X className="w-4 h-4 relative z-10" /> : <Mic className="w-4 h-4 relative z-10" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-widest ${
            state === 'unavailable' || state === 'error' ? 'text-red-400' : 'bg-brand-gradient bg-clip-text text-transparent'
          }`}>
            {STATE_LABEL[state]}
          </span>
        </div>
        {active ? (
          <Waveform micAnalyser={micAnalyser} playbackAnalyser={playbackAnalyser} active={active} state={state} />
        ) : (
          state === 'unavailable' && (
            <p className="text-sm text-gray-400 dark:text-gray-500 truncate">
              {error || 'Voice Assistant unavailable'}
            </p>
          )
        )}
        {active && caption && (
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{caption}</p>
        )}
      </div>
    </div>
  );
}
