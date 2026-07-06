// ---------------------------------------------------------------------------
// LocalReasonService — Gen 2 inference layer
//
// Supports two backends for the KIMMP REASON phase local model:
//
//   1. MLX server  (mlx_lm.server — Apple Silicon, OpenAI-compatible API)
//      KIMMP_MLX_SERVER_URL  = http://localhost:11435
//      KIMMP_MLX_MODEL       = /path/to/fused  (or HF model ID)
//
//   2. Ollama      (ollama serve — OpenAI-compatible via /api/chat)
//      KIMMP_OLLAMA_URL          = http://localhost:11434
//      KIMMP_LOCAL_REASON_MODEL  = kimmp-reason:latest
//
// MLX server is tried first (lower latency on Apple Silicon).
// Falls back to Ollama, then to Claude if both are unavailable.
// ---------------------------------------------------------------------------

import logger from '../utils/logger'

interface OAIChatResponse {
  choices?: { message?: { content?: string } }[]
}

interface OllamaChatResponse {
  message?: { role: string; content: string }
  done?: boolean
}

interface OllamaTagsResponse {
  models?: { name: string; size?: number }[]
}

export interface LocalReasonResult {
  completion: string
  latencyMs:  number
  model:      string
  backend:    'mlx' | 'ollama'
}

export interface LocalModelStatus {
  available:     boolean
  backend:       'mlx' | 'ollama' | 'none'
  model:         string
  serverUrl:     string
  loadedModels?: string[]
  note?:         string
}

export class LocalReasonService {
  // MLX server (mlx_lm.server — OpenAI-compatible)
  private static readonly MLX_URL   = process.env.KIMMP_MLX_SERVER_URL ?? 'http://localhost:11435'
  private static readonly MLX_MODEL = process.env.KIMMP_MLX_MODEL ?? '/private/tmp/kimmp-reason-v1/fused'

  // Ollama fallback
  private static readonly OLLAMA_URL   = process.env.KIMMP_OLLAMA_URL ?? 'http://localhost:11434'
  private static readonly OLLAMA_MODEL = process.env.KIMMP_LOCAL_REASON_MODEL ?? 'kimmp-reason:latest'

  private static _status: LocalModelStatus | null = null
  private static _lastCheck = 0

  static async isAvailable(): Promise<boolean> {
    const s = await this.status()
    return s.available
  }

  static async reason(systemPrompt: string, userPrompt: string): Promise<LocalReasonResult | null> {
    const st = await this.status()
    if (!st.available) return null

    const start = Date.now()

    if (st.backend === 'mlx') {
      try {
        const res = await fetch(`${this.MLX_URL}/v1/chat/completions`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model:       this.MLX_MODEL,
            temperature: 0.05,
            max_tokens:  512,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user',   content: userPrompt   },
            ],
          }),
          signal: AbortSignal.timeout(20_000),
        })
        if (!res.ok) return null
        const data  = await res.json() as OAIChatResponse
        const completion = data.choices?.[0]?.message?.content ?? ''
        if (!completion.trim()) return null
        const latencyMs = Date.now() - start
        logger.info(`[KIMMP:GEN2] MLX ${latencyMs}ms`)
        return { completion, latencyMs, model: this.MLX_MODEL, backend: 'mlx' }
      } catch (err: any) {
        logger.debug(`[KIMMP:GEN2] MLX failed: ${err.message}`)
        return null
      }
    }

    if (st.backend === 'ollama') {
      try {
        const res = await fetch(`${this.OLLAMA_URL}/api/chat`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model:    this.OLLAMA_MODEL,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user',   content: userPrompt   },
            ],
            stream:  false,
            options: { temperature: 0.05, num_predict: 512 },
          }),
          signal: AbortSignal.timeout(20_000),
        })
        if (!res.ok) return null
        const data = await res.json() as OllamaChatResponse
        const completion = data.message?.content ?? ''
        if (!completion.trim()) return null
        const latencyMs = Date.now() - start
        logger.info(`[KIMMP:GEN2] Ollama ${latencyMs}ms`)
        return { completion, latencyMs, model: this.OLLAMA_MODEL, backend: 'ollama' }
      } catch (err: any) {
        logger.debug(`[KIMMP:GEN2] Ollama failed: ${err.message}`)
        return null
      }
    }

    return null
  }

  static async status(): Promise<LocalModelStatus> {
    const now = Date.now()
    if (this._status && now - this._lastCheck < 30_000) return this._status

    // Try MLX server first
    try {
      const res = await fetch(`${this.MLX_URL}/v1/models`, { signal: AbortSignal.timeout(2_000) })
      if (res.ok) {
        const data = await res.json() as { data?: { id: string }[] }
        const loaded = (data.data ?? []).map(m => m.id)
        this._status = {
          available: true, backend: 'mlx',
          model: this.MLX_MODEL, serverUrl: this.MLX_URL,
          loadedModels: loaded,
          note: `kimmp-reason-v1 (MLX) serving at ${this.MLX_URL} — REASON phase uses local model`,
        }
        this._lastCheck = now
        return this._status
      }
    } catch { /* fall through */ }

    // Try Ollama
    try {
      const res = await fetch(`${this.OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(2_000) })
      if (res.ok) {
        const data = await res.json() as OllamaTagsResponse
        const loaded = (data.models ?? []).map(m => m.name)
        const modelBase = this.OLLAMA_MODEL.split(':')[0]
        const found = loaded.some(m => m.startsWith(modelBase))
        this._status = {
          available: found, backend: found ? 'ollama' : 'none',
          model: this.OLLAMA_MODEL, serverUrl: this.OLLAMA_URL,
          loadedModels: loaded,
          note: found
            ? `${this.OLLAMA_MODEL} (Ollama) ready — REASON phase uses local model`
            : `Ollama reachable but ${this.OLLAMA_MODEL} not loaded. Run: ollama pull ${this.OLLAMA_MODEL}`,
        }
        this._lastCheck = now
        return this._status
      }
    } catch { /* fall through */ }

    this._status = {
      available: false, backend: 'none',
      model: this.MLX_MODEL, serverUrl: this.MLX_URL,
      note: `No local model available. Start MLX server: python -m mlx_lm server --model /tmp/kimmp-reason-v1/fused --port 11435`,
    }
    this._lastCheck = now
    return this._status
  }
}
