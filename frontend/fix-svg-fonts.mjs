import fs from 'fs';

const filePath = 'src/components/services/shared/UniversalServicePage.jsx';
let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const targetLines = [
  1673, 1682, 1692, 1702, 1712, 1733, 1734, 1749, 1750, 
  1765, 1766, 1788, 1789, 1794, 1822, 1844, 1845, 1856, 1857, 1869
];

for (let i of targetLines) {
  const lineIdx = i - 1;
  lines[lineIdx] = lines[lineIdx].replace(/fontSize="\d+"/g, 'fontSize="12"');
}

fs.writeFileSync(filePath, lines.join('\n'));
console.log('Fixed font sizes');
