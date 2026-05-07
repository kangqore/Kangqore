/* Convert frontend/src/data/departmentData.js into clean KB markdown files.
 *
 * Reads:  ../frontend/src/data/departmentData.js
 * Writes:
 *   backend/knowledge-base/01-departments.md       (overview of all 15 departments)
 *   backend/knowledge-base/02-services-catalog.md  (full catalog: 61 services with descriptions)
 *
 * Run from backend/ via: npx tsx scripts/build-services-kb.ts
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';

const ROOT = path.resolve(__dirname, '../..');
const SRC = path.join(ROOT, 'frontend/src/data/departmentData.js');
const KB = path.resolve(__dirname, '../knowledge-base');

interface Service {
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  keyFeatures?: string[];
}

interface Department {
  name: string;
  slug: string;
  description: string;
  benefits?: { title: string; description: string }[];
  services?: Service[];
}

function loadDepartmentData(): Department[] {
  const raw = fs.readFileSync(SRC, 'utf-8');
  // Strip ESM imports + icon references (lucide-react identifiers we don't have).
  const transformed = raw
    .replace(/^import\s+[\s\S]*?from\s+['"][^'"]+['"];?$/gm, '')
    .replace(/icon:\s*\w+\s*,/g, '')
    .replace(/^export\s+const\s+/gm, 'const ')
    .replace(/^export\s+default\s+/gm, 'const __default__ = ');
  const code = `${transformed}\nmodule.exports = { departmentData };`;
  const sandbox: any = { module: { exports: {} }, exports: {}, require: () => ({}) };
  vm.runInNewContext(code, sandbox);
  return sandbox.module.exports.departmentData || [];
}

function frontmatter(meta: Record<string, any>): string {
  const lines = ['---'];
  for (const [k, v] of Object.entries(meta)) {
    if (Array.isArray(v)) lines.push(`${k}: [${v.map((x) => JSON.stringify(x)).join(', ')}]`);
    else if (typeof v === 'string') lines.push(`${k}: ${v}`);
    else if (typeof v === 'boolean') lines.push(`${k}: ${v}`);
    else lines.push(`${k}: ${JSON.stringify(v)}`);
  }
  lines.push('---');
  return lines.join('\n');
}

function buildDepartmentsMd(departments: Department[]): string {
  const fm = frontmatter({
    id: '01-departments',
    title: 'Kangqore Departments',
    tags: ['departments', 'practice-areas'],
    populated: true,
    source: 'frontend/src/data/departmentData.js',
  });

  const out: string[] = [
    fm,
    '',
    '<!-- Auto-generated from departmentData.js. Re-run scripts/build-services-kb.ts to refresh. -->',
    '',
    `Kangqore organizes its work into ${departments.length} departments. Each department has a portfolio of specialized services. The list below is the canonical structure of Kangqore's offerings.`,
    '',
  ];

  for (const dept of departments) {
    const serviceCount = dept.services?.length || 0;
    out.push(`# ${dept.name}`);
    out.push('');
    out.push(dept.description.trim());
    out.push('');
    if (serviceCount > 0) {
      out.push(`This department offers ${serviceCount} ${serviceCount === 1 ? 'service' : 'services'}: ${dept.services!.map((s) => `**${s.name}**`).join(', ')}.`);
      out.push('');
    }
    if (dept.benefits && dept.benefits.length > 0) {
      out.push('Key benefits visitors typically realize from this practice:');
      for (const b of dept.benefits) {
        out.push(`- **${b.title}** — ${b.description}`);
      }
      out.push('');
    }
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function buildServicesMd(departments: Department[]): string {
  const allServices: { dept: Department; svc: Service }[] = [];
  for (const dept of departments) {
    for (const svc of dept.services || []) allServices.push({ dept, svc });
  }

  const fm = frontmatter({
    id: '02-services-catalog',
    title: 'Kangqore Services Catalog',
    tags: ['services', 'catalog'],
    populated: true,
    source: 'frontend/src/data/departmentData.js',
  });

  const out: string[] = [
    fm,
    '',
    '<!-- Auto-generated from departmentData.js. Re-run scripts/build-services-kb.ts to refresh. -->',
    '',
    `Kangqore offers ${allServices.length} services across ${departments.length} departments. Each service is described below with what it does, the typical outcome, and the key capabilities. If a visitor asks about a specific service that's listed here, answer from this content. If they ask about something that is not in this catalog, fall back to the consultant handoff.`,
    '',
  ];

  for (const dept of departments) {
    if (!dept.services || dept.services.length === 0) continue;
    out.push(`# ${dept.name}`);
    out.push('');
    for (const svc of dept.services) {
      out.push(`## ${svc.name}`);
      out.push('');
      out.push(svc.shortDescription.trim());
      if (svc.fullDescription && svc.fullDescription.trim() !== svc.shortDescription.trim()) {
        out.push('');
        out.push(svc.fullDescription.trim());
      }
      if (svc.keyFeatures && svc.keyFeatures.length > 0) {
        out.push('');
        out.push('Key capabilities:');
        for (const f of svc.keyFeatures) out.push(`- ${f}`);
      }
      out.push('');
    }
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function main(): void {
  const departments = loadDepartmentData();
  if (departments.length === 0) {
    console.error('No departments parsed from', SRC);
    process.exit(1);
  }
  const totalServices = departments.reduce((n, d) => n + (d.services?.length || 0), 0);

  fs.writeFileSync(path.join(KB, '01-departments.md'), buildDepartmentsMd(departments), 'utf-8');
  fs.writeFileSync(path.join(KB, '02-services-catalog.md'), buildServicesMd(departments), 'utf-8');

  console.log(`Wrote 01-departments.md (${departments.length} departments)`);
  console.log(`Wrote 02-services-catalog.md (${totalServices} services across ${departments.length} departments)`);
}

main();
