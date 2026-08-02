import Anthropic from '@anthropic-ai/sdk'
import { withWaandax } from '../../kangqore-immp/llm/waandaxAnthropic'
import { logCall, scanPii } from '../../services/kimmpGatewayCore'

const client = withWaandax(new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' }))

// S308 — explicit gateway logging with actorType:'AEGIS'. This is the shared
// helper ~40 AEGIS engine agent files call, so instrumenting it here covers
// all of them without touching each file. The passive withWaandax() logger
// skips AEGIS-attributed calls (see waandaxAnthropic.ts logGatewayCall) to
// avoid double-counting the same call from both places.
export async function callLLM(
  system: string,
  user: string,
  maxTokens = 500,
): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) return ''
  const start = Date.now()
  try {
    const res = await client.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens:  maxTokens,
      temperature: 0.1,
      system,
      messages: [{ role: 'user', content: user }],
    })
    const text = res.content[0]?.type === 'text' ? res.content[0].text : ''
    const provider = res.id?.toString().startsWith('waandax_') ? 'waandax' : 'claude'
    scanPii(system + '\n' + user).then(scan => logCall({
      actorType: 'AEGIS', model: res.model, provider,
      promptTokens: res.usage?.input_tokens ?? 0,
      completionTokens: res.usage?.output_tokens ?? 0,
      latencyMs: Date.now() - start,
      prompt: system + '\n' + user, response: text,
      sourceModule: 'kangqore-aegis/agents/llm.ts', status: 'SUCCESS',
      piiDetected: scan.detected, piiPatterns: scan.patterns,
    })).catch(() => {})
    return text
  } catch (err) {
    logCall({
      actorType: 'AEGIS', model: 'claude-haiku-4-5-20251001', provider: 'none',
      prompt: system + '\n' + user, response: '',
      sourceModule: 'kangqore-aegis/agents/llm.ts', status: 'ERROR',
      errorMessage: (err as Error).message, latencyMs: Date.now() - start,
    }).catch(() => {})
    return ''
  }
}
