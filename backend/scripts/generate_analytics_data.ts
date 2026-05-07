import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:5050/api/admin/content/track';

const USER_AGENTS = [
  // Desktop
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/115.0',
  // Mobile
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36',
  // Tablet
  'Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
];

const REFERRERS = [
  'https://www.google.com/',
  'https://www.linkedin.com/',
  'https://twitter.com/',
  'https://www.facebook.com/',
  'https://kangqore.com/insights',
  'Direct'
];

const PLATFORMS = ['linkedin', 'twitter', 'facebook', 'whatsapp', 'email', 'copy'];

// Random IPs from US, UK, India, Germany, Japan
const IPS = [
  '203.0.113.1', '198.51.100.1', '103.21.244.0', '185.220.101.0', 
  '93.184.216.34', '172.217.16.142', '104.28.16.12', '157.240.22.35'
];

async function generateData() {
  console.log('Fetching content...');
  const contents = await prisma.content.findMany({ select: { id: true, title: true } });
  console.log(`Found ${contents.length} content items.`);

  for (const content of contents) {
    console.log(`Generating data for: ${content.title}`);
    
    // Generate 5-25 views
    const views = Math.floor(Math.random() * 20) + 5;
    for (let i = 0; i < views; i++) {
      try {
        await axios.post(`${BASE_URL}/view`, {
          contentId: content.id,
          referrer: REFERRERS[Math.floor(Math.random() * REFERRERS.length)]
        }, {
          headers: {
            'User-Agent': USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
            'X-Forwarded-For': IPS[Math.floor(Math.random() * IPS.length)]
          }
        });
      } catch (err) {
        // ignore
      }
    }

    // Generate 0-5 shares
    const shares = Math.floor(Math.random() * 6);
    for (let i = 0; i < shares; i++) {
      try {
        await axios.post(`${BASE_URL}/share`, {
          contentId: content.id,
          platform: PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)]
        });
      } catch (err) {
        // ignore
      }
    }
  }

  console.log('Data generation complete!');
}

generateData()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
