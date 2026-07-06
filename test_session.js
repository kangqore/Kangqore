const axios = require('axios');

async function run() {
  const visitorId = 'v_' + Math.random().toString(36).substring(7);
  const sessionId = 's_' + Math.random().toString(36).substring(7);
  
  const events = [
    { visitorId, sessionId, eventType: 'PAGE_VIEW', page: '/pricing', timestamp: new Date().toISOString() },
    { visitorId, sessionId, eventType: 'CORPORATE_EMAIL_SUBMITTED', timestamp: new Date().toISOString() }
  ];

  await axios.post('http://localhost:5050/api/hcip/events', { events });
  console.log('Session generated:', sessionId);
}
run();
