import { useCallback, useEffect, useRef, useState } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
const BARGE_IN_RMS_THRESHOLD = 0.035;
const BARGE_IN_CONSECUTIVE_FRAMES = 3;

function wsUrl() {
  const base = BACKEND_URL || (typeof window !== 'undefined' ? window.location.origin : '');
  return base.replace(/^http/, 'ws') + '/ws/voice/booking';
}

// Linear-interpolation resample — good enough for speech-recognition input,
// avoids pulling in a resampling library for a 1:many downsample.
function resampleTo16k(float32, inputRate) {
  if (inputRate === 16000) return float32;
  const ratio = inputRate / 16000;
  const outLength = Math.floor(float32.length / ratio);
  const out = new Float32Array(outLength);
  for (let i = 0; i < outLength; i++) {
    const srcIndex = i * ratio;
    const i0 = Math.floor(srcIndex);
    const i1 = Math.min(i0 + 1, float32.length - 1);
    const frac = srcIndex - i0;
    out[i] = float32[i0] * (1 - frac) + float32[i1] * frac;
  }
  return out;
}

function floatTo16BitPCM(float32) {
  const buffer = new ArrayBuffer(float32.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < float32.length; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
}

function pcm16ToFloat32(arrayBuffer) {
  const view = new DataView(arrayBuffer);
  const len = arrayBuffer.byteLength / 2;
  const out = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    out[i] = view.getInt16(i * 2, true) / 0x8000;
  }
  return out;
}

/**
 * Fluent, full-duplex voice conversation for the eQORE booking assistant.
 * Streams mic audio to the backend voice gateway (Deepgram STT -> WAANDA/
 * Claude -> ElevenLabs TTS) and plays the spoken reply back, with client-side
 * barge-in so the user can interrupt mid-sentence like a real phone call.
 */
