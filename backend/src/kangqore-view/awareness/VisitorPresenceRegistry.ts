// In-memory registry of visitors currently on the public site.
// Entries expire after 90s without a heartbeat — no DB involved.

export interface PresenceEntry {
  visitorUuid:   string
  path:          string
  title:         string
  country:       string | null
  city:          string | null
  sessionCount:  number
  isLead:        boolean
  stitchedName:  string | null
  stitchedEmail: string | null
  updatedAt:     number
}

const registry = new Map<string, PresenceEntry>()
const TTL_MS   = 90_000

export function upsertPresence(entry: Omit<PresenceEntry, 'updatedAt'>): void {
  registry.set(entry.visitorUuid, { ...entry, updatedAt: Date.now() })
  pruneStale()
}

export function removePresence(visitorUuid: string): void {
  registry.delete(visitorUuid)
}

export function getActivePresence(): PresenceEntry[] {
  pruneStale()
  return [...registry.values()].sort((a, b) => b.sessionCount - a.sessionCount || b.updatedAt - a.updatedAt)
}

function pruneStale(): void {
  const cutoff = Date.now() - TTL_MS
  for (const [uuid, entry] of registry) {
    if (entry.updatedAt < cutoff) registry.delete(uuid)
  }
}
