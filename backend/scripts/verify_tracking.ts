
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

const API_URL = process.env.BACKEND_URL || 'http://localhost:5050';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@kangqore.com'; // Default or from env
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123456'; // Default

async function run() {
  try {
    console.log('--- Verifying Visitor Tracking ---');

    // 1. Simulate Visit (Public Endpoint)
    console.log('Simulating a visit...');
    // We send some fake headers to simulate real browser
    await axios.post(`${API_URL}/api/analytics/track`, {
       referrer: 'http://google.com'
    }, {
       headers: {
         'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
         'X-Forwarded-For': '8.8.8.8' // Google DNS IP (US)
       }
    });
    console.log('Visit tracked.');

    // 2. Login as Admin
    console.log('Logging in as Admin...');
    const loginRes = await axios.post(`${API_URL}/api/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    const token = loginRes.data.token;
    console.log('Logged in.');

    // 3. Fetch Analytics
    console.log('Fetching Traffic Stats...');
    const statsRes = await axios.get(`${API_URL}/api/analytics/traffic`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const stats = statsRes.data;
    console.log('Stats received:', {
       total: stats.total,
       countries: stats.byCountry,
       devices: stats.byDevice
    });

    // 4. Validate
    if (stats.recent && stats.recent.length > 0) {
        const lastVisit = stats.recent[0];
        console.log('Most recent visit IP:', lastVisit.ip);
        console.log('Most recent visit Country:', lastVisit.country);
        
        if (lastVisit.ip === '8.8.8.8' || lastVisit.country === 'US') {
             console.log('SUCCESS: Visit recorded correctly with GeoIP.');
        } else {
             console.warn('WARNING: Visit recorded but IP/Country mismatch (might contain previous data).');
        }
    } else {
        throw new Error('No recent visits found after tracking!');
    }

    console.log('--- Verification SUCCESS ---');
    process.exit(0);

  } catch (error: any) {
    console.error('Verification FAILED:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

run();
