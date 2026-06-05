import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding cap table and fundraising rounds...')

  if (await prisma.capTableEntry.count() > 0) {
    console.log('Skipped — already seeded.'); return
  }

  await prisma.capTableEntry.createMany({ data: [
    { investorName: 'James Whitfield',          firm: 'Whitfield Ventures', round: 'seed',     amount: 750, ownership: 8.5,  shareClass: 'Series A Preferred', date: new Date('2025-09-01'), proRataRights: true,  boardSeat: true  },
    { investorName: 'Priya Sharma',             firm: 'Elevate Capital',    round: 'seed',     amount: 250, ownership: 3.2,  shareClass: 'Series A Preferred', date: new Date('2025-09-01'), proRataRights: true,  boardSeat: false },
    { investorName: 'Marcus Chen',              firm: 'Angel Syndicate UK', round: 'seed',     amount: 100, ownership: 1.4,  shareClass: 'Series A Preferred', date: new Date('2025-09-01'), proRataRights: false, boardSeat: false },
    { investorName: 'Mahesh Kumar (Founder)',   firm: 'Kangqore',           round: 'pre-seed', amount: 0,   ownership: 72.4, shareClass: 'Ordinary',           date: new Date('2024-01-01'), proRataRights: false, boardSeat: true  },
    { investorName: 'ESOP Pool',                firm: 'Kangqore',           round: 'seed',     amount: 0,   ownership: 14.5, shareClass: 'Options Pool',       date: new Date('2025-09-01'), proRataRights: false, boardSeat: false },
  ]})

  await prisma.fundraisingRound.createMany({ data: [
    {
      name: 'Seed Round', stage: 'seed',
      targetAmount: 1200, raisedAmount: 1100,
      status: 'closed', openDate: new Date('2025-07-01'), closeDate: new Date('2025-09-01'),
      leadInvestorName: 'James Whitfield',
      investorNames: ['James Whitfield', 'Priya Sharma', 'Marcus Chen'],
      valuation: 8500,
      useOfFunds: [
        { category: 'Product & Engineering', amount: 550, percentage: 50 },
        { category: 'Sales & Marketing',     amount: 330, percentage: 30 },
        { category: 'Operations',            amount: 220, percentage: 20 },
      ],
    },
    {
      name: 'Series A', stage: 'series-a',
      targetAmount: 5000, raisedAmount: 0,
      status: 'open', openDate: new Date('2026-05-01'),
      leadInvestorName: 'Sophia Müller',
      investorNames: ['Sophia Müller', 'Rachel Tanaka'],
      valuation: 28000,
      useOfFunds: [
        { category: 'Product & Engineering',   amount: 2000, percentage: 40 },
        { category: 'Sales & GTM',             amount: 1750, percentage: 35 },
        { category: 'International Expansion', amount: 750,  percentage: 15 },
        { category: 'Operations & G&A',        amount: 500,  percentage: 10 },
      ],
    },
  ]})

  console.log('Seeded: 5 cap table entries, 2 fundraising rounds.')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
