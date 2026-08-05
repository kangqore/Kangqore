/**
 * voiceGateway.ts
 * ─────────────────────────────────────────────────────────────
 * Public, unauthenticated WebSocket endpoint for the fluent eQORE
 * VoiceAssistant on the booking surfaces (BookingWidget / BookingPage).
 *
 * Wire protocol (client <-> server):
 *   Binary frames  — raw linear16 PCM mono @16kHz audio, both directions
 *                    (client mic -> server while listening; server TTS
 *                    -> client while speaking).
 *   Text frames    — JSON control messages:
 *     client -> server: {type:'init', eventTypeSlug, timezone}
 *                       {type:'barge_in'}
 *                       {type:'end_session'}
 *     server -> client: {type:'state', value:'listening'|'thinking'|'speaking'}
 *                       {type:'transcript', text, isFinal}
 *                       {type:'assistant_text', text}
 *                       {type:'booking_action', targetDate, timeStr, timeRange, summary}
 *                       {type:'assistant_interrupted'}
 *                       {type:'error', code, message}
 *
 * Requires DEEPGRAM_API_KEY + ELEVENLABS_API_KEY + ELEVENLABS_VOICE_ID.
 * Without them, every connection is closed immediately with a clear
 * 'not configured' error so the frontend can show a disabled state
 * instead of hanging.
 */

import { Server as HttpServer, IncomingMessage } from 'http';
import { WebSocketServer, WebSocket, RawData } from 'ws';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { prisma } from '../lib/prisma';
import logger from '../utils/logger';
import { DeepgramSttSession } from './deepgramSttSession';
import { ElevenLabsTtsStream } from './elevenLabsTtsStream';
import { processVoiceTurn, VoiceTurn } from './voiceConversationAgent';

const VOICE_WS_PATH = '/ws/voice/booking';
const MAX_SESSION_MS = parseInt(process.env.VOICE_SESSION_MAX_MS || '360000', 10); // 6 min
const INIT_TIMEOUT_MS = 10000;

const sessionLimiter = new RateLimiterMemory({
  points: parseInt(process.env.VOICE_RATE_LIMIT_POINTS || '10', 10),
  duration: parseInt(process.env.VOICE_RATE_LIMIT_DURATION || '3600', 10),
} as any);

function clientIp(req: IncomingMessage): string {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length) return fwd.split(',')[0].trim();
  return req.socket.remoteAddress || 'unknown';
}

function sendJson(ws: WebSocket, msg: Record<string, unknown>) {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg));
}

function closeWithError(ws: WebSocket, code: string, message: string, closeCode = 4000) {
  sendJson(ws, { type: 'error', code, message });
  try {
    ws.close(closeCode, code);
  } catch {
    /* noop */
  }
}

