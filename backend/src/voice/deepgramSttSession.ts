/**
 * deepgramSttSession.ts
 * ─────────────────────────────────────────────────────────────
 * Thin wrapper around a single Deepgram live-transcription WebSocket
 * connection. One instance per voice-gateway client session.
 *
 * Wire format: https://developers.deepgram.com/docs/live-streaming-audio
 * Client sends raw linear16 PCM binary frames; Deepgram pushes back JSON
 * transcript events. Requires DEEPGRAM_API_KEY.
 */

import WebSocket from 'ws';
import logger from '../utils/logger';

const DEEPGRAM_LISTEN_URL = 'wss://api.deepgram.com/v1/listen';

export interface DeepgramTranscript {
  text: string;
  isFinal: boolean;
  speechFinal: boolean;
}

interface DeepgramSttSessionOptions {
  apiKey: string;
  sampleRate?: number;
  onTranscript: (t: DeepgramTranscript) => void;
  onError: (err: Error) => void;
  onClose?: () => void;
}

export class DeepgramSttSession {
  private ws: WebSocket | null = null;
  private ready = false;
  private queue: Buffer[] = [];
  private closed = false;

  constructor(private opts: DeepgramSttSessionOptions) {
    const sampleRate = opts.sampleRate ?? 16000;
    const params = new URLSearchParams({
      encoding: 'linear16',
      sample_rate: String(sampleRate),
      channels: '1',
      model: 'nova-2',
      interim_results: 'true',
      smart_format: 'true',
      endpointing: '300',
      vad_events: 'true',
    });

    this.ws = new WebSocket(`${DEEPGRAM_LISTEN_URL}?${params.toString()}`, {
      headers: { Authorization: `Token ${opts.apiKey}` },
    });

    this.ws.on('open', () => {
      this.ready = true;
      for (const chunk of this.queue) this.ws?.send(chunk);
      this.queue = [];
    });

    this.ws.on('message', (data, isBinary) => {
      if (isBinary) return;
      try {
        const msg = JSON.parse(data.toString());
        if (msg.type !== 'Results') return;
        const alt = msg.channel?.alternatives?.[0];
        const text: string = alt?.transcript ?? '';
        if (!text) return;
        this.opts.onTranscript({
          text,
          isFinal: !!msg.is_final,
          speechFinal: !!msg.speech_final,
        });
      } catch (err) {
        logger.warn('[DeepgramSttSession] failed to parse message', { err: (err as Error).message });
      }
    });

    this.ws.on('error', (err) => {
      logger.error('[DeepgramSttSession] socket error', { err: err.message });
      this.opts.onError(err);
    });

    this.ws.on('close', () => {
      this.ready = false;
      this.opts.onClose?.();
    });
  }

  /** Feed raw linear16 PCM mono audio at the configured sample rate. */
  sendAudio(chunk: Buffer) {
    if (this.closed) return;
    if (this.ready && this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(chunk);
    } else {
      // Buffer briefly while the handshake completes rather than dropping audio.
      this.queue.push(chunk);
      if (this.queue.length > 200) this.queue.shift(); // ~200 chunks safety cap
    }
  }

  close() {
    if (this.closed) return;
    this.closed = true;
    try {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'CloseStream' }));
      }
      this.ws?.close();
    } catch {
      /* noop */
    }
  }
}
