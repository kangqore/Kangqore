/**
 * elevenLabsTtsStream.ts
 * ─────────────────────────────────────────────────────────────
 * Thin wrapper around ElevenLabs' streaming text-to-speech WebSocket
 * ("stream-input"). Feed it text incrementally, get raw PCM16 audio
 * chunks back as they're generated. Requires ELEVENLABS_API_KEY.
 *
 * Wire format: https://elevenlabs.io/docs/api-reference/websockets
 * output_format=pcm_16000 gives raw 16-bit PCM @ 16kHz mono, which the
 * client can play directly via Web Audio without decoding MP3/Opus.
 */

import WebSocket from 'ws';
import logger from '../utils/logger';

const DEFAULT_MODEL_ID = 'eleven_turbo_v2_5';

interface ElevenLabsTtsStreamOptions {
  apiKey: string;
  voiceId: string;
  modelId?: string;
  onAudioChunk: (chunk: Buffer) => void;
  onDone: () => void;
  onError: (err: Error) => void;
}

export class ElevenLabsTtsStream {
  private ws: WebSocket;
  private ready = false;
  private pendingText: string[] = [];
  private closed = false;

  constructor(private opts: ElevenLabsTtsStreamOptions) {
    const modelId = opts.modelId ?? DEFAULT_MODEL_ID;
    const url = `wss://api.elevenlabs.io/v1/text-to-speech/${opts.voiceId}/stream-input?model_id=${modelId}&output_format=pcm_16000`;

    this.ws = new WebSocket(url);

    this.ws.on('open', () => {
      this.ready = true;
      // BOS (beginning-of-stream) message primes the connection with auth + voice settings.
      this.ws.send(JSON.stringify({
        text: ' ',
        voice_settings: { stability: 0.5, similarity_boost: 0.8 },
        xi_api_key: this.opts.apiKey,
      }));
      for (const t of this.pendingText) this.sendChunk(t);
      this.pendingText = [];
    });

    this.ws.on('message', (data, isBinary) => {
      if (isBinary) return;
      try {
        const msg = JSON.parse(data.toString());
        if (msg.audio) {
          this.opts.onAudioChunk(Buffer.from(msg.audio, 'base64'));
        }
        if (msg.isFinal) {
          this.opts.onDone();
        }
      } catch (err) {
        logger.warn('[ElevenLabsTtsStream] failed to parse message', { err: (err as Error).message });
      }
    });

    this.ws.on('error', (err) => {
      logger.error('[ElevenLabsTtsStream] socket error', { err: err.message });
      this.opts.onError(err);
    });

    this.ws.on('close', () => {
      this.ready = false;
    });
  }

  private sendChunk(text: string) {
    this.ws.send(JSON.stringify({ text, try_trigger_generation: true }));
  }

  /** Queue a chunk of assistant reply text to be synthesized. */
  sendText(text: string) {
    if (this.closed || !text) return;
    if (this.ready && this.ws.readyState === WebSocket.OPEN) {
      this.sendChunk(text);
    } else {
      this.pendingText.push(text);
    }
  }

  /** Signal end of text — flushes any remaining audio, then the session emits onDone(). */
  flush() {
    if (this.closed) return;
    if (this.ready && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ text: '' }));
    }
  }

  /** Hard-stop mid-generation (used for barge-in interruption). */
  close() {
    if (this.closed) return;
    this.closed = true;
    try {
      this.ws.close();
    } catch {
      /* noop */
    }
  }
}
