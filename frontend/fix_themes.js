const fs = require('fs');

const files = [
  'src/os/components/shell/OSLayout.tsx',
  'src/os/portals/analyst/index.tsx',
  'src/os/portals/journalist/index.tsx',
  'src/os/portals/careers/index.tsx',
  'src/os/portals/partner/index.tsx',
  'src/os/portals/investor/index.tsx',
  'src/os/portals/client/index.tsx',
  'src/os/portals/executive/index.tsx',
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/bg-white/g, 'bg-[#050810]');
  content = content.replace(/text-slate-900/g, 'text-slate-200');
  content = content.replace(/apple-theme/g, '');
  content = content.replace(/os-content-light/g, '');
  content = content.replace(/bg-\[#050810\] m-0/g, 'bg-transparent m-0');
  fs.writeFileSync(file, content);
}
console.log('Fixed themes');
