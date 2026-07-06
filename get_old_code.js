const fs = require('fs');
const lines = fs.readFileSync('/Users/maheshkumar/.gemini/antigravity-ide/brain/49a4147d-7b0b-4f29-8526-082d85aa591f/.system_generated/logs/transcript.jsonl', 'utf-8').split('\n');
for (const line of lines) {
  if (!line) continue;
  try {
    const data = JSON.parse(line);
    if (data.type === 'TOOL_CALL' && data.content && data.content.includes('Documentation Sections')) {
      console.log(data.content);
    }
  } catch(e) {}
}
