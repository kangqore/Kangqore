import fs from 'fs';

const filePath = 'src/components/ui/GenAI3DModel.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Shader base color: replace with a pure medium blue (e.g., #2563eb -> 37, 99, 235)
// vec3(0.145, 0.388, 0.922)
content = content.replace(/vec3\(0\.05, 0\.05, 0\.08\)/g, 'vec3(0.145, 0.388, 0.922)'); 

// Shader rim color: replace with white (1.0, 1.0, 1.0)
content = content.replace(/vec3\(0\.133, 0\.827, 0\.933\)/g, 'vec3(1.0, 1.0, 1.0)');

// Any remaining dark blues -> medium/light blues
content = content.replace(/#172554/g, '#2563eb'); // Blue-950 -> Blue-600
content = content.replace(/#1e3a8a/g, '#3b82f6'); // Blue-900 -> Blue-500
content = content.replace(/#1e40af/g, '#60a5fa'); // Blue-800 -> Blue-400

// Any remaining cyan/sky blues -> white or light blue
content = content.replace(/#38bdf8/g, '#ffffff'); // Sky-400 -> White
content = content.replace(/#93c5fd/g, '#ffffff'); // Blue-300 -> White

// Update Tailwind HTML classes
content = content.replace(/bg-blue-950\/80/g, 'bg-blue-600/80');
content = content.replace(/bg-blue-900\/80/g, 'bg-blue-500/80');
content = content.replace(/border-blue-800/g, 'border-blue-400');
content = content.replace(/border-blue-700/g, 'border-white/50');
content = content.replace(/text-blue-200/g, 'text-white');
content = content.replace(/border-blue-200\/20/g, 'border-white/40');
content = content.replace(/text-blue-300/g, 'text-white');
content = content.replace(/rgba\(147,197,253,0\.8\)/g, 'rgba(255,255,255,0.8)');
content = content.replace(/text-blue-400/g, 'text-white');
content = content.replace(/border-blue-400/g, 'border-white');
content = content.replace(/rgba\(96,165,250/g, 'rgba(255,255,255');

fs.writeFileSync(filePath, content);
console.log('Colors replaced successfully');
