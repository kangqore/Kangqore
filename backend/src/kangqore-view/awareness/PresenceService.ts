import { prisma } from '../../lib/prisma';
import { redisConnection as redis } from '../../lib/redis';

type PresenceStatus = 'ONLINE' | 'AWAY' | 'DND' | 'OFFLINE';

const PRESENCE_KEY = (userId: string) => `presence:${userId}`;

// Track pending offline timers to cancel on re-connect
const offlineTimers = new Map<string, ReturnType<typeof setTimeout>>();

export async function setPresence(
  userId: string,
  status: PresenceStatus,
  customStatus?: string | null,
): Promise<void> {
  try {
    const payload = JSON.stringify({ status, updatedAt: Date.now() });
    await redis.set(PRESENCE_KEY(userId), payload, 'EX', 300); // 5-min TTL

    await prisma.userPresence.upsert({
      where: { userId },
      create: { userId, status, customStatus: customStatus ?? null, lastSeenAt: new Date() },
      update: { status, customStatus: customStatus ?? null, lastSeenAt: new Date() },
    });
  } catch { /* non-fatal */ }
}

export async function getPresence(userId: string): Promise<{ status: PresenceStatus; customStatus?: string | null }> {
  try {
    const raw = await redis.get(PRESENCE_KEY(userId));
    if (raw) {
      const parsed = JSON.parse(raw);
      // Expire stale Redis entry as offline
      if (Date.now() - parsed.updatedAt > 290_000) return { status: 'OFFLINE' };
      return { status: parsed.status };
    }
  } catch { }

  try {
    const record = await prisma.userPresence.findUnique({ where: { userId } });
    return { status: (record?.status as PresenceStatus) ?? 'OFFLINE', customStatus: record?.customStatus };
  } catch {
    return { status: 'OFFLINE' };
  }
}

export async function getBulkPresence(userIds: string[]): Promise<Record<string, PresenceStatus>> {
  if (!userIds.length) return {};

  const result: Record<string, PresenceStatus> = {};
  try {
    const keys = userIds.map(PRESENCE_KEY);
    const values = await redis.mget(...keys);
    userIds.forEach((id, i) => {
      const raw = values[i];
      if (raw) {
        try { result[id] = JSON.parse(raw).status; } catch { result[id] = 'OFFLINE'; }
      } else {
        result[id] = 'OFFLINE';
      }
    });
  } catch {
    userIds.forEach((id) => { result[id] = 'OFFLINE'; });
  }
  return result;
}

export function onConnect(userId: string): void {
  // Cancel any pending offline timer
  const timer = offlineTimers.get(userId);
  if (timer) {
    clearTimeout(timer);
    offlineTimers.delete(userId);
  }
  setPresence(userId, 'ONLINE').catch(() => {});
}

export function onDisconnect(userId: string, hasOtherSockets: boolean, emitPresence: (userId: string, status: string) => void): void {
  if (hasOtherSockets) return; // still connected on another tab

  // 30-second grace period before marking offline
  const timer = setTimeout(async () => {
    offlineTimers.delete(userId);
    await setPresence(userId, 'OFFLINE');
    emitPresence(userId, 'OFFLINE');
  }, 30_000);

  offlineTimers.set(userId, timer);
}
