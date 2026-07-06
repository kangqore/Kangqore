export type Platform = 'slack' | 'jira' | 'github' | 'salesforce'

export interface IntegrationConfig {
  [key: string]: string
}

export interface IntegrationAction {
  platform:  Platform
  action:    string
  params:    Record<string, any>
}

export interface IntegrationResult {
  ok:      boolean
  summary: string
  data?:   any
  error?:  string
}

export interface IntegrationTestResult {
  ok:      boolean
  message: string
}

export interface IntegrationAdapter {
  test(config: IntegrationConfig): Promise<IntegrationTestResult>
  execute(action: string, params: Record<string, any>, config: IntegrationConfig): Promise<IntegrationResult>
  actions(): string[]
}
