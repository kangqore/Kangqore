// WAANDA AI Capability Provider
// Generation III Runtime — registered in CapabilityBroker at OSBootstrap time.
// Handles all cap.ai.* and ecf.waanda capability invocations from widgets.
// Routes to POST /api/admin/waanda/query → MissionDispatcher → KIMMP runtime.

export class WaandaAIProvider {
  public readonly name: string

  constructor(private readonly capability: string) {
    this.name = `WaandaAI[${capability}]`
  }

  public async execute(inputs: { prompt: string; [key: string]: any }): Promise<{
    ok: boolean
    response: unknown
    capability: string
  }> {
    const workspaceId = (inputs as any).workspaceId ?? 'unknown'

    const res = await fetch('/api/admin/waanda/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt:      inputs.prompt,
        capability:  this.capability,
        workspaceId,
      }),
    })

    if (!res.ok) {
      throw new Error(`[WaandaAIProvider:${this.capability}] Query failed — HTTP ${res.status}`)
    }

    return res.json()
  }
}
