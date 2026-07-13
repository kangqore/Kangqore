/**
 * Constitutional Law 2 — Upstream Immutability
 * Downstream engines must not write to upstream engines' artifact tables.
 *
 * Mapping:
 *   CognitionEvent     — owned by evidenceEngine (never mutated downstream)
 *   EnterpriseLesson   — owned by observationLearningEngine
 *   EnterpriseInsight  — owned by insightEngine
 */

import * as fs   from 'fs';
import * as path from 'path';
import * as glob from 'glob';

const COGNITION_DIR = path.resolve(__dirname, '..');

// Tables that must only be created by their owning engine; downstream files
// must not call .update() or .delete() on them.
const IMMUTABLE_TABLES: Record<string, string> = {
  cognitionEvent:    'evidenceEngine',
  enterpriseLesson:  'observationLearningEngine',
  enterpriseInsight: 'insightEngine',
};

describe('Constitutional Law 2 — Upstream Immutability', () => {
  const files = (glob as any).sync
    ? (glob as any).sync(`${COGNITION_DIR}/*.ts`)
    : fs.readdirSync(COGNITION_DIR)
        .filter((f: string) => f.endsWith('.ts'))
        .map((f: string) => path.join(COGNITION_DIR, f));

  for (const [table, ownerFile] of Object.entries(IMMUTABLE_TABLES)) {
    test(`only ${ownerFile} may mutate ${table}`, () => {
      for (const file of files) {
        const name = path.basename(file, '.ts');
        if (name === ownerFile || name.endsWith('.test')) continue;

        const src = fs.readFileSync(file, 'utf8');
        const mutationRe = new RegExp(`prisma.*\\.${table}\\.(update|delete|deleteMany|updateMany)`, 'i');
        expect(src).not.toMatch(mutationRe);
      }
    });
  }
});
