
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
    console.log('--- Verifying Cache System ---');

    // 1. Login as Admin
    console.log('Logging in as Admin...');
    const loginRes = await axios.post(`${API_URL}/api/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    const token = loginRes.data.token;
    console.log('Logged in.');

    // 2. Clear Cache (to reset state)
    console.log('Clearing Cache...');
    await axios.post(`${API_URL}/api/admin/cache/clear`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Cache cleared.');

    // 3. Request 1 (Expect MISS)
    console.log('Request 1: GET /api/content (Expect MISS)');
    const res1 = await axios.get(`${API_URL}/api/content?type=blog`, {
       validateStatus: () => true 
    });
    const cacheStatus1 = res1.headers['x-cache'];
    console.log(`Response 1 Status: ${res1.status}`);
    console.log(`Response 1 X-Cache: ${cacheStatus1}`);
    
    if (res1.status !== 200) {
      console.error('Response 1 Error:', JSON.stringify(res1.data, null, 2));
    }
    
    if (cacheStatus1 !== 'MISS') {
        console.warn('WARNING: Expected MISS but got ' + cacheStatus1);
    }

    // 4. Request 2 (Expect HIT)
    console.log('Request 2: GET /api/content (Expect HIT)');
     const res2 = await axios.get(`${API_URL}/api/content?type=blog`, {
       validateStatus: () => true 
    });
    const cacheStatus2 = res2.headers['x-cache'];
    console.log(`Response 2 Status: ${res2.status}`);
    console.log(`Response 2 X-Cache: ${cacheStatus2}`);

    if (cacheStatus2 !== 'HIT') {
        throw new Error('Expected HIT but got ' + cacheStatus2);
    }

    // 5. Clear Cache Again
    console.log('Clearing Cache...');
    await axios.post(`${API_URL}/api/admin/cache/clear`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Cache cleared.');

     // 6. Request 3 (Expect MISS again)
    console.log('Request 3: GET /api/content (Expect MISS)');
    const res3 = await axios.get(`${API_URL}/api/content?type=blog`, {
        validateStatus: () => true 
    });
    const cacheStatus3 = res3.headers['x-cache'];
    console.log(`Response 3 X-Cache: ${cacheStatus3}`);

    if (cacheStatus3 !== 'MISS') {
        throw new Error('Expected MISS but got ' + cacheStatus3);
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
