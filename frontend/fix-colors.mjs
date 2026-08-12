import fs from 'fs';

const filePath = 'src/components/ui/GenAI3DModel.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Hex replacements
content = content.replace(/#818cf8/g, '#60a5fa'); // Indigo-400 -> Blue-400
content = content.replace(/#22d3ee/g, '#38bdf8'); // Cyan-400 -> Sky-400 (closer to true blue highlight)
content = content.replace(/#0f172a/g, '#172554'); // Slate-900 -> Blue-950
content = content.replace(/#1e1b4b/g, '#1e3a8a'); // Indigo-950 -> Blue-900
content = content.replace(/#334155/g, '#1e40af'); // Slate-700 -> Blue-800
content = content.replace(/#64748b/g, '#3b82f6'); // Slate-500 -> Blue-500
content = content.replace(/#94a3b8/g, '#93c5fd'); // Slate-400 -> Blue-300

// Tailwind HTML class replacements
content = content.replace(/text-purple-400/g, 'text-blue-300');
content = content.replace(/rgba\(192,132,252,0\.8\)/g, 'rgba(147,197,253,0.8)');
content = content.replace(/text-cyan-400/g, 'text-blue-400');
content = content.replace(/border-cyan-400/g, 'border-blue-400');
content = content.replace(/rgba\(34,211,238/g, 'rgba(96,165,250');
content = content.replace(/bg-slate-900\/80/g, 'bg-blue-950/80');
content = content.replace(/border-slate-700/g, 'border-blue-800');
content = content.replace(/bg-slate-800\/80/g, 'bg-blue-900/80');
content = content.replace(/border-slate-600/g, 'border-blue-700');
content = content.replace(/text-slate-400/g, 'text-blue-200');
content = content.replace(/border-white\/10/g, 'border-blue-200/20');

fs.writeFileSync(filePath, content);
console.log('Colors replaced successfully');
