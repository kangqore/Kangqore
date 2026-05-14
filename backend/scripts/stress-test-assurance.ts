import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const BACKEND_URL = 'http://localhost:5050';

const testQueries = [
  "OUR SYSTEM IS DOWN! We are a bank and nobody can log in. This is a disaster.",
  "We've been hacked! Someone is stealing customer credit card data right now.",
  "Our AI medical diagnostic tool is giving dangerous advice. We need to stop it.",
  "We are facing a massive HIPAA audit next week and our data is a mess.",
  "Our cloud costs just spiked by 1000% and we are going bankrupt.",
  "Our founder just quit and took all the production keys. Help!",
  "Our mobile app is crashing for everyone on the new Android 17 update.",
  "We have a major SQL injection vulnerability that was just reported by a researcher.",
  "Our e-commerce checkout is timing out and we are losing $10k per minute.",
  "Our AI recruiting tool is being accused of extreme bias in the media.",
  "We are a non-profit and our site was defaced with extremist propaganda.",
  "Our delivery fleet tracking is showing everyone in the middle of the ocean.",
  "We need to achieve PCI-DSS compliance in 10 days or we are shut down.",
  "Our legacy ERP won't talk to our new cloud CRM and operations are stalled.",
  "We scaled from 1k to 500k users overnight and the database is melting.",
  "Our CI/CD pipeline is stuck and we haven't been able to deploy for a week.",
  "Our claims processing AI is rejecting 90% of valid insurance claims.",
  "Our microservices are so chatty that latency is now 15 seconds per request.",
  "We have 10 million rows of fragmented data and can't make sense of our sales.",
  "Our chatbot is being viral on social media for being toxic and abusive."
];

async function runStressTest() {
  console.log(`Starting Assurance Stress Test (${testQueries.length} queries)...`);
  
  const sessionId = uuidv4();
  
  for (const query of testQueries) {
    console.log(`\n--- Testing Query: "${query}" ---`);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/eqore/conversations/message`, {
        message: query,
        sessionId
      });
      
      const { message: responseContent, timeline } = response.data;
      const assuranceResult = timeline.agentResults.find((r: any) => r.agentName === 'AssuranceEngine');
      
      if (assuranceResult) {
        console.log(`✅ Assurance Engine Triggered`);
        console.log(`Category: ${assuranceResult.metadata?.assuranceCategory || 'N/A'}`);
        console.log(`Urgency: ${assuranceResult.metadata?.urgencyLevel || 'N/A'}`);
        console.log(`Scenario ID: ${assuranceResult.metadata?.matchedScenarioId || 'N/A'}`);
        console.log(`Score: ${assuranceResult.metadata?.matchedScenarioScore || 'N/A'}`);
        console.log(`Departments: ${assuranceResult.metadata?.recommendedDepartments?.join(', ') || 'N/A'}`);
        console.log(`Response Snippet: ${(responseContent || '').substring(0, 100)}...`);
      } else {
        console.log('❌ Assurance Engine NOT Triggered');
        console.log(`Detected Intent: ${timeline.intent}`);
      }
      
      if (timeline.guardrailStatus !== 'PASSED') {
        console.log(`⚠️ Guardrail: ${timeline.guardrailStatus}`);
        console.log(`Notes: ${timeline.guardrailNotes?.join(', ')}`);
      }
      
    } catch (error: any) {
      console.error('❌ Request Failed:', error.response?.data || error.message);
    }
  }
  
  console.log('\n--- Stress Test Completed ---');
}

runStressTest();
