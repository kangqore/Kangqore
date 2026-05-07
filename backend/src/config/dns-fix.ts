
import { setDefaultResultOrder } from 'dns';

try {
  setDefaultResultOrder('ipv4first');
  console.log('✅ DNS Order set to ipv4first (Enforced)');
} catch (e) {
  console.error('❌ Failed to set DNS order:', e);
}
