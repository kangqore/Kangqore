/**
 * Constitutional Law 1 — Engine Isolation
 * No upstream engine may import from a downstream engine.
 * Hierarchy (allowed upstream direction only):
 *   evidenceEngine → observationLearningEngine → insightEngine →
 *   knowledgeEngine → trustEngine → evolutionEngine → cognitionOrchestrator
 */

import * as fs   from 'fs';
import * as path from 'path';

const COGNITION_DIR = path.resolve(__dirname, '..');

const ENGINE_ORDER: string[] = [
  'evidenceEngine',
  'observationLearningEngine',
  'insightEngine',
  'knowledgeEngine',
  'trustEngine',
  'evolutionEngine',
  'cognitionOrchestrator',
  'autopilot.service',
];

function readImports(filePath: string): string[] {
  const src  = fs.readFileSync(filePath, 'utf8');
  const re   = /from ['"]([^'"]+)['"]/g;
  const hits: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) hits.push(m[1]);
  return hits;
}

describe('Constitutional Law 1 — Engine Isolation', () => {
  for (let i = 0; i < ENGINE_ORDER.length; i++) {
    const engine = ENGINE_ORDER[i];
    const engineFile = path.join(COGNITION_DIR, `${engine}.ts`);

    if (!fs.existsSync(engineFile)) continue;

    test(`${engine} must not import downstream engines`, () => {
      const imports = readImports(engineFile);
      const downstreamEngines = ENGINE_ORDER.slice(i + 1);

      for (const imp of imports) {
        for (const downstream of downstreamEngines) {
          expect(imp).not.toContain(downstream);
        }
      }
    });
  }
});
