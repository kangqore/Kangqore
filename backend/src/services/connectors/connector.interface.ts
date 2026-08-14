export interface ConnectorResult {
  connector: string
  status: 'OK' | 'SKIPPED' | 'ERROR'
  message: string
  data?: Record<string, any>
}

export interface ConnectorContext {
  actionName: string
  params: Record<string, any>
  actorId?: string | null
  actorType?: string
}

export interface Connector {
  name: string
  supports(actionName: string): boolean
  execute(ctx: ConnectorContext): Promise<ConnectorResult>
}
