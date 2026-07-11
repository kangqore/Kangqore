// Activity Runtime
// Generation III Runtime

/**
 * Tracks user behavior, telemetry, and UX analytics.
 * Feeds into the Enterprise Memory.
 */
export class ActivityRuntime {
    public logActivity(activityType: string, entityId: string, metadata?: any) {
        // Map to valid adoption event types recognised by /api/admin/adoption/event
        const ADOPTION_TYPE: Record<string, string> = {
            AI_INVOKE: 'AGENT_INVOKE', WORKFLOW: 'WORKFLOW_TRIGGER',
            DECISION_ACCEPT: 'DECISION_ACCEPT', DECISION_REJECT: 'DECISION_REJECT',
            OVERRIDE: 'OVERRIDE', REC_ACTED: 'REC_ACTED', REC_IGNORED: 'REC_IGNORED',
        }
        const eventType = ADOPTION_TYPE[activityType] ?? 'SESSION'
        fetch('/api/admin/adoption/event', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eventType, entityType: activityType, entityId, metadata }),
        }).catch(() => {})
    }
}
