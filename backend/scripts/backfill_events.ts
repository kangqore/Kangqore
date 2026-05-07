import { PrismaClient, EventSource, ActorRole, RelatedEntityType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting Event Source Backfill Migration...');

  // 1. Count legacy events
  const totalEvents = await prisma.accountabilityEvent.count();
  const legacyEvents = await prisma.accountabilityEvent.count({
    where: {
      eventSource: null
    } as any
  });

  console.log(`📊 Total Events: ${totalEvents}`);
  console.log(`⚠️ Legacy Events to Backfill: ${legacyEvents}`);

  if (legacyEvents === 0) {
    console.log('✅ No legacy events found. Migration not needed.');
    // Don't return, proceed to Step 2 (Obligations)
  }

  // 2. Update legacy events
  // We deduce source based on existing fields if possible, or default to SYSTEM/API
  
  // A. Decision Events -> Source: DASHBOARD (Assumed), Role: CLIENT (if userId matches client)
  // For simplicity in this script, we'll establish a baseline.
  // Better approach: Check if user is ADMIN or CLIENT
  
  const events = await prisma.accountabilityEvent.findMany({
    where: { eventSource: null } as any,
    include: { user: true }
  });

  let updatedCount = 0;

  for (const event of events) {
    let source: EventSource = EventSource.API;
    let role: ActorRole = ActorRole.SYSTEM;

    // ... (logic remains same)
    if (event.user) {
      if (event.user.role === 'ADMIN') {
        role = ActorRole.ADMIN;
        source = EventSource.DASHBOARD;
      } else if (event.user.role === 'CLIENT') {
        role = ActorRole.CLIENT;
        source = EventSource.DASHBOARD;
      } else {
        role = ActorRole.SYSTEM;
        source = EventSource.SYSTEM_RULE;
      }
    }

    await prisma.accountabilityEvent.update({
      where: { id: event.id },
      data: {
        eventSource: source,
        actorRole: role
      } as any
    });
    process.stdout.write('.');
    updatedCount++;
  }

  console.log(`\n✅ Step 1: Backfilled ${updatedCount} legacy events.`);

  // 3. Create Missing Obligations for OPEN items (decisions, risks, etc.)
  // If we don't do this, old pending decisions will never trigger "Overdue" alerts.
  console.log('\n🚀 Step 2: Creating missing obligations for open items...');
  
  const pendingDecisions = await prisma.decision.findMany({
      where: { status: 'PENDING_APPROVAL' },
      include: { project: true } // need client info?
  });
  
  let obCount = 0;
  for (const decision of pendingDecisions) {
      // Check if obligation exists
      const exists = await prisma.accountabilityObligation.findFirst({
          where: { description: `Approve Decision: ${decision.title}` }
      });

      if (!exists) {
        // Create it
        try {
            // First, create the synthetic event
            const syntheticEvent = await prisma.accountabilityEvent.create({
                data: {
                    eventType: 'SYSTEM_MIGRATION',
                    eventCategory: 'SYSTEM',
                    projectId: decision.projectId,
                    clientId: decision.clientId,
                    userId: 'SYSTEM',
                    actionTaken: 'Migration Backfill',
                    summary: 'Backfilled Obligation Source',
                    eventSource: EventSource.SYSTEM_RULE,
                    actorRole: ActorRole.SYSTEM,
                    relatedEntityType: RelatedEntityType.DECISION,
                    relatedEntityId: decision.id
                }
            });

            // Then, create the obligation referencing the event
            await prisma.accountabilityObligation.create({
                data: {
                    clientId: decision.clientId,
                    projectId: decision.projectId,
                    obligationType: 'APPROVAL_REQUIRED',
                    owedByRole: 'CLIENT',
                    description: `Approve Decision: ${decision.title}`,
                    dueDate: decision.dueDate,
                    status: 'OPEN',
                    linkedEventId: syntheticEvent.id
                }
            });
            process.stdout.write('+');
            obCount++;
        } catch (err) {
            console.error(`Failed to backfill obligation for Decision ${decision.id}`, err);
        }
      }
  }
  console.log(`\n✅ Step 2: Created ${obCount} missing obligations.`);

  console.log(`\n\n✅ Successfully backfilled ${updatedCount} events.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
