const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/name: \.Digital Marketing\.,/g, "name: 'Digital Marketing',");
  content = content.replace(/slug: \.digital-marketing\.,/g, "slug: 'digital-marketing',");
  content = content.replace(/name: \.Creative & Market Experience\.,/g, "name: 'Creative & Market Experience',");
  content = content.replace(/slug: \.creative-market-experience\.,/g, "slug: 'creative-market-experience',");
  fs.writeFileSync(filePath, content);
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      fixFile(fullPath);
    }
  }
}

processDirectory('/Users/maheshkumar/Desktop/Kangqore/frontend/src/pages/services/digital-marketing');
processDirectory('/Users/maheshkumar/Desktop/Kangqore/frontend/src/pages/services/creative-market-experience');
console.log('Done fixing quotes.');
