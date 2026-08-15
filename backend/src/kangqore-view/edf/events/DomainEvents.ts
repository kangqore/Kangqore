export type DomainEventType =
  | 'DOMAIN_REGISTERED'
  | 'DOMAIN_UPDATED'
  | 'DOMAIN_DEACTIVATED'
  | 'OBJECT_CREATED'
  | 'OBJECT_UPDATED'
  | 'KPI_BREACHED'
  | 'KPI_RECOVERED'
  | 'CAPABILITY_ACTIVATED'
  | 'CAPABILITY_DEACTIVATED'
  | 'GOAL_ACHIEVED'
  | 'GOAL_AT_RISK'

export interface DomainEvent {
  eventId: string
  type: DomainEventType
  domainId: string
  payload: Record<string, unknown>
  occurredAt: Date
}

export function createDomainEvent(
  type: DomainEventType,
  domainId: string,
  payload: Record<string, unknown> = {}
): DomainEvent {
  return {
    eventId:    `evt_${type}_${Date.now()}`,
    type,
    domainId,
    payload,
    occurredAt: new Date(),
  }
}
