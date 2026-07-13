/**
 * Constitutional Law 4 — CognitionEvent Immutability
 * CognitionEvents are the audit trail. No file outside evidenceEngine may
 * call .update(), .delete(), or .deleteMany() on the CognitionEvent table.
 */

import * as fs   from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..', '..', '..');

const FORBIDDEN_RE = /prisma[^.]*\.cognitionEvent\.(update|delete|deleteMany|updateMany)/gi;

describe('Constitutional Law 4 — CognitionEvent Immutability', () => {
  function walk(dir: string): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files: string[] = [];
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory() && !e.name.startsWith('node_modules') && !e.name.startsWith('.')) {
        files.push(...walk(full));
      } else if (e.isFile() && (e.name.endsWith('.ts') || e.name.endsWith('.js'))) {
        files.push(full);
      }
    }
    return files;
  }

  const allFiles = walk(ROOT).filter(f => !f.includes('__constitution__') && !f.includes('evidenceEngine'));

  test('no file outside evidenceEngine may mutate CognitionEvent', () => {
    const violations: string[] = [];
    for (const file of allFiles) {
      const src = fs.readFileSync(file, 'utf8');
      if (FORBIDDEN_RE.test(src)) {
        violations.push(path.relative(ROOT, file));
      }
      FORBIDDEN_RE.lastIndex = 0;
    }
    if (violations.length) {
      console.error('[Constitution-04] Violations:', violations.join(', '));
    }
    expect(violations).toHaveLength(0);
  });
});
