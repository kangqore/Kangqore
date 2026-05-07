import { useCallback, useEffect, useRef, useState } from 'react';

function getSpeechRecognition() {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function useVoiceInput({ onFinal } = {}) {
  const SpeechRecognition = getSpeechRecognition();
  const supported = Boolean(SpeechRecognition);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const onFinalRef = useRef(onFinal);
  onFinalRef.current = onFinal;

  useEffect(() => () => {
    try {
      recognitionRef.current?.stop();
    } catch {
      /* noop */
    }
  }, []);

  const start = useCallback(() => {
    if (!supported || listening) return;
    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang =
        (typeof navigator !== 'undefined' && navigator.language) || 'en-US';
      rec.onstart = () => {
        setListening(true);
        setError(null);
        setInterim('');
      };
      rec.onerror = (e) => {
        setError(e?.error || 'speech-error');
        setListening(false);
      };
      rec.onend = () => {
        setListening(false);
      };
      rec.onresult = (event) => {
        let interimText = '';
        let finalText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const r = event.results[i];
          if (r.isFinal) finalText += r[0].transcript;
          else interimText += r[0].transcript;
        }
        if (interimText) setInterim(interimText);
        if (finalText) {
          setInterim('');
          onFinalRef.current?.(finalText.trim());
        }
      };
      recognitionRef.current = rec;
      rec.start();
    } catch (e) {
      setError(e?.message || 'speech-init-failed');
      setListening(false);
    }
  }, [SpeechRecognition, supported, listening]);

  const stop = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {
      /* noop */
    }
  }, []);

  const toggle = useCallback(() => {
    if (listening) stop();
    else start();
  }, [listening, start, stop]);

  return { supported, listening, interim, error, start, stop, toggle };
}
