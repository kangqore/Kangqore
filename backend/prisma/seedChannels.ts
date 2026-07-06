/**
 * Seed default RELAY channels.
 * Run: docker compose exec core-backend npx tsx prisma/seedChannels.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEPTS = [
  'it', 'hr', 'finance', 'security', 'legal', 'support',
  'facilities', 'supply-chain', 'marketing', 'sales',
  'customer-success', 'product', 'engineering', 'delivery',
  'risk-compliance', 'procurement', 'data-analytics',
  'ai-automation', 'innovation-rd', 'operations',
];

async function main() {
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!admin) {
    console.error('No admin user found — run the main seed first.');
    process.exit(1);
  }

  const seed = async (slug: string, name: string, type: any, scope: any, deptId?: string) => {
    const existing = await prisma.channel.findUnique({ where: { slug } });
    if (existing) { console.log(`  skip: #${name}`); return existing; }

    const ch = await prisma.channel.create({
      data: {
        name,
        slug,
        type,
        scope,
        deptId: deptId ?? null,
        createdById: admin.id,
        members: { create: { userId: admin.id, role: 'OWNER' } },
      },
    });
    console.log(`  ✓ #${name}`);
    return ch;
  };

  console.log('\n── Global channels ──');
  await seed('general',       '#general',       'PUBLIC',       'GLOBAL');
  await seed('random',        '#random',        'PUBLIC',       'GLOBAL');
  await seed('announcements', '#announcements', 'ANNOUNCEMENT', 'GLOBAL');

  console.log('\n── Executive channels ──');
  await seed('exec-general',     '#exec-general',    'PRIVATE',      'EXECUTIVE');
  await seed('board-updates',    '#board-updates',   'ANNOUNCEMENT', 'EXECUTIVE');

  console.log('\n── Dept channels ──');
  for (const dept of DEPTS) {
    await seed(`${dept}-general`, `#${dept}-general`, 'PUBLIC', 'DEPT', dept);
    await seed(`${dept}-ops`,     `#${dept}-ops`,     'PUBLIC', 'DEPT', dept);
  }

  console.log('\nDone.\n');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
