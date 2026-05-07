
import https from 'https';

// Force all HTTPS requests to use IPv4
// This fixes connectivity to Google/SendGrid on networks where IPv6 is unstable
// but allows database connections (which use raw net.connect) to usage default resolution (IPv6)
try {
  https.globalAgent.options.family = 4;
  console.log('✅ HTTPS Global Agent configured to force IPv4');
} catch (error) {
  console.error('❌ Failed to configure HTTPS Global Agent:', error);
}
