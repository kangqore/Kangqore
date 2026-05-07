
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Service Lines...');

  const services = [
    {
      name: 'AI & Autonomous Systems',
      slug: 'ai-autonomous',
      description: 'Enterprise AI agents and autonomous workflows.',
      metrics: [
        { period: new Date('2024-01-01'), revenue: 4500000, cost: 2340000, margin: 48, utilization: 92, headcount: 120, bench: 5 },
        { period: new Date('2024-02-01'), revenue: 4800000, cost: 2400000, margin: 50, utilization: 94, headcount: 125, bench: 3 }
      ]
    },
    {
      name: 'Cloud & DevOps',
      slug: 'cloud-devops',
      description: 'Cloud infrastructure modernization and CI/CD pipelines.',
      metrics: [
        { period: new Date('2024-01-01'), revenue: 3800000, cost: 2200000, margin: 42, utilization: 88, headcount: 95, bench: 10 },
        { period: new Date('2024-02-01'), revenue: 4100000, cost: 2300000, margin: 44, utilization: 89, headcount: 100, bench: 8 }
      ]
    },
    {
      name: 'Cybersecurity',
      slug: 'cybersecurity',
      description: 'Managed security services and threat detection.',
      metrics: [
        { period: new Date('2024-01-01'), revenue: 2500000, cost: 1125000, margin: 55, utilization: 85, headcount: 45, bench: 2 },
        { period: new Date('2024-02-01'), revenue: 2700000, cost: 1200000, margin: 55, utilization: 86, headcount: 48, bench: 2 }
      ]
    },
    {
      name: 'Modernization',
      slug: 'modernization',
      description: 'Legacy application modernization and refactoring.',
      metrics: [
        { period: new Date('2024-01-01'), revenue: 2200000, cost: 1430000, margin: 35, utilization: 84, headcount: 60, bench: 8 },
        { period: new Date('2024-02-01'), revenue: 2300000, cost: 1450000, margin: 37, utilization: 85, headcount: 62, bench: 6 }
      ]
    },
    {
      name: 'Consulting',
      slug: 'consulting',
      description: 'Strategic technology consulting and advisory.',
      metrics: [
        { period: new Date('2024-01-01'), revenue: 1250000, cost: 500000, margin: 60, utilization: 78, headcount: 20, bench: 4 },
        { period: new Date('2024-02-01'), revenue: 1400000, cost: 560000, margin: 60, utilization: 80, headcount: 22, bench: 3 }
      ]
    }
  ];

  for (const s of services) {
    const serviceLine = await prisma.serviceLine.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        name: s.name,
        slug: s.slug,
        description: s.description,
      },
    });

    console.log(`Updated Service: ${serviceLine.name}`);

    for (const m of s.metrics) {
      await prisma.practiceMetric.upsert({
        where: {
          serviceLineId_period: {
            serviceLineId: serviceLine.id,
            period: m.period,
          },
        },
        update: {},
        create: {
          serviceLineId: serviceLine.id,
          period: m.period,
          revenue: m.revenue,
          cost: m.cost,
          margin: m.margin,
          utilization: m.utilization,
          headcount: m.headcount,
          bench: m.bench,
        },
      });
    }
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