export function useVoiceAssistant({ eventTypeSlug, onBookingAction } = {}) {
  const [state, setState] = useState('idle'); // idle|connecting|listening|thinking|speaking|unavailable|error
  const [interimTranscript, setInterimTranscript] = useState('');
  const [assistantText, setAssistantText] = useState('');
  const [error, setError] = useState(null);

  const wsRef = useRef(null);
  const micStreamRef = useRef(null);
  const micCtxRef = useRef(null);
  const workletNodeRef = useRef(null);
  const micAnalyserRef = useRef(null);
  const playbackCtxRef = useRef(null);
  const playbackAnalyserRef = useRef(null);
  const nextStartTimeRef = useRef(0);
  const activeSourcesRef = useRef(new Set());
  const stateRef = useRef('idle');
  const bargeInStreakRef = useRef(0);
  const bargeInMeterRef = useRef(null);
  const onBookingActionRef = useRef(onBookingAction);
  onBookingActionRef.current = onBookingAction;

  const setStateBoth = useCallback((s) => {
    stateRef.current = s;
    setState(s);
  }, []);

  const clearPlaybackQueue = useCallback(() => {
    for (const src of activeSourcesRef.current) {
      try { src.stop(); } catch { /* noop */ }
    }
    activeSourcesRef.current.clear();
    if (playbackCtxRef.current) nextStartTimeRef.current = playbackCtxRef.current.currentTime;
  }, []);

  const sendBargeIn = useCallback(() => {
    clearPlaybackQueue();
    setStateBoth('listening');
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'barge_in' }));
    }
  }, [clearPlaybackQueue, setStateBoth]);

  const playChunk = useCallback((arrayBuffer) => {
    const ctx = playbackCtxRef.current;
    if (!ctx) return;
    const float32 = pcm16ToFloat32(arrayBuffer);
    const buffer = ctx.createBuffer(1, float32.length, 16000);
    buffer.copyToChannel(float32, 0);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(playbackAnalyserRef.current);
    playbackAnalyserRef.current.connect(ctx.destination);

    const startAt = Math.max(nextStartTimeRef.current, ctx.currentTime);
    source.start(startAt);
    nextStartTimeRef.current = startAt + buffer.duration;

    activeSourcesRef.current.add(source);
    source.onended = () => activeSourcesRef.current.delete(source);
  }, []);

  const handleControlMessage = useCallback((msg) => {
    switch (msg.type) {
      case 'state':
        if (msg.value === 'listening' || msg.value === 'thinking' || msg.value === 'speaking') {
          setStateBoth(msg.value);
          if (msg.value !== 'thinking') setInterimTranscript('');
        }
        break;
      case 'transcript':
        setInterimTranscript(msg.isFinal ? '' : msg.text);
        break;
      case 'assistant_text':
        setAssistantText(msg.text);
        break;
      case 'booking_action':
        onBookingActionRef.current?.({
          targetDate: msg.targetDate ? new Date(msg.targetDate) : null,
          timeStr: msg.timeStr,
          timeRange: msg.timeRange,
          summary: msg.summary,
        });
        break;
      case 'assistant_interrupted':
        clearPlaybackQueue();
        break;
      case 'error':
        setError(msg.message || 'Voice Assistant error');
        setStateBoth(msg.code === 'VOICE_NOT_CONFIGURED' ? 'unavailable' : 'error');
        break;
      default:
        break;
    }
  }, [clearPlaybackQueue, setStateBoth]);

  const stop = useCallback(() => {
    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'end_session' }));
      }
      wsRef.current?.close();
    } catch { /* noop */ }
    wsRef.current = null;

    workletNodeRef.current?.port?.close();
    workletNodeRef.current?.disconnect();
    workletNodeRef.current = null;
    micAnalyserRef.current?.disconnect();
    micAnalyserRef.current = null;

    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    micStreamRef.current = null;

    micCtxRef.current?.close().catch(() => {});
    micCtxRef.current = null;

    clearPlaybackQueue();
    playbackCtxRef.current?.close().catch(() => {});
    playbackCtxRef.current = null;

    if (bargeInMeterRef.current) {
      cancelAnimationFrame(bargeInMeterRef.current);
      bargeInMeterRef.current = null;
    }

    setStateBoth('idle');
    setInterimTranscript('');
  }, [clearPlaybackQueue, setStateBoth]);

  const start = useCallback(async () => {
    if (stateRef.current !== 'idle' && stateRef.current !== 'unavailable' && stateRef.current !== 'error') return;

    const hasSupport = typeof window !== 'undefined'
      && navigator.mediaDevices?.getUserMedia
      && window.AudioContext
      && window.AudioWorklet;
    if (!hasSupport) {
      setError('Voice Assistant is not supported in this browser.');
      setStateBoth('unavailable');
      return;
    }

    setError(null);
    setStateBoth('connecting');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      micStreamRef.current = stream;

      const micCtx = new AudioContext();
      micCtxRef.current = micCtx;
      await micCtx.audioWorklet.addModule('/audio/pcm-recorder-worklet.js');

      const source = micCtx.createMediaStreamSource(stream);
      const analyser = micCtx.createAnalyser();
      analyser.fftSize = 512;
      micAnalyserRef.current = analyser;
      source.connect(analyser);

      const worklet = new AudioWorkletNode(micCtx, 'pcm-recorder-processor');
      workletNodeRef.current = worklet;
      source.connect(worklet);

      const playbackCtx = new AudioContext({ sampleRate: 16000 });
      playbackCtxRef.current = playbackCtx;
      nextStartTimeRef.current = playbackCtx.currentTime;
      const playbackAnalyser = playbackCtx.createAnalyser();
      playbackAnalyser.fftSize = 512;
      playbackAnalyserRef.current = playbackAnalyser;

      const ws = new WebSocket(wsUrl());
      ws.binaryType = 'arraybuffer';
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({
          type: 'init',
          eventTypeSlug: eventTypeSlug || 'discovery-call',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }));
      };

      ws.onmessage = (evt) => {
        if (typeof evt.data === 'string') {
          try { handleControlMessage(JSON.parse(evt.data)); } catch { /* noop */ }
        } else {
          playChunk(evt.data);
        }
      };

      ws.onerror = () => {
        setError('Voice Assistant connection failed.');
        setStateBoth('error');
      };

      ws.onclose = (evt) => {
        if (stateRef.current !== 'unavailable' && stateRef.current !== 'error' && evt.code !== 1000) {
          setError(evt.reason || 'Voice Assistant disconnected.');
          setStateBoth('error');
        }
      };

      worklet.port.onmessage = (e) => {
        const { samples, sampleRate } = e.data;
        if (ws.readyState !== WebSocket.OPEN) return;
        const resampled = resampleTo16k(samples, sampleRate);
        ws.send(floatTo16BitPCM(resampled));
      };

      // Barge-in meter: watch mic energy while the assistant is speaking.
      const timeDomain = new Uint8Array(analyser.fftSize);
      const tick = () => {
        analyser.getByteTimeDomainData(timeDomain);
        let sumSquares = 0;
        for (let i = 0; i < timeDomain.length; i++) {
          const v = (timeDomain[i] - 128) / 128;
          sumSquares += v * v;
        }
        const rms = Math.sqrt(sumSquares / timeDomain.length);

        if (stateRef.current === 'speaking' && rms > BARGE_IN_RMS_THRESHOLD) {
          bargeInStreakRef.current += 1;
          if (bargeInStreakRef.current >= BARGE_IN_CONSECUTIVE_FRAMES) {
            bargeInStreakRef.current = 0;
            sendBargeIn();
          }
        } else {
          bargeInStreakRef.current = 0;
        }
        bargeInMeterRef.current = requestAnimationFrame(tick);
      };
      bargeInMeterRef.current = requestAnimationFrame(tick);
    } catch (err) {
      setError(err?.message || 'Could not start Voice Assistant.');
      setStateBoth('error');
      stop();
    }
  }, [eventTypeSlug, handleControlMessage, playChunk, sendBargeIn, setStateBoth, stop]);

  const toggle = useCallback(() => {
    if (state === 'idle' || state === 'unavailable' || state === 'error') start();
    else stop();
  }, [state, start, stop]);

  useEffect(() => () => stop(), [stop]);

  return {
    state,
    interimTranscript,
    assistantText,
    error,
    start,
    stop,
    toggle,
    micAnalyser: micAnalyserRef,
    playbackAnalyser: playbackAnalyserRef,
  };
}