export function initializeVoiceGateway(httpServer: HttpServer) {
  const wss = new WebSocketServer({ server: httpServer, path: VOICE_WS_PATH });

  wss.on('connection', async (ws: WebSocket, req: IncomingMessage) => {
    const ip = clientIp(req);

    try {
      await sessionLimiter.consume(ip);
    } catch {
      closeWithError(ws, 'RATE_LIMITED', 'Too many voice sessions — please try again shortly.', 4029);
      return;
    }

    const deepgramKey = process.env.DEEPGRAM_API_KEY;
    const elevenLabsKey = process.env.ELEVENLABS_API_KEY;
    const elevenLabsVoiceId = process.env.ELEVENLABS_VOICE_ID;

    if (!deepgramKey || !elevenLabsKey || !elevenLabsVoiceId) {
      closeWithError(
        ws,
        'VOICE_NOT_CONFIGURED',
        'Voice Assistant is not yet configured on this server.',
        4001,
      );
      return;
    }

    let initialized = false;
    let context: { eventTypeName: string; duration: number; timezone: string } | null = null;
    const history: VoiceTurn[] = [];
    let stt: DeepgramSttSession | null = null;
    let activeTts: ElevenLabsTtsStream | null = null;
    let closed = false;

    const sessionTimer = setTimeout(() => {
      closeWithError(ws, 'SESSION_TIMEOUT', 'Voice session timed out.', 4002);
    }, MAX_SESSION_MS);

    const initTimer = setTimeout(() => {
      if (!initialized) {
        closeWithError(ws, 'INIT_TIMEOUT', 'No init message received.', 4003);
      }
    }, INIT_TIMEOUT_MS);

    const cleanup = () => {
      if (closed) return;
      closed = true;
      clearTimeout(sessionTimer);
      clearTimeout(initTimer);
      stt?.close();
      activeTts?.close();
    };

    const startSttSession = () => {
      stt = new DeepgramSttSession({
        apiKey: deepgramKey,
        onTranscript: async (t) => {
          if (!context) return;

          if (!t.isFinal) {
            sendJson(ws, { type: 'transcript', text: t.text, isFinal: false });
            return;
          }

          sendJson(ws, { type: 'transcript', text: t.text, isFinal: true });
          if (!t.speechFinal) return; // wait for end-of-utterance before triggering a turn

          history.push({ role: 'user', text: t.text });
          sendJson(ws, { type: 'state', value: 'thinking' });

          const result = await processVoiceTurn(t.text, history, context);
          if (closed) return;
          history.push({ role: 'assistant', text: result.replyText });

          sendJson(ws, { type: 'assistant_text', text: result.replyText });
          if (result.bookingAction) {
            sendJson(ws, { type: 'booking_action', ...result.bookingAction });
          }

          sendJson(ws, { type: 'state', value: 'speaking' });
          speak(result.replyText);
        },
        onError: (err) => {
          logger.error('[voiceGateway] STT session error', { err: err.message });
          closeWithError(ws, 'STT_ERROR', 'Speech recognition failed.', 4004);
        },
      });
    };

    const speak = (text: string) => {
      activeTts?.close();
      const tts = new ElevenLabsTtsStream({
        apiKey: elevenLabsKey!,
        voiceId: elevenLabsVoiceId!,
        onAudioChunk: (chunk) => {
          if (ws.readyState === WebSocket.OPEN) ws.send(chunk, { binary: true });
        },
        onDone: () => {
          if (activeTts === tts) activeTts = null;
          sendJson(ws, { type: 'state', value: 'listening' });
        },
        onError: (err) => {
          logger.error('[voiceGateway] TTS stream error', { err: err.message });
          if (activeTts === tts) activeTts = null;
          sendJson(ws, { type: 'state', value: 'listening' });
        },
      });
      activeTts = tts;
      tts.sendText(text);
      tts.flush();
    };

    ws.on('message', async (data: RawData, isBinary: boolean) => {
      if (isBinary) {
        const buf = Buffer.isBuffer(data) ? data : Buffer.from(data as ArrayBuffer);
        stt?.sendAudio(buf);
        return;
      }

      let msg: any;
      try {
        msg = JSON.parse(data.toString());
      } catch {
        return;
      }

      if (msg.type === 'init' && !initialized) {
        clearTimeout(initTimer);
        const slug = typeof msg.eventTypeSlug === 'string' ? msg.eventTypeSlug : 'discovery-call';
        const timezone = typeof msg.timezone === 'string' ? msg.timezone : 'UTC';

        const eventType = await prisma.eventType.findUnique({ where: { slug } });
        if (!eventType) {
          closeWithError(ws, 'EVENT_TYPE_NOT_FOUND', `Unknown event type "${slug}".`, 4005);
          return;
        }

        context = { eventTypeName: eventType.name, duration: eventType.duration, timezone };
        initialized = true;
        startSttSession();
        sendJson(ws, { type: 'state', value: 'listening' });
      } else if (msg.type === 'barge_in') {
        if (activeTts) {
          activeTts.close();
          activeTts = null;
          sendJson(ws, { type: 'assistant_interrupted' });
          sendJson(ws, { type: 'state', value: 'listening' });
        }
      } else if (msg.type === 'end_session') {
        cleanup();
        ws.close(1000, 'client_ended');
      }
    });

    ws.on('close', cleanup);
    ws.on('error', (err) => {
      logger.error('[voiceGateway] connection error', { err: err.message });
      cleanup();
    });
  });

  logger.info(`[voiceGateway] Voice Assistant WebSocket gateway mounted at ${VOICE_WS_PATH}`);
  return wss;
}
