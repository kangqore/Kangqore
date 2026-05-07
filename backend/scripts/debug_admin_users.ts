
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const API_URL = process.env.BACKEND_URL || 'http://localhost:5050';
const ADMIN_EMAIL = 'admin@kangqore.com';
const ADMIN_PASSWORD = 'Admin@123456';

async function run() {
  try {
    console.log('--- Debugging Admin Users API ---');

    console.log('Logging in...');
    const loginRes = await axios.post(`${API_URL}/api/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    const token = loginRes.data.token;
    console.log('Logged in. Token length:', token.length);

    console.log('Fetching Stats...');
    try {
        const statsRes = await axios.get(`${API_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Stats Response:', JSON.stringify(statsRes.data, null, 2));
    } catch (e: any) {
        console.error('Stats Fetch Failed:', e.message, e.response?.data);
    }

    console.log('Fetching Users...');
    try {
        const usersRes = await axios.get(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Users Response Status:', usersRes.status);
        console.log('Users Count:', usersRes.data.users?.length);
        if (usersRes.data.users?.length > 0) {
            console.log('First User:', usersRes.data.users[0].email);
        } else {
            console.log('Users List is EMPTY.');
        }
    } catch (e: any) {
        console.error('Users Fetch Failed:', e.message, e.response?.data);
    }

  } catch (error: any) {
    console.error('Login Failed:', error.message);
    if (error.response) console.error('Data:', error.response.data);
  }
}

run();
