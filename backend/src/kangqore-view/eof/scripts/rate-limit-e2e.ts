/**
 * Rate limiter probe — buckets must be per-identity, and unforgeable.
 *
 * The bug this guards: one shared IP bucket meant every user on the system
 * competed for 1000 requests per 15 minutes, while a single OS page load costs
 * 24. The API returned 429 to everyone after ~41 loads in total.
 *
 * The bug the FIX could have introduced, which matters more: if the bucket key
 * came from an unverified Authorization header, anyone could mint unlimited
 * windows by randomising it — strictly worse than the shared bucket. §3 is the
 * assertion that actually protects the change.
 *
 * Run: npx tsx src/kangqore-view/eof/scripts/rate-limit-e2e.ts
 */

import { rateLimiterMiddleware } from '../../../middleware/rateLimiter';
import { generateTokenPair } from '../../kernel/auth/TokenService';

let pass = 0, fail = 0;
const check = (l: string, c: boolean, d = '') => {
  if (c) { pass++; console.log(`  ✓ ${l}`); } else { fail++; console.log(`  ✗ ${l} ${d}`); }
};

/** Drive the middleware directly — no HTTP, no server, no ports. */
function call(opts: { ip: string; token?: string }): Promise<number> {
  return new Promise(resolve => {
    const req: any = {
      ip: opts.ip,
      headers: opts.token ? { authorization: `Bearer ${opts.token}` } : {},
    };
    const res: any = {
      statusCode: 200,
      set: () => res,
      status(c: number) { res.statusCode = c; return res; },
      json() { resolve(res.statusCode); return res; },
    };
    rateLimiterMiddleware(req, res, () => resolve(200));
  });
}

const drain = async (o: { ip: string; token?: string }, n: number) => {
  let limited = 0;
  for (let i = 0; i < n; i++) if (await call(o) === 429) limited++;
  return limited;
};

async function main() {
  const alice = generateTokenPair('probe-alice', 'ADMIN').accessToken;
  const bob = generateTokenPair('probe-bob', 'ADMIN').accessToken;

  console.log('\n1. Two users behind ONE address do not share a window');
  // The exact production shape: same load balancer, different people.
  const IP = '10.0.0.7';
  check('alice starts unthrottled', await drain({ ip: IP, token: alice }, 50) === 0);
  check('bob is unaffected by alice', await drain({ ip: IP, token: bob }, 50) === 0);

  console.log('\n2. Exhausting one user does not touch the other');
  const limit = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS_AUTHENTICATED || '3000');
  await drain({ ip: IP, token: alice }, limit);
  check('alice is now throttled', await call({ ip: IP, token: alice }) === 429);
  check('bob still gets through — the whole point', await call({ ip: IP, token: bob }) === 200);
  check('an anonymous caller on that same IP is also unaffected',
    await call({ ip: IP }) === 200);

  console.log('\n3. A bucket cannot be minted from an unverified header');
  // If the key came from the raw token, each of these would open a new window
  // and the limiter would be decorative.
  const forged = ['aaa.bbb.ccc', 'not-a-jwt', alice + 'tampered', ''];
  const ANON_IP = '10.0.0.9';
  await drain({ ip: ANON_IP }, parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000'));
  const evaded = [];
  for (const t of forged) if (await call({ ip: ANON_IP, token: t }) === 200) evaded.push(t.slice(0, 12));
  check('invalid tokens fall back to the IP bucket, not a fresh one',
    evaded.length === 0, `evaded with: ${evaded.join(', ')}`);
  check('a VALID token on that exhausted IP does get its own window',
    await call({ ip: ANON_IP, token: bob }) === 200);

  console.log('\n4. Anonymous protection is not weakened');
  const FRESH = '10.0.0.11';
  const anonLimit = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000');
  check(`anonymous still capped at ${anonLimit}`,
    await drain({ ip: FRESH }, anonLimit) === 0 && await call({ ip: FRESH }) === 429);

  console.log(`\n${'─'.repeat(52)}`);
  console.log(`  ${pass} passed, ${fail} failed`);
  console.log('─'.repeat(52));
  process.exit(fail === 0 ? 0 : 1);
}

main().catch(e => { console.error('PROBE ERROR:', e); process.exit(1); });
