import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' })

export async function callLLM(
  system: string,
  user: string,
  maxTokens = 500,
): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) return ''
  try {
    const res = await client.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens:  maxTokens,
      temperature: 0.1,
      system,
      messages: [{ role: 'user', content: user }],
    })
    return res.content[0]?.type === 'text' ? res.content[0].text : ''
  } catch {
    return ''
  }
}
