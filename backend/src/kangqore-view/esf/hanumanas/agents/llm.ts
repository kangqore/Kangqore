import Anthropic from '@anthropic-ai/sdk'
import { withKrisnam } from '../../../../kangqore-immp/llm/krisnamAnthropic'
import { logCall, scanPii } from '../../../kimmp/gateway/KimmpGatewayCore'
import { PromptRegistry } from '../../../../kangqore-immp/wir/promptRegistry.service'
import { HANUMANAS } from '../identity'

const client = withKrisnam(new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' }))

// S308 — explicit gateway logging with actorType:'HANUMANAS'. This is the shared
// helper ~40 HANUMANAS engine agent files call, so instrumenting it here covers
// all of them without touching each file. The passive withKrisnam() logger
// skips HANUMANAS-attributed calls (see krisnamAnthropic.ts logGatewayCall) to
// avoid double-counting the same call from both places.
export async function callLLM(
  system: string,
  user: string,
  maxTokens = 500,
  // S311 — same registry-backed override as kimmpLLMRouter.routedCall/
  // withKrisnam: resolved via PromptRegistry, falls back to `system` on a miss.
  promptName?: string,
): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) return ''
  const start = Date.now()

  let resolvedSystem = system
  let promptVersion: number | null = null
  if (promptName) {
    const resolved = await PromptRegistry.getWithVersion(promptName).catch(() => null)
    if (resolved) { resolvedSystem = resolved.content; promptVersion = resolved.version }
  }

  try {
    const res = await client.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens:  maxTokens,
      temperature: 0.1,
      system:      resolvedSystem,
      messages: [{ role: 'user', content: user }],
    })
    const text = res.content[0]?.type === 'text' ? res.content[0].text : ''
    const provider = res.id?.toString().startsWith('krisnam_') ? 'krisnam' : 'claude'
    scanPii(resolvedSystem + '\n' + user).then(scan => logCall({
      actorType: HANUMANAS.name, model: res.model, provider,
      promptTokens: res.usage?.input_tokens ?? 0,
      completionTokens: res.usage?.output_tokens ?? 0,
      latencyMs: Date.now() - start,
      prompt: resolvedSystem + '\n' + user, response: text,
      sourceModule: 'kangqore-view/esf/hanumanas/agents/llm.ts',
      promptName: promptName ?? null, promptVersion,
      status: 'SUCCESS',
      piiDetected: scan.detected, piiPatterns: scan.patterns,
    })).catch(() => {})
    return text
  } catch (err) {
    logCall({
      actorType: HANUMANAS.name, model: 'claude-haiku-4-5-20251001', provider: 'none',
      prompt: resolvedSystem + '\n' + user, response: '',
      sourceModule: 'kangqore-view/esf/hanumanas/agents/llm.ts',
      promptName: promptName ?? null, promptVersion,
      status: 'ERROR',
      errorMessage: (err as Error).message, latencyMs: Date.now() - start,
    }).catch(() => {})
    return ''
  }
}
