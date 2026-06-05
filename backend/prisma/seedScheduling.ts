/**
 * Seeds the minimum scheduling setup required for the public consultation
 * booking page to work:
 *   1. Admin user (upsert — idempotent)
 *   2. discovery-call event type (30-min public booking)
 *   3. discovery-cmkfi event type (used by eQORE AI inline card)
 *   4. Default Mon–Fri 9am–6pm IST availability schedule linked to both
 */
import { PrismaClient } from '@prisma/client'
import bcrypt           from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding scheduling setup...')

  // ── 1. Admin user ──────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('password123', 10)
  const admin = await prisma.user.upsert({
    where:  { email: 'admin@kangqore.com' },
    update: {},
    create: {
      email:    'admin@kangqore.com',
      name:     'Mahesh Kumar',
      password: passwordHash,
      role:     'ADMIN',
      status:   'active',
    },
  })
  console.log('Admin:', admin.email)

  // ── 2. Event types ─────────────────────────────────────────────────────────
  const etBase = {
    hostId:         admin.id,
    isActive:       true,
    isPublic:       true,
    duration:       30,
    color:          '#2564ea',
    locationType:   'VIDEO',
    videoProvider:  'JITSI',
    minNotice:      60,
    maxAdvanceDays: 30,
    durationOptions: [15, 30, 60],
  }

  await prisma.eventType.upsert({
    where:  { slug: 'discovery-call' },
    update: {},
    create: {
      ...etBase,
      slug:        'discovery-call',
      name:        '30-Minute Discovery Call',
      description: 'Book a 30-minute discovery call to discuss how Kangqore can help your business.',
    },
  })

  await prisma.eventType.upsert({
    where:  { slug: 'discovery-cmkfi' },
    update: {},
    create: {
      ...etBase,
      slug:        'discovery-cmkfi',
      name:        'Discovery Call',
      description: 'Quick discovery call via eQORE AI.',
    },
  })

  console.log('Event types: discovery-call, discovery-cmkfi')

  // ── 3. Availability schedule ───────────────────────────────────────────────
  const rules = [1, 2, 3, 4, 5].map(day => ({
    day,
    startTime: '09:00',
    endTime:   '18:00',
  }))

  await prisma.availabilitySchedule.upsert({
    where:  { id: 'default-admin-schedule' },
    update: {},
    create: {
      id:        'default-admin-schedule',
      name:      'Working Hours',
      userId:    admin.id,
      isDefault: true,
      timezone:  'Asia/Kolkata',
      rules,
      eventTypes: {
        connect: [
          { slug: 'discovery-call'  },
          { slug: 'discovery-cmkfi' },
        ],
      },
    },
  })

  console.log('Availability: Mon–Fri 9am–6pm IST linked to both event types')
  console.log('Done.')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
