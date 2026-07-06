const fs = require('fs');
let content = fs.readFileSync('src/os/portals/team/DeptShell.tsx', 'utf8');

// Replace dark bg with vibrant theme classes
content = content.replace(
  'className="flex flex-col h-screen overflow-hidden bg-[#050810] relative text-slate-200 dept-shell"',
  'className="flex flex-col h-screen overflow-hidden bg-[#f5f6f8] relative text-[#323338] dept-shell vibrant-theme"'
);

fs.writeFileSync('src/os/portals/team/DeptShell.tsx', content);
console.log('DeptShell updated');
