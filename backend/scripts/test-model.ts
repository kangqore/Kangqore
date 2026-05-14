import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
});

async function testModel() {
  const model = process.env.EQORE_ROUTER_MODEL || 'claude-3-haiku-20240307';
  console.log(`Testing model: ${model}`);
  
  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Hello' }]
    });
    console.log('✅ Success:', response.content[0]);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.status === 404) {
      console.error('Model not found. Try a different model ID.');
    }
  }
}

testModel();
